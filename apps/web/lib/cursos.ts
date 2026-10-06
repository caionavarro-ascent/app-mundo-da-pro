import { promises as fs } from "fs";
import path from "path";

import { listarMateriais, type MaterialPainel } from "@/lib/dados-locais";

/**
 * Estrutura das coleções para a Vitrine (D47): produto → volumes → módulos → PDFs.
 * - Módulo: o começo do título ("Roteiro Colorido — …"), que a importação tirou da pasta
 *   de cada PDF. O mapa de arquivos (dados/mapa-arquivos.json, Release painel-dados)
 *   NÃO serve para isso: 51 PDFs do Imagine 1 são cópias idênticas em 2 a 4 pastas, e o
 *   mapa guardou uma só. Sem " — " no título, vale a pasta do mapa (Cube: "2º ANO").
 * - Volume (Imagine 1 / Imagine 2) e a ordem dos módulos ("01 - VIVIANA…") vêm do mapa.
 * Material subido depois pelo /admin, fora do mapa, entra só pelo título.
 */

export interface ModuloDoCurso {
  nome: string;
  materialIds: string[];
}

export interface VolumeDoCurso {
  nome: string;
  modulos: ModuloDoCurso[];
}

export interface CursoDaVitrine {
  produtoId: string;
  /** capa oficial da coleção, se houver em public/capas-colecoes/<produto>.(png|jpg|webp) */
  capa: string | null;
  volumes: VolumeDoCurso[];
}

const PASTA = path.join(process.cwd(), "dados");
const PASTA_CAPAS_COLECOES = path.join(process.cwd(), "public", "capas-colecoes");
const SEM_MODULO = "Todos os PDFs";

// palavras que ficam minúsculas no meio do nome ("Viviana, Rainha do Pijama")
const MINUSCULAS = new Set(["de", "da", "do", "das", "dos", "e", "a", "o", "as", "os", "à", "às", "ao", "com", "no", "na", "em", "para", "por"]);

/** "01 - VIVIANA, RAINHA DO PIJAMA" → "Viviana, Rainha do Pijama"; "2º ANO" → "2º ano". */
export function nomeDaPasta(pasta: string): string {
  const sem = pasta.replace(/^\s*\d+\s*-\s*/, "").trim();
  if (sem !== sem.toUpperCase()) return sem;
  return sem
    .toLowerCase()
    .split(" ")
    .map((p, i) => (i > 0 && MINUSCULAS.has(p) ? p : p.charAt(0).toUpperCase() + p.slice(1)))
    .join(" ")
    .replace(/^(\d+º) Ano$/i, "$1 ano");
}

const comparar = (a: string, b: string) => a.localeCompare(b, "pt-BR", { numeric: true });

/** chave para casar "Aventuras No Jardim" (título) com "02 - AVENTURAS NO JARDIM" (pasta) */
const chaveDeNome = (nome: string) =>
  nomeDaPasta(nome)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

/**
 * Das pastas do mapa: a posição do módulo pela numeração ("02 - …" → 2; sem número, vai
 * para o fim) e o nome limpo da pasta, melhor que o do título ("Aventuras No Jardim").
 */
function pastasConhecidas(origensPorId: Map<string, Origem>) {
  const ordem = new Map<string, number>();
  const nome = new Map<string, string>();
  for (const { modulo } of origensPorId.values()) {
    if (!modulo) continue;
    nome.set(chaveDeNome(modulo), nomeDaPasta(modulo));
    const numero = modulo.match(/^\s*(\d+)\s*-/);
    if (numero) ordem.set(chaveDeNome(modulo), Number(numero[1]));
  }
  return { ordem, nome };
}

interface Origem {
  volume: string;
  modulo: string;
  arquivo: string;
}

async function origens(): Promise<Map<string, Origem>> {
  const porId = new Map<string, Origem>();
  try {
    const mapa = JSON.parse(await fs.readFile(path.join(PASTA, "mapa-arquivos.json"), "utf8")) as {
      itens: { arquivo: string; origem: string }[];
    };
    for (const item of mapa.itens) {
      const id = path.basename(item.arquivo, ".pdf");
      const partes = item.origem.split("/cursos/")[1]?.split("/") ?? [];
      if (partes.length < 2) continue;
      porId.set(id, {
        volume: partes[0],
        modulo: partes.length > 2 ? partes[1] : "",
        arquivo: partes[partes.length - 1],
      });
    }
  } catch {
    // sem mapa: tudo entra pelo título
  }
  return porId;
}

async function capaDaColecao(produtoId: string): Promise<string | null> {
  for (const ext of ["png", "jpg", "jpeg", "webp"]) {
    try {
      await fs.access(path.join(PASTA_CAPAS_COLECOES, `${produtoId}.${ext}`));
      return `/capas-colecoes/${produtoId}.${ext}`;
    } catch {
      // tenta a próxima extensão
    }
  }
  return null;
}

export async function cursosDaVitrine(): Promise<CursoDaVitrine[]> {
  const porId = await origens();
  const { ordem, nome } = pastasConhecidas(porId);
  const posicao = (modulo: string) => ordem.get(chaveDeNome(modulo)) ?? Number.MAX_SAFE_INTEGER;
  const publicados = (await listarMateriais()).filter((m) => m.status === "publicado");

  // produto → volume → módulo → [material, chave de ordem]
  const arvore = new Map<string, Map<string, Map<string, [MaterialPainel, string][]>>>();
  for (const m of publicados) {
    const produtoId = m.produtoIds[0];
    if (!produtoId) continue;
    const origem = porId.get(m.id);
    const [doTitulo, ...resto] = m.titulo.split(" — ");
    const volume = origem?.volume ?? "";
    const bruto = resto.length > 0 ? doTitulo.trim() : (origem?.modulo ?? "");
    // mesmo módulo escrito de jeitos diferentes ("Notícia" em NFC e NFD, caixa) vira um só
    const modulo = bruto ? (nome.get(chaveDeNome(bruto)) ?? bruto.normalize("NFC")) : "";
    const chave = origem?.arquivo ?? m.titulo;

    const volumes = arvore.get(produtoId) ?? new Map();
    arvore.set(produtoId, volumes);
    const modulos = volumes.get(volume) ?? new Map();
    volumes.set(volume, modulos);
    const lista = modulos.get(modulo) ?? [];
    modulos.set(modulo, lista);
    lista.push([m, chave]);
  }

  const cursos: CursoDaVitrine[] = [];
  for (const [produtoId, volumes] of arvore) {
    cursos.push({
      produtoId,
      capa: await capaDaColecao(produtoId),
      volumes: [...volumes.entries()]
        .sort(([a], [b]) => comparar(a, b))
        .map(([volume, modulos]) => ({
          nome: volume ? nomeDaPasta(volume) : "",
          modulos: [...modulos.entries()]
            .sort(([a], [b]) =>
              a === "" ? 1 : b === "" ? -1 : posicao(a) - posicao(b) || comparar(a, b),
            )
            .map(([modulo, itens]) => ({
              nome: modulo ? nomeDaPasta(modulo) : SEM_MODULO,
              materialIds: itens.sort(([, a], [, b]) => comparar(a, b)).map(([m]) => m.id),
            })),
        })),
    });
  }
  return cursos;
}
