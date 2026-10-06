# DECISIONS.md

Registro das decisões de produto e arquitetura. Toda decisão nova entra aqui, com data e
motivo. Quando uma decisão for revertida, não apague: marque como revertida e explique.

---

### D1 — Web instalável, não app nativo
**REVERTIDA em 27/08 pela D16.** Mantida aqui como registro do raciocínio original.
**Era:** o app seria um PWA em Next.js, sem App Store e sem Google Play.
**Por quê:** a mecânica central é levar a professora para um checkout externo e liberar o
material depois. As lojas restringem exatamente isso e cobram comissão sobre conteúdo
digital. Como não há necessidade de recurso nativo e o público é majoritariamente Android,
a web resolve com custo e prazo muito menores.
**Reavaliar se:** houver demanda real por notificação push ou uso offline pesado.

### D2 — Posse por produto, não assinatura
**Decidido.** O app não cria um modelo de cobrança novo. Cada material pertence a um ou
mais produtos, e o produto continua sendo vendido avulso como já é hoje.
**Por quê:** uma assinatura que entregasse tudo canibalizaria a Abertura FDA de novembro,
a campanha de maior receita do ano, e trocaria pico de caixa por receita diluída.
**Consequência:** existe um combo "Acesso Total" como oferta adicional, nunca como
substituto dos produtos individuais.

### D3 — FDA e FPT aparecem, mas não são hospedados
**Decidido.** As aulas dos cursos aparecem na vitrine como cards, e o botão leva para o
The Members. O app não reconstrói player, progresso nem certificado.
**Por quê:** reconstruir a plataforma de curso adicionaria cerca de três meses ao projeto
e não é o gargalo. O valor está em a aluna de EducaKits esbarrar numa aula do FDA enquanto
procura atividade.

### D4 — E-mail é a única chave de identidade
**Decidido.** Nada de CPF como chave de deduplicação ou de casamento de compra.
**Por quê:** a base do MDP tem CPF majoritariamente preenchido com valor genérico.

### D5 — Marca d'água obrigatória em todo download
**Decidido.** Nome e e-mail carimbados no rodapé de todas as páginas, gerado no ato.
**Por quê:** não impede vazamento determinado, mas mata o compartilhamento casual em grupo
de WhatsApp, que é o vetor real. O efeito é psicológico e funciona.
**Consequência:** os arquivos precisam morar em bucket nosso. Não dá para servir direto do
The Members.

### D6 — Painel de conteúdo antes do app da professora
**Decidido.** Blocos 3 e 4 vêm antes do 6 e 7.
**Por quê:** sem material cadastrado não há o que mostrar, e construir vitrine sobre dado
falso gera retrabalho na hora de plugar o real.

### D7 — Taxonomia sugerida por IA, confirmada por humano
**Decidido.** O painel sugere tipo, anos, níveis, habilidade, descrição e passos; a pessoa
confirma ou corrige. Nunca salva sozinho.
**Por quê:** o acervo é grande e o tagueamento manual é o gargalo real do cronograma.
Transformar digitação em triagem é o que faz a curadoria caber nas semanas disponíveis.

### D8 — Painel de conteúdo é desktop-first
**Decidido.** Responsivo para emergência, mas otimizado para notebook.
**Por quê:** subir PDF longo, escrever ficha e revisar quatro taxonomias pelo celular é
lento e propenso a erro. O uso real da equipe é sentada.

### D9 — Nível de escrita sempre com exemplo visual
**Decidido.** Os chips de nível mostram como a criança escreve "borboleta" em cada estágio.
**Por quê:** a professora reconhece o caderno da aluna dela na hora, sem depender de
lembrar nomenclatura técnica. É também a assinatura visual que diferencia o app.

### D10 — "Como usar" liberado mesmo com cadeado
**Decidido.** A aba fica aberta em material que a professora não possui.
**Por quê:** ela entende exatamente como usaria o material que não tem. É o mecanismo de
desejo mais forte da vitrine, e custa zero.

---

## Em aberto

- **Preço e composição do Acesso Total.** Precisa existir como SKU no The Members antes do
  Bloco 8. A D22 assume que o combo libera todo o acervo; se FDA/FPT ficarem de fora,
  a função `tem_acesso` precisa de ajuste. Atenção: aulas do FDA abrem no The Members,
  que tem controle de acesso próprio — o combo liberar a aula no app não libera lá.
- **Quem escreve os pitches de cada produto** (para quem é / para que serve). São 8 pares
  de frases e definem a conversão da vitrine.
- **Quem faz a curadoria e com quantas horas por semana.** Sem isso definido, o cronograma
  não fecha.
- **Quem produz as artes de destaque** (vertical 4:5, título tratado como imagem). Cada
  campanha e cada material em destaque precisa de uma. O fallback gerado da capa funciona,
  mas rende muito menos que arte feita à mão. Provável trabalho de Canva para a equipe.
- **Fundo escuro combina com a identidade do Mundo da Prô?** Ver D14. Precisa de aval da
  Gi e da Flávia antes do Bloco 7.
- **Quem cuida das contas de desenvolvedor e do D-U-N-S?** Bloco -1, **nada iniciado em
  27/08**. Com a decisão D26 (lançamento em novembro), o D-U-N-S precisa ser solicitado
  nesta semana ou a data não fecha. É o item que trava a publicação.
- **Termos de uso e política de privacidade**, com URL pública. Necessários para publicar.
  Provavelmente exige apoio jurídico.
- **A API v1 do The Members entrega URL de arquivo?** Se não, a ingestão do Bloco 5 vira
  pasta local mais planilha de correspondência.

---

## Decisões da referência visual (27/08)

### D11 — A home segue a estrutura do Netflix mobile
**Decidido.** A referência é a home do app do Netflix no celular, seguida bloco a bloco:
topo enxuto, pílulas de filtro sob o logo, card de destaque grande na dobra, prateleiras
horizontais, barra de navegação flutuante no rodapé. O mapeamento está na Parte A do PRD.
**Por quê:** é um padrão que a professora já sabe usar sem aprender nada, e que resolve
bem o problema central da vitrine — mostrar muita coisa sem parecer catálogo de arquivo.

### D12 — Sem busca no topo; busca é aba do rodapé
**Decidido.** A navegação principal fica numa barra flutuante com Início, Novidades,
Buscar e Meus materiais. O campo de busca abre em tela cheia pela aba.
**Por quê:** campo de busca no topo consome a altura da dobra, que pertence ao destaque.
No Netflix a busca também mora no rodapé, e ninguém tem dificuldade de achar.

### D13 — O destaque é personalizado por posse
**Decidido.** O bloco grande da dobra não é banner fixo. É resolvido no servidor por
ordem de prioridade: campanha ativa, material novo de produto que ela tem, próximo
produto sugerido, material gratuito de entrada.
**Por quê:** é a posição mais valiosa da tela. Usá-la para o mesmo banner para todo mundo
desperdiça o único espaço que consegue mover uma venda no primeiro segundo de sessão.
**Consequência:** a tabela `destaques` precisa existir e o painel precisa da tela B6.

