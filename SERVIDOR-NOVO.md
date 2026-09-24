# Mundo da Prô num servidor novo: leia isto primeiro

Escrito em 24/09/2026, no dia em que o app saiu da VPS da Ascent (que é a produção do SDR
da Beascent e não aguentou dois servidores de desenvolvimento junto com o resto). Tudo que
existia lá está neste repositório ou na Release indicada abaixo. Este arquivo é o checklist
da primeira sessão no servidor novo. Marque o que for fazendo.

## 1. O que veio da VPS

- **Código**: 4 commits que só existiam na VPS foram enviados em 24/09 (`0c6a495`, `cc88559`,
  `fac974e`, `f84ce99`: package-lock, Bloco 1 no Supabase remoto, tela Conta, produto Cube),
  mais `ecosystem.config.cjs`, `deploy/publicar.sh` e a decisão D40 em `DECISIONS.md`.
- **PDFs de entrada** (`entrada-pdfs/`, 392 arquivos, 3,4 GB): NÃO estão no git (um arquivo
  tem 149 MB; o GitHub recusa acima de 100 MB). Estão como assets da Release
  `entrada-pdfs-2026-09-24` deste repo, um `.tar` por curso, sem compressão, com
  `SHA256SUMS.txt`. Restaurar na estrutura original:

  ```bash
  mkdir -p ../entrada-pdfs && cd ../entrada-pdfs
  gh release download entrada-pdfs-2026-09-24 -R caionavarro-ascent/app-mundo-da-pro -D .
  sha256sum -c SHA256SUMS.txt
  for t in *.tar; do tar xf "$t"; done && rm *.tar
  # resultado: entrada-pdfs/cursos/<curso>/... e entrada-pdfs/{educakits,imagine1,imagine2}.json
  ```

- **Dados do painel** (fora do git pelo `.gitignore`): `apps/web/dados/materiais.json` (387
  materiais com metadados e texto extraído), `apps/web/dados/arquivos/*.pdf` (387 PDFs, todos
  cópias exatas de `entrada-pdfs`) e `apps/web/public/demo-capas/*.png` (387 capas). Estão na
  Release `painel-dados-2026-09-24` (índice, capas e um mapa id → PDF de origem). Depois de
  restaurar os PDFs de entrada, rode `bash deploy/restaurar-dados-painel.sh`: ele baixa,
  confere os checksums e recria as três pastas. Sem isso o `/admin` abre vazio.

- **Esqueleto da pasta de fora** (`/root/mundo-da-pro`): só `.gitkeep`, README e DECISIONS;
  guardado em `legado/vps-mundo-da-pro/`.

## 2. O que NÃO veio (e você precisa ter no Mac)

Arquivos de segredo nunca vão pro git. Recrie no servidor novo com os mesmos valores:

| Arquivo | Chaves |
|---|---|
| `.env` (raiz) | `SUPABASE_DB_URL` (string de conexão Postgres do projeto, usada com psql) |
| `apps/web/.env.local` | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY`, `THEMEMBERS_WEBHOOK_SECRET`, `THEMEMBERS_API_TOKEN`, `THEMEMBERS_API_BASE`, `THEMEMBERS_ORGANIZATION_ID`, `PANDA_API_KEY`, `CRON_SECRET`, `EXPO_ACCESS_TOKEN`, `THEACCESS_PRIVATE_KEY_PATH`, `NEXT_PUBLIC_SITE_URL` |
| `apps/app/.env` | `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`, `EXPO_PUBLIC_API_URL`, `EXPO_PUBLIC_SUPORTE_WHATSAPP` |

`THEACCESS_PRIVATE_KEY_PATH` aponta pra `segredos/theaccess-privada.pem`, que não existia na VPS nem está no git: precisa vir do Mac.

## 3. Banco (Supabase)

- Projeto `rrtvbkiesjuvvvgygmmk` (o mesmo de antes; nada mudou de lado do banco na saída da VPS).
- Migrations em `supabase/migrations/` foram aplicadas **à mão com psql** (D39, 23/09), não
  pela CLI: não existe `supabase_migrations.schema_migrations`. Antes de mexer, confira o
  que está aplicado (`\dt` no psql, ou o `SCHEMA.sql`) e em especial se
  `20260924010000_produto_cube.sql` já foi aplicada.
- Storage: buckets `capas` (público) e `materiais`. Os PDFs de entrada não estão lá.

## 4. Como rodar

- **Desenvolvimento**: no Mac, como no README (`npm run web --workspace apps/app`,
  `npm run web`, `npm run app`). Servidor de desenvolvimento (`next dev`, `expo start`) não
  é coisa de servidor: foi exatamente isso que derrubou a VPS da Ascent em 24/09 (ver D40).
- **Servidor** (produção ou homologação): Node 22, `npm ci`, os `.env` acima, e então
  `bash deploy/publicar.sh` (ajuste os caminhos absolutos no topo dele e em
  `ecosystem.config.cjs`, que apontam pra `/root/mundo-da-pro/app-mundo-da-pro`). O script
  faz `next build --webpack` (Turbopack estourou 1,3 GB e foi morto) e `expo export
  --platform web`, dentro de um limite de memória (`systemd-run`, precisa de cgroup v2), e
  sobe o painel com `next start` no pm2 (`mdp-painel`, porta 3000). O app web estático vai
  pra `/var/www/mdp-app` pra um nginx servir (exemplo de bloco no histórico do D40).
  Memória: painel ~120 a 200 MB; build ~600 MB de pico; export do Expo ~1 GB de pico.

## 5. Onde o projeto parou (24/09/2026)

Estado por bloco em `ROADMAP.md` (Bloco 1, banco, concluído em 23/09; Bloco -1, contas nas
lojas, em aberto). Pendências que travam etapas: seção "Pendências que travam etapas" do
`README.md`. Decisões: `DECISIONS.md` (D1 a D40). Regras de produto: `CLAUDE.md`, `PRD.md`,
`LOJAS.md`.

## 6. Checklist da primeira sessão no servidor novo

1. Ler este arquivo, `CLAUDE.md`, `README.md` e as últimas entradas de `DECISIONS.md`.
2. Recriar os três arquivos `.env` (seção 2) e o arquivo de chave do THEACCESS.
3. `npm ci` na raiz (workspaces) e `npm run typecheck`.
4. Baixar e conferir os PDFs da Release (seção 1) e rodar `deploy/restaurar-dados-painel.sh` (dados do painel).
5. Conferir o banco (seção 3) antes de qualquer migration nova.
6. Só então decidir como rodar (seção 4). Nunca deixar `next dev`/`expo start` rodando
   num servidor compartilhado.
7. Registrar em `DECISIONS.md` o que mudou no servidor novo (endereços, portas, domínio).
