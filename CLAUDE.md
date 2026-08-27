# CLAUDE.md — App Mundo da Prô

Este arquivo é lido em toda sessão. Antes de escrever qualquer código, leia também
`PRD.md` (o que construir), `ROADMAP.md` (em que ordem) e `LOJAS.md` (as regras da App
Store e do Google Play). Registre toda decisão de arquitetura em `DECISIONS.md`.

---

## 1. O que é

Um aplicativo para celular, publicado na App Store e no Google Play, onde as professoras
clientes do Mundo da Prô encontram, previsualizam e baixam todos os materiais pedagógicos
da marca. Layout de vitrine em prateleiras, como um serviço de streaming: o que ela já
comprou abre direto, o resto aparece com cadeado e uma explicação curta de para quem serve.

**Não é uma assinatura.** Cada material pertence a um produto, e o produto é comprado
avulso, como já é hoje. O app é vitrine, entrega e motor de cross-sell — não é um novo
modelo de cobrança. Existe um combo "Acesso Total" como oferta adicional, não como
substituto dos produtos.

**Não é uma WebView.** O app tem telas nativas de verdade: abas nativas, leitor de PDF
nativo, download para uso offline, compartilhamento e impressão pelo sistema, e
notificações. App que é só o site embrulhado é reprovado na revisão da Apple pela
diretriz 4.2. Ver `LOJAS.md`.

**A dor que resolve:** hoje a cliente recebe PDFs soltos por WhatsApp e não faz ideia do
que mais existe. No app ela encontra o que precisa em segundos, guarda offline para usar
na escola sem internet, e esbarra o tempo todo no que ainda não tem.

**Referência visual: a home do Netflix no celular.** Não como inspiração vaga — como
estrutura a ser seguida bloco por bloco. Topo enxuto, pílulas de filtro logo abaixo do
logo, um card de destaque grande ocupando a maior parte da dobra, prateleiras horizontais
abaixo dele, e navegação em abas no rodapé. Quando houver dúvida de layout, a pergunta é
"como o Netflix resolve isso no celular". O mapeamento completo está na Parte A do `PRD.md`.

Três consequências que não podem ser negociadas:
- **Não existe campo de busca no topo.** A busca é uma aba do rodapé. Campo no topo rouba
  a altura da dobra, que pertence ao destaque.
- **O destaque é personalizado por posse**, resolvido no servidor. Não é banner fixo.
- **A navegação principal mora nas abas do rodapé**, não em menu lateral nem hambúrguer.

## 2. Quem usa

Professoras da educação básica brasileira, maioria de escola pública, alfabetizadoras e
professoras de 1º ao 5º ano. Celular Android intermediário, internet instável, pouco
espaço no aparelho, pouca paciência com interface confusa. Imprimem em lote, uma vez por
semana, no xerox da escola.

Consequências obrigatórias de projeto:
- Android é o aparelho principal. iOS existe, mas é minoria. Teste sempre nos dois, e
  priorize Android quando houver conflito.
- Nada de jargão de sistema na interface. "Materiais", não "assets". "Liberado", não "unlocked".
- Toda tela precisa funcionar em conexão ruim, e o que foi baixado precisa abrir sem rede.
- Aparelho com pouco espaço: mostre quanto os downloads estão ocupando e deixe apagar.
- Toque grande, contraste alto, texto legível sem zoom.

**Tema escuro no app.** O acervo é feito de páginas brancas: sobre fundo escuro, cada capa
vira um cartaz e a cor vem do próprio material, como no Netflix. Também poupa bateria em
tela OLED e reduz o brilho na mão de quem usa o celular na sala de aula. O painel de
conteúdo permanece claro — é planilha, não vitrine.

Tokens do app:
`--fundo #0B0D12` · `--superficie #16191F` · `--superficie-2 #1F232B` ·
`--texto #F5F6F8` · `--texto-2 #A2A8B4` · `--marca #FFD84D` · `--coral #E4574E` ·
`--verde #1F9E77` · botão primário sempre branco com texto escuro, como na referência.

## 3. As três superfícies

| Superfície | Onde | Quem usa | Tecnologia |
|---|---|---|---|
| App da Professora | App Store e Google Play | cliente final | Expo / React Native |
| Painel de Conteúdo | `/admin` no site | equipe MDP | Next.js, desktop-first |
| Site e checkout | site público | quem chega por link | Next.js |

Monorepo, um Supabase só, um schema só. O painel vem **antes** do app no roadmap: sem
material cadastrado não existe o que mostrar, e trabalhar com dado falso gera retrabalho.

O site público existe por três motivos: é onde o pagamento acontece (a loja não pode
processar), é a página de retorno depois da compra, e é o destino de quem recebe link no
WhatsApp sem ter o app instalado.

## 4. Stack

**App**
- **Expo** (SDK atual) com **Expo Router**, TypeScript
- **NativeWind** para estilo
- **EAS Build** e **EAS Submit** para gerar e enviar os binários
- `expo-file-system` (download offline), `expo-sharing` e `expo-print` (compartilhar e
  imprimir), `expo-notifications` (push), `expo-secure-store` (sessão)
- Leitor de PDF nativo; nada de renderizar PDF dentro de WebView

**Web**
- **Next.js** (App Router) + TypeScript + Tailwind, para `/admin`, site e retorno de checkout

