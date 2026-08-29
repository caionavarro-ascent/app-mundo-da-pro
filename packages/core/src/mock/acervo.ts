/**
 * ACERVO DE DEMONSTRAÇÃO (D29) — dados de exemplo para o MVP local, antes do
 * Supabase. As telas consomem apenas as funções deste módulo; quando o banco
 * entrar (Blocos 1–5), a implementação troca e as telas ficam.
 * Não importar em nada além do app de demonstração.
 */
import {
  nomeAno,
  nomeNivel,
  nomeTipo,
  type AnoEscolar,
  type NivelEscrita,
  type TipoMaterial,
} from '../tokens';

export interface ProdutoDemo {
  id: string;
  nome: string;
  cor: string;
  precoCentavos: number;
  parcelasTexto: string;
  pitchParaQuem: string;
  pitchParaQue: string;
  ordemVitrine: number;
  /** FDA e FPT: aulas abrem no The Members, sempre por último na vitrine */
  cursoExterno?: boolean;
  isCombo?: boolean;
}

export interface MaterialDemo {
  id: string;
  titulo: string;
  tipo: TipoMaterial;
  anos: AnoEscolar[];
  niveis: NivelEscrita[];
  paginas: number;
  gratuito: boolean;
  produtoIds: string[];
  novo?: boolean;
  posicaoTop?: number;
  descricao: string;
  passos: string[];
}

export const produtosDemo: ProdutoDemo[] = [
  {
    id: 'educakits',
    nome: 'EducaKits',
    cor: '#E4574E',
    precoCentavos: 19700,
    parcelasTexto: 'ou 12x de R$ 19',
    pitchParaQuem: 'Para quem já sabe o que ensinar mas gasta o domingo montando atividade.',
    pitchParaQue: 'Sequências prontas para imprimir, do infantil ao 2º ano.',
    ordemVitrine: 10,
  },
  {
    id: 'imagine',
    nome: 'Coleção Imagine',
    cor: '#7C5CBF',
    precoCentavos: 14700,
    parcelasTexto: 'ou 12x de R$ 14',
    pitchParaQuem: 'Para quem quer trabalhar produção de texto sem inventar tudo do zero.',
    pitchParaQue: 'Propostas ilustradas de escrita criativa para o 2º ao 5º ano.',
    ordemVitrine: 20,
  },
  {
    id: 'flaeduca',
    nome: 'Cadernos FlaEduca',
    cor: '#1F9E77',
    precoCentavos: 16700,
    parcelasTexto: 'ou 12x de R$ 16',
    pitchParaQuem: 'Para quem precisa de rotina estruturada de alfabetização.',
    pitchParaQue: 'Cadernos completos por nível de escrita, prontos para o xerox.',
    ordemVitrine: 30,
  },
  {
    id: 'avulsos',
    nome: 'Materiais Avulsos',
    cor: '#3A57C4',
    precoCentavos: 4700,
    parcelasTexto: 'ou 6x de R$ 8',
    pitchParaQuem: 'Para quem precisa de uma atividade certeira para amanhã.',
    pitchParaQue: 'Jogos, cartazes e avaliações vendidos um a um.',
    ordemVitrine: 40,
  },
  {
    id: 'bncc',
    nome: 'BNCC de Bolso',
    cor: '#B8862D',
    precoCentavos: 9700,
    parcelasTexto: 'ou 12x de R$ 9',
    pitchParaQuem: 'Para quem trava na hora de preencher o planejamento.',
    pitchParaQue: 'As habilidades da BNCC traduzidas em linguagem de sala de aula.',
    ordemVitrine: 50,
  },
  {
    id: 'fda',
    nome: 'Formação Destrava Aluno',
    cor: '#C2483F',
    precoCentavos: 69700,
    parcelasTexto: 'ou 12x de R$ 69',
    pitchParaQuem: 'Para quem tem aluno que não avança e já tentou de tudo.',
    pitchParaQue: 'Formação completa em alfabetização, com acesso por 1 ano.',
    ordemVitrine: 90,
    cursoExterno: true,
  },
  {
    id: 'fpt',
    nome: 'Formação Produção de Texto',
    cor: '#2F6FAD',
    precoCentavos: 49700,
    parcelasTexto: 'ou 12x de R$ 49',
    pitchParaQuem: 'Para quem sofre para tirar texto de criança do 3º ao 5º ano.',
    pitchParaQue: 'Método passo a passo para destravar a escrita da turma.',
    ordemVitrine: 91,
    cursoExterno: true,
  },
  {
    id: 'acesso-total',
    nome: 'Acesso Total Mundo da Prô',
    cor: '#FFD84D',
    precoCentavos: 99700,
    parcelasTexto: 'ou 12x de R$ 97',
    pitchParaQuem: 'Para quem quer o acervo inteiro sem escolher.',
    pitchParaQue: 'Todos os materiais, atuais e futuros, num acesso só.',
    ordemVitrine: 999,
    isCombo: true,
  },
];

