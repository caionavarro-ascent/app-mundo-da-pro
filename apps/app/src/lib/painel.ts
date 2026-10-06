import Constants from 'expo-constants';
import { Platform } from 'react-native';
import type { PalavraDaAtividade, Pontuacao } from '@mdp/core';
import type { MaterialDemo } from '@mdp/core/src/mock/acervo';

/**
 * Ponte app ↔ painel sem banco (D33): busca os materiais PUBLICADOS no
 * /admin e os injeta no acervo da demo. Some quando o Supabase entrar.
 */

/**
 * Publicado (D41): EXPO_PUBLIC_API_URL aponta pro painel do servidor.
 * Em desenvolvimento (vazia ou localhost): no web, o painel está em
 * localhost; no aparelho, no IP do computador.
 */
export function baseDoPainel(): string {
  const publicado = process.env.EXPO_PUBLIC_API_URL;
  if (publicado && !/localhost|127\.0\.0\.1/.test(publicado)) return publicado.replace(/\/+$/, '');
  if (Platform.OS === 'web') return 'http://localhost:3000';
  const hostUri = Constants.expoConfig?.hostUri; // ex.: 192.168.0.10:8081
  const maquina = hostUri?.split(':')[0];
  return maquina ? `http://${maquina}:3000` : 'http://localhost:3000';
}

interface MaterialDaApi {
  id: string;
  titulo: string;
  descricao: string;
  tipo: MaterialDemo['tipo'];
  anos: MaterialDemo['anos'];
  niveis: MaterialDemo['niveis'];
  paginas: number;
  gratuito: boolean;
  produtoIds: string[];
  capa: string | null;
  capaProporcao: number | null;
  criadoEm: string;
}

const TRINTA_DIAS = 30 * 24 * 60 * 60 * 1000;

export async function buscarMateriaisDoPainel(): Promise<MaterialDemo[]> {
  const base = baseDoPainel();
  const resposta = await fetch(`${base}/api/materiais`);
  if (!resposta.ok) throw new Error(`painel respondeu ${resposta.status}`);
  const lista = (await resposta.json()) as MaterialDaApi[];
  return lista.map((m) => ({
    id: m.id,
    titulo: m.titulo,
    tipo: m.tipo,
    anos: m.anos,
    niveis: m.niveis,
    paginas: m.paginas,
    gratuito: m.gratuito,
    produtoIds: m.produtoIds,
    novo: Date.now() - new Date(m.criadoEm).getTime() < TRINTA_DIAS,
    descricao: m.descricao || 'Material publicado pelo painel do Mundo da Prô.',
    passos: [],
    capaUrl: m.capa ? `${base}${m.capa}` : undefined,
    capaProporcao: m.capaProporcao ?? undefined,
  }));
}

/**
 * Busca da home (D42) no painel, que enxerga o texto dos PDFs. Devolve a
 * pontuação por id; quem chama mescla com a busca local (título, tipo, ano).
 */
export async function buscarNoPainel(pergunta: string): Promise<Map<string, Pontuacao>> {
  const controle = new AbortController();
  const limite = setTimeout(() => controle.abort(), 6000);
  try {
    const resposta = await fetch(
      `${baseDoPainel()}/api/busca?q=${encodeURIComponent(pergunta)}`,
      { signal: controle.signal },
    );
    if (!resposta.ok) throw new Error(`painel respondeu ${resposta.status}`);
    const { resultados } = (await resposta.json()) as {
      resultados: (Pontuacao & { id: string })[];
    };
    return new Map(resultados.map(({ id, ...pontuacao }) => [id, pontuacao]));
  } finally {
    clearTimeout(limite);
  }
}

/**
 * Endereço do PDF de uma ferramenta (D44): o navegador do aparelho abre e baixa.
 * Os dados vão na URL (poucas palavras e o cabeçalho), com a mesma semente da prévia.
 */
export function urlDoPdfDaFerramenta(dados: object, baixar = true): string {
  const d = encodeURIComponent(JSON.stringify(dados));
  // baixar=0: o painel devolve "inline", para ver sem baixar (pré-visualizar, D46)
  return `${baseDoPainel()}/api/ferramentas/pdf?d=${d}${baixar ? '' : '&baixar=0'}`;
}

/** Quais materiais têm repertório de palavras para as ferramentas (D45), e quantas. */
export async function buscarRepertorios(): Promise<
  Record<string, { palavras: number; comDica: number }>
> {
  const resposta = await fetch(`${baseDoPainel()}/api/repertorio`);
  if (!resposta.ok) throw new Error(`painel respondeu ${resposta.status}`);
  return resposta.json();
}

/** Palavras (com dica de lacuna, quando há) tiradas do PDF de um material (D45). */
export async function buscarPalavrasDoMaterial(id: string): Promise<PalavraDaAtividade[]> {
  const resposta = await fetch(`${baseDoPainel()}/api/repertorio/${encodeURIComponent(id)}`);
  if (!resposta.ok) throw new Error(`painel respondeu ${resposta.status}`);
  return ((await resposta.json()) as { palavras: PalavraDaAtividade[] }).palavras;
}

/** Coleção da Vitrine em bloco (D47): volumes → módulos → ids dos PDFs. */
export interface CursoDaVitrine {
  produtoId: string;
  /** capa oficial da coleção (endereço completo), se houver */
  capaUrl: string | null;
  volumes: { nome: string; modulos: { nome: string; materialIds: string[] }[] }[];
}

export async function buscarCursos(): Promise<CursoDaVitrine[]> {
  const base = baseDoPainel();
  const resposta = await fetch(`${base}/api/cursos`);
  if (!resposta.ok) throw new Error(`painel respondeu ${resposta.status}`);
  const lista = (await resposta.json()) as (Omit<CursoDaVitrine, 'capaUrl'> & {
    capa: string | null;
  })[];
  return lista.map(({ capa, ...curso }) => ({ ...curso, capaUrl: capa ? `${base}${capa}` : null }));
}

/**
 * Miniatura de uma página da amostra do material (D49). O painel só gera até
 * PAGINAS_AMOSTRA; o PDF em si nunca sai de lá (regra de ouro 1).
 */
export function urlDaPagina(materialId: string, pagina: number, grande = false): string {
  return `${baseDoPainel()}/api/materiais/${encodeURIComponent(materialId)}/paginas/${pagina}${
    grande ? '?tamanho=grande' : ''
  }`;
}

export interface PaginasDoMaterial {
  total: number;
  /** o servidor conferiu sessão e posse e liberou todas */
  liberado: boolean;
  paginas: { numero: number; mini: string; grande: string }[];
}

/**
 * Páginas que ela pode ver na ficha (D50). Com sessão, manda o token e o painel
 * confere a posse no banco: libera todas (URLs assinadas, 30 min) ou só a amostra.
 */
export async function buscarPaginasDoMaterial(
  materialId: string,
  token: string | null,
): Promise<PaginasDoMaterial> {
  const base = baseDoPainel();
  const resposta = await fetch(`${base}/api/materiais/${encodeURIComponent(materialId)}/paginas`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!resposta.ok) throw new Error(`painel respondeu ${resposta.status}`);
  const dados = (await resposta.json()) as PaginasDoMaterial;
  return {
    ...dados,
    paginas: dados.paginas.map((p) => ({ ...p, mini: base + p.mini, grande: base + p.grande })),
  };
}
