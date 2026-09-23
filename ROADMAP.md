# ROADMAP — App Mundo da Prô

Um bloco por sessão do Claude Code. `/clear` entre blocos. Os prompts abaixo são para
copiar e colar como estão.

Marque o bloco quando o "pronto quando" estiver cumprido de verdade — não quando o código
compilar.

**Ponto de validação: fim do Bloco 8.** A Gi e a Flávia navegam o app inteiro no próprio
celular, com acervo real, tudo destrancado. Se a vitrine não convencer ali, não vale
seguir para pagamento e publicação.

---

## Bloco -1 — Contas nas lojas (não é código, começa hoje)

**Ninguém programa isso, mas é o caminho crítico.** Se atrasar, o app fica pronto e não
publica. Ver seção 4 de `LOJAS.md`.

- [ ] Solicitar o número **D-U-N-S** da empresa (leva de dias a semanas)
- [ ] Inscrever na **Apple Developer Program** como organização, US$ 99/ano
- [ ] Criar a **Google Play Console** como organização, US$ 25 (conta de organização evita
      a exigência de 12 testadores por 14 dias)
- [ ] Confirmar elegibilidade ao Small Business Program da Apple e ao equivalente do Google
- [ ] Confirmar as condições atuais do programa de **link externo de pagamento** no Brasil
- [ ] Definir nome do app, identificador do pacote e e-mail de suporte

---

## Bloco 0 — Fundação
**Pronto quando:** o app abre no Expo Go, o site sobe local, e ambos leem o mesmo Supabase.

```
Leia CLAUDE.md, PRD.md, LOJAS.md e SCHEMA.sql antes de começar.

Monte o monorepo:
- apps/app: Expo com Expo Router e TypeScript, NativeWind configurado
- apps/web: Next.js App Router com TypeScript e Tailwind
- packages/core: tipos do banco, cliente Supabase, regras de acesso e formatadores,
  usados pelos dois
- Gerenciador de workspace à sua escolha, justifique em uma linha

Temas:
- app escuro: fundo #0B0D12, superfície #16191F, superfície-2 #1F232B,
  texto #F5F6F8, texto-2 #A2A8B4, marca #FFD84D, coral #E4574E, verde #1F9E77,
  botão primário branco com texto escuro
- web admin claro: papel #FCFCFA, tinta #16265C, tinta clara #3A57C4

Fontes no app: Bricolage Grotesque para títulos, Instrument Sans para texto,
Patrick Hand para os exemplos manuscritos dos níveis de escrita.

Configure EAS (eas.json) com perfis de development, preview e production.
Crie .env.example com todas as chaves.

Não construa nenhuma tela de produto ainda.
```

---

## Bloco 1 — Banco ✅ (23/09/2026)
**Pronto quando:** schema aplicado, tipos gerados, seed rodando, RLS testada com dois usuários.
**Feito:** aplicado no projeto remoto `rrtvbkiesjuvvvgygmmk`; teste de acesso passou inteiro. Ver D39.

```
Aplique o SCHEMA.sql como primeira migration em supabase/migrations.

Depois:
1. Gere os tipos TypeScript em packages/core/types/supabase.ts pela CLI
2. Crie um seed com os 7 produtos reais: EducaKits, Coleção Imagine, Cadernos FlaEduca,
   Materiais avulsos, BNCC de Bolso, FDA e FPT, mais o combo Acesso Total.
   Preencha pitch_para_quem e pitch_para_que com texto provisório marcado como TODO,
   e as habilidades da tabela habilidades.
3. Escreva um teste que cria dois usuários, dá entitlement de EducaKits só ao primeiro,
   e confirma que a função tem_acesso responde certo para os dois.

Me mostre o resultado do teste antes de seguir.
```

---

## Bloco 2 — Autenticação
**Pronto quando:** entro no app com código de 6 dígitos e a sessão sobrevive a fechar o app.

```
Implemente a autenticação nas duas pontas.

No app (Expo):
- Tela de e-mail e tela de código de 6 dígitos, usando OTP por e-mail do Supabase Auth.
  Nada de link mágico no app: voltar da caixa de entrada quebra o fluxo.
- Sessão guardada em expo-secure-store, renovada automaticamente
- Copy em português, tom de quem fala com professora, não com usuário de SaaS.
  A tela explica que é o mesmo e-mail usado na compra.
- Estado de visitante: quem não entrou vê a vitrine com tudo trancado

No web (Next.js):
- Link mágico para o /admin
- Middleware protegendo /admin: só papel admin ou editor

Nunca exponha a chave service_role no cliente, e nenhum segredo dentro do binário do app.
```

---

## Bloco 3 — Painel: upload e ficha
**Pronto quando:** subo um PDF de verdade e ele vira material com capa e preview.