const passosPadrao = [
  'Imprima as páginas em papel comum, uma por aluno.',
  'Apresente a atividade no coletivo antes de distribuir.',
  'Circule pela sala apoiando quem estiver no nível pré-silábico.',
  'Guarde as produções para comparar na próxima sondagem.',
];

export const materiaisDemo: MaterialDemo[] = [
  {
    id: 'bingo-sons',
    titulo: 'Bingo dos Sons Iniciais',
    tipo: 'jogo',
    anos: ['infantil', '1ano'],
    niveis: ['pre', 'sil'],
    paginas: 12,
    gratuito: true,
    produtoIds: ['educakits'],
    posicaoTop: 1,
    descricao:
      'Bingo com imagens para a criança identificar o som inicial de cada palavra. Ideal para roda de jogos na fase pré-silábica.',
    passos: [
      'Imprima as cartelas em papel mais grosso, se possível.',
      'Recorte as fichas de chamada e coloque num saquinho.',
      'Diga a palavra em voz alta sem mostrar a imagem primeiro.',
      'Peça que marquem a figura que começa com aquele som.',
    ],
  },
  {
    id: 'seq-festa-junina',
    titulo: 'Sequência Didática: Festa Junina',
    tipo: 'sequencia',
    anos: ['1ano', '2ano'],
    niveis: ['sil', 'sa'],
    paginas: 28,
    gratuito: false,
    produtoIds: ['educakits'],
    novo: true,
    posicaoTop: 2,
    descricao:
      'Sequência completa de duas semanas com o tema Festa Junina: leitura, escrita espontânea, lista, convite e produção final.',
    passos: passosPadrao,
  },
  {
    id: 'alfabeto-movel',
    titulo: 'Alfabeto Móvel para Recortar',
    tipo: 'atividade',
    anos: ['infantil', '1ano', '2ano'],
    niveis: ['pre', 'sil', 'sa'],
    paginas: 8,
    gratuito: true,
    produtoIds: ['avulsos'],
    posicaoTop: 3,
    descricao:
      'Letras grandes para recortar e montar palavras na mesa. Recurso básico que serve o ano inteiro.',
    passos: passosPadrao,
  },
  {
    id: 'aval-diagnostica',
    titulo: 'Avaliação Diagnóstica de Escrita',
    tipo: 'avaliacao',
    anos: ['1ano', '2ano', '3ano'],
    niveis: ['pre', 'sil', 'sa', 'alf'],
    paginas: 6,
    gratuito: false,
    produtoIds: ['flaeduca'],
    posicaoTop: 4,
    descricao:
      'Sondagem pronta com as quatro palavras e a frase, mais a tabela para registrar o nível de cada aluno.',
    passos: [
      'Aplique individualmente ou em pequenos grupos.',
      'Dite as quatro palavras do mesmo campo semântico.',
      'Peça a frase por último, sem ajudar na escrita.',
      'Classifique cada escrita usando a tabela da última página.',
    ],
  },
  {
    id: 'silabario',
    titulo: 'Cartaz Silabário Simples',
    tipo: 'cartaz',
    anos: ['1ano', '2ano'],
    niveis: ['sil', 'sa'],
    paginas: 4,
    gratuito: false,
    produtoIds: ['avulsos'],
    posicaoTop: 5,
    descricao: 'Silabário em quatro cartazes A4 para compor o mural de apoio à leitura.',
    passos: passosPadrao,
  },
  {
    id: 'planner-semanal',
    titulo: 'Planner Semanal da Alfabetizadora',
    tipo: 'planner',
    anos: ['infantil', '1ano', '2ano', '3ano', '4ano', '5ano'],
    niveis: ['pre', 'sil', 'sa', 'alf'],
    paginas: 16,
    gratuito: false,
    produtoIds: ['educakits', 'avulsos'],
    posicaoTop: 6,
    descricao: 'Planner de rotina semanal com espaço para agrupamentos por nível de escrita.',
    passos: passosPadrao,
  },
  {
    id: 'trilha-leitura',
    titulo: 'Trilha da Leitura',
    tipo: 'jogo',
    anos: ['1ano', '2ano'],
    niveis: ['sa', 'alf'],
    paginas: 10,
    gratuito: false,
    produtoIds: ['educakits'],
    novo: true,
    descricao:
      'Jogo de tabuleiro em que a criança avança lendo palavras e frases curtas. Para duplas ou trios.',
    passos: passosPadrao,
  },
  {
    id: 'ditado-recortado',
    titulo: 'Ditado Recortado',
    tipo: 'atividade',
    anos: ['1ano', '2ano'],
    niveis: ['sil', 'sa'],
    paginas: 9,
    gratuito: false,
    produtoIds: ['flaeduca'],
    posicaoTop: 7,
    descricao:
      'A criança recorta as letras e monta a palavra ditada. Ponte entre o alfabeto móvel e a escrita no caderno.',
    passos: passosPadrao,
  },
  {
    id: 'producao-bilhete',
    titulo: 'Caderno de Produção: Bilhete e Convite',
    tipo: 'sequencia',
    anos: ['2ano', '3ano'],
    niveis: ['alf'],
    paginas: 22,
    gratuito: false,
    produtoIds: ['imagine'],
    novo: true,
    descricao:
      'Propostas de escrita com função social real: bilhete para a família e convite para um evento da turma.',
    passos: passosPadrao,
  },
  {
    id: 'memoria-rimas',
    titulo: 'Jogo da Memória de Rimas',
    tipo: 'jogo',
    anos: ['infantil', '1ano'],
    niveis: ['pre', 'sil'],
    paginas: 8,
    gratuito: false,
    produtoIds: ['avulsos'],
    posicaoTop: 8,
    descricao: 'Pares de imagens que rimam, para consciência fonológica na roda ou em cantos.',
    passos: passosPadrao,
  },
  {
    id: 'bncc-1ano',
    titulo: 'BNCC de Bolso: 1º ano',
    tipo: 'planner',
    anos: ['1ano'],
    niveis: ['pre', 'sil', 'sa', 'alf'],
    paginas: 34,
    gratuito: false,
    produtoIds: ['bncc'],
    descricao:
      'As habilidades de Língua Portuguesa do 1º ano traduzidas em objetivos práticos e exemplos de atividade.',
    passos: passosPadrao,
  },
  {
    id: 'aval-fluencia',
    titulo: 'Fichas de Fluência Leitora',
    tipo: 'avaliacao',
    anos: ['2ano', '3ano'],
    niveis: ['alf'],
    paginas: 14,
    gratuito: false,
    produtoIds: ['flaeduca'],
    novo: true,
    posicaoTop: 9,
    descricao: 'Textos graduados com rubrica simples para acompanhar a fluência ao longo do bimestre.',
    passos: passosPadrao,
  },
  {
    id: 'cartaz-combinados',
    titulo: 'Cartazes de Combinados da Turma',
    tipo: 'cartaz',
    anos: ['infantil', '1ano', '2ano'],
    niveis: ['pre', 'sil', 'sa', 'alf'],
    paginas: 6,
    gratuito: true,
    produtoIds: ['avulsos'],
    posicaoTop: 10,
    descricao: 'Cartazes ilustrados para construir os combinados com a turma na primeira semana.',
    passos: passosPadrao,
  },
  {
    id: 'imagine-historia',
    titulo: 'Imagine: E se o Zoológico Fugisse?',
    tipo: 'sequencia',
    anos: ['3ano', '4ano', '5ano'],
    niveis: ['alf'],
    paginas: 18,
    gratuito: false,
    produtoIds: ['imagine'],
    descricao:
      'Proposta ilustrada de narrativa: a turma imagina a fuga dos bichos e escreve a notícia do dia seguinte.',
    passos: passosPadrao,
  },
  {
    id: 'caderno-silabico',
    titulo: 'Caderno do Nível Silábico',
    tipo: 'sequencia',
    anos: ['1ano', '2ano'],
    niveis: ['sil'],
    paginas: 42,
    gratuito: false,
    produtoIds: ['flaeduca'],
    descricao:
      'Caderno completo de intervenção para alunos silábicos: 4 semanas de atividades graduadas.',
    passos: passosPadrao,
  },
  {
    id: 'aula-fda-sondagem',
    titulo: 'Aula: Como Aplicar a Sondagem',
    tipo: 'aula',
    anos: ['1ano', '2ano', '3ano'],
    niveis: ['pre', 'sil', 'sa', 'alf'],
    paginas: 0,
    gratuito: false,
    produtoIds: ['fda'],
    descricao: 'Aula em vídeo da Formação Destrava Aluno. Assiste-se na plataforma The Members.',
    passos: [],
  },
  {
    id: 'seq-nome-proprio',
    titulo: 'Sequência: O Nome Próprio',
    tipo: 'sequencia',
    anos: ['infantil', '1ano'],
    niveis: ['pre', 'sil'],
    paginas: 24,
    gratuito: false,
    produtoIds: ['educakits'],
    descricao:
      'O nome da criança como porta de entrada na escrita: crachá, chamada viva e comparação de letras.',
    passos: passosPadrao,
  },
  {
    id: 'jogo-forca-silabas',
    titulo: 'Forca das Sílabas',
    tipo: 'jogo',
    anos: ['1ano', '2ano'],
    niveis: ['sil', 'sa'],
    paginas: 7,
    gratuito: false,
    produtoIds: ['educakits'],
    descricao: 'Versão da forca em que a turma arrisca sílabas inteiras, não letras soltas.',
    passos: passosPadrao,
  },
  {
    id: 'seq-receita',
    titulo: 'Sequência: Receita de Brigadeiro',
    tipo: 'sequencia',
    anos: ['1ano', '2ano'],
    niveis: ['sa', 'alf'],
    paginas: 20,
    gratuito: false,
    produtoIds: ['educakits'],
    descricao:
      'Texto instrucional na prática: ler a receita, reescrever o modo de fazer e produzir a própria.',
    passos: passosPadrao,
  },
  {
    id: 'ativ-rotulos',
    titulo: 'Leitura de Rótulos e Embalagens',
    tipo: 'atividade',
    anos: ['infantil', '1ano'],
    niveis: ['pre', 'sil'],
    paginas: 11,
    gratuito: false,
    produtoIds: ['educakits'],
    descricao: 'A escrita que já mora na casa da criança: rótulos conhecidos para leitura incidental.',
    passos: passosPadrao,
  },
  {
    id: 'caderno-pre-silabico',
    titulo: 'Caderno do Nível Pré-silábico',
    tipo: 'sequencia',
    anos: ['infantil', '1ano'],
    niveis: ['pre'],
    paginas: 38,
    gratuito: false,
    produtoIds: ['flaeduca'],
    descricao: 'Quatro semanas de atividades para a criança que ainda não relaciona letra e som.',
    passos: passosPadrao,
  },
  {
    id: 'caderno-alfabetico',
    titulo: 'Caderno do Nível Alfabético',
    tipo: 'sequencia',
    anos: ['2ano', '3ano'],
    niveis: ['alf'],
    paginas: 44,
    gratuito: false,
    produtoIds: ['flaeduca'],
    descricao: 'Ortografia e fluência para quem já escreve alfabeticamente: o passo depois da hipótese.',
    passos: passosPadrao,
  },
  {
    id: 'aval-leitura-palavras',
    titulo: 'Avaliação de Leitura de Palavras',
    tipo: 'avaliacao',
    anos: ['1ano', '2ano'],
    niveis: ['sil', 'sa', 'alf'],
    paginas: 8,
    gratuito: false,
    produtoIds: ['flaeduca'],
    descricao: 'Listas graduadas para mapear quem lê palavras, pseudopalavras e frases curtas.',
    passos: passosPadrao,
  },
  {
    id: 'jogo-domino-figuras',
    titulo: 'Dominó de Figuras e Palavras',
    tipo: 'jogo',
    anos: ['1ano', '2ano'],
    niveis: ['sil', 'sa'],
    paginas: 9,
    gratuito: false,
    produtoIds: ['avulsos'],
    descricao: 'Dominó clássico ligando imagem e palavra escrita, para cantos de atividade.',
    passos: passosPadrao,
  },
  {
    id: 'cartaz-aniversariantes',
    titulo: 'Cartaz de Aniversariantes',
    tipo: 'cartaz',
    anos: ['infantil', '1ano', '2ano'],
    niveis: ['pre', 'sil', 'sa', 'alf'],
    paginas: 5,
    gratuito: false,
    produtoIds: ['avulsos'],
    descricao: 'Mural de aniversários com os meses do ano, para trabalhar calendário e escrita de nomes.',
    passos: passosPadrao,
  },
  {
    id: 'planner-sondagem',
    titulo: 'Fichas de Registro de Sondagem',
    tipo: 'planner',
    anos: ['1ano', '2ano', '3ano'],
    niveis: ['pre', 'sil', 'sa', 'alf'],
    paginas: 12,
    gratuito: false,
    produtoIds: ['avulsos'],
    novo: true,
    descricao: 'Fichas para acompanhar a evolução de escrita de cada aluno ao longo do ano.',
    passos: passosPadrao,
  },
  {
    id: 'imagine-carta-futuro',
    titulo: 'Imagine: Carta para o Eu do Futuro',
    tipo: 'sequencia',
    anos: ['3ano', '4ano', '5ano'],
    niveis: ['alf'],
    paginas: 16,
    gratuito: false,
    produtoIds: ['imagine'],
    descricao: 'A turma escreve cartas para si mesma, sela e abre no fim do ano. Escrita com emoção real.',
    passos: passosPadrao,
  },
  {
    id: 'imagine-noticia-maluca',
    titulo: 'Imagine: A Notícia Mais Maluca do Mundo',
    tipo: 'sequencia',
    anos: ['4ano', '5ano'],
    niveis: ['alf'],
    paginas: 19,
    gratuito: false,
    produtoIds: ['imagine'],
    descricao: 'Estrutura de notícia com liberdade total no conteúdo: lide, título e imagem de apoio.',
    passos: passosPadrao,
  },
  {
    id: 'imagine-poema-coletivo',
    titulo: 'Imagine: Poema Coletivo da Turma',
    tipo: 'sequencia',
    anos: ['2ano', '3ano'],
    niveis: ['sa', 'alf'],
    paginas: 14,
    gratuito: false,
    produtoIds: ['imagine'],
    descricao: 'Cada aluno contribui com um verso; a turma revisa junta e monta o livro do poema.',
    passos: passosPadrao,
  },
  {
    id: 'bncc-2ano',
    titulo: 'BNCC de Bolso: 2º ano',
    tipo: 'planner',
    anos: ['2ano'],
    niveis: ['sil', 'sa', 'alf'],
    paginas: 36,
    gratuito: false,
    produtoIds: ['bncc'],
    descricao: 'As habilidades de Língua Portuguesa do 2º ano em linguagem de sala de aula.',
    passos: passosPadrao,
  },
  {
    id: 'bncc-infantil',
    titulo: 'BNCC de Bolso: Educação Infantil',
    tipo: 'planner',
    anos: ['infantil'],
    niveis: ['pre'],
    paginas: 30,
    gratuito: false,
    produtoIds: ['bncc'],
    descricao: 'Os campos de experiência traduzidos em propostas práticas para a pré-escola.',
    passos: passosPadrao,
  },
  {
    id: 'aula-fda-agrupamentos',
    titulo: 'Aula: Agrupamentos Produtivos',
    tipo: 'aula',
    anos: ['1ano', '2ano'],
    niveis: ['pre', 'sil', 'sa', 'alf'],
    paginas: 0,
    gratuito: false,
    produtoIds: ['fda'],
    descricao: 'Como montar duplas e grupos que fazem a hipótese de escrita avançar.',
    passos: [],
  },
  {
    id: 'aula-fda-intervencao',
    titulo: 'Aula: Intervenção no Nível Silábico',
    tipo: 'aula',
    anos: ['1ano', '2ano'],
    niveis: ['sil'],
    paginas: 0,
    gratuito: false,
    produtoIds: ['fda'],
    descricao: 'O que fazer com o aluno que estacionou no silábico: as perguntas que desestabilizam.',
    passos: [],
  },
  {
    id: 'aula-fpt-destravar',
    titulo: 'Aula: Destravando a Primeira Linha',
    tipo: 'aula',
    anos: ['3ano', '4ano', '5ano'],
    niveis: ['alf'],
    paginas: 0,
    gratuito: false,
    produtoIds: ['fpt'],
    descricao: 'Por que a criança trava diante da folha em branco e como abrir a escrita.',
    passos: [],
  },
  {
    id: 'aula-fpt-revisao',
    titulo: 'Aula: Revisão Sem Sofrimento',
    tipo: 'aula',
    anos: ['4ano', '5ano'],
    niveis: ['alf'],
    paginas: 0,
    gratuito: false,
    produtoIds: ['fpt'],
    descricao: 'Transformar a revisão de texto em etapa que a turma pede para fazer.',
    passos: [],
  },
];

