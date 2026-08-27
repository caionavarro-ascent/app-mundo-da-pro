import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { AnoEscolar, NivelEscrita, TipoMaterial } from '@mdp/core';
import type { MaterialDemo } from '@mdp/core/src/mock/acervo';

/**
 * Estado do MVP de demonstração (D29): sessão simulada e filtros das pílulas.
 * Quando o Supabase entrar, a sessão vem do Auth e a posse de entitlements;
 * os filtros permanecem.
 */

interface EstadoDemo {
  nome: string;
  /** ids de produtos possuídos na demonstração */
  posse: string[];
  favoritos: Set<string>;
  alternarFavorito: (materialId: string) => void;
  // filtros das pílulas (A1)
  niveis: Set<NivelEscrita>;
  anos: Set<AnoEscolar>;
  tipos: Set<TipoMaterial>;
  alternarNivel: (n: NivelEscrita) => void;
  alternarAno: (a: AnoEscolar) => void;
  alternarTipo: (t: TipoMaterial) => void;
  limparFiltros: () => void;
  temFiltro: boolean;
  filtrar: (materiais: MaterialDemo[]) => MaterialDemo[];
}

const Contexto = createContext<EstadoDemo | null>(null);

function alternar<T>(conjunto: Set<T>, item: T): Set<T> {
  const novo = new Set(conjunto);
  if (novo.has(item)) novo.delete(item);
  else novo.add(item);
  return novo;
}

export function ProvedorDemo({ children }: { children: ReactNode }) {
  const [favoritos, setFavoritos] = useState<Set<string>>(new Set());
  const [niveis, setNiveis] = useState<Set<NivelEscrita>>(new Set());
  const [anos, setAnos] = useState<Set<AnoEscolar>>(new Set());
  const [tipos, setTipos] = useState<Set<TipoMaterial>>(new Set());

  const valor = useMemo<EstadoDemo>(() => {
    const temFiltro = niveis.size > 0 || anos.size > 0 || tipos.size > 0;
    return {
      nome: 'Ana',
      posse: ['educakits'],
      favoritos,
      alternarFavorito: (id) => setFavoritos((f) => alternar(f, id)),
      niveis,
      anos,
      tipos,
      alternarNivel: (n) => setNiveis((s) => alternar(s, n)),
      alternarAno: (a) => setAnos((s) => alternar(s, a)),
      alternarTipo: (t) => setTipos((s) => alternar(s, t)),
      limparFiltros: () => {
        setNiveis(new Set());
        setAnos(new Set());
        setTipos(new Set());
      },
      temFiltro,
      filtrar: (materiais) =>
        !temFiltro
          ? materiais
          : materiais.filter(
              (m) =>
                (niveis.size === 0 || m.niveis.some((n) => niveis.has(n))) &&
                (anos.size === 0 || m.anos.some((a) => anos.has(a))) &&
                (tipos.size === 0 || tipos.has(m.tipo)),
            ),
    };
  }, [favoritos, niveis, anos, tipos]);

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useDemo(): EstadoDemo {
  const contexto = useContext(Contexto);
  if (!contexto) throw new Error('useDemo precisa do ProvedorDemo no _layout raiz');
  return contexto;
}
