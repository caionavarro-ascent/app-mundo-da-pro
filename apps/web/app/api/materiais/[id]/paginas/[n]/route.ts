import { execFile } from "child_process";
import { promises as fs } from "fs";
import path from "path";
import { promisify } from "util";
import { NextResponse } from "next/server";
import { PAGINAS_AMOSTRA } from "@mdp/core";

import { assinaturaValida } from "@/lib/acesso-servidor";
import { materialPorId, PASTA_ARQUIVOS } from "@/lib/dados-locais";

/**
 * Miniatura de uma página do material, para a prévia da ficha (D49).
 * Regra de ouro 1: o PDF nunca sai daqui, só imagem de página. A amostra
 * (PAGINAS_AMOSTRA) é pública; além dela, só com a assinatura curta que
 * /api/materiais/[id]/paginas entrega depois de conferir sessão e posse (D50).
 * Gerada uma vez com pdftoppm e guardada em dados/miniaturas.
 */

const rodar = promisify(execFile);
const PASTA_MINIATURAS = path.join(process.cwd(), "dados", "miniaturas");
const TAMANHOS = { mini: 360, grande: 1100 } as const;

const naoTem = (mensagem: string) =>
  NextResponse.json(
    { erro: mensagem },
    { status: 404, headers: { "Access-Control-Allow-Origin": "*" } },
  );

export async function GET(
  pedido: Request,
  { params }: { params: Promise<{ id: string; n: string }> },
) {
  const { id, n } = await params;
  const pagina = Number(n);
  const busca = new URL(pedido.url).searchParams;
  const tamanho = busca.get("tamanho") === "grande" ? "grande" : "mini";
  if (!/^[a-z0-9-]+$/i.test(id) || !Number.isInteger(pagina) || pagina < 1) {
    return naoTem("Página inválida.");
  }
  if (pagina > PAGINAS_AMOSTRA && !assinaturaValida(id, pagina, busca.get("exp"), busca.get("sig"))) {
    return naoTem("Fora da amostra.");
  }

  const material = await materialPorId(id);
  if (!material || material.status !== "publicado" || pagina > material.paginas) {
    return naoTem("Material ou página não encontrado.");
  }

  const destino = path.join(PASTA_MINIATURAS, `${id}-${pagina}-${tamanho}.png`);
  try {
    await fs.access(destino);
  } catch {
    await fs.mkdir(PASTA_MINIATURAS, { recursive: true });
    const prefixo = destino.slice(0, -4);
    try {
      await rodar(
        "pdftoppm",
        [
          "-f", String(pagina), "-l", String(pagina), "-singlefile", "-png",
          "-scale-to", String(TAMANHOS[tamanho]),
          path.join(PASTA_ARQUIVOS, material.arquivo), prefixo,
        ],
        { timeout: 20000 },
      );
    } catch {
      return naoTem("Não foi possível gerar a página.");
    }
  }

  return new NextResponse(new Uint8Array(await fs.readFile(destino)), {
    headers: {
      "Content-Type": "image/png",
      // amostra: cache público; página liberada: só no aparelho de quem pediu
      "Cache-Control": pagina > PAGINAS_AMOSTRA ? "private, max-age=1800" : "public, max-age=86400",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
