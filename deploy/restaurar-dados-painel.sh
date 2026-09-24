#!/usr/bin/env bash
#
# Recria o que o painel guardava em disco na VPS da Ascent (fora do git):
#   apps/web/dados/materiais.json        índice dos materiais (metadados + texto extraído)
#   apps/web/dados/arquivos/<id>.pdf     os PDFs (cópias exatas de entrada-pdfs)
#   apps/web/public/demo-capas/<id>.png  as capas
# a partir das Releases entrada-pdfs-2026-09-24 e painel-dados-2026-09-24.
#
# Uso (na raiz do repo, com `gh` autenticado):
#   bash deploy/restaurar-dados-painel.sh            # espera ../entrada-pdfs já restaurado
#   ENTRADA=/outro/caminho bash deploy/restaurar-dados-painel.sh
#
set -euo pipefail
cd "$(dirname "$0")/.."
REPO=caionavarro-ascent/app-mundo-da-pro
ENTRADA="${ENTRADA:-../entrada-pdfs}"
[[ -d "$ENTRADA/cursos" ]] || { echo "✗ $ENTRADA não tem a pasta cursos: restaure a Release entrada-pdfs-2026-09-24 primeiro (SERVIDOR-NOVO.md, seção 1)" >&2; exit 1; }
T=$(mktemp -d)
gh release download painel-dados-2026-09-24 -R "$REPO" -D "$T"
( cd "$T" && sha256sum -c SHA256SUMS.txt )
mkdir -p apps/web/dados/arquivos apps/web/public
cp "$T/materiais.json" apps/web/dados/materiais.json
tar xf "$T/demo-capas.tar" -C apps/web/public
python3 - "$T/mapa-arquivos.json" "$ENTRADA" <<'PY'
import json, shutil, sys, os, hashlib
m = json.load(open(sys.argv[1])); ent = sys.argv[2]; ok = 0
for it in m['itens']:
    src = os.path.join(ent, it['origem'].split('entrada-pdfs/', 1)[1]); dst = os.path.join('apps/web', it['arquivo'])
    shutil.copyfile(src, dst)
    if hashlib.sha256(open(dst, 'rb').read()).hexdigest() != it['sha256']: raise SystemExit(f'✗ hash diferente: {dst}')
    ok += 1
print(f'✓ {ok} PDFs restaurados e conferidos em apps/web/dados/arquivos')
PY
rm -rf "$T"
echo "✓ materiais.json e $(ls apps/web/public/demo-capas | wc -l) capas restaurados"
