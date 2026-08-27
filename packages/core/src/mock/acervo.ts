/**
 * ACERVO DE DEMONSTRAÇÃO (D29) — dados de exemplo para o MVP local, antes do
 * Supabase. As telas consomem apenas as funções deste módulo; quando o banco
 * entrar (Blocos 1–5), a implementação troca e as telas ficam.
 * Não importar em nada além do app de demonstração.
 */
import type { AnoEscolar, NivelEscrita, TipoMaterial } from '../tokens';

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
];

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
    (m) => m.novo && m.produtoIds.some((id) => posse.includes(id)),
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

export function buscarMateriais(termo: string): MaterialDemo[] {
  const normalizado = termo
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
  if (!normalizado.trim()) return [];
  return materiaisDemo.filter((m) =>
    `${m.titulo} ${m.descricao}`
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .includes(normalizado),
  );
}