### D14 — Tema escuro no app, claro no painel
**Decidido.** O app da professora é escuro; o painel de conteúdo permanece claro.
**Por quê:** o acervo é feito de páginas brancas, e sobre fundo escuro cada capa vira um
cartaz — a cor da tela passa a vir do próprio material, como acontece no Netflix. Ajuda
também na bateria de tela OLED e no brilho em sala de aula. O painel é planilha, não
vitrine, e escuro atrapalharia a leitura de tabela longa.
**Reavaliar se:** a identidade do Mundo da Prô exigir fundo claro. Nesse caso os tokens
mudam, mas a estrutura de blocos permanece.

### D15 — Prova social por "Mais baixados da semana"
**Decidido.** Uma prateleira com numeração de posição, no lugar do TOP 10 da referência,
alimentada pela view `vw_mais_baixados`.
**Por quê:** dá sensação de acervo vivo e usado por outras professoras sem precisar
construir avaliação, comentário ou moderação. Custo quase zero, efeito alto.

---

## Decisões do app nativo (27/08)

### D16 — Aplicativo nativo nas duas lojas, reverte a D1
**Decidido.** O produto passa a ser um aplicativo publicado na App Store e no Google Play,
feito em Expo, com um site em Next.js ao lado para o painel, o checkout e as páginas
legais.
**Por quê:** decisão do cliente. Estar na loja dá presença de marca, permite notificação,
permite uso offline de verdade e é o que a Gi e a Flávia querem poder anunciar.
**O que muda:** o prazo sobe de cerca de 9 para cerca de 12 semanas; entram as regras das
lojas (`LOJAS.md`); entram três recursos que a versão web não tinha — download offline,
impressão pelo sistema e push.
**O que não muda:** a estrutura de blocos da vitrine, o modelo de posse por produto, o
schema, o webhook e a marca d'água.

### D17 — Link externo de pagamento, não compra dentro do app
**Decidido.** O botão de compra abre o checkout do The Members no navegador do sistema,
usando o programa de link externo das lojas.
**Por quê:** os produtos vão de R$147 a R$697, e Pix e parcelamento em 12x respondem por
boa parte da conversão nessa faixa. A compra dentro do app não faz nenhum dos dois e
trabalha com faixas fixas de preço. Pelo levantamento feito no projeto The Edit, após o
acordo do CADE a comissão do link externo no Brasil fica em torno de 10% para quem está no
Small Business Program, abaixo dos 15% da compra dentro do app.
**Atenção:** essa é a decisão mais sensível a mudança de política. Reconfirme os termos
atuais das duas lojas antes do Bloco 10 e registre aqui a data da confirmação.
**Consequência:** o checkout nunca abre em WebView interna. Sempre no navegador do sistema.

### D18 — Não é WebView embrulhada
**Decidido.** Todas as telas de produto são nativas em React Native. WebView só no
checkout externo e nas páginas legais.
**Por quê:** a diretriz 4.2 da Apple reprova app que só embrulha um site, e é o motivo de
rejeição mais comum em projetos assim. Além disso, os três recursos que justificam a
existência do app — offline, impressão e push — não existem numa WebView.

### D19 — Entrada por código de 6 dígitos, não link mágico
**Decidido.** No app, a autenticação é por código enviado ao e-mail. O link mágico fica só
no `/admin` web.
**Por quê:** em aplicativo, o link mágico obriga a professora a sair para o e-mail e voltar,
e o retorno para o app frequentemente falha. O código de 6 dígitos ela lê e digita sem sair
da tela.

### D20 — Exclusão de conta dentro do app
**Decidido.** Tela de exclusão em Conta, que anonimiza os dados pessoais e preserva o
registro de compra pelo prazo fiscal.
**Por quê:** exigência das duas lojas quando o app permite criar conta. Sem isso, reprova.

### D21 — Configuração vem do servidor, não do binário
**Decidido.** Preço, texto, destaque, prateleira e campanha vêm das tabelas
`configuracoes`, `destaques` e `produtos`.
**Por quê:** trocar a oferta da Happy Friday não pode depender de uma nova versão passar
pela revisão da Apple. Só mudança de tela ou de biblioteca nativa gera nova submissão.

## Decisões do início do desenvolvimento (27/08)

### D22 — Acesso Total tratado na função de acesso
**Decidido.** `tem_acesso` considera entitlement ativo de qualquer produto `is_combo`
como acesso a todo material. Nenhum vínculo por material é criado para o combo.
**Por quê:** vincular todo material ao combo em `material_produto` exigiria trigger e
manutenção; na função, material novo já nasce coberto e a regra mora num lugar só.
**Pendência ligada:** a composição exata do combo segue em aberto (ver "Em aberto").

### D23 — Supabase local até o fim do Bloco 1
**Decidido.** Desenvolvimento começa com `supabase start` local; o projeto hospedado
entra quando o schema estiver estável. Migrations versionadas tornam a troca trivial.
**Pendência:** Docker não está instalado na máquina de desenvolvimento — precisa ser
instalado antes do Bloco 1 (ou cair no plano B: criar já o projeto hospedado).

### D24 — Nome da professora vem do The Members, com fallback
**Decidido.** O nome entra pelo webhook/ingestão. Sem nome (ex.: entrou antes do
webhook), a marca d'água carimba só o e-mail, a saudação usa o prefixo do e-mail
capitalizado (`primeiroNome` em packages/core) e o perfil permite corrigir depois.

### D25 — Compras antigas de Hotmart e Kiwify fora do lançamento
**Decidido.** Só compras do The Members contam como posse. Cliente antiga é atendida
caso a caso pela concessão manual do /admin/acessos (`origem = 'manual'`).
**Reavaliar se:** o volume de chamados de suporte após o lançamento justificar importar
as bases com `origem = 'migracao'`.

### D26 — Lançamento em onda única, mirando novembro, com MVP local antes
**Decidido pelo cliente.** Sem onda web separada. O marco imediato é o MVP local do fim
do Bloco 8 — app navegável de ponta a ponta no celular da Gi e da Flávia — que destrava
o interesse das sócias antes de qualquer investimento em publicação.
**Risco registrado:** em 27/08 o Bloco -1 estava zerado; novembro só fecha se o D-U-N-S
for pedido imediatamente e a primeira submissão não travar.

### D27 — Monorepo com npm workspaces
**Decidido.** npm workspaces, sem pnpm/yarn/turbo.
**Por quê:** zero configuração extra, sem symlinks que quebram o Metro, e suportado
nativamente pelo EAS Build. O Expo detecta o monorepo sozinho desde o SDK 52.

