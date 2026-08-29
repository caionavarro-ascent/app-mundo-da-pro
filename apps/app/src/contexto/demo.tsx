import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { AnoEscolar, NivelEscrita, TipoMaterial } from '@mdp/core';
import type { DiaDaSemana, MaterialDemo } from '@mdp/core/src/mock/acervo';

/**
 * Estado do MVP de demonstração (D29): sessão simulada e filtros das pílulas.
 * Quando o Supabase entrar, a sessão vem do Auth e a posse de entitlements;
 * os filtros permanecem.
 */

/** Cenários do seletor de teste: simulam estados de posse da conta */
export const cenariosAcesso = [
  { id: 'nenhum', rotulo: 'Nenhum produto', descricao: 'Só os materiais gratuitos', posse: [] },
  {
    id: 'um',
    rotulo: '1 produto',
    descricao: 'Possui o EducaKits',
    posse: ['educakits'],
  },
  {
    id: 'dois',
    rotulo: '2 produtos',
    descricao: 'Possui EducaKits e Cadernos FlaEduca',
    posse: ['educakits', 'flaeduca'],
  },
  {
    id: 'fda',
    rotulo: 'Aluna do FDA',
    descricao: 'Possui EducaKits e a Formação Destrava Aluno',
    posse: ['educakits', 'fda'],
  },
  {
    id: 'total',
    rotulo: 'Acesso Total',
    descricao: 'O combo: tudo liberado',
    posse: ['acesso-total'],
  },
] as const;

export type CenarioAcesso = (typeof cenariosAcesso)[number]['id'];

interface EstadoDemo {
  nome: string;
  /** ids de produtos possuídos na demonstração */
  posse: string[];
  cenario: CenarioAcesso;
  definirCenario: (c: CenarioAcesso) => void;
  favoritos: Set<string>;
  alternarFavorito: (materialId: string) => void;
  buscasRecentes: string[];
  registrarBusca: (termo: string) => void;
  /** materiais já aplicados em cada turma (D30) */
  aplicadas: Record<string, Set<string>>;
  alternarAplicada: (turmaId: string, materialId: string) => void;
  /** materiais adicionados à mão em cada turma pelo botão Salvar */
  materiaisDaTurma: Record<string, Set<string>>;
  alternarMaterialDaTurma: (turmaId: string, materialId: string) => void;
  /** folha Salvar global: aberta pelo botão + ou pelo toque longo num card */
  materialSalvando: MaterialDemo | null;
  abrirSalvar: (material: MaterialDemo) => void;
  fecharSalvar: () => void;
  /** primeira abertura (A15): as três telas puláveis, uma vez por sessão */
  viuAbertura: boolean;
  concluirAbertura: () => void;
  /** plano da semana por turma (D30) — espelha a tabela plano_semana */
  plano: Record<string, Partial<Record<DiaDaSemana, string[]>>>;
  adicionarAoPlano: (turmaId: string, dia: DiaDaSemana, materialId: string) => void;
  removerDoPlano: (turmaId: string, dia: DiaDaSemana, materialId: string) => void;
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
  // "Aluna do FDA" como padrão da demo: as aulas já abrem destravadas
  const [cenario, setCenario] = useState<CenarioAcesso>('fda');
  const [favoritos, setFavoritos] = useState<Set<string>>(new Set());
  const [buscasRecentes, setBuscasRecentes] = useState<string[]>([]);
  const [aplicadas, setAplicadas] = useState<Record<string, Set<string>>>({
    // a demo começa com algumas atividades já passadas na 1º ano A
    'turma-1a': new Set(['bingo-sons', 'alfabeto-movel']),
  });
  const [materiaisDaTurma, setMateriaisDaTurma] = useState<Record<string, Set<string>>>(
    {},
  );
  const [materialSalvando, setMaterialSalvando] = useState<MaterialDemo | null>(null);
  const [viuAbertura, setViuAbertura] = useState(false);
  const [plano, setPlano] = useState<
    Record<string, Partial<Record<DiaDaSemana, string[]>>>
  >({
    'turma-2b': { seg: ['trilha-leitura'], qua: ['jogo-forca-silabas'] },
  });
  const [niveis, setNiveis] = useState<Set<NivelEscrita>>(new Set());
  const [anos, setAnos] = useState<Set<AnoEscolar>>(new Set());
  const [tipos, setTipos] = useState<Set<TipoMaterial>>(new Set());

  const valor = useMemo<EstadoDemo>(() => {
    const temFiltro = niveis.size > 0 || anos.size > 0 || tipos.size > 0;
    return {
      nome: 'Ana',
      posse: [...(cenariosAcesso.find((c) => c.id === cenario)?.posse ?? [])],
      cenario,
      definirCenario: setCenario,
      favoritos,
      alternarFavorito: (id) => setFavoritos((f) => alternar(f, id)),
      plano,
      adicionarAoPlano: (turmaId, dia, materialId) =>
        setPlano((atual) => {
          const daTurma = atual[turmaId] ?? {};
          const doDia = daTurma[dia] ?? [];
          if (doDia.includes(materialId)) return atual;
          return { ...atual, [turmaId]: { ...daTurma, [dia]: [...doDia, materialId] } };
        }),
      removerDoPlano: (turmaId, dia, materialId) =>
        setPlano((atual) => {
          const daTurma = atual[turmaId] ?? {};
          return {
            ...atual,
            [turmaId]: {
              ...daTurma,
              [dia]: (daTurma[dia] ?? []).filter((id) => id !== materialId),
            },
          };
        }),
      materialSalvando,
      abrirSalvar: setMaterialSalvando,
      fecharSalvar: () => setMaterialSalvando(null),
      viuAbertura,
      concluirAbertura: () => setViuAbertura(true),
      materiaisDaTurma,
      alternarMaterialDaTurma: (turmaId, materialId) =>
        setMateriaisDaTurma((atual) => ({
          ...atual,
          [turmaId]: alternar(atual[turmaId] ?? new Set(), materialId),
        })),
      aplicadas,
      alternarAplicada: (turmaId, materialId) =>
        setAplicadas((atual) => ({
          ...atual,
          [turmaId]: alternar(atual[turmaId] ?? new Set(), materialId),
        })),
      buscasRecentes,
      registrarBusca: (termo) => {
        const limpo = termo.trim();
        if (!limpo) return;
        setBuscasRecentes((lista) => [
          limpo,
          ...lista.filter((t) => t.toLowerCase() !== limpo.toLowerCase()),
        ].slice(0, 8));
      },
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
  }, [
    cenario,
    favoritos,
    buscasRecentes,
    aplicadas,
    materiaisDaTurma,
    materialSalvando,
    viuAbertura,
    plano,
    niveis,
    anos,
    tipos,
  ]);

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useDemo(): EstadoDemo {
  const contexto = useContext(Contexto);
  if (!contexto) throw new Error('useDemo precisa do ProvedorDemo no _layout raiz');
  return contexto;
}
