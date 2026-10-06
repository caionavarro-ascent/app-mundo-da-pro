#!/usr/bin/env bash
#
# Índice de texto da busca da home (D42): extrai o texto das primeiras páginas de
# cada PDF do painel para apps/web/dados/textos-busca.json ({ id: texto }).
# A rota /api/busca usa esse texto quando o material não tem `textoExtraido`
# (os 387 que vieram da VPS chegaram sem). PDF só de imagem fica sem texto e a
# busca usa o título. Rodar de novo é seguro: refaz o índice inteiro.
#
# Uso (na raiz do repo):  bash deploy/indexar-textos.sh
# Precisa de: pdftotext (apt install poppler-utils)
#
set -euo pipefail
cd "$(dirname "$0")/../apps/web"
command -v pdftotext >/dev/null || { echo "✗ falta o pdftotext: apt install poppler-utils" >&2; exit 1; }
nice -n 19 python3 - <<'PY'
import json, os, re, subprocess
materiais = json.load(open('dados/materiais.json'))
indice, com_texto = {}, 0
for m in materiais:
    caminho = os.path.join('dados/arquivos', m['arquivo'])
    if not os.path.exists(caminho):
        continue
    try:
        bruto = subprocess.run(['pdftotext', '-l', '8', '-q', caminho, '-'],
                               capture_output=True, timeout=30).stdout.decode('utf-8', 'ignore')
    except subprocess.TimeoutExpired:
        bruto = ''
    texto = re.sub(r'\s+', ' ', bruto).strip()[:6000]
    if len(texto) > 80:
        indice[m['id']] = texto
        com_texto += 1
tmp = 'dados/textos-busca.json.tmp'
json.dump(indice, open(tmp, 'w'), ensure_ascii=False)
os.replace(tmp, 'dados/textos-busca.json')
print(f'✓ {com_texto} de {len(materiais)} materiais com texto em apps/web/dados/textos-busca.json')
PY