**Comum**
- **Supabase**: Postgres, Auth (link mágico e OTP por e-mail), Storage, RLS
- **Vercel** para o web
- **pdf-lib** e **pdfjs-dist** no servidor, para marca d'água, capa e miniaturas
- **n8n** já existente para receber o webhook do The Members
- **API da Anthropic** para sugerir taxonomia e rascunhar o "Como usar" no painel
  (consulte https://docs.claude.com/en/api/overview para o identificador de modelo atual;
  não invente nome de modelo)

## 5. Regras de ouro

Estas regras não são negociáveis. Se um pedido conflitar com elas, pare e avise.

1. **Nenhum arquivo é servido direto.** Todo bucket é privado. Download só por URL
   assinada de curta duração, gerada no servidor, depois de checar posse.
2. **Todo PDF baixado sai com marca d'água** com nome e e-mail de quem baixou, no rodapé
   de todas as páginas. Sem exceção, nem em teste.
3. **A posse mora em `entitlements`**, nunca em pedido, nunca em campo de perfil. Fonte
   única da verdade sobre quem pode ver o quê.
4. **O app nunca decide acesso sozinho.** O cadeado na tela é enfeite; a checagem real
   acontece no servidor, na hora de gerar a URL. Assuma que o binário será inspecionado.
5. **Nenhum segredo dentro do app.** Só a chave anônima do Supabase. Chave de serviço,
   chave da Anthropic e token do The Members ficam no servidor. Binário de app é
   inspecionável por qualquer pessoa.
6. **Todo webhook é idempotente.** Guarde o payload cru antes de processar. O mesmo evento
   pode chegar duas vezes.
7. **Reembolso revoga acesso.** Trate a saída com o mesmo cuidado da entrada.
8. **Nada de dado falso depois do bloco 5.** A partir da ingestão, tudo roda com o acervo real.
9. **Português do Brasil em tudo que a usuária lê.** Código, tabelas e variáveis também em
   português quando o termo for do domínio (`materiais`, `niveis`, `turmas`).
10. **Toda tela do app precisa existir de verdade em React Native.** WebView só é aceitável
    para o fluxo de pagamento e para páginas legais. Ver `LOJAS.md`.

## 6. Taxonomia do domínio

Quatro eixos. Todos são muitos-para-muitos: um material serve mais de um ano e mais de um nível.

- **Ano**: `infantil`, `1ano`, `2ano`, `3ano`, `4ano`, `5ano`
- **Nível de escrita**: `pre` (pré-silábico), `sil` (silábico), `sa` (silábico-alfabético), `alf` (alfabético)
- **Tipo**: `sequencia`, `atividade`, `jogo`, `avaliacao`, `cartaz`, `planner`, `aula`
- **Habilidade**: vocabulário controlado, com tabela própria (consciência fonológica,
  produção textual, ortografia, leitura, avaliação diagnóstica, rotina, etc.)

O nível de escrita é o eixo mais importante e o mais mal compreendido por quem não é da
área. Na interface ele nunca aparece só como nome técnico: sempre acompanhado de um
exemplo de como a criança escreve a palavra naquele estágio.

## 7. Convenções de código

**Monorepo**
```
apps/app     -> Expo
apps/web     -> Next.js (site + /admin)
packages/core -> tipos, cliente Supabase, regras de acesso, formatadores
```
Regra de acesso, tipos do banco e chamadas de dados moram em `packages/core` e são usados
pelos dois. Nada de duplicar lógica de posse.

**App**
- Expo Router com grupo de abas. Uma pasta por aba.
- Nada de `fetch` direto para rota sensível: passa por funções de `packages/core`.
- Lista longa sempre virtualizada. Imagem sempre com `expo-image` e cache.
- Estado de servidor com TanStack Query, com cache persistido para abrir offline.

**Web**
- Server Components por padrão. `"use client"` só onde houver estado ou evento.
- Rotas de dados sensíveis em Route Handlers sob `/app/api`.

**Banco**
- Tipos gerados em `packages/core/types/supabase.ts` via CLI. Não escreva tipo à mão.
- Migrations versionadas em `supabase/migrations`. Nada de alterar schema pelo painel web
  sem gerar migration.

## 8. Como trabalhar comigo

- Uma sessão por bloco do `ROADMAP.md`. `/clear` entre blocos.
- Ao terminar um bloco: rode o build, teste o fluxo descrito no bloco em aparelho ou
  simulador, e só então atualize `DECISIONS.md` e marque o bloco no `ROADMAP.md`.
- Se algo do PRD não fizer sentido na implementação, pare e pergunte antes de improvisar.
  Improviso silencioso é o principal risco deste projeto.
- Não instale dependência nova sem justificar em uma linha. Em Expo, confira antes se a
  biblioteca funciona sem ejetar.
- Commits pequenos, mensagem em português, no imperativo.

## 9. Fora de escopo no MVP

Não construa nada disso sem pedido explícito: turmas e sondagem, plano da semana,
avaliação por estrelas, indicação com cupom, player de vídeo próprio (aulas do FDA/FPT
abrem o The Members no navegador do sistema), chat ou comunidade, login social,
sincronização entre aparelhos além da sessão.

Estão previstos no schema como fase 2. Deixe as tabelas, não construa as telas.
