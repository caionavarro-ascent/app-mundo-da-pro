import { NextResponse } from "next/server";

import { listarMateriais } from "@/lib/dados-locais";

/**
 * API pública do painel sem banco (D33): o app da professora consome os
 * materiais PUBLICADOS daqui. Com o Supabase, esta rota morre e o app
 * lê direto do banco.
 */
export async function GET() {
  const publicados = (await listarMateriais())
    .filter((m) => m.status === "publicado")
    .map((m) => ({
      id: m.id,
      titulo: m.titulo,
      descricao: m.descricao,
      tipo: m.tipo ?? "atividade",
      anos: m.anos,
      niveis: m.niveis,
      paginas: m.paginas,
      gratuito: m.gratuito,
      produtoIds: m.produtoIds.length > 0 ? m.produtoIds : ["avulsos"],
      capa: m.capa,
      criadoEm: m.criadoEm,
    }));

  return NextResponse.json(publicados, {
    headers: {
      // o app roda em outra origem (localhost:8081 / Expo Go)
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-store",
    },
  });
}
