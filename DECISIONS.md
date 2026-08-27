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
  Bloco 8.
- **Compras antigas de Hotmart e Kiwify contam como posse?** Se sim, é necessário importar
  essa base para `entitlements` antes do lançamento, com `origem = 'migracao'`.
- **Quem escreve os pitches de cada produto** (para quem é / para que serve). São 8 pares
  de frases e definem a conversão da vitrine.
- **Quem faz a curadoria e com quantas horas por semana.** Sem isso definido, o cronograma
  não fecha.
- **Quem produz as artes de destaque** (vertical 4:5, título tratado como imagem). Cada
  campanha e cada material em destaque precisa de uma. O fallback gerado da capa funciona,
  mas rende muito menos que arte feita à mão. Provável trabalho de Canva para a equipe.
- **Fundo escuro combina com a identidade do Mundo da Prô?** Ver D14. Precisa de aval da
  Gi e da Flávia antes do Bloco 7.
- **Lançar em uma ou duas ondas?** São 12 semanas de desenvolvimento e a Happy Friday é em
  novembro, sem folga, com a primeira submissão quase sempre voltando com pedido de ajuste.
  A alternativa de menor risco: **onda 1 em novembro, só web**, aproveitando que os Blocos
  3 a 5 e 10 já entregam painel, acervo e venda, e usando a campanha para vender normalmente;
  **onda 2 em janeiro, o app nas lojas**, junto da virada do ano letivo, que é quando a
  professora está montando o planejamento e a atenção dela está no ponto mais alto.
  Precisa de decisão antes do Bloco 6.
- **Quem cuida das contas de desenvolvedor e do D-U-N-S?** Bloco -1. É o item que trava a
  publicação e ninguém lembra dele até o fim.
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
