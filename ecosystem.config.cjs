/**
 * pm2 do Mundo da Prô na VPS da Ascent (máquina de PRODUÇÃO do SDR: 1 CPU, 3,9 GB).
 *
 * Regra da casa (24/09/2026, incidente de memória): aqui NÃO roda servidor de
 * desenvolvimento. `next dev` e `expo start` ficam no Mac de quem desenvolve.
 *   - Painel (apps/web): build de produção (`next build --webpack`) e `next start`, ~120 MB.
 *   - App (apps/app): export estático (`expo export --platform web`) servido pelo
 *     nginx em /var/www/mdp-app (porta 8081), 0 MB de runtime. Nada no pm2.
 * Publicar: bash deploy/publicar.sh  (build sob teto de memória + reload).
 */
module.exports = {
  apps: [
    {
      name: 'mdp-painel',
      cwd: '/root/mundo-da-pro/app-mundo-da-pro',
      script: 'npm',
      args: 'run start --workspace apps/web -- -p 3000',
      env: { NODE_ENV: 'production', PORT: '3000' },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '400M',
      kill_timeout: 8000,
      time: true,
    },
  ],
};