// ---------------------------------------------------------------------------
// Turmas (D30) — espelham a tabela `turmas` da fase 2 do schema
// ---------------------------------------------------------------------------

export interface TurmaDemo {
  id: string;
  nome: string;
  ano: AnoEscolar;
  alunos: number;
  /** distribuição da turma por nível de escrita, como na sondagem */
  dist: Record<NivelEscrita, number>;
}

export const turmasDemo: TurmaDemo[] = [
  {
    id: 'turma-1a',
    nome: '1º ano A — manhã',
    ano: '1ano',
    alunos: 24,
    dist: { pre: 6, sil: 10, sa: 5, alf: 3 },
  },
  {
    id: 'turma-2b',
    nome: '2º ano B — tarde',
    ano: '2ano',
    alunos: 26,
    dist: { pre: 4, sil: 9, sa: 8, alf: 5 },
  },
];

export const diasDaSemana = ['seg', 'ter', 'qua', 'qui', 'sex'] as const;
export type DiaDaSemana = (typeof diasDaSemana)[number];

export const nomeDia: Record<DiaDaSemana, string> = {
  seg: 'Segunda',
  ter: 'Terça',
  qua: 'Quarta',
  qui: 'Quinta',
  sex: 'Sexta',
};

/** Frase de orientação a partir do nível dominante da sondagem. */
export function insightDaTurma(turma: TurmaDemo): string {
  const dominante = (Object.keys(turma.dist) as NivelEscrita[]).reduce((a, b) =>
    turma.dist[b] > turma.dist[a] ? b : a,
  );
  const frases: Record<NivelEscrita, string> = {
    pre: 'A maioria ainda está no pré-silábico. Priorize consciência fonológica, nome próprio e escrita espontânea.',
    sil: 'A maioria está no silábico. Priorize consciência fonológica e princípio alfabético.',
    sa: 'A maioria está no silábico-alfabético. Priorize leitura de palavras e ditados com apoio.',
    alf: 'A maioria já escreve alfabeticamente. Priorize fluência, ortografia e produção de texto.',
  };
  return frases[dominante];
}

