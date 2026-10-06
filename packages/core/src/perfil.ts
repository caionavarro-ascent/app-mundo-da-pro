/**
 * Perfil da professora (D53): o que ela responde nas boas-vindas do primeiro login,
 * para o app abrir já no jeito dela. Mora no `user_metadata.perfil` da conta do
 * Supabase Auth (segue a conta em qualquer aparelho, sem mudar o schema) e numa
 * cópia local para quem usa a demonstração sem entrar.
 */
import { nomeAno, nomeNivel, nomeTipo, type AnoEscolar, type NivelEscrita, type TipoMaterial } from './tokens';

/** Partes do app que ela pode querer ver primeiro. */
export const nomeRecurso = {
  perguntar: 'Achar material rápido',
  vitrine: 'Ver tudo o que existe',
  ferramentas: 'Criar atividades',
  turmas: 'Organizar minhas turmas',
  formacoes: 'Assistir às formações',
} as const;
export type RecursoApp = keyof typeof nomeRecurso;

export const descricaoRecurso: Record<RecursoApp, string> = {
  perguntar: 'Perguntar do meu jeito e receber sugestões',
  vitrine: 'Coleções, kits e atividades em prateleiras',
  ferramentas: 'Cruzadinha e caça-palavras com as minhas palavras',
  turmas: 'Separar materiais e planejar a semana de cada turma',
  formacoes: 'As aulas em vídeo das formações',
};

/** Onde ela dá aula: muda o tom das sugestões, não o acesso. */
export const nomeContexto = {
  publica: 'Escola pública',
  particular: 'Escola particular',
  reforco: 'Reforço / aula particular',
  coordenacao: 'Coordenação',
} as const;
export type ContextoAula = keyof typeof nomeContexto;

/** Tipos que fazem sentido perguntar (aula e planner ficam de fora: não são "de sala"). */
export const TIPOS_DE_SALA: TipoMaterial[] = ['atividade', 'jogo', 'sequencia', 'avaliacao', 'cartaz', 'ebook'];

export interface PerfilProfessora {
  versao: 1;
  nome: string;
  contexto: ContextoAula | null;
  anos: AnoEscolar[];
  niveis: NivelEscrita[];
  tipos: TipoMaterial[];
  recursos: RecursoApp[];
  concluidoEm: string;
}

export function perfilValido(bruto: unknown): PerfilProfessora | null {
  if (!bruto || typeof bruto !== 'object') return null;
  const p = bruto as Partial<PerfilProfessora>;
  if (p.versao !== 1 || !Array.isArray(p.anos) || !Array.isArray(p.tipos) || !Array.isArray(p.recursos)) {
    return null;
  }
  return {
    versao: 1,
    nome: typeof p.nome === 'string' ? p.nome : '',
    contexto: p.contexto && p.contexto in nomeContexto ? p.contexto : null,
    anos: p.anos.filter((a) => a in nomeAno),
    niveis: Array.isArray(p.niveis) ? p.niveis.filter((n) => n in nomeNivel) : [],
    tipos: p.tipos.filter((t) => t in nomeTipo),
    recursos: p.recursos.filter((r) => r in nomeRecurso),
    concluidoEm: typeof p.concluidoEm === 'string' ? p.concluidoEm : '',
  };
}

/** Nível de escrita só se pergunta para quem alfabetiza (Infantil ao 3º ano). */
export function perguntaNivel(anos: AnoEscolar[]): boolean {
  return anos.length === 0 || anos.some((a) => ['infantil', '1ano', '2ano', '3ano'].includes(a));
}

const ARTIGO_TIPO: Partial<Record<TipoMaterial, string>> = {
  atividade: 'Atividades',
  jogo: 'Jogo',
  sequencia: 'Sequência didática',
  avaliacao: 'Avaliação diagnóstica',
  cartaz: 'Cartazes',
  ebook: 'Ebook',
};

// temas por fase: quem alfabetiza pergunta de rima e alfabeto; do 3º ao 5º, de leitura e texto
const TEMAS_ALFABETIZACAO = ['rimas', 'animais', 'alfabeto', 'nome próprio', 'frutas'];
const TEMAS_FUNDAMENTAL = ['leitura', 'produção de texto', 'interpretação', 'fábulas', 'ortografia'];

/**
 * "Experimente perguntar" da home montado com o perfil: as perguntas que ela faria,
 * já na língua do motor de busca (ano, nível, tipo e tema). Sem perfil, os exemplos fixos.
 */
export function perguntasDoPerfil(perfil: PerfilProfessora | null, padrao: string[]): string[] {
  if (!perfil || (perfil.anos.length === 0 && perfil.tipos.length === 0)) return padrao;
  const anos = perfil.anos.length ? perfil.anos : (['1ano'] as AnoEscolar[]);
  const tipos = perfil.tipos.length ? perfil.tipos : (['atividade', 'jogo'] as TipoMaterial[]);
  const saida: string[] = [];
  for (let i = 0; saida.length < 4 && i < 8; i++) {
    const tipo = tipos[i % tipos.length];
    const ano = anos[i % anos.length];
    const temas = ['infantil', '1ano', '2ano'].includes(ano) ? TEMAS_ALFABETIZACAO : TEMAS_FUNDAMENTAL;
    const tema = temas[i % temas.length];
    const comoTipo = ARTIGO_TIPO[tipo] ?? nomeTipo[tipo];
    const frase =
      tipo === 'ebook'
        ? 'Ebook sobre alfabetização' // o ebook é para ela, não para o aluno: sem ano
        : i === 1 && perfil.niveis.length
          ? `${comoTipo} para alunos ${nomeNivel[perfil.niveis[0]].toLowerCase()}s`
          : `${comoTipo} sobre ${tema} para ${ano === 'infantil' ? 'a Educação Infantil' : `o ${nomeAno[ano]}`}`;
    if (!saida.includes(frase)) saida.push(frase);
  }
  return saida;
}

/** Para onde ir ao terminar: a primeira coisa que ela disse querer ver. */
export function rotaDoRecurso(recurso: RecursoApp | undefined): string {
  switch (recurso) {
    case 'vitrine':
      return '/vitrine';
    case 'ferramentas':
      return '/ferramentas';
    case 'turmas':
      return '/turmas';
    case 'formacoes':
      return '/meus';
    default:
      return '/';
  }
}
