#!/usr/bin/env bash
#
# Publica o Mundo da Prô na VPS da Ascent SEM derrubar o SDR que roda na mesma
# máquina (1 CPU, 3,9 GB). Rodar como root, na VPS:  bash deploy/publicar.sh
#
# O que faz:
#   1. painel (apps/web): `next build --webpack` dentro de um cgroup com teto de
#      memória e SEM swap (systemd-run): se não couber, morre o build, não a VPS.
#      Turbopack estourou 1,3 GB e foi morto; webpack fecha em ~600 MB.
#   2. app (apps/app): `expo export --platform web` (estático), copiado pra
#      /var/www/mdp-app e servido pelo nginx na porta 8081 (0 MB de runtime).
#   3. pm2 reload do painel (ecosystem.config.cjs na raiz, `next start`).
# Nunca: next dev / expo start aqui. Isso é pro Mac de quem desenvolve.
#
set -euo pipefail
cd "$(dirname "$0")/.."
export HOME=/root PM2_HOME=/root/.pm2 PATH=/usr/local/bin:/usr/bin:/bin
limitado() { systemd-run --scope -q -p MemoryMax="$1" -p MemorySwapMax=0 nice -n 19 "${@:2}"; }

livre=$(free -m | awk 'NR==2{print $7}')
if (( livre < 900 )); then echo "✗ só ${livre} MB disponíveis; feche o que está pesando (ps aux --sort=-rss | head) e tente de novo" >&2; exit 1; fi

echo "→ painel: next build (webpack, teto 1600 MB, nice 19)"
NODE_ENV=production NODE_OPTIONS=--max-old-space-size=1100 limitado 1600M npx --workspace apps/web next build --webpack
[[ -f apps/web/.next/BUILD_ID ]] || { echo "✗ build sem BUILD_ID" >&2; exit 1; }

echo "→ app: expo export web (teto 1300 MB, nice 19)"
( cd apps/app && limitado 1300M npx expo export --platform web --output-dir dist )
[[ -f apps/app/dist/index.html ]] || { echo "✗ export sem index.html" >&2; exit 1; }
mkdir -p /var/www/mdp-app
rsync -a --delete apps/app/dist/ /var/www/mdp-app/
chown -R www-data:www-data /var/www/mdp-app

echo "→ pm2: reload do painel"
if pm2 describe mdp-painel >/dev/null 2>&1; then pm2 reload ecosystem.config.cjs --only mdp-painel >/dev/null; else pm2 start ecosystem.config.cjs >/dev/null; fi
pm2 save >/dev/null
for _ in $(seq 1 15); do sleep 2; code=$(curl -s -o /dev/null -w '%{http_code}' -m 5 http://127.0.0.1:3000/); [[ "$code" != 000 ]] && break; done
echo "✓ painel http://127.0.0.1:3000 → HTTP $code | app estático em http://<vps>:8081 | $(free -m | awk 'NR==2{print $7}') MB disponíveis"
