#!/usr/bin/env bash
#
# Concede (ou revoga) um produto a um e-mail, à mão, até o webhook do The Members
# existir (Bloco 10). Só no servidor: usa a service_role do apps/web/.env.local, que
# nunca vai para o app nem para o /admin sem login (D50).
#
#   bash deploy/conceder-acesso.sh professora@email.com colecao-imagine
#   bash deploy/conceder-acesso.sh professora@email.com acesso-total
#   bash deploy/conceder-acesso.sh professora@email.com colecao-imagine --revogar
#   bash deploy/conceder-acesso.sh professora@email.com --listar
#
# Produto = slug da tabela produtos (educakits, colecao-imagine, cadernos-flaeduca,
# materiais-avulsos, bncc-de-bolso, cube, fda, fpt, acesso-total).
# Sem conta ainda: cria o usuário (e-mail confirmado); no 1º login ela já entra liberada.
#
set -euo pipefail
cd "$(dirname "$0")/.."
[[ $# -ge 2 ]] || { sed -n '3,15p' "$0"; exit 1; }
ENV=apps/web/.env.local
export SUPABASE_URL=$(grep '^NEXT_PUBLIC_SUPABASE_URL=' $ENV | cut -d= -f2-)
export SERVICO=$(grep '^SUPABASE_SERVICE_ROLE_KEY=' $ENV | cut -d= -f2-)
python3 - "$@" <<'PY'
import datetime, json, os, sys, urllib.error, urllib.parse, urllib.request

url, chave = os.environ['SUPABASE_URL'], os.environ['SERVICO']
email = sys.argv[1].strip().lower()
acao = sys.argv[2]
revogar = len(sys.argv) > 3 and sys.argv[3] == '--revogar'

def pedir(metodo, caminho, corpo=None, prefer=None):
    req = urllib.request.Request(url + caminho, method=metodo,
        data=json.dumps(corpo).encode() if corpo is not None else None,
        headers={'apikey': chave, 'Authorization': f'Bearer {chave}',
                 'Content-Type': 'application/json', **({'Prefer': prefer} if prefer else {})})
    try:
        with urllib.request.urlopen(req) as r:
            texto = r.read().decode()
            return json.loads(texto) if texto else None
    except urllib.error.HTTPError as e:
        sys.exit(f'✗ {metodo} {caminho}: {e.code} {e.read().decode()[:300]}')

perfil = pedir('GET', f'/rest/v1/perfis?select=id,email&email=eq.{urllib.parse.quote(email)}')
if not perfil:
    if acao == '--listar' or revogar:
        sys.exit(f'✗ {email} ainda não tem conta')
    criado = pedir('POST', '/auth/v1/admin/users', {'email': email, 'email_confirm': True})
    print(f'  conta criada para {email} (entra com o código do e-mail)')
    usuario = criado['id']
else:
    usuario = perfil[0]['id']

def listar():
    posse = pedir('GET', f'/rest/v1/entitlements?select=origem,concedido_em,expira_em,revogado_em,produtos(slug,nome)&user_id=eq.{usuario}&order=concedido_em')
    print(f'Posse de {email}:' if posse else f'{email} não tem nenhum produto.')
    for e in posse or []:
        situacao = 'revogado' if e['revogado_em'] else ('até ' + e['expira_em'][:10] if e['expira_em'] else 'ativo')
        print(f"  {e['produtos']['slug']:<20} {situacao:<12} ({e['origem']}, desde {e['concedido_em'][:10]})")

if acao == '--listar':
    listar(); sys.exit()

produto = pedir('GET', f'/rest/v1/produtos?select=id,nome&slug=eq.{urllib.parse.quote(acao)}')
if not produto:
    sys.exit(f'✗ produto "{acao}" não existe (use o slug da tabela produtos)')
pid, nome = produto[0]['id'], produto[0]['nome']

if revogar:
    pedir('PATCH', f'/rest/v1/entitlements?user_id=eq.{usuario}&produto_id=eq.{pid}&revogado_em=is.null',
          {'revogado_em': datetime.datetime.now(datetime.timezone.utc).isoformat(),
           'motivo_revogacao': 'manual (deploy/conceder-acesso.sh)'}, 'return=minimal')
    print(f'✓ {nome} revogado de {email}')
else:
    ativo = pedir('GET', f'/rest/v1/entitlements?select=id&user_id=eq.{usuario}&produto_id=eq.{pid}&revogado_em=is.null')
    if ativo:
        print(f'  {email} já tem {nome}')
    else:
        pedir('POST', '/rest/v1/entitlements', {'user_id': usuario, 'produto_id': pid, 'origem': 'manual'}, 'return=minimal')
        print(f'✓ {nome} liberado para {email}')
listar()
PY
