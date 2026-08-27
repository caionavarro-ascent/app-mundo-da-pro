# LOJAS.md — App Store e Google Play

Regras que decidem se o app é aprovado ou reprovado. Leia antes dos blocos de app.

As políticas das lojas mudam com frequência. Sempre que uma regra abaixo for decisiva
para uma escolha de implementação, confirme na documentação oficial antes de agir e
registre a confirmação em `DECISIONS.md` com a data.

---

## 1. O risco número um: WebView

**Diretriz 4.2 da Apple (Minimum Functionality).** App que apenas embrulha um site é
reprovado. É o motivo de rejeição mais comum em projetos como este.

Para o app ser aprovado, estas telas precisam ser nativas de verdade:

- Navegação por abas no rodapé
- Home com destaque e prateleiras
- Ficha do material e leitor de PDF
- Busca
- Meus materiais, com downloads offline
- Conta e configurações

WebView é aceitável apenas em dois lugares:
1. **Checkout**, aberto no navegador do sistema, não embutido
2. **Páginas legais** (termos, privacidade), que podem ser WebView interna

E o app precisa oferecer pelo menos um recurso que o site não oferece. No nosso caso são
três, e todos são úteis de verdade para a professora: **download para uso offline**,
**impressão pelo sistema** e **notificação de material novo**. Isso não é enfeite para
passar na revisão — é o argumento real de por que existir um app.

## 2. Pagamento

O produto é vendido fora do app: The Members processa, com Pix e parcelamento. As lojas
tratam isso de três formas possíveis, e a escolha muda a comissão.

| Caminho | Comissão Apple | Observação |
|---|---|---|
| Compra dentro do app (IAP) | 15% no Small Business Program | Sem Pix, sem 12x, valores em faixas fixas |
| Link externo para checkout | 10% no Small Business Program (Brasil, após o acordo do CADE) | Pix e parcelamento funcionam |
| Só menção em texto, sem link | zero | Conversão muito baixa |

**Decisão do projeto: link externo.** Ver D17 em `DECISIONS.md`. Motivo: os produtos vão
de R$147 a R$697, e Pix e parcelamento em 12x são responsáveis por boa parte da conversão
nessa faixa. O IAP não faz nenhum dos dois.

Consequências para a implementação:

- O botão de compra abre o checkout no **navegador do sistema**, nunca em WebView interna
- É preciso estar inscrito no programa de link externo da Apple e usar a API própria para
  abrir o link, com o aviso que o sistema exibe
- Google Play tem programa equivalente, com regras próprias e elegibilidade que precisa
  ser confirmada antes do envio
- Verifique a elegibilidade ao Small Business Program da Apple e ao equivalente do Google;
  o faturamento do MDP está confortavelmente abaixo do teto

## 3. Conta e dados

Obrigações que reprovam o app se faltarem:

- **Exclusão de conta dentro do app.** Se dá para criar conta, tem que dar para excluir,
  sem falar com suporte. Tela obrigatória em Conta.
- **Política de privacidade** acessível dentro do app e com URL pública.
- **Ficha de privacidade** preenchida na App Store e formulário de segurança de dados no
  Google Play, declarando: e-mail, nome, identificador de aparelho, uso e diagnóstico.
- **Login sem senha por e-mail** dispensa login social, portanto dispensa "Sign in with
  Apple". Se um dia entrar login social, o da Apple passa a ser obrigatório no iOS.
- **Conteúdo trancado precisa ser explicável.** Na revisão, forneça uma conta de teste com
  acesso liberado a pelo menos um produto pago, senão o revisor vê só cadeado e reprova
  por conteúdo incompleto.

## 4. Publicação — o caminho crítico esquecido

**Comece por aqui, antes de qualquer código.**

- **Apple Developer Program, conta de organização**: exige número **D-U-N-S** da empresa.
  Obter o D-U-N-S leva de dias a semanas, e a inscrição na Apple leva mais alguns dias.
  US$ 99 por ano.
- **Google Play Console**: US$ 25, taxa única. **Conta pessoal nova exige teste fechado com
  12 testadores por 14 dias corridos antes de publicar.** Conta de organização é isenta —
  use conta de organização.
- **Prazo de revisão**: Apple costuma responder em 1 a 3 dias; a primeira submissão quase
  sempre volta com pedido. Reserve duas semanas para o ciclo completo.

## 5. Material de loja

Prepare antes do envio, porque trava a publicação:

- Ícone 1024×1024, sem transparência e sem cantos arredondados
- Capturas de tela em pelo menos dois tamanhos de iPhone e dois de Android
- Nome (30 caracteres), subtítulo (30) e descrição
- Palavras-chave: alfabetização, atividades, professora, BNCC, plano de aula
- Classificação etária e questionário de conteúdo
- Conta de teste para o revisor, com acesso a produto pago
- URL de suporte e URL de privacidade

## 6. Atualizações depois do lançamento

- Correção de conteúdo, texto, preço, destaque e prateleira **não exige nova versão**:
  tudo vem do servidor, pelas tabelas `configuracoes`, `destaques` e `produtos`.
- Nova versão do binário só para mudança de tela ou de biblioteca nativa.
- Use **EAS Update** para correção de JavaScript sem passar por revisão, respeitando o
  limite: não pode mudar a finalidade nem as funcionalidades declaradas do app.
