/**
 * Tokens de cor das duas superfícies. Fonte única: qualquer ajuste de cor
 * acontece aqui e se propaga para o app (NativeWind) e o painel (Tailwind).
 */

/** App da Professora — tema escuro (ver CLAUDE.md §2) */
export const coresApp = {
  fundo: '#0B0D12',
  superficie: '#16191F',
  superficie2: '#1F232B',
  texto: '#F5F6F8',
  texto2: '#A2A8B4',
  marca: '#FFD84D',
  coral: '#E4574E',
  verde: '#1F9E77',
  /** Botão primário sempre branco com texto escuro, como na referência */
  botaoPrimarioFundo: '#FFFFFF',
  botaoPrimarioTexto: '#0B0D12',
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
} as const;

export type NivelEscrita = keyof typeof nomeNivel;
export type AnoEscolar = keyof typeof nomeAno;
export type TipoMaterial = keyof typeof nomeTipo;
