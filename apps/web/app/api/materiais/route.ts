import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

import { listarMateriais, PASTA_CAPAS } from "@/lib/dados-locais";

/** altura ÷ largura da capa, lida do cabeçalho do PNG (mosaico da home, D43) */
async function proporcaoDaCapa(capa: string | null): Promise<number | null> {
  if (!capa) return null;
  try {
    const arquivo = await fs.open(
      path.join(PASTA_CAPAS, path.basename(capa)),
      "r",
    );
    try {
      const { buffer } = await arquivo.read(Buffer.alloc(24), 0, 24, 0);
      const largura = buffer.readUInt32BE(16);
      const altura = buffer.readUInt32BE(20);
      return largura > 0 ? Math.round((altura / largura) * 100) / 100 : null;
    } finally {
      await arquivo.close();
    }
  } catch {
    return null;
  }
}

/**
 * API pública do painel sem banco (D33): o app da professora consome os
 * materiais PUBLICADOS daqui. Com o Supabase, esta rota morre e o app
 * lê direto do banco.
 */
export async function GET() {
  const publicados = await Promise.all(
    (await listarMateriais())
      .filter((m) => m.status === "publicado")
      .map(async (m) => ({
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
        capaProporcao: await proporcaoDaCapa(m.capa),
        criadoEm: m.criadoEm,
      })),
  );

  return NextResponse.json(publicados, {
    headers: {
      // o app roda em outra origem (localhost:8081 / Expo Go)
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-store",
    },
  });
}
