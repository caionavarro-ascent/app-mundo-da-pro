import { NextResponse } from "next/server";
import { PAGINAS_AMOSTRA } from "@mdp/core";

import { assinaturaDaPagina, temAcessoAoMaterial, usuarioDoPedido } from "@/lib/acesso-servidor";
import { materialPorId } from "@/lib/dados-locais";

/**
 * Quais páginas ela pode ver na prévia da ficha (D50). Sem sessão ou sem posse: só
 * a amostra. Com sessão e posse conferidas AQUI (regra de ouro 4): todas, cada uma
 * com URL assinada que vale 30 minutos. O app nunca decide isso sozinho.
 */

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export async function GET(pedido: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const material = await materialPorId(id);
  if (!material || material.status !== "publicado") {
    return NextResponse.json({ erro: "Material não encontrado." }, { status: 404, headers: CORS });
  }

  const usuario = await usuarioDoPedido(pedido);
  const liberado = usuario != null && (await temAcessoAoMaterial(usuario, material));
  const quantas = liberado ? material.paginas : Math.min(material.paginas, PAGINAS_AMOSTRA);

  const paginas = Array.from({ length: quantas }, (_, i) => {
    const n = i + 1;
    const base = `/api/materiais/${id}/paginas/${n}`;
    // a amostra é pública; além dela, só com assinatura
    const assinatura = n > PAGINAS_AMOSTRA ? assinaturaDaPagina(id, n) : "";
    return {
      numero: n,
      mini: assinatura ? `${base}?${assinatura}` : base,
      grande: `${base}?tamanho=grande${assinatura ? `&${assinatura}` : ""}`,
    };
  });

  return NextResponse.json(
    { total: material.paginas, liberado, paginas },
    { headers: { ...CORS, "Cache-Control": "no-store" } },
  );
}
