# PRD — App Mundo da Prô

Especificação funcional. O `CLAUDE.md` diz como trabalhar, `LOJAS.md` diz o que a App
Store e o Google Play exigem, `ROADMAP.md` diz em que ordem, e este arquivo diz o que
construir.

**Referência visual:** home do Netflix no celular. Não é inspiração vaga — é o layout a
ser seguido estrutura por estrutura, com o conteúdo do MDP no lugar do catálogo de filmes.
O mapeamento está na Parte A.

---

# Parte A — App da Professora (iOS e Android)

Aplicativo Expo publicado nas duas lojas. Telas nativas de verdade; WebView só no
checkout e nas páginas legais. Ver `LOJAS.md`.

Desenhado para tela de ~390px. Autenticação por **código de 6 dígitos enviado ao e-mail
da compra** — em aplicativo, link mágico sofre para voltar da caixa de entrada, e o código
elimina esse atrito. Quem não entrou vê a vitrine com tudo trancado e um convite para
acessar.

Respeite a área segura do aparelho: notch e ilha dinâmica no iOS, barra de status no
Android. Nada de conteúdo por baixo delas.

## Mapa da referência

| Netflix | App Mundo da Prô |
|---|---|
| Logo N + Início | Logo MDP + Início |
| Ícones: transmitir, downloads, sino | Ícones: baixados, avatar |
| Pílulas: Séries, Filmes, Novidades, Categorias | Pílulas: **Nível**, **Ano**, **Novidades**, **Categorias** |
| Card de destaque com arte vertical | Card de destaque do material ou campanha da vez |
| "Assistir à série" (branco) + "Minha lista" (cinza) | "Baixar agora" (branco) + "Salvar" (cinza) |
| "Continuar assistindo como CAIO" | "Continue de onde parou, Ana" |
| Selo TOP 10 | Selo de posição em "Mais baixados da semana" |
| Abas: Início, Clipes, Buscar, Minha Netflix | Abas: Início, Novidades, Buscar, Meus materiais |

## A0. Topo

Linha única, transparente no topo da rolagem, ganhando opacidade conforme desce.

- Esquerda: logo do MDP + a palavra **Início**, no mesmo peso da referência
- Direita: ícone de baixados e avatar

**Sem campo de busca no topo.** A busca é uma aba do rodapé. Campo aqui rouba a altura da
dobra, que pertence ao destaque.

## A1. Pílulas de filtro

Faixa horizontal rolável logo abaixo do topo, fixa na rolagem. Quatro pílulas:

1. **Nível** — abre folha inferior nativa com os 4 níveis de escrita. Cada opção mostra o
   nome e, ao lado, o exemplo manuscrito de como a criança escreve "borboleta" naquele
   estágio (`XAOEI` / `OOEA` / `BOBLETA` / `BORBOLETA`). É a assinatura visual do app.
2. **Ano** — folha inferior nativa com Ed. Infantil a 5º ano.
3. **Novidades** — atalho, rola até a prateleira de novidades.
4. **Categorias** — folha inferior nativa com tipo (sequência, atividade, jogo, avaliação,
   cartaz, planner) e habilidade.

Pílula com filtro ativo fica preenchida e mostra a contagem: `Nível · 2`. Filtros são
multi-seleção, acumulativos, e sobrevivem a fechar e reabrir o app.

**Com filtro ativo, as prateleiras continuam existindo, apenas filtradas.** Prateleira que
ficou sem item some. A professora nunca perde a navegação por produto. Uma pílula "limpar"
aparece no fim da faixa.

## A2. Destaque

O bloco mais importante do app. Card grande, cantos arredondados, ocupando cerca de 60%
da dobra, exatamente como na referência.

- Arte vertical (proporção 4:5), com o título tratado como parte da imagem
- Logo pequeno do MDP no canto superior esquerdo do card
- Linha de apoio embaixo do título ("Sequência completa, 28 páginas")
- **Botão primário branco** e **botão secundário cinza com +**

O conteúdo é **personalizado**, resolvido no servidor nesta ordem:

| Prioridade | Situação | Botão primário |
|---|---|---|
| 1 | Campanha ativa no painel (ex: Acesso Total na Happy Friday) | "Quero o acesso total" |
| 2 | Material novo dentro de um produto que ela já tem | "Baixar agora" |
| 3 | Próximo produto sugerido pelo que ela possui | "Conhecer o EducaKits" |
| 4 | Material gratuito de entrada | "Baixar de graça" |

