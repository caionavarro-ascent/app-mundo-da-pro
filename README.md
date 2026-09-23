# App Mundo da Prô — como retomar

Leia `CLAUDE.md` (regras), `DECISIONS.md` (D1–D37, o histórico de decisões) e
`ROADMAP.md`. Este arquivo resume o estado vivo do MVP de demonstração.

## Rodar

```bash
npm run web --workspace apps/app   # app (web) em http://localhost:8081
npm run web                        # painel em http://localhost:3000/admin
npm run app                        # QR para Expo Go no celular
```

Servidores caem entre sessões — suba de novo. Mudou config/dependência? Reinicie
o Metro com `--clear`.

## Estado do MVP (set/2026)

- **App demo completo, sem banco (D29/D33):** vitrine Netflix, busca viva, tema
  claro/escuro, onboarding visual de 7 telas, persistência local (AsyncStorage),
  barra de abas em todas as telas, modo desktop web com menu lateral e hero.
- **Abas:** Início · Novidades · Buscar · **Ferramentas** (D36: turmas viraram
  ferramenta; Corretor/Adaptador de Provas e Sondagem Digital "em breve") ·
  Meus materiais (ícone mochilinha).
- **Turmas:** dinâmicas e persistidas; tela de criar turma com sondagem por nível.
- **Formações (D31):** FDA/FPT com 135 aulas reais do Panda Video tocando no app
  (catálogo gerado pela API em `packages/core/src/mock/aulas-panda.ts`).
- **Ebooks (D37):** tipo novo + prateleira própria.
- **Painel `/admin` (D33):** upload de PDF → capa real → publicar → aparece no
  app. Armazém local em `apps/web/dados/` (fora do git).
- **Botão «teste»** na home troca o cenário de posse (padrão: Aluna do FDA).
- **Guia compartilhável:** https://claude.ai/code/artifact/482fe865-454a-44d8-a705-d414109de15a

## Pendências que travam etapas

- **Supabase:** ✓ aplicado no projeto `rrtvbkiesjuvvvgygmmk` em 23/09 (Bloco 1, ver
  D39); atenção às tabelas antigas pré-existentes no projeto. Blocos 2–5 destravados.
- **TheAccess (D35):** chave pública gerada em `segredos/` — falta colar no painel
  do The Members, obter `organization_id` e o formato da URL de login.
- **D-U-N-S / contas das lojas:** não iniciado; trava a publicação (Bloco -1).
- **Decisões do cliente:** AAZ e Canva Prô viram produtos? pitches finais; ícone.
- Chaves em `.env` (fora do git): Panda ✓ · The Members ✓ · Supabase ✓.
