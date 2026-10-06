import { createHmac, timingSafeEqual } from "crypto";
import { criarClienteSupabase, entitlementValido, slugDoProdutoPeloId } from "@mdp/core";

import type { MaterialPainel } from "@/lib/dados-locais";

/**
 * Checagem de acesso no SERVIDOR (regra de ouro 4, D50). O app manda o token da
 * sessão; aqui se confere quem é no Supabase Auth e se tem posse em
 * `entitlements` (com a service_role, que nunca sai do servidor, regra 5).
 * Liberado, o servidor entrega URLs assinadas e curtas (regra 1), não o arquivo.
 */

function clienteDeServico() {
  // service_role: só em rota de servidor; ignora RLS para ler a posse de quem pediu
  return criarClienteSupabase(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

/** Quem é, pelo token "Authorization: Bearer <access_token>"; null se não veio ou não vale. */
export async function usuarioDoPedido(pedido: Request): Promise<string | null> {
  const token = pedido.headers.get("authorization")?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) return null;
  const { data, error } = await clienteDeServico().auth.getUser(token);
  return error || !data.user ? null : data.user.id;
}

/** Tem acesso: material gratuito, entitlement ativo de um dos produtos dele, ou o combo (D22). */
export async function temAcessoAoMaterial(
  usuario: string,
  material: MaterialPainel,
): Promise<boolean> {
  if (material.gratuito) return true;
  const { data, error } = await clienteDeServico()
    .from("entitlements")
    .select("expira_em, revogado_em, produto_id, produtos(slug, is_combo)")
    .eq("user_id", usuario);
  if (error || !data) return false;
  const slugsDoMaterial = new Set(material.produtoIds.map(slugDoProdutoPeloId));
  return data.filter((e) => entitlementValido(e)).some((e) => {
    const produto = e.produtos as unknown as { slug: string; is_combo: boolean } | null;
    return produto != null && (produto.is_combo || slugsDoMaterial.has(produto.slug));
  });
}

// ---------------------------------------------------------------------------
// URL assinada de página (curta): quem teve o acesso conferido recebe; vale 30 min
// ---------------------------------------------------------------------------

const VALIDADE_MS = 30 * 60 * 1000;

function assinar(conteudo: string): string {
  const segredo = process.env.PAGINAS_SEGREDO;
  if (!segredo) throw new Error("PAGINAS_SEGREDO não configurado no .env.local do painel");
  return createHmac("sha256", segredo).update(conteudo).digest("base64url");
}

/** Parâmetros "exp" e "sig" para a página n do material, válidos por 30 minutos. */
export function assinaturaDaPagina(materialId: string, pagina: number): string {
  const exp = Date.now() + VALIDADE_MS;
  return `exp=${exp}&sig=${assinar(`${materialId}|${pagina}|${exp}`)}`;
}

export function assinaturaValida(
  materialId: string,
  pagina: number,
  exp: string | null,
  sig: string | null,
): boolean {
  if (!exp || !sig || !/^\d+$/.test(exp) || Number(exp) < Date.now()) return false;
  const esperado = Buffer.from(assinar(`${materialId}|${pagina}|${exp}`));
  const recebido = Buffer.from(sig);
  return esperado.length === recebido.length && timingSafeEqual(esperado, recebido);
}
