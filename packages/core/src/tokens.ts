/**
 * Tokens de cor das duas superfícies. Fonte única: qualquer ajuste de cor
 * acontece aqui e se propaga para o app (NativeWind) e o painel (Tailwind).
 */

/**
 * Identidade "Mundo da Prô | Clube Pedagógico" (D54): azul-marinho da marca (#0E2447)
 * nos fundos de destaque, menu ativo e banners; rosa (#FF0167) como cor primária
 * (botões, destaques, ícones em círculo). Texto sobre o rosa é sempre branco.
 */

/** App da Professora — tema escuro, todo em azul-marinho (alternativa no switch da Conta) */
export const coresApp = {
  fundo: '#071430',
  superficie: '#0E2447',
  superficie2: '#1A3560',
  texto: '#F3F6FB',
  texto2: '#A9B5CC',
  borda: '#1E3A66',
  marca: '#FF0167',
  /** marca quando usada como TEXTO/ícone: precisa de contraste no fundo */
  marcaLegivel: '#FF5C9A',
  /** texto e ícone por cima da marca */
  sobreMarca: '#FFFFFF',
  /** azul-marinho da marca: banners, menu ativo */
  brand: '#0E2447',
  coral: '#E4574E',
  verde: '#1F9E77',
  botaoPrimarioFundo: '#FF0167',
  botaoPrimarioTexto: '#FFFFFF',
} as const;

/** App da Professora — tema claro: o padrão (D54, encerra a dúvida da D14). */
export const coresAppClara = {
  fundo: '#F5F7FB',
  superficie: '#FFFFFF',
  superficie2: '#E8ECF3',
  texto: '#0E2447',
  texto2: '#5A6782',
  borda: '#E1E6EF',
  marca: '#FF0167',
  marcaLegivel: '#D10057',
  sobreMarca: '#FFFFFF',
  brand: '#0E2447',
  coral: '#E4574E',
  verde: '#1F9E77',
  botaoPrimarioFundo: '#FF0167',
  botaoPrimarioTexto: '#FFFFFF',
} as const;

/** Painel de conteúdo — tema claro (é planilha, não vitrine) */
export const coresAdmin = {
  papel: '#FCFCFA',
  tinta: '#16265C',
  tintaClara: '#3A57C4',
} as const;

/**
 * Exemplos manuscritos de "borboleta" por nível de escrita.
 * Assinatura visual do app: aparecem ao lado do nome do nível (PRD A1).
 */
export const exemploNivel = {
  pre: 'XAOEI',
  sil: 'OOEA',
  sa: 'BOBLETA',
  alf: 'BORBOLETA',
} as const;

export const nomeNivel = {
  pre: 'Pré-silábico',
  sil: 'Silábico',
  sa: 'Silábico-alfabético',
  alf: 'Alfabético',
} as const;

export const nomeAno = {
  infantil: 'Ed. Infantil',
  '1ano': '1º ano',
  '2ano': '2º ano',
  '3ano': '3º ano',
  '4ano': '4º ano',
  '5ano': '5º ano',
} as const;

export const nomeTipo = {
  sequencia: 'Sequência',
  atividade: 'Atividade',
  jogo: 'Jogo',
  avaliacao: 'Avaliação',
  cartaz: 'Cartaz',
  planner: 'Planner',
  aula: 'Aula',
  ebook: 'Ebook',
} as const;

export type NivelEscrita = keyof typeof nomeNivel;
export type AnoEscolar = keyof typeof nomeAno;
export type TipoMaterial = keyof typeof nomeTipo;