### D28 — Identificador de pacote provisório
**Decidido.** `com.mdp.app` no iOS e Android enquanto o MVP for local. Precisa virar
definitivo ANTES da primeira publicação — no Android o pacote é imutável depois que o
app entra no Play Console. Registrar aqui quando for trocado.

### D29 — MVP de demonstração sem Supabase (27/08)
**Decidido pelo cliente.** A casca (Bloco 6) e a vitrine (Bloco 7) foram adiantadas com
um acervo de exemplo em `packages/core/src/mock/acervo.ts`, para colocar o app navegável
na mão das sócias antes de instalar banco. As telas consomem só as funções desse módulo,
que espelham as regras do servidor (A2, A5); quando o Supabase entrar (Blocos 1–5), a
fonte de dados troca e as telas ficam.
**Fora da demo:** login, download com marca d'água, compra e push — viram alertas
"chega no Bloco N". A regra de ouro 8 (nada de dado falso após o Bloco 5) segue valendo:
o mock morre na ingestão.

### D30 — Aba "Turmas" antecipada da fase 2, a pedido do cliente (27/08)
**Decidido pelo cliente.** A professora vê as turmas que atende e marca quais
atividades já passou em cada uma. As tabelas `turmas` e `plano_semana` já existiam no
schema como fase 2; as telas entram agora na demo (mock, D29).
**Atenção:** o PRD A8 definia quatro abas no rodapé; com Turmas são cinco. Validar o
desenho com a Gi e a Flávia junto do restante da demo, e atualizar o PRD A8 se ficar.

### D31 — Aulas tocam dentro do app, via Panda Video (29/08)
**Decidido pelo cliente.** Revisa parcialmente a D3: as aulas em vídeo passam a tocar
dentro do app, embutindo o player do Panda Video (WebView pontual no aparelho, iframe
no web). Os vídeos continuam hospedados no Panda; progresso e certificado continuam no
The Members — o app não os reconstrói.
**Segurança:** na versão real, o embed é montado no servidor após checar o entitlement,
usando os recursos do Panda (whitelist de domínio, HLS criptografado, anti-download).
**Consequência:** aulas de demonstração gratuitas viram isca dentro da vitrine; a D23
de LOJAS segue valendo — o app continua não sendo uma WebView embrulhada.

### D32 — Supabase hospedado, direto (29/08)
**Decidido pelo cliente.** Substitui a D23 (local até o Bloco 1): sem Docker na máquina,
o banco nasce direto num projeto hospedado no supabase.com. Migration inicial, seed e
teste de acesso prontos em `supabase/`; falta o cliente criar o projeto e fornecer as
chaves para o push.

### D33 — Painel de conteúdo sem banco, com armazenamento local (29/08)
**Decidido pelo cliente.** O painel /admin nasce antes do Supabase, gravando em
arquivos do próprio repositório: `apps/web/dados/materiais.json` (fichas),
`apps/web/dados/arquivos/` (PDFs originais, fora do git) e `public/demo-capas/`
(capas). Sem login nesta fase.
**Desvio temporário do Bloco 3:** a capa e o texto são extraídos no NAVEGADOR
(pdfjs-dist) e enviados junto com o PDF; o servidor confere as páginas com pdf-lib.
No Supabase, o processamento volta inteiro para o servidor, como manda o PRD.

### D34 — Onboarding visual completo, revendo o A15 (29/08)
**Decidido pelo cliente.** A primeira abertura passa de 3 cartões (A15) para 7 telas
deslizáveis, cada uma com um mini-mockup do próprio app: vitrine, código por e-mail,
níveis de escrita, amostra/cadeado, offline, turmas e formações. Continua pulável e
pode ser revista em Meus materiais → "Rever a apresentação do app".

### D35 — Login sem senha no The Members via TheAccess (02/09)
**Decidido pelo cliente.** O app usa o TheAccess para abrir o The Members com a
professora já logada: nosso servidor emite JWT RS256 (e-mail + organization_id)
validado pela chave pública cadastrada no painel deles. Elimina o atrito de senha
no botão "Assistir no The Members" (D3) e no pós-compra.
**O que NÃO muda:** o login do nosso app continua sendo OTP por e-mail (D19) — o
TheAccess transporta a identidade para lá, não autentica aqui.
**Segurança:** a chave privada emite acesso a qualquer conta de aluno; vive só no
servidor (regra 5), e o token só é emitido após conferir a sessão (regra 4).
**Pendências:** cadastrar a chave pública no painel (Plataforma → Configurações →
Integrações → TheAccess), obter o organization_id, e confirmar com o suporte o
formato exato da URL de entrada (a documentação não o especifica).

### D36 — Aba Turmas vira aba Ferramentas (13/09)
**Decidido pelo cliente.** A quinta aba passa a ser "Ferramentas": um grid de 2 colunas
com 6 espaços para utilitários da professora. Minhas turmas não morre — vira a primeira
ferramenta do grid (a tela continua inteira, acessada por lá). Slots anunciados:
Corretor de Provas e Adaptador de Provas para crianças atípicas (em breve).
**Por quê:** posiciona o app além do download de PDF — é a casa da gestão de sala.
Revisa a D30 (turmas como aba própria).