/** Materiais trancados que servem à turma — o cross-sell da tela (D30). */
export function sugeridosParaTurma(turma: TurmaDemo, posse: string[]): MaterialDemo[] {
  return materiaisDemo.filter(
    (m) => m.tipo !== 'aula' && m.anos.includes(turma.ano) && !estaLiberado(m, posse),
  );
}

export function turmaPorId(id: string): TurmaDemo | undefined {
  return turmasDemo.find((t) => t.id === id);
}

/**
 * Atividades que fazem sentido para a turma: materiais liberados (não aula)
 * cujo ano bate com o da turma.
 */
export function atividadesParaTurma(turma: TurmaDemo, posse: string[]): MaterialDemo[] {
  return materiaisDemo.filter(
    (m) => m.tipo !== 'aula' && m.anos.includes(turma.ano) && estaLiberado(m, posse),
  );
}

// ---------------------------------------------------------------------------
// Regras da vitrine — espelham o que o servidor fará (A2 e A5 do PRD)
// ---------------------------------------------------------------------------

export function produtoPorId(id: string): ProdutoDemo | undefined {
  return produtosDemo.find((p) => p.id === id);
}

export function materialPorId(id: string): MaterialDemo | undefined {
  return materiaisDemo.find((m) => m.id === id);
}

