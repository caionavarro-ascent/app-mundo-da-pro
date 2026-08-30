import Constants from 'expo-constants';
import { Platform } from 'react-native';
import type { MaterialDemo } from '@mdp/core/src/mock/acervo';

/**
 * Ponte app ↔ painel sem banco (D33): busca os materiais PUBLICADOS no
 * /admin e os injeta no acervo da demo. Some quando o Supabase entrar.
 */

/** No web, o painel está em localhost; no aparelho, no IP do computador. */
export function baseDoPainel(): string {
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
  }));
}