### D37 — Ebooks entram como tipo de material (13/09)
**Decidido pelo cliente.** Novo tipo `ebook` na taxonomia, com prateleira própria na
home e leitura pelo mesmo caminho do PDF (offline + marca d'água, quando o banco entrar).
Os cursos seguem na parte separada já construída (páginas de Formação).
**Consequência:** o enum `tipo_material` do schema ganha o valor 'ebook' (ajustado em
SCHEMA.sql e na migration inicial, ainda não aplicada).

### D38 — Onboarding enxugado de 7 para 4 telas (13/09)
**Decidido pelo cliente** ("tem muitas telas"). Ficam: vitrine, nível de escrita,
amostra/cadeado e offline/imprimir. Saem: login por e-mail (a professora vive isso na
própria tela de login), turmas (descoberta na aba Ferramentas) e formações (só
interessa a quem tem FDA/FPT). Critério: o onboarding apresenta o valor do app;
recursos que a interface já ensina sozinha não ganham tela. Revisa a D34.

### D39 — Bloco 1 aplicado no Supabase remoto; o projeto não estava vazio (23/09)
**Feito na VPS.** Migration inicial (35 objetos), seed (7 produtos + combo, 10
habilidades) e teste de acesso aplicados no projeto `rrtvbkiesjuvvvgygmmk` via psql.
Teste do roadmap passou inteiro: Ana/Bia, combo (D22), revogação (regra de ouro 7),
expiração e duplicata manual barrada. Tipos gerados do schema vivo com o motor da CLI
(`@supabase/postgres-meta` + `postgrest-typegen` como biblioteca, sem Docker) e
gravados em `packages/core/types/supabase.ts`; typecheck verde nos 3 workspaces.
**Atenção:** o projeto Supabase já continha 14 tabelas e 3 views de uma iteração
anterior do mesmo domínio (`produto`, `sequencia`, `raw_the_members`, `jose_*`).
Sem colisão de nomes e com RLS ligada em todas, mas os tipos gerados as incluem.
Pendente decisão do cliente: manter o projeto compartilhado ou migrar para um limpo.
A senha do banco fica em `.env` na raiz (fora do git), como `SUPABASE_DB_URL`.

### D40 — Conta separada; Meus materiais vira estante de produtos (23/09)
**Pedido do cliente.** A aba Meus materiais deixou de acumular configurações e passou
a responder "o que eu comprei": cards de produto (não de material) com cor, pitch
curto e tamanho do acervo ("9 materiais no app", "53 aulas em vídeo"); formações
navegam para a própria página; combo ganha selo "todos os produtos liberados".
A gestão da conta (tema, rever apresentação, notificações, WhatsApp, termos, sair,
excluir conta) mudou para a tela própria `/conta`, aberta pela engrenagem no topo
da aba. "Ajuda no WhatsApp" já abre o número real (EXPO_PUBLIC_SUPORTE_WHATSAPP).
Revisa a A8.


### D40 — Produção na VPS: nada de dev server; painel com `next start`, app estático (24/09)
**Contexto.** `expo start` e `next dev` ficaram horas rodando na VPS da Ascent (que é a
produção do SDR da Beascent, 1 CPU, 3,9 GB); com 8 sessões do Claude Code na mesma máquina
a memória e a swap esgotaram e o SDR passou 14 min sem responder. O kernel matou um
`next-server` por OOM duas vezes no dia. Depois, os mesmos dois foram postos no pm2 sem
derrubar os soltos, e ficaram em loop de reinício (600+ vezes) por porta ocupada.
**Decisão.** Servidor de desenvolvimento só no Mac. Na VPS: painel em build de produção
(`next build --webpack`, ~600 MB de pico, 70 s) e `next start` no pm2 (`ecosystem.config.cjs`,
`mdp-painel`, ~120 MB); app como export estático web (`expo export`, 8,7 MB) no nginx
porta 8081 (0 MB). Builds rodam dentro de cgroup com teto de memória e sem swap
(`deploy/publicar.sh`). Vigia de dev server esquecido em cron (30 min). Turbopack foi
descartado no build por estourar 1,3 GB.
**Consequência.** Memória do MDP na VPS cai de ~600 MB para ~120 MB. Teste de app no
celular (Expo Go) e hot reload continuam existindo, mas no Mac.

**Adendo (24/09, mesmo dia):** o Daniel pediu pra tirar o app da VPS da Ascent de vez. Tudo
que estava na VPS (4 commits do Caio ainda não enviados + `ecosystem.config.cjs`,
`deploy/publicar.sh`, esta decisão) foi para o GitHub, e o app saiu do servidor. Os
scripts de deploy ficam como referência para um servidor próprio.

### D41 — Servidor próprio srv2006395: endereços, portas e domínio (24/09)
**Contexto.** Saída da VPS da Ascent (D40). O app foi para uma VPS própria (Hostinger,
`srv2006395`, IP `187.127.38.236`, Ubuntu 26.04, 1 CPU, 3,8 GB + 2 GB de swap, 48 GB),
dividida em dois blocos: Dashboards da Ascent (Docker, `/srv/ascent-midia`, porta 8081)
e este app (`/srv/mundo-da-pro`). Checklist do `SERVIDOR-NOVO.md` seguido na ordem.
**Como roda (mantém o D40).** Node 22.22 + pm2 7 (inicia no boot), sem Docker e sem dev
server. Repo em `/srv/mundo-da-pro/app-mundo-da-pro`, PDFs de entrada em
`/srv/mundo-da-pro/entrada-pdfs` (389 PDFs, 3,4 GB, checksums conferidos). Publicar:
`git pull && npm ci && bash deploy/publicar.sh`.
- Painel: `next start` no pm2 (`mdp-painel`) em `127.0.0.1:3000` (não exposto), nginx
  publica em `http://187.127.38.236:8083` (`/admin`). Uploads até 200 MB.
- App web: export estático em `/var/www/mdp-app`, nginx em `http://187.127.38.236:8082`.
  Rotas dinâmicas (`/material/<id>`, `/aula/…`, `/formacao/…`, `/turma/…`) servem o
  `[id].html` correspondente.
- A porta 8081 deste servidor é dos Dashboards da Ascent, não do app.
- `ecosystem.config.cjs` usa `cwd: __dirname` (antes: caminho fixo da VPS) e o painel
  escuta só em 127.0.0.1. Firewall (ufw): 22, 80, 443, 8081–8083.
**Domínio.** Ainda não há. As portas 8082/8083 são provisórias: com domínio, o nginx
passa a `listen 80` + `server_name`, certbot emite o HTTPS, as portas provisórias fecham
e `NEXT_PUBLIC_SITE_URL`/`EXPO_PUBLIC_API_URL` (hoje `http://187.127.38.236:8083`) mudam
para o domínio, com novo `publicar.sh`.
**Banco.** Conferido pela API antes de qualquer migration: as 17 tabelas do schema inicial
existem e o produto `cube` está gravado, logo as duas migrations já estavam aplicadas;
buckets `capas` (público) e `materiais` (privado). Nada foi aplicado.
**Pendências de env.** Faltam `SUPABASE_DB_URL` (psql), `ANTHROPIC_API_KEY`,
`THEMEMBERS_API_BASE`, `THEMEMBERS_ORGANIZATION_ID`, `EXPO_ACCESS_TOKEN` e a chave
`segredos/theaccess-privada.pem`; nenhuma é lida pelo código atual. `CRON_SECRET` e
`THEMEMBERS_WEBHOOK_SECRET` foram gerados no servidor (o segundo vai para o n8n no Bloco 10).
**Adendo (24/09, mesmo dia): app sem os materiais do painel.** `apps/app/src/lib/painel.ts`
buscava o painel em `localhost:3000` fixo no web, que só funciona com tudo na mesma máquina.
Agora usa `EXPO_PUBLIC_API_URL` quando ela aponta para fora de localhost (em
desenvolvimento, vazia ou localhost, vale a detecção antiga). O nginx serve
`/demo-capas/` direto do disco, porque `next start` só entrega o `public/` que existia no
build, e as capas enviadas pelo /admin depois disso ficariam quebradas até o próximo publicar.

### D42 — Home vira busca por pergunta; a vitrine vira a aba Vitrine (24/09)
**Decidido pelo cliente.** A primeira tela do app passa a ser como a de um assistente: saudação,
uma barra de pergunta e exemplos ("Jogo de rimas para o 1º ano"). Ao perguntar, aparece a
pergunta como balão, uma resposta curta que repete o que foi entendido ("Encontrei 19
sugestões de atividade sobre “frutas” para a Ed. Infantil" + chips "Entendi: …") e a lista
de materiais sugeridos, cada um com o porquê e, quando o tema foi achado no PDF, o trecho.
Revoga, para a home, a regra "não existe campo de busca no topo" (seção 1 do CLAUDE.md).
**A vitrine não morre.** A home Netflix inteira (destaque, prateleiras, A0–A7) virou a aba
**Vitrine** (`vitrine.tsx`), no lugar da aba Buscar, que foi removida (a busca dela ficou
contida na nova home). Abas: Início · Novidades · Vitrine · Ferramentas · Meus materiais.
Ícones: Início ganha o brilho (sparkles); Novidades passa para o sino.
**Motor: busca inteligente, não IA** (escolha do cliente; IA de verdade fica para depois e
exigiria a `ANTHROPIC_API_KEY`). `packages/core/src/busca.ts`, usado pelo app e pelo painel:
reconhece ano ("1º ano", "primeiro ano"), nível ("silábicos"), tipo com sinônimos ("prova" →
avaliação, "brincadeira" → jogo, "folhinha" → atividade), descarta palavras vazias e pontua
título > descrição > texto do PDF, casando só no começo de palavra ("rima" acha "rimas", não
"primavera"). O painel expõe `GET /api/busca?q=`, que enxerga o texto dos PDFs; o app mescla
com a busca local (materiais da demo) e, sem painel, segue só com a local. A busca antiga
(`buscarMateriais`, todas as palavras obrigatórias) foi removida.
**Texto dos PDFs.** Os 387 materiais vindos da VPS têm `textoExtraido` vazio. O
`deploy/indexar-textos.sh` (pdftotext, 8 primeiras páginas) gera
`apps/web/dados/textos-busca.json` (fora do git): 339 de 387 com texto; os outros são só
imagem e contam pelo título. O `publicar.sh` refaz o índice a cada publicação.
**Limite conhecido.** Nos dados do painel quase nada tem ano (29 de 387) e nenhum tem nível;
perguntas só por ano/nível ("primeiro ano") acham pouco até essas fichas serem preenchidas no
/admin.

### D43 — Mosaico estilo Pinterest abaixo da pergunta da home (24/09, experimento)
**Pedido do cliente, para testar e visualizar.** Abaixo da pergunta da Início (D42), antes de
ela perguntar, entra "Inspire-se no acervo": um mosaico de colunas com alturas livres, cada
material na coluna mais curta, capa com cantos arredondados e o título embaixo. 2 colunas no
celular, 3 a 5 conforme a largura (até 1200 px); carrega 30 por vez conforme ela rola. Só
materiais com capa real, embaralhados sempre do mesmo jeito (por id); sem painel no ar,
usa a demo com alturas variadas. Componente `apps/app/src/components/mosaico.tsx`.
**Proporção da capa vem do painel.** `/api/materiais` passou a devolver `capaProporcao`
(altura ÷ largura, lida do cabeçalho do PNG): as capas são 264 em pé (1,41) e 123 deitadas
(0,71), e as colunas se montam antes das imagens chegarem, sem blocos pulando.
**Duas armadilhas encontradas.** (1) A home é pré-gerada no build (export estático) sem
largura de tela nem acervo do painel: o mosaico só é montado no aparelho. (2) O React
Compiler (ligado no app) memoriza pelo que é reativo DENTRO do cálculo e ignora dependência
manual; o acervo do módulo não é reativo, então a lista era calculada uma vez, antes do
painel. O contexto passou a expor `versaoAcervo`, e quem lê o acervo do módulo tem de usá-la
no cálculo (ver `acervo(versao)` em `index.tsx`).
**Pendente, anterior a esta mudança:** a Vitrine (e a home) disparam o erro de hidratação
React #418 no web; o React se recupera e a tela funciona. Provável causa: o topo muda por
largura (`useDesktopWeb`) e por tema (logo claro/escuro) entre o HTML do build e o aparelho.

### D44 — Ferramentas Cruzadinha e Caça-palavras, com PDF pronto (25/09)
**Pedido do cliente.** Duas ferramentas novas na aba Ferramentas ("Disponíveis agora"): a
professora escolhe palavras (8 temas prontos com dica, como Animais, Frutas e Escola, ou as
dela) e a atividade se monta sozinha, com prévia na tela e PDF para baixar.
- **Cabeçalho** igual ao do papel dela (print do cliente): escola em negrito, "Prof. Maria" à
  direita, e Nome ____ Nº ____ 4º ano A ____. Escola, professora e turma ficam salvas no
  aparelho; campo vazio vira linha para escrever à mão.
- **Cruzadinha** (`packages/core/src/atividades/cruzadinha.ts`): encaixa cruzando por letra em
  comum, sem palavra encostando de lado, em 40 tentativas (fica a que põe mais palavras na
  menor área). Testada em 50 cruzadinhas de 15 palavras: nenhuma sequência falsa. Palavra sem
  letra em comum fica de fora e a tela avisa. Todas com dica → dicas numeradas (Horizontais/
  Verticais); alguma sem dica → quadro "Palavras para encaixar" (formato de alfabetização).
- **Caça-palavras** (`caca-palavras.ts`): fácil (→ ↓), médio (+ diagonal), difícil (8
  direções); grade de 8 a 16, cresce se não couber; preenchimento com letras no peso do
  português. Quadro de palavras com quadradinho para marcar.
- Letras da grade em maiúscula e sem acento (o Ç fica); no banco e nas dicas, com acento.
- **Gabarito** opcional (padrão ligado) numa 2ª página, sem cabeçalho: a cruzadinha preenchida
  e, no caça-palavras, um traço colorido sobre cada palavra.
- **Mesma semente na prévia e no PDF**: "Outra arrumação" troca a semente; o PDF sai idêntico
  ao que ela viu. Os geradores estão no `packages/core`, usados pelo app e pelo painel.
- **PDF no painel** (`apps/web/lib/pdf-atividades.ts`, pdf-lib, A4): `GET
  /api/ferramentas/pdf?d=<json>` (até 20 palavras, textos limitados), `attachment`. O app abre
  o endereço no navegador do aparelho (`Linking.openURL`), que baixa o arquivo; não precisa
  de `expo-file-system`/`expo-sharing`, que ainda não estão instalados.
**Regra de ouro 2, exceção decidida pelo cliente:** folha gerada com as palavras da própria
professora para o aluno não leva nome/e-mail dela; só o rodapé "Feito com o app Mundo da
Prô". Registrada no CLAUDE.md. Material do acervo continua com marca d'água sem exceção.
**Adendo (25/09): prévia da cruzadinha desalinhada.** As casas eram montadas em linhas
(flex-row) com margem -1 só nas casas com letra, então cada linha deslocava conforme as
casas vazias, e o tamanho fracionado arredondava diferente por coluna. Agora cada casa fica
em posição absoluta (coluna × casa, linha × casa), com tamanho inteiro e 1 px a mais para a
borda sobrepor a da vizinha, como no PDF. Conferido no navegador: 55 casas, nenhuma fora da
grade. O caça-palavras também passou a usar casa de tamanho inteiro.

### D45 — Cruzadinha e Caça-palavras a partir de um material do acervo (25/09)
**Pedido do cliente.** Nas duas ferramentas, a professora escolhe "De onde vêm as palavras?":
temas e as dela (D44) ou **um material do acervo**. No segundo modo, ela busca o material, diz
quantas palavras quer e cada toque em **Nova versão** sorteia outras palavras do repertório
daquele PDF e outra arrumação: versões sem fim do mesmo material.
**Repertório** (`deploy/gerar-repertorio.sh`, roda no `publicar.sh`): para cada PDF publicado,
até 40 palavras do tema em `apps/web/dados/repertorio-palavras.json` (fora do git). Hoje:
216 de 387 materiais, 6.174 palavras, 2.792 com dica. Os outros têm pouco texto (PDF de imagem,
tabela, gabarito numérico) e não aparecem na lista. Filtros, nesta ordem:
- texto das até 30 primeiras páginas (pdftotext); frase repetida em 15+ PDFs (apresentação,
  direitos) sai antes de contar; menos que isso pode ser a mesma história em outra versão;
- palavra do dicionário do português (`wbrazilian`, 275 mil formas), 3 a 12 letras, fora das
  palavras vazias, de instrução ("ligue", "pinte") e comuns de jogo ("avance", "volte");
- genérica sai: aparece em mais de 12% dos materiais;
- cara de substantivo: já veio depois de artigo/preposição ou em lista em maiúsculas;
  infinitivo ("voltar") só fica com artigo forte ("o jantar");
- singular e plural da mesma palavra: fica a mais frequente;
- ordem: frequência no material × raridade no acervo.
**Dica de lacuna** tirada do próprio PDF: frase de 5 a 18 palavras com a palavra uma vez,
trocada por "________" ('Complete: "Os ________ vivem principalmente em florestas e
savanas..."'). Frase com ":", ordem de atividade ("Ligue..."), título em maiúsculas ou texto
de apresentação não vira dica.
**Sorteio** (`sortearDoRepertorio`, packages/core): semente → mesmas palavras na prévia e no
PDF. Cruzadinha: com 5+ palavras com dica, sai só com elas (folha de dicas); senão, sem
nenhuma dica (banco de palavras), para não misturar. Quantidades: cruzadinha 6/8/10/12,
caça-palavras 8/10/12/15.
**API do painel:** `GET /api/repertorio` (quais materiais têm e quantas palavras) e
`GET /api/repertorio/[id]` (as palavras). O nginx do painel aceita URL de até 32 KB
(`large_client_header_buffers`), porque o PDF leva palavras e dicas na URL (12 dicas ≈ 3 KB).
**Em aberto (decisão do cliente):** material que ela ainda não comprou aparece na lista (com
"ainda não é seu") e gera atividade. As palavras e frases curtas não entregam o PDF, e servem
de vitrine, mas é conteúdo de produto pago: confirmar se fica assim ou só com os liberados.
**Adendo (25/09): seletor de quantidade nas duas origens.** Pedido do cliente. Um seletor
− N + (`SeletorDeQuantidade`) substitui as opções fixas (6/8/10/12) e aparece também em
"Temas e minhas palavras", com o botão "Sortear N palavras de <tema>" (troca a seleção por N
palavras sorteadas do tema; escolher palavra por palavra continua valendo). Limites: mínimo
2; máximo = o da ferramenta (cruzadinha 15, caça-palavras 20), o tamanho do tema ou o
repertório do material. Na cruzadinha a partir de material com 5+ dicas, o máximo é o número
de palavras com dica, porque o sorteio só usa essas (folha de dicas).

**Adendo à D42/D43 (25/09): tocar em Início volta à tela principal.** Pedido do cliente.
Toque na aba Início (rodapé) ou no Início do menu lateral (desktop) limpa a pergunta e a
resposta, volta o mosaico ao primeiro lote e a rolagem ao topo (`lib/voltar-ao-inicio.ts`:
o rodapé avisa por `listeners.tabPress`, o menu lateral pelo `onPress` do Link, e a home
escuta). Só no toque, não ao ganhar foco: quem abre um material das respostas e volta
continua nas respostas. Conferido no navegador nos três casos (depois de perguntar, vindo
da Vitrine, voltando de um material).

### D46 — Pré-visualizar o PDF nas ferramentas; etiqueta fixa de tipo nos materiais (25/09)
**Pré-visualizar (pedido do cliente).** Cruzadinha e Caça-palavras ganham o botão
"Pré-visualizar" ao lado de "Baixar PDF" (`components/previa-pdf.tsx`): abre a folha
exatamente como vai sair (cabeçalho, atividade, gabarito), numa janela por cima do app, com
"Fechar" e "Baixar PDF". No web, o PDF vem do painel com `baixar=0` (inline) dentro de um
iframe; no celular, abre no leitor de PDF do sistema, sem baixar. O aviso "Montando a
folha…" fica por baixo do PDF (o `onLoad` do leitor de PDF do Chrome não é confiável).
**Etiqueta de tipo (teste do cliente).** Todo card de material (vitrine, mosaico da home,
sugestões da pesquisa) mostra uma etiqueta fixa no canto superior esquerdo com o tipo
(Atividade, Sequência, Jogo, Avaliação, Cartaz, Planner, Aula, Ebook), uma cor por tipo e
texto branco (contraste de 5,3:1 a 6,5:1). O "Novo" foi para o canto direito. Antes, o tipo
só aparecia em texto nos cards sem capa e sumia nas capas reais.
`components/tag-tipo.tsx`. As cores ficam fora dos tokens da marca de propósito: é teste.
**Observação sobre os dados:** os 387 materiais do painel vieram só como "atividade" (209),
"sequência" (177) e "avaliação" (1); nenhum está marcado como Jogo ou Ebook. Para a etiqueta
contar a verdade, o tipo precisa ser revisado nas fichas do /admin.

### D47 — Coleções em bloco na Vitrine: capa + volumes → módulos → PDFs (25/09)
**Pedido do cliente.** Na Vitrine, cada coleção/kit de PDFs (Coleção Imagine, EducaKits,
Cadernos FlaEduca, Cube) vira um bloco grande, na seção "Coleções", no lugar da prateleira
solta de produto (A5): capa principal da coleção; ao lado, "Coleção · N módulos · M PDFs",
nome, para quem é e o status (Liberado para você, ou preço + "Quero a coleção"); embaixo, as
abas de volume (Imagine 1 / Imagine 2), os módulos com a contagem e a prateleira com os PDFs
do módulo escolhido. Aparece para todas as coleções, compradas ou não. FDA/FPT (aulas em
vídeo), BNCC e Avulsos seguem como prateleira. `components/bloco-de-curso.tsx`.
**Estrutura** (`apps/web/lib/cursos.ts`, `GET /api/cursos`): produto → volume → módulo →
PDFs. O módulo vem do começo do título ("Roteiro Colorido — …"), que a importação tirou da
pasta de cada PDF; o mapa de arquivos NÃO serve para isso, porque 51 PDFs do Imagine 1 são
cópias idênticas em 2 a 4 pastas e o mapa guardou só uma. Do mapa
(`dados/mapa-arquivos.json`, agora guardado pelo `restaurar-dados-painel.sh`) vêm o volume, a
ordem dos módulos pela numeração das pastas ("01 - Viviana…") e o nome limpo da pasta
("Aventuras no Jardim", em vez do "Aventuras No Jardim" do título). Nome de módulo em Unicode
diferente (NFC/NFD) é agrupado. Conferido contra as pastas: Imagine 1 com 7/11/22/11 PDFs,
Imagine 2 com 10 gêneros de 13, EducaKits com 28 histórias, Cube (2º ano) e FlaEduca (sem
módulos: uma prateleira só).
**Capa principal.** A oficial, se a equipe puser o arquivo em
`apps/web/public/capas-colecoes/<produto>.png` (imagine, educakits, flaeduca, cube; 2:3),
servida pelo nginx direto do disco. Sem ela, uma capa montada na cor da coleção com três
PDFs em leque (um de cada um dos primeiros módulos) e o nome.
**De quebra:** ícones sobre o botão primário (Quero a coleção, Baixar PDF, Adicionar) usavam
cor fixa escura e sumiam no tema claro; agora usam `botaoPrimarioTexto` do tema.

### D48 — Cruzadinha e Caça-palavras em 3 etapas (25/09)
**Pedido do cliente:** muitos blocos na mesma tela até gerar a folha. As duas ferramentas
viram um passo a passo, na ordem de quem monta uma atividade:
1. **Palavras**: de onde vêm (temas/minhas ou material) e a escolha/sorteio.
2. **Montar**: prévia, "Outra arrumação"/"Nova versão", aviso de palavra que não coube e,
   no caça-palavras, o nível (decide a grade, então fica junto da prévia).
3. **Folha e PDF**: título, cabeçalho, gabarito, Pré-visualizar e Baixar PDF.
No topo, o indicador ① Palavras › ② Montar › ③ Folha e PDF (etapa feita ganha ✓; tocar volta
ou avança, se liberada). Embaixo, "Voltar" e "Próximo: <etapa>", desligado com o motivo
("Escolha pelo menos 2 palavras para seguir." / "Escolha um material para seguir.").
Montar e Folha só com a atividade de pé (2+ palavras). Trocar de etapa volta ao topo e não
perde nada (palavras, semente, cabeçalho). Peças: `Etapas` e `NavegacaoDasEtapas` em
`components/atividade-palavras.tsx`; as seções continuam as mesmas, só redistribuídas.

### D49 — Prévia com as páginas de verdade na ficha do material (25/09)
**Relato do cliente:** a ficha mostrava "página 1", "página 2" em quadros brancos. Não era
defeito de carregamento: a prévia (A10) nunca tinha sido implementada, era marcador da demo.
**Agora:** as páginas da amostra são imagens reais do PDF, geradas pelo painel
(`GET /api/materiais/[id]/paginas/[n]`, pdftoppm, 360 px na ficha e 1100 px com
`?tamanho=grande`, cache em `apps/web/dados/miniaturas`, fora do git). Tocar numa página
abre a leitura em tela cheia, com setas entre as páginas da amostra. O resto vira um card
"+N páginas": trancado com "Desbloqueie para ver todas" (abre o paywall) ou "no PDF
completo" quando o material é dela. O quadro segue o formato da página (A4 deitado, como
rubricas e fichas, ganha quadro deitado), pela proporção da capa, que é a página 1.
**Regras de ouro 1 e 4:** o PDF nunca sai do painel, só imagens, e só das páginas até
`PAGINAS_AMOSTRA` (2, agora em `packages/core/src/acesso.ts`; virá de
`configuracoes.paginas_amostra`). Sem login, o servidor não sabe quem comprou, então página
além da amostra não é gerada para ninguém, nem pedida direto pela URL (testado: página 3 →
404). Quando houver sessão, quem tem posse poderá ver todas, com a checagem no servidor.
Materiais da demo (sem PDF) continuam com o quadro "página N".

### D50 — Login de verdade (Bloco 2, parte do app) e todas as páginas para quem tem acesso (25/09)
**Pedido do cliente:** ver todas as páginas na ficha quando tem acesso, e só a amostra quando
não tem. Sem login não havia como o servidor saber quem comprou (regra de ouro 4); entre o
modo demonstração burlável e o login real, o cliente escolheu o login real.
**App (Bloco 2).** Tela `/entrar`: e-mail → código numérico do Supabase Auth (D19, sem link
mágico) → sessão. Sessão no `expo-secure-store` no celular (em pedaços, o cofre aceita ~2 KB
por chave) e no localStorage no web (`lib/supabase.ts`). `contexto/sessao.tsx` guarda a
sessão e lê a posse de `entitlements` (RLS "vejo minha posse"); com sessão, a posse e o nome
vêm da conta e o botão "teste" da demo some; sem sessão, tudo segue como antes. Conta ganha
"Entrar com seu e-mail" e "Sair" de verdade; o menu lateral mostra o e-mail. Produto do banco
(slug) ↔ id do app em `packages/core/src/acesso.ts` (`idDoProdutoPeloSlug`).
**O código tem 8 dígitos neste projeto** (configuração do Supabase), não 6 como diz o D19:
a tela aceita de 6 a 10. Para voltar a 6: Supabase → Authentication → Providers → Email.
**Servidor (regra de ouro 4).** `GET /api/materiais/[id]/paginas` confere o token
(`Authorization: Bearer`) no Supabase Auth e a posse em `entitlements` com a service_role
(`lib/acesso-servidor.ts`: gratuito, produto do material ou combo). Com acesso: todas as
páginas, cada uma com URL assinada (HMAC, `PAGINAS_SEGREDO`, 30 min, `Cache-Control:
private`); sem: só a amostra, pública. A rota da página exige a assinatura além da amostra.
Testado: sem login/logado sem compra/token falso → 2 de 14; com a Coleção Imagine → 14 de 14;
assinatura ausente, adulterada, de outra página ou com validade alterada → 404; outro
produto → amostra. No navegador: ficha com as 14 páginas e leitura até "Página 14 de 14".
**Conceder acesso, por enquanto:** `bash deploy/conceder-acesso.sh <email> <slug>`
(`--revogar`, `--listar`), só no servidor; cria a conta se ainda não existe. O webhook do
The Members (Bloco 10) substitui isso. Não há botão no /admin porque ele ainda não tem login.
**Armadilhas encontradas:** (1) React Compiler de novo (D43): "tem PDF?" era calculado antes
do acervo do painel chegar e nunca refeito; agora depende de `versaoAcervo`. (2) O fade do
expo-image (`transition`) trava em opacidade 0 no web quando a imagem vem do cache; tirado
da ficha e do mosaico.
**Pendente no Bloco 2:** login e proteção do /admin (link mágico + papel). **Depende do
cliente no painel do Supabase:** (a) os modelos de e-mail "Magic Link" e "Confirm signup"
precisam ter `{{ .Token }}` (sem isso o e-mail leva só um link, e o app pede o código);
(b) SMTP próprio: o do Supabase só entrega para e-mails da equipe do projeto e tem limite
de poucos e-mails por hora.
Testes feitos com usuários temporários (`claude-teste-*@example.com`) criados pela API
administrativa, com o código gerado sem e-mail; apagados no fim (perfis e posse em cascata).

### D52 — Tela de entrar com a visão geral do app (30/09)
**Pedido do cliente:** a tela de login mostrar o que o app é, para quem chega sem ter visto
nada por dentro. `/entrar` saiu das abas (`src/app/entrar.tsx`, tela cheia, sem barra de abas
nem menu lateral). Desktop: à esquerda a visão geral (logo, "Seus materiais do Mundo da Prô,
num lugar só.", capas reais do painel em leque, os 4 recursos: Pergunte e encontre, Vitrine,
Ferramentas, Formações em vídeo, e os números: materiais do acervo, aulas do Panda, offline);
à direita o cartão de login. Celular: cabeçalho, prateleira de capas, cartão de login e, abaixo,
"O que você encontra no app". O login continua opcional ("Explorar o app sem entrar"); a
apresentação de primeira abertura não cobre `/entrar`. O fluxo (e-mail → código) é o da D50.
**Supabase (mesmo dia):** os modelos "Confirm signup"/"Magic Link" ainda só levavam o link
(sem `{{ .Token }}`) e a Site URL era `http://localhost:3000`; o primeiro login real caiu num
link para o localhost. Correção a fazer no painel do Supabase (ver conversa de 30/09); limite
atual: 2 e-mails/hora, sem SMTP próprio.

### D53 — Boas-vindas do primeiro login: segmentar pela turma e pelo uso (01/10)
**Pedido do cliente:** no primeiro login, perguntar à professora qual turma ela tem, o que mais
usa em sala e o que quer ver primeiro, para o app abrir no jeito dela.
**Tela `/boas-vindas`** (`src/app/boas-vindas.tsx`, tela cheia, no estilo das etapas da D48:
barra de progresso, Voltar/Continuar, "Pular" no topo):
1. Nome ("Como podemos te chamar?") e onde dá aula (pública, particular, reforço, coordenação).
2. Ano(s) da turma (Ed. Infantil ao 5º, com a idade), pelo menos um.
3. Nível de escrita (os 4 níveis com o "borboleta" manuscrito); só aparece se ela tem turma do
   Infantil ao 3º ano; opcional.
4. O que mais usa em sala: atividade, jogo, sequência, avaliação, cartaz, ebook (pelo menos um).
5. O que quer ver primeiro, em ordem de toque (1, 2, 3…): achar material rápido, vitrine,
   criar atividades, turmas, formações. O app abre no nº 1.
**Onde fica:** `user_metadata.perfil` da conta no Supabase Auth (segue a conta em qualquer
aparelho, sem migration) e cópia no aparelho (`mdp-perfil-v1`), que é a única para quem usa
sem entrar. O nome também vai para `perfis.nome`. Tipo e validação em
`packages/core/src/perfil.ts` (`PerfilProfessora`, `perfilValido`).
**Quando aparece:** depois do código, se a conta ainda não tem perfil (`confirmarCodigo`
devolve `temPerfil`). Pular grava o perfil vazio e não pergunta de novo. Refazer: Conta →
Minhas preferências. Sem perfil, a home mostra o convite "Conte sobre a sua turma". Concluir
conta como a apresentação de 4 telas vista (ela não abre mais por cima).
**O que muda com o perfil (por enquanto):** a saudação usa o nome dela, e o "Experimente
perguntar" da home é montado com ano, nível e tipo (`perguntasDoPerfil`), com temas de
alfabetização até o 2º ano e de leitura/texto do 3º ao 5º, todas já reconhecidas pelo motor
de busca. Próximos usos naturais: ordenar prateleiras da Vitrine e pré-filtrar pílulas.

### D54 — Identidade "Mundo da Prô | Clube Pedagógico": claro, azul-marinho e rosa (06/10)
**Pedido do cliente:** aplicar no app a identidade visual de um prompt de referência
("Clube Pedagógico"). Só a parte visual: o prompt também descrevia outra stack (Vite,
TanStack), outro banco (profiles/user_roles/resources), limite de downloads, créditos de IA e
"assumir administração"; nada disso foi feito, o app segue Expo + o schema atual.
**O que mudou:** tema claro como padrão (encerra a D14; o escuro virou azul-marinho e fica no
switch da Conta). Marca rosa `#FF0167` (botões, círculos, destaques, com texto branco:
`text-sobre-marca`), azul-marinho `#0E2447` (`bg-brand`) no banner e no menu ativo, `--borda`
nova para os cards (borda + sombra suave). Fontes Baloo 2 (títulos) e Nunito Sans (texto),
pelos mesmos nomes de classe (`font-titulo`, `font-corpo`…), então nenhuma tela precisou
mudar por causa delas. Título da aba "Mundo da Prô | Clube Pedagógico" e descrição nova.
**Home:** banner azul-marinho com selo "Clube Pedagógico", "Oi, <nome>!", "O que você precisa
hoje?", o subtítulo do pedido e o campo "Digite aqui o que precisa" com botão "Buscar"; abaixo,
três números reais (recursos disponíveis, novidades, aulas em vídeo). Dos cards do prompt,
"Downloads hoje X/limite" e "Créditos de IA" ficaram de fora: o app não tem limite diário nem
IA (CLAUDE.md: não dizer "IA" na interface).
**Menu lateral (desktop):** logo grande + "CLUBE PEDAGÓGICO", item ativo em azul-marinho. No
celular a navegação continua nas abas do rodapé (CLAUDE.md §1), não em gaveta.
**Tema salvo:** o tema guardado no aparelho passou de `tema` para `temaEscolhido`, porque
todo mundo tinha "escuro" salvo (era o padrão); assim todos abrem no claro.
**Armadilha:** no web, o `TextInput` tem largura própria; numa linha com botão ao lado ele
precisa de `minWidth: 0`, senão empurra o botão para fora no celular.