export function corDoMaterial(m: MaterialDemo): string {
  return produtoPorId(m.produtoIds[0])?.cor ?? '#3A57C4';
}

export function estaLiberado(m: MaterialDemo, posse: string[]): boolean {
  if (m.gratuito) return true;
  if (posse.includes('acesso-total')) return true;
  return m.produtoIds.some((id) => posse.includes(id));
}

export interface DestaqueResolvido {
  material: MaterialDemo;
  chamada: string;
  ctaPrimario: string;
}

/** Prioridades de A2: material novo de produto possuído > sugestão > gratuito */
export function resolverDestaque(posse: string[]): DestaqueResolvido {
  const novoPossuido = materiaisDemo.find(
    (m) => m.novo && !m.gratuito && estaLiberado(m, posse),
  );
  if (novoPossuido) {
    return { material: novoPossuido, chamada: 'Novo no seu acervo', ctaPrimario: 'Baixar agora' };
  }
  const sugestao = materiaisDemo.find((m) => m.novo && !estaLiberado(m, posse));
  if (sugestao) {
    const produto = produtoPorId(sugestao.produtoIds[0]);
    return {
      material: sugestao,
      chamada: 'Sugerido para você',
      ctaPrimario: `Conhecer o ${produto?.nome ?? 'produto'}`,
    };
  }
  const gratuito = materiaisDemo.find((m) => m.gratuito)!;
  return { material: gratuito, chamada: 'Comece por aqui', ctaPrimario: 'Baixar de graça' };
}