```
Construa /admin/materiais no apps/web.

1. Lista com filtro por status, produto e "sem taxonomia", busca por título, e no topo o
   placar: quantos sem taxonomia, sem Como usar, sem descrição, sem arte de destaque.

2. Upload de PDF (um ou vários). Para cada arquivo:
   - salva o original no bucket privado 'materiais'
   - conta as páginas com pdf-lib
   - renderiza a página 1 como capa (cartaz 2:3) e as 4 primeiras como miniaturas com
     pdfjs-dist, em baixa resolução e com marca fixa "Mundo da Prô — amostra",
     salvando no bucket público 'previews'
   - extrai o texto das 5 primeiras páginas para texto_extraido
   - cria o material com status rascunho

3. Formulário da ficha: título, descrição, tipo, produtos vinculados, anos, níveis,
   habilidade, gratuito. Anos e níveis em chips de seleção múltipla.

O processamento roda no servidor, nunca no navegador. Se a renderização da capa falhar,
o material é criado mesmo assim e fica marcado para reprocessar.
```

---

## Bloco 4 — Painel: IA, Como usar, destaques e publicação
**Pronto quando:** subo um PDF, sugiro com IA, corrijo e publico em menos de 3 minutos.

```
Complete o painel.

1. Botão "Sugerir com IA" na ficha. Manda texto_extraido para a API da Anthropic e recebe
   JSON com tipo, anos, niveis, habilidade, descricao e passos. Consulte
   https://docs.claude.com/en/api/overview para o identificador de modelo atual — não
   invente nome de modelo. Preenche o formulário como rascunho editável e grava em
   sugestao_ia. Nunca salve direto sem confirmação humana.
   O prompt deve explicar o domínio: alfabetização brasileira, os quatro níveis de
   escrita, os anos escolares, e que os passos são instruções práticas para a professora
   usar em sala, não resumo do PDF.

2. Editor de "Como usar": passos ordenáveis por arrastar, URL de vídeo, e prévia.

3. Upload da arte de destaque vertical 4:5, com prévia dentro de uma moldura de celular.

4. /admin/destaques: CRUD da tabela destaques, com regra de exibição (todos, só quem não
   possui o produto X, só quem possui o produto X), prioridade, período e texto de botão.
   É por aqui que a campanha entra no ar sem enviar nova versão para as lojas.

5. Publicação: rascunho, agendado, publicado, arquivado. Rota de cron na Vercel que
   publica o que venceu.

6. /admin/produtos com os identificadores externos do The Members e do Woo.
7. /admin/configuracoes editando a tabela configuracoes em chave/valor.
```

---

## Bloco 5 — Ingestão do acervo
**Pronto quando:** o acervo real está no banco, com arquivo, capa e preview.

```
Crie um script em scripts/ingestao que traz o acervo que hoje está no The Members.

Comece descobrindo o que a API v1 do The Members entrega: produtos, cursos, aulas e se
existe URL de arquivo. Se não houver endpoint de arquivo, o script precisa aceitar uma
pasta local de PDFs mais uma planilha de correspondência.

Requisitos:
- idempotente: rodar duas vezes não duplica
- roda em lote com retomada, porque são muitos arquivos
- log do que entrou, do que falhou e por quê
- reaproveita todo o pipeline do Bloco 3 (capa, preview, texto)

Rode primeiro com um produto só e me mostre o resultado antes de processar tudo.
```

---

## Bloco 6 — Casca do app
**Pronto quando:** o app roda no meu celular com as quatro abas e a área segura correta.

```
Monte a estrutura de navegação do app Expo, conforme A8 e A15 do PRD.

- Grupo de abas do Expo Router com quatro abas: Início, Novidades, Buscar,
  Meus materiais. Barra de abas nativa, escura e translúcida, como na referência do
  Netflix mobile.
- Cada aba com pilha própria; tocar na aba ativa volta ao topo da lista.
- Área segura respeitada: notch e ilha dinâmica no iOS, barra de status no Android.
- Telas de primeira abertura: três cartões puláveis, conforme A15.
- Splash screen e ícone provisórios.
- Tela de atualização obrigatória, comparando a versão do app com
  configuracoes.versao_minima_{plataforma}, com botão que abre a loja.
- TanStack Query com cache persistido, para o app abrir mostrando o último estado
  conhecido mesmo sem rede.

Ainda com dados de exemplo. A vitrine vem no próximo bloco.
```

---

## Bloco 7 — A vitrine
**Pronto quando:** a home abre em menos de 2s num Android intermediário e o destaque muda conforme a posse.