O botão secundário é sempre "Salvar", com +, e vira ✓ ao favoritar.

A arte vem do painel (`destaques.arte_path` ou `materiais.arte_destaque_path`). Sem arte
enviada, o app gera fallback: capa do PDF ampliada, sobreposição escura e título grande.

## A3. "Continue de onde parou, {nome}"

Primeira prateleira, logo abaixo do destaque, com o primeiro nome da professora no título,
como na referência.

Materiais abertos nos últimos 30 dias e não baixados. Cartazes verticais.

**Se ela nunca abriu nada**, a prateleira vira "Comece por aqui, é seu" e mostra os
gratuitos e o que ela possui. **Nunca aparece vazia.**

## A4. "Mais baixados da semana"

Prateleira com número de posição no canto do card, no mesmo lugar do TOP 10 da referência.
De 1 a 10, vindo da view `vw_mais_baixados`.

Prova social sem precisar de avaliação nem comentário. Dá à professora a sensação de que
existe gente usando aquilo.

## A5. Prateleiras por produto

Uma para cada produto que ela **não possui**. Cabeçalho com nome, contagem e as duas
linhas de pitch:

> **EducaKits** · 52 materiais
> Para quem já sabe o que ensinar mas gasta o domingo montando atividade.
> Sequências prontas para imprimir, do infantil ao 2º ano.

**Ordem resolvida no servidor**, não fixa:
1. Produtos marcados como próximo passo de algo que ela já possui (`produtos.sugerido_apos`)
2. Demais por `produtos.ordem_vitrine`
3. FDA e FPT sempre por último

## A6. Prateleira "Novidades"

Publicados nos últimos 30 dias, do mais novo. Selo NOVO no card. Inclui material trancado.

## A7. Faixa Acesso Total

Fecha a home. Some se ela já tiver. Texto, preço e selo de campanha vêm de `configuracoes`.

## A8. Abas do rodapé

Barra de abas nativa, fundo escuro translúcido, quatro abas, como na referência:

| Aba | Conteúdo |
|---|---|
| Início | a home |
| Novidades | lista cronológica completa |
| Buscar | campo em tela cheia, com sugestões e buscas recentes |
| Meus materiais | possuídos, favoritos, baixados e conta |

O ícone de "Meus materiais" usa a foto ou as iniciais dela. Cada aba mantém a própria
pilha de navegação, e tocar na aba ativa volta ao topo da lista.

## A9. Card de material

Cartaz vertical, proporção 2:3. Capa gerada da primeira página do PDF.

- **Liberado**: capa limpa
- **Trancado**: desfoque leve e cadeado pequeno no canto inferior direito.
  **Desfoque leve, não opaco** — ela precisa ver que tem coisa boa ali.
- Seta preenchida quando o material já está baixado no aparelho
- Selo NOVO ou número de posição quando aplicável
- Título abaixo do cartaz, no máximo duas linhas
- Toque longo abre menu de contexto nativo: salvar, baixar, compartilhar

## A10. Ficha do material

Tela cheia, com a arte no topo, no padrão de uma página de título de streaming.

- **Preview**: navegação por páginas, liberada até `configuracoes.paginas_amostra`
  (padrão 2). Restante desfocado com aviso de amostra.
- **Aba "Sobre"**: tipo, páginas, anos, níveis, habilidade, descrição
- **Aba "Como usar"**: passos numerados e vídeo curto quando houver.
  **Sempre liberada, mesmo com cadeado.** É o mecanismo de desejo mais forte da vitrine.
- **Ação principal**: "Baixar PDF", "Desbloquear por R$ X", ou "Assistir no The Members"
  para aulas, abrindo o navegador do sistema
- **Depois de baixado**: "Abrir", "Imprimir" e "Compartilhar", usando as folhas nativas.
  Imprimir é o que a professora mais usa e é um dos recursos que justificam existir um app
- Prateleira "Parecidos com este" ao final, por habilidade e nível em comum

## A11. Paywall

Folha inferior, aberta pelo cadeado ou pelo botão de desbloquear. Registra
`paywall_aberto` com o material de origem.

