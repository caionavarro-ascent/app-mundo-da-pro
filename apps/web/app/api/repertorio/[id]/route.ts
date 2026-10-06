import { NextResponse } from "next/server";

import { materialPorId } from "@/lib/dados-locais";
import { repertorioPorMaterial } from "@/lib/repertorio";

/** Palavras (e dicas de lacuna) de um material, para sortear versões da atividade (D45). */
export async function GET(_pedido: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const material = await materialPorId(id);
  const palavras = material?.status === "publicado" ? (await repertorioPorMaterial())[id] : undefined;
  if (!palavras) {
    return NextResponse.json(
      { erro: "Material sem repertório." },
      { status: 404, headers: { "Access-Control-Allow-Origin": "*" } },
    );
  }
  return NextResponse.json(
    { id, palavras },
    { headers: { "Access-Control-Allow-Origin": "*", "Cache-Control": "no-store" } },
  );
}
