import { promises as fs } from "fs";
import path from "path";
import { NextResponse, type NextRequest } from "next/server";
import { interpretarPergunta, pontuarMaterial } from "@mdp/core";

import { listarMateriais } from "@/lib/dados-locais";

/**
 * Busca da home (D42): pontua os materiais PUBLICADOS com o mesmo motor do app
 * (packages/core/src/busca.ts), mas aqui enxerga também o texto dos PDFs.
 * Devolve só id + pontuação: as fichas o app já tem de /api/materiais.
 */

const ARQUIVO_TEXTOS = path.join(process.cwd(), "dados", "textos-busca.json");

// índice gerado por deploy/indexar-textos.sh; relido quando o arquivo muda
let textos: { lido: number; porId: Record<string, string> } = { lido: 0, porId: {} };
async function textosDosPdfs(): Promise<Record<string, string>> {
  try {
    const { mtimeMs } = await fs.stat(ARQUIVO_TEXTOS);
    if (mtimeMs !== textos.lido) {
      textos = { lido: mtimeMs, porId: JSON.parse(await fs.readFile(ARQUIVO_TEXTOS, "utf8")) };
    }
  } catch {
    // sem índice: a busca segue com título e descrição
  }
  return textos.porId;
}

export async function GET(pedido: NextRequest) {
  const pergunta = (pedido.nextUrl.searchParams.get("q") ?? "").slice(0, 200);
  const consulta = interpretarPergunta(pergunta);
  const porId = await textosDosPdfs();

  const resultados = (await listarMateriais())
    .filter((m) => m.status === "publicado")
    .map((m) => ({
      id: m.id,
      ...pontuarMaterial(
        {
          titulo: m.titulo,
          descricao: m.descricao,
          tipo: m.tipo ?? "atividade",
          anos: m.anos,
          niveis: m.niveis,
          texto: m.textoExtraido || porId[m.id],
        },
        consulta,
      ),
    }))
    .filter((r) => r.pontos > 0)
    .sort((a, b) => b.pontos - a.pontos)
    .slice(0, 60);

  return NextResponse.json(
    { consulta, resultados },
    {
      headers: {
        // o app roda em outra origem (localhost:8081 / Expo Go / :8082)
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-store",
      },
    },
  );
}