Duas ofertas: o produto do material (preço, três benefícios, botão de compra) e o Acesso
Total em destaque, com selo de campanha configurável.

O botão abre `produtos.checkout_url` **no navegador do sistema**, com o e-mail
pré-preenchido, usando a API de link externo exigida pela loja. Nunca em WebView interna.
Ver seção 2 de `LOJAS.md`.

Ao voltar para o app, ele revalida a posse sozinho e mostra o material liberado, com uma
tela curta comemorando a compra. Se o webhook ainda não chegou, mostra "estamos liberando
seu acesso" e tenta de novo por até 60 segundos antes de oferecer o suporte.

## A12. Baixados e uso de espaço

Dentro de Meus materiais. Lista o que está no aparelho, com o tamanho de cada arquivo e o
total ocupado no topo. Permite apagar um a um ou tudo de uma vez.

O arquivo baixado fica na área privada do app, já com a marca d'água, e abre sem internet.
Apagar do aparelho não tira o acesso: ela baixa de novo quando quiser.

## A13. Conta

- Nome, e-mail e foto
- Meus acessos: produtos que ela possui, com data
- Notificações: ligar e desligar por tipo
- Ajuda: abre conversa no WhatsApp do suporte
- Termos e privacidade
- Sair
- **Excluir minha conta** — obrigatório pelas duas lojas. Explica o que será apagado, pede
  confirmação por texto, anonimiza os dados pessoais e mantém o registro de compra pelo
  prazo fiscal. Ver seção 3 de `LOJAS.md`.

## A14. Notificações

Pedido de permissão **nunca na primeira abertura**. Só depois que ela baixar o primeiro
material, com uma tela explicando o que vai receber. Pedir cedo é o caminho mais rápido
para a negativa permanente.

Tipos: material novo em produto que ela possui, novidade geral, campanha, e aviso de
acesso do FDA vencendo. Cada envio grava evento e respeita as preferências de A13.

## A15. Primeira abertura

Três telas curtas e puláveis: o que é o app, que ela acessa com o e-mail da compra, e que
dá para baixar e imprimir sem internet. Depois, a tela de e-mail.

Quem entra e não possui nada cai numa home com os gratuitos em destaque, nunca numa tela
vazia.

---

# Parte B — Painel de Conteúdo

Rota `/admin` no site. Só para `papel = 'admin'` ou `'editor'`. Desktop-first, tema claro.

## B1. Lista de materiais

Tabela com filtro por status, produto e "sem taxonomia", busca por título. Ações em massa:
publicar, despublicar, vincular a produto.

Placar no topo: quantos sem taxonomia, sem Como usar, sem descrição, sem arte de destaque.
São os quatro números do trabalho de curadoria.

## B2. Upload

Arrasta um ou vários PDFs. Para cada arquivo o sistema salva o original no bucket privado,
conta páginas, renderiza a página 1 como capa e as 4 primeiras como miniaturas de preview
no bucket público (baixa resolução, marca fixa), extrai o texto das primeiras páginas e
cria o material como rascunho.

## B3. Ficha

Título, descrição, tipo, produtos vinculados, anos, níveis, habilidade, gratuito.

**Botão "Sugerir com IA"**: manda o texto extraído para a API da Anthropic e recebe tipo,
anos, níveis, habilidade, descrição e passos. Preenche como rascunho editável.
**Nunca salva direto.** É o que torna um acervo grande viável no prazo.

## B4. Como usar

Passos ordenáveis por arrastar, campo de URL de vídeo, prévia do que a professora vê.

## B5. Arte de destaque

Upload da arte vertical 4:5, com prévia dentro de uma moldura de celular mostrando como o
bloco de destaque vai ficar. Sem arte, o app usa o fallback gerado da capa.

## B6. Destaques e campanhas

CRUD de `destaques`: o que aparece no bloco A2, para quem, em que período, com qual texto
de botão. Regras: todos, só quem não possui o produto X, só quem possui o produto X.
É por aqui que a Happy Friday entra no ar **sem enviar nova versão para as lojas**.

## B7. Publicação

Rascunho, agendado, publicado, arquivado. Agendado pede data e hora; um cron diário
publica o que venceu. É o que faz o ciclo de 15 dias rodar sem alguém lembrar.

## B8. Produtos