export interface PrateleiraDemo {
  id: string;
  titulo: string;
  subtitulo?: string;
  materiais: MaterialDemo[];
}

/** Prateleiras por produto não possuído, na ordem de A5 (cursos por último) */
export function prateleirasPorProduto(posse: string[]): PrateleiraDemo[] {
  return produtosDemo
    .filter((p) => !p.isCombo && !posse.includes(p.id))
    .sort((a, b) =>
      Number(a.cursoExterno ?? false) - Number(b.cursoExterno ?? false) ||
      a.ordemVitrine - b.ordemVitrine,
    )
    .map((p) => ({
      id: p.id,
      titulo: p.nome,
      subtitulo: `${p.pitchParaQuem}\n${p.pitchParaQue}`,
      materiais: materiaisDemo.filter((m) => m.produtoIds.includes(p.id)),
    }))
    .filter((prateleira) => prateleira.materiais.length > 0);
}

export function maisBaixados(): MaterialDemo[] {
  return materiaisDemo
    .filter((m) => m.posicaoTop != null)
    .sort((a, b) => (a.posicaoTop ?? 99) - (b.posicaoTop ?? 99));
}

export function novidades(): MaterialDemo[] {
  return materiaisDemo.filter((m) => m.novo);
}

export function comecePorAqui(posse: string[]): MaterialDemo[] {
  return materiaisDemo.filter((m) => estaLiberado(m, posse));
}

export function parecidosCom(material: MaterialDemo): MaterialDemo[] {
  return materiaisDemo.filter(
    (m) =>
      m.id !== material.id &&
      (m.tipo === material.tipo || m.niveis.some((n) => material.niveis.includes(n))),
  ).slice(0, 8);
}

function semAcentos(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

/**
 * Busca ao vivo: título, descrição e também os nomes de tipo, ano e nível —
 * "jogo", "1º ano" e "silábico" encontram materiais. Cada palavra digitada
 * precisa aparecer em algum campo.
 */
export function buscarMateriais(termo: string): MaterialDemo[] {
  const palavras = semAcentos(termo).split(/\s+/).filter(Boolean);
  if (palavras.length === 0) return [];
  return materiaisDemo.filter((m) => {
    const palheiro = semAcentos(
      [
        m.titulo,
        m.descricao,
        nomeTipo[m.tipo],
        ...m.anos.map((a) => nomeAno[a]),
        ...m.niveis.map((n) => nomeNivel[n]),
      ].join(' '),
    );
    return palavras.every((p) => palheiro.includes(p));
  });
}