```
Construa a home do app, seguindo a Parte A do PRD.

A referência é a home do Netflix no celular, e o PRD traz a tabela de mapeamento bloco
a bloco. Siga a estrutura, não uma interpretação livre dela.

Ordem na tela:
1. Topo: logo + "Início" à esquerda, ícone de baixados e avatar à direita. Transparente
   no topo, ganha opacidade ao rolar. Sem campo de busca.
2. Pílulas de filtro fixas na rolagem: Nível, Ano, Novidades, Categorias. Nível, Ano e
   Categorias abrem folha inferior nativa. A folha de Nível mostra, ao lado de cada
   opção, o exemplo manuscrito de "borboleta" naquele estágio: XAOEI, OOEA, BOBLETA,
   BORBOLETA. É a assinatura visual do app. Pílula ativa fica preenchida com contagem.
3. Bloco de destaque: card grande com arte vertical 4:5, cerca de 60% da dobra, botão
   primário branco e secundário cinza com +. Conteúdo personalizado no servidor pela
   tabela de prioridade em A2. Sem arte enviada, gere o fallback a partir da capa.
4. "Continue de onde parou, {primeiro nome}"
5. "Mais baixados da semana", com número de posição no canto do card, de vw_mais_baixados
6. Uma prateleira por produto não possuído, com as duas linhas de pitch no cabeçalho e
   ordem resolvida no servidor conforme A5
7. Prateleira Novidades
8. Faixa Acesso Total

Regras que não podem ser simplificadas:
- Filtro ativo filtra dentro das prateleiras; não vira grade de busca.
- A prateleira de continuar nunca aparece vazia; sem histórico vira "Comece por aqui,
  é seu".
- Card trancado tem desfoque leve e cadeado pequeno, nunca capa opaca.

Listas virtualizadas, imagens com expo-image e cache, skeleton enquanto carrega, nunca
tela em branco. Filtros sobrevivem a fechar e reabrir o app. Área de toque mínima 44px.
Construa também a aba Buscar em tela cheia, com sugestões e buscas recentes.
```

---

## Bloco 8 — Ficha do material e leitor
**Pronto quando:** leio o Como usar de um material trancado e vejo 2 páginas de amostra no celular.

```
Construa a ficha do material, conforme A10 do PRD. Tela cheia, arte no topo.

- Preview com navegação por página, liberado até configuracoes.paginas_amostra, restante
  desfocado com aviso de amostra
- Aba Sobre e aba Como usar. A aba Como usar fica sempre liberada, inclusive com cadeado
  — é o que gera desejo.
- Ação principal: baixar, desbloquear, ou assistir no The Members abrindo o navegador
  do sistema
- Prateleira "Parecidos com este" ao final, por habilidade e nível em comum
- Favoritar, e a aba Meus materiais com possuídos, favoritos e baixados
- Menu de contexto por toque longo no card: salvar, baixar, compartilhar
- Registre material_visto, preview_pagina, favorito e cadeado_clicado

Leitor de PDF nativo. Nada de renderizar PDF dentro de WebView.

Este é o ponto de validação: ao terminar, o app precisa estar navegável de ponta a ponta
com acervo real, para a Gi e a Flávia testarem no próprio celular.
```

---

## Bloco 9 — Download, offline e impressão
**Pronto quando:** baixo um PDF, ligo o modo avião, abro e mando imprimir.

```
Implemente a entrega, conforme C4 e A12 do PRD.

No servidor:
- GET /api/download/[materialId]: confere sessão, confere acesso pela função tem_acesso,
  baixa o original do bucket privado, carimba nome e e-mail no rodapé de todas as páginas
  com pdf-lib, registra em downloads com o texto exato carimbado e a plataforma, e
  devolve URL assinada de 60 segundos.
- Marca d'água legível mas discreta: cinza claro, fonte pequena, rodapé centralizado.
  Não pode atrapalhar a impressão da atividade.
- Nunca cacheie o arquivo carimbado. Teste baixar material que a conta não possui: 403.

No app:
- Baixa por essa URL com expo-file-system, guarda na área privada do app, com barra de
  progresso e retomada
- Abre offline no leitor nativo
- Imprimir com expo-print e compartilhar com expo-sharing
- Tela de baixados com tamanho de cada arquivo, total ocupado e apagar
- Ao sincronizar, se um acesso foi revogado, apaga o arquivo local correspondente
```

---

## Bloco 10 — Cadeado, paywall e webhook
**Pronto quando:** compro num checkout de teste e volto ao app com o material liberado.

