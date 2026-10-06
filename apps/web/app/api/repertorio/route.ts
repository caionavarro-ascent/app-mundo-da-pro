import { NextResponse } from "next/server";

import { listarMateriais } from "@/lib/dados-locais";
import { repertorioPorMaterial } from "@/lib/repertorio";

/**
 * Materiais que servem de base para Cruzadinha e Caça-palavras (D45): só os
 * publicados com repertório gerado. Título e capa o app já tem de /api/materiais.
 */
export async function GET() {
  const repertorio = await repertorioPorMaterial();
  const resumo: Record<string, { palavras: number; comDica: number }> = {};
  for (const m of await listarMateriais()) {
    const lista = repertorio[m.id];
    if (m.status !== "publicado" || !lista) continue;
    resumo[m.id] = { palavras: lista.length, comDica: lista.filter((p) => p.dica).length };
  }
  return NextResponse.json(resumo, {
    headers: { "Access-Control-Allow-Origin": "*", "Cache-Control": "no-store" },
  });
}
