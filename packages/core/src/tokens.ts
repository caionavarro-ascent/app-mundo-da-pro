/**
 * Tokens de cor das duas superfícies. Fonte única: qualquer ajuste de cor
 * acontece aqui e se propaga para o app (NativeWind) e o painel (Tailwind).
 */

/** App da Professora — tema escuro (ver CLAUDE.md §2; rebrand D39) */
export const coresApp = {
  fundo: '#0E2447',
  superficie: '#16325A',
  superficie2: '#1E3E6C',
  texto: '#F5F7FA',
  texto2: '#A3B2CB',
  marca: '#FF0167',
  /** marca quando usada como TEXTO/ícone: precisa de contraste no fundo */
  marcaLegivel: '#FF7AAE',
  coral: '#E4574E',
  verde: '#1F9E77',
  botaoPrimarioFundo: '#FF0167',
  botaoPrimarioTexto: '#FFFFFF',
} as const;

/**
 * App da Professora — tema claro (D14 em avaliação: o switch existe na demo
 * para a Gi e a Flávia compararem os dois fundos). Marca e apoios não mudam.
 */
export const coresAppClara = {
  fundo: '#F6F7FB',
  superficie: '#FFFFFF',
  superficie2: '#E8ECF4',
  texto: '#0E2447',
  texto2: '#4E5F7C',
  marca: '#FF0167',
  marcaLegivel: '#CC0052',
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
