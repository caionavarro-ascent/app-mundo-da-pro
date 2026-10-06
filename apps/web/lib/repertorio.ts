import { promises as fs } from "fs";
import path from "path";
import type { PalavraDaAtividade } from "@mdp/core";

/**
 * Repertório de palavras por material (D45), gerado por deploy/gerar-repertorio.sh
 * a partir do texto dos PDFs. Relido quando o arquivo muda.
 */

const ARQUIVO = path.join(process.cwd(), "dados", "repertorio-palavras.json");

let cache: { lido: number; porId: Record<string, PalavraDaAtividade[]> } = { lido: 0, porId: {} };

export async function repertorioPorMaterial(): Promise<Record<string, PalavraDaAtividade[]>> {
  try {
    const { mtimeMs } = await fs.stat(ARQUIVO);
    if (mtimeMs !== cache.lido) {
      cache = { lido: mtimeMs, porId: JSON.parse(await fs.readFile(ARQUIVO, "utf8")) };
    }
  } catch {
    // sem repertório gerado: nenhum material aparece na opção "a partir de um material"
  }
  return cache.porId;
}
