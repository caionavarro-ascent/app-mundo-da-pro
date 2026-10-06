import { NextResponse, type NextRequest } from "next/server";
import {
  gerarCacaPalavras,
  gerarCruzadinha,
  type CabecalhoDaFolha,
  type NivelCacaPalavras,
  type PalavraDaAtividade,
} from "@mdp/core";

import { pdfDaCruzadinha, pdfDoCacaPalavras } from "@/lib/pdf-atividades";

/**
 * PDF das ferramentas Cruzadinha e Caça-palavras (D44). GET com os dados na
 * URL (`?d=<json>`) para o app abrir direto no navegador do aparelho, que
 * baixa o arquivo. A semente vem do app: o PDF sai igual à prévia da tela.
 */

interface Pedido {
  tipo: "cruzadinha" | "caca-palavras";
  titulo?: string;
  cabecalho?: Partial<CabecalhoDaFolha>;
  palavras?: PalavraDaAtividade[];
  nivel?: NivelCacaPalavras;
  semente?: number;
  gabarito?: boolean;
}

const MAXIMO_PALAVRAS = 20;
const texto = (valor: unknown, maximo: number) =>
  typeof valor === "string" ? valor.slice(0, maximo) : "";

function erro(mensagem: string) {
  return NextResponse.json({ erro: mensagem }, { status: 400 });
}

export async function GET(pedido: NextRequest) {
  let dados: Pedido;
  try {
    dados = JSON.parse(pedido.nextUrl.searchParams.get("d") ?? "");
  } catch {
    return erro("Pedido inválido.");
  }
  if (dados.tipo !== "cruzadinha" && dados.tipo !== "caca-palavras") return erro("Tipo inválido.");

  const palavras = (Array.isArray(dados.palavras) ? dados.palavras : [])
    .slice(0, MAXIMO_PALAVRAS)
    .map((p) => ({ palavra: texto(p?.palavra, 20), dica: texto(p?.dica, 140) || undefined }))
    .filter((p) => p.palavra.trim());
  if (palavras.length < 2) return erro("Escolha pelo menos 2 palavras.");

  const cabecalho: CabecalhoDaFolha = {
    escola: texto(dados.cabecalho?.escola, 80),
    professora: texto(dados.cabecalho?.professora, 60),
    turma: texto(dados.cabecalho?.turma, 30),
  };
  const semente = Number.isFinite(dados.semente) ? Number(dados.semente) : 1;
  const gabarito = dados.gabarito !== false;
  const nivel: NivelCacaPalavras = ["facil", "medio", "dificil"].includes(dados.nivel as string)
    ? (dados.nivel as NivelCacaPalavras)
    : "facil";

  let bytes: Uint8Array;
  let nomeArquivo: string;
  if (dados.tipo === "cruzadinha") {
    const titulo = texto(dados.titulo, 60).trim() || "Cruzadinha";
    bytes = await pdfDaCruzadinha({
      titulo,
      cabecalho,
      cruzadinha: gerarCruzadinha(palavras, semente),
      gabarito,
    });
    nomeArquivo = "cruzadinha";
  } else {
    const titulo = texto(dados.titulo, 60).trim() || "Caça-palavras";
    bytes = await pdfDoCacaPalavras({
      titulo,
      cabecalho,
      caca: gerarCacaPalavras(
        palavras.map((p) => p.palavra),
        nivel,
        semente,
      ),
      gabarito,
    });
    nomeArquivo = "caca-palavras";
  }

  const baixar = pedido.nextUrl.searchParams.get("baixar") !== "0";
  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${baixar ? "attachment" : "inline"}; filename="${nomeArquivo}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
