# Decisões de arquitetura — Mundo da Pro

## 2026-09-15 — Criação do projeto
- Pasta isolada em `/root/mundo-da-pro`, sem dependência das outras pastas da VPS.
- Arquitetura limpa em 4 camadas (domain, application, infrastructure, presentation); regra de dependência documentada no README.
- Stack base: Node.js (padrão da casa). Framework HTTP, banco e demais libs serão decididos quando o escopo do produto for definido.

## 2026-09-18 — Esta pasta ainda não tem código; o app vive no Mac
- Pedido de teste e2e nesta pasta não pôde ser atendido: só existem os `.gitkeep` do esqueleto, nenhum commit e o `src/presentation/server.js` apontado pelo `package.json` não existe.
- O aplicativo Mundo da Prô já em desenvolvimento (Expo/React Native, web em `localhost:8081`, painel `/admin` em `localhost:3000`, DECISIONS D1–D37 próprias) está em `/Users/caionavarro/app-mundo-da-pro`, sem remote no GitHub. Se esta pasta for virar o backend dele, o primeiro passo é publicar aquele repo e definir a fronteira entre os dois.

## 2026-09-21 — App publicado no GitHub e clonado para a VPS
- O repo do app saiu do Mac e foi publicado em `caionavarro-ascent/app-mundo-da-pro` (privado); clonado em `/root/mundo-da-pro/app-mundo-da-pro`.
- É um monorepo: `apps/app` (Expo/React Native), `apps/web`, `packages/core`, mais `supabase/` e `SCHEMA.sql` — com DECISIONS.md e CLAUDE.md próprios.
- O repo externo (`/root/mundo-da-pro`) ignora a subpasta `app-mundo-da-pro/` via .gitignore; cada repo tem seu próprio git.
