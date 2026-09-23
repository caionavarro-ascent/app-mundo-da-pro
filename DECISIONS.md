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
