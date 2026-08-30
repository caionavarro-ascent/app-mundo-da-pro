import { NextResponse } from "next/server";

import { atualizarMaterial, materialPorId } from "@/lib/dados-locais";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const material = await materialPorId(id);
  if (!material) return NextResponse.json({ erro: "Não encontrado." }, { status: 404 });
  return NextResponse.json(material);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const mudancas = await req.json();
  // só os campos editáveis da ficha passam
  const permitidos = [
    "titulo",
    "descricao",
    "tipo",
    "anos",
    "niveis",
    "gratuito",
    "produtoIds",
    "status",
  ] as const;
  const filtradas = Object.fromEntries(
    Object.entries(mudancas).filter(([chave]) =>
      (permitidos as readonly string[]).includes(chave),
    ),
  );
  const material = await atualizarMaterial(id, filtradas);
  if (!material) return NextResponse.json({ erro: "Não encontrado." }, { status: 404 });
  return NextResponse.json(material);
}