CRUD com nome, preço, checkout, cor, autora, os dois pitches, ordem, sugerido após, ativo,
e os identificadores externos do The Members e do Woo usados pelo webhook.

## B9. Acessos

Busca por e-mail, mostra o que a pessoa possui e a origem, permite conceder e revogar.
Necessário para suporte: cliente antiga de Hotmart, compra com e-mail diferente, cortesia.
Também é aqui que se prepara a **conta de teste para o revisor da loja**.

## B10. Uso

Mais baixados, mais vistos, **cadeados mais clicados** e paywalls por produto, com recorte
por plataforma (iOS, Android, web). O terceiro é o número mais valioso do sistema: diz
qual produto a base está pedindo antes de qualquer campanha.

## B11. Notificações

Composição e envio de push por segmento: quem possui o produto X, quem não possui, todos.
Agendamento e prévia. Registra entrega e abertura.

## B12. Configurações

Chave/valor: páginas de amostra, texto e preço do Acesso Total, selo de campanha, janelas
de novidades e continuar, e **versão mínima do app** para forçar atualização quando
necessário.

---

# Parte C — Regras de negócio

## C1. Acesso

Acessa um material se ele é gratuito, **ou** se existe entitlement ativo dela para algum
produto vinculado. Ativo = `revogado_em IS NULL` e (`expira_em IS NULL` ou futuro).

FDA tem acesso de 1 ano; grave `expira_em`. Demais produtos são vitalícios.

## C2. Entrada

The Members → n8n → `POST /api/webhooks/themembers`. O endpoint grava o payload cru em
`webhook_eventos`, responde 200 na hora, processa só compra aprovada e reembolso, casa
produto pelos identificadores externos (sem correspondência não é erro, é evento marcado
para revisão), casa pessoa por e-mail em minúsculas criando perfil se necessário, e cria o
entitlement ignorando duplicata pelo pedido externo.

**O e-mail é a única chave confiável.** A base tem CPF de preenchimento genérico.

Quando o entitlement é criado e a pessoa tem aparelho registrado, dispara push:
"seu acesso ao {produto} está liberado".

## C3. Saída

Reembolso, chargeback e cancelamento preenchem `revogado_em`. Nunca apague a linha.

Material já baixado no aparelho de quem perdeu o acesso: o app apaga o arquivo local na
próxima sincronização.

## C4. Download

`GET /api/download/[materialId]`, sempre no servidor: confere sessão, confere acesso,
baixa o original do bucket privado, carimba nome e e-mail no rodapé de todas as páginas
com `pdf-lib`, registra em `downloads`, devolve URL assinada de 60 segundos.

O app baixa por essa URL e guarda o arquivo na área privada dele. Sem cache do arquivo
carimbado no servidor: cada download é único e rastreável.

## C5. Eventos

`material_visto`, `preview_pagina`, `cadeado_clicado`, `paywall_aberto`,
`checkout_clicado`, `download`, `favorito`, `destaque_clicado`, `push_aberto`,
`app_aberto`. Sempre com `user_id`, `plataforma`, e `material_id` ou `produto_id` quando
fizer sentido.

## C6. Versão e atualização

O app manda a versão em toda chamada. Se estiver abaixo de `configuracoes.versao_minima`,
mostra tela bloqueante pedindo atualização com link para a loja. Usado só em caso de
mudança que quebre compatibilidade.

Correção de JavaScript vai por EAS Update, sem revisão. Mudança de tela ou de biblioteca
nativa exige nova versão na loja.

---

# Parte D — Critérios de pronto

O MVP está pronto quando uma professora consegue, num Android intermediário, em conexão ruim:

1. Instalar pela loja e entrar com o e-mail da compra, sem senha
2. Ver na primeira dobra um destaque que faz sentido para ela
3. Filtrar por nível e ano pelas pílulas e achar algo útil em menos de 20 segundos
4. Ler o "Como usar" de um material que ela não tem
5. Baixar um PDF com o nome dela no rodapé
6. **Abrir e imprimir esse PDF no modo avião**, na escola, sem internet
7. Tocar num cadeado, comprar no navegador, voltar e ver o material já liberado
8. Excluir a própria conta pelo app

E quando a equipe consegue, no notebook, subir um PDF novo e publicá-lo em menos de
3 minutos, e trocar o destaque da home **sem enviar nova versão para as lojas**.
