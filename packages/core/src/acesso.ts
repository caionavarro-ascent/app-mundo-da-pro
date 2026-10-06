/**
 * Regras de acesso — espelho em TypeScript da função SQL `tem_acesso`.
 *
 * ATENÇÃO (regra de ouro 4): isto serve SOMENTE para decidir o que a
 * interface mostra (cadeado, botão). A checagem real de acesso acontece no
 * servidor, na hora de gerar a URL assinada. Nunca use este módulo para
 * liberar arquivo.
 */

export interface EntitlementAtivo {
  produto_id: string;
  expira_em: string | null;
  revogado_em: string | null;
}

export function entitlementValido(e: EntitlementAtivo, agora = new Date()): boolean {
  if (e.revogado_em) return false;
  if (e.expira_em && new Date(e.expira_em) <= agora) return false;
  return true;
}

export interface MaterialParaAcesso {
  gratuito: boolean;
  produto_ids: string[];
}

/**
 * Decide se a interface mostra o material como liberado.
 * `possuiCombo` cobre o Acesso Total: quem tem o combo vê tudo liberado
 * (decisão D22 — o combo é tratado na regra, não em vínculos por material).
 */
export function pareceLiberado(
  material: MaterialParaAcesso,
  entitlements: EntitlementAtivo[],
  possuiCombo: boolean,
  agora = new Date(),
): boolean {
  if (material.gratuito) return true;
  if (possuiCombo) return true;
  const ativos = new Set(
    entitlements.filter((e) => entitlementValido(e, agora)).map((e) => e.produto_id),
  );
  return material.produto_ids.some((id) => ativos.has(id));
}

/**
 * Páginas da amostra: as que qualquer pessoa vê na ficha do material, comprado ou não
 * (A10, PRD "Preview"). O servidor só gera miniatura até aqui (D49); virá de
 * `configuracoes.paginas_amostra` quando o painel for para o Supabase.
 */
export const PAGINAS_AMOSTRA = 2;

/**
 * Produto do banco (slug em `produtos`) → id do produto no acervo do app (D50).
 * O painel e a demo usam ids curtos; o Supabase, os slugs da migration.
 */
const ID_DO_SLUG: Record<string, string> = {
  'colecao-imagine': 'imagine',
  'cadernos-flaeduca': 'flaeduca',
  'materiais-avulsos': 'avulsos',
  'bncc-de-bolso': 'bncc',
};

export function idDoProdutoPeloSlug(slug: string): string {
  return ID_DO_SLUG[slug] ?? slug;
}

export function slugDoProdutoPeloId(id: string): string {
  return Object.entries(ID_DO_SLUG).find(([, valor]) => valor === id)?.[0] ?? id;
}