```
Implemente o acesso, conforme A11 e Parte C do PRD, e a seção 2 de LOJAS.md.

1. Paywall em folha inferior, com as duas ofertas: o produto do material e o Acesso Total.
   Registra paywall_aberto com o material de origem, e checkout_clicado.
2. O botão de compra abre produtos.checkout_url NO NAVEGADOR DO SISTEMA, usando a API de
   link externo exigida pela loja, com o aviso que o sistema mostra. Nunca em WebView
   interna — é motivo de reprovação.
3. Ao voltar para o app, revalida a posse sozinho e mostra o material liberado com uma
   tela curta de comemoração. Se o webhook ainda não chegou, mostra "estamos liberando
   seu acesso" e tenta de novo por até 60 segundos antes de oferecer o suporte.
4. POST /api/webhooks/themembers no apps/web:
   - grava o payload cru em webhook_eventos antes de qualquer processamento
   - responde 200 imediatamente
   - idempotente pelo id externo do pedido
   - casa produto pelos identificadores externos; sem correspondência não é erro, é evento
     marcado para revisão
   - casa pessoa por e-mail em minúsculas; cria perfil se não existir
   - cria entitlement respeitando produtos.acesso_dias
   - reembolso, chargeback e cancelamento preenchem revogado_em, nunca apagam a linha
5. /admin/acessos: busca por e-mail, conceder e revogar manualmente.

Escreva testes com payload real dos eventos do The Members.
```

---

## Bloco 11 — Notificações e conta
**Pronto quando:** recebo push de material novo e consigo excluir minha conta pelo app.

```
1. Push com expo-notifications:
   - registro do aparelho na tabela dispositivos
   - permissão pedida SÓ depois do primeiro download, com tela explicando o que ela vai
     receber. Nunca na primeira abertura.
   - preferências por tipo em preferencias_push
   - disparo automático quando entra material novo em produto que a pessoa possui, e
     quando um entitlement é criado
   - /admin/notificacoes para composição, segmentação, agendamento e prévia
   - registrar push_aberto

2. Tela de Conta, conforme A13:
   - nome, e-mail, meus acessos, notificações, ajuda no WhatsApp, termos, privacidade, sair
   - EXCLUIR MINHA CONTA: obrigatório pelas duas lojas. Explica o que será apagado, pede
     confirmação por texto, anonimiza os dados pessoais e mantém o registro de compra pelo
     prazo fiscal.

3. /admin/uso: mais baixados, mais vistos, cadeados mais clicados e paywalls por produto,
   com recorte por plataforma. O ranking de cadeados clicados é o número mais importante
   da tela.
```

---

## Bloco 12 — Publicação nas lojas
**Pronto quando:** o app está aprovado nas duas lojas.

```
Prepare o envio, seguindo LOJAS.md.

1. Revise o app contra a diretriz 4.2 da Apple: liste as telas nativas e confirme que
   WebView aparece só no checkout externo e nas páginas legais.
2. Ícone 1024x1024 sem transparência, splash, e capturas de tela em dois tamanhos de
   iPhone e dois de Android.
3. Ficha de privacidade da App Store e formulário de segurança de dados do Google Play,
   declarando e-mail, nome, identificador de aparelho, uso e diagnóstico.
4. Páginas de termos e privacidade publicadas no site, com URL pública.
5. Conta de teste para o revisor, com acesso liberado a pelo menos um produto pago, criada
   em /admin/acessos. Sem isso o revisor vê só cadeado e reprova.
6. eas build de produção para as duas plataformas, eas submit, e teste interno antes do
   envio público.
7. Configure EAS Update para correção de JavaScript sem revisão.

Documente em DECISIONS.md a data e o resultado de cada envio.
```

---

## Bloco 13 — Fase 2 (só depois do lançamento)

Turmas com sondagem, plano da semana com download em PDF único, "já usei em sala" com
estrelas, indicação com cupom, sincronização entre aparelhos. As tabelas de turmas e plano
já existem no schema.

---

## Cronograma

| Bloco | Duração | Observação |
|---|---|---|
| -1 | começa hoje | contas nas lojas, corre em paralelo a tudo |
| 0–2 | 1,5 semana | monorepo, banco, autenticação nas duas pontas |
| 3–4 | 1,5 semana | painel completo |
| 5 | 1 semana | pode rodar em paralelo ao 3–4 |
| **Curadoria** | **3–4 semanas** | **contínua, humana, começa junto do bloco 5** |
| 6–8 | 3 semanas | casca, vitrine e ficha do app |
| 9–10 | 2 semanas | download offline, venda e webhook |
| 11 | 1 semana | push e conta |
| 12 | 2 semanas | material de loja, envio e ciclo de revisão |

Cerca de **12 semanas** de desenvolvimento, contra 9 da versão só web. A diferença são as
telas nativas, o offline e o ciclo das lojas.

**Duas coisas rodam por fora e podem atrasar tudo:**
- A curadoria do acervo, que não depende de programação e precisa de alguém alocado.
- As contas de desenvolvedor, especialmente o D-U-N-S da Apple.

**Sobre a Happy Friday de novembro:** 12 semanas a partir do fim de agosto chegam em
novembro sem folga nenhuma, e a primeira submissão quase sempre volta com pedido de
ajuste. O caminho de menor risco é lançar em duas ondas — ver as pendências em
`DECISIONS.md`.
