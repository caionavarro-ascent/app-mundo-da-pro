import { promises as fs } from "fs";
import path from "path";
import type { AnoEscolar, NivelEscrita, TipoMaterial } from "@mdp/core";

/**
 * Armazém do painel sem banco (D33): um JSON com as fichas e pastas para os
 * arquivos. Toda esta camada é substituída pelo Supabase no Bloco 1 — as
 * telas do painel não sabem a diferença.
 */

export interface MaterialPainel {
  id: string;
  titulo: string;
  descricao: string;
  tipo: TipoMaterial | null;
  anos: AnoEscolar[];
  niveis: NivelEscrita[];
  gratuito: boolean;
  status: "rascunho" | "publicado";
  paginas: number;
  arquivo: string; // nome do PDF em dados/arquivos
  capa: string | null; // caminho público da capa, ex.: /demo-capas/{id}.png
  textoExtraido: string;
  criadoEm: string;
  atualizadoEm: string;
}

const PASTA_DADOS = path.join(process.cwd(), "dados");
const ARQUIVO_INDICE = path.join(PASTA_DADOS, "materiais.json");
export const PASTA_ARQUIVOS = path.join(PASTA_DADOS, "arquivos");
export const PASTA_CAPAS = path.join(process.cwd(), "public", "demo-capas");

async function garantirPastas(): Promise<void> {
  await fs.mkdir(PASTA_ARQUIVOS, { recursive: true });
  await fs.mkdir(PASTA_CAPAS, { recursive: true });
}

export async function listarMateriais(): Promise<MaterialPainel[]> {
  try {
    const bruto = await fs.readFile(ARQUIVO_INDICE, "utf8");
    return JSON.parse(bruto) as MaterialPainel[];
  } catch {
    return [];
  }
}

export async function salvarMateriais(lista: MaterialPainel[]): Promise<void> {
  await garantirPastas();
  await fs.writeFile(ARQUIVO_INDICE, JSON.stringify(lista, null, 2), "utf8");
}

export async function materialPorId(id: string): Promise<MaterialPainel | undefined> {
  return (await listarMateriais()).find((m) => m.id === id);
}

export async function atualizarMaterial(
  id: string,
  mudancas: Partial<MaterialPainel>,
): Promise<MaterialPainel | undefined> {
  const lista = await listarMateriais();
  const indice = lista.findIndex((m) => m.id === id);
  if (indice < 0) return undefined;
  lista[indice] = {
    ...lista[indice],
    ...mudancas,
    id,
    atualizadoEm: new Date().toISOString(),
  };
  await salvarMateriais(lista);
  return lista[indice];
}
