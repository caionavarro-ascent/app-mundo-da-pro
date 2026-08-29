import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";

import {
  PASTA_ARQUIVOS,
  PASTA_CAPAS,
  listarMateriais,
  salvarMateriais,
  type MaterialPainel,
} from "@/lib/dados-locais";

export async function GET() {
  return NextResponse.json(await listarMateriais());
}

/** Upload do painel (D33): recebe o PDF + capa e texto extraídos no navegador. */
export async function POST(req: Request) {
  const formulario = await req.formData();
  const arquivo = formulario.get("arquivo");
  if (!(arquivo instanceof File) || !arquivo.name.toLowerCase().endsWith(".pdf")) {
    return NextResponse.json({ erro: "Envie um arquivo PDF." }, { status: 400 });
  }

  const bytes = Buffer.from(await arquivo.arrayBuffer());

  // confere o PDF e conta as páginas no servidor (pdf-lib)
  let paginas = 0;
  try {
    const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
    paginas = pdf.getPageCount();
  } catch {
    return NextResponse.json(
      { erro: `Não consegui ler "${arquivo.name}" como PDF.` },
      { status: 400 },
    );
  }

  const id = `m-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  await fs.mkdir(PASTA_ARQUIVOS, { recursive: true });
  await fs.writeFile(path.join(PASTA_ARQUIVOS, `${id}.pdf`), bytes);

  let capa: string | null = null;
  const capaEnviada = formulario.get("capa");
  if (capaEnviada instanceof File && capaEnviada.size > 0) {
    await fs.mkdir(PASTA_CAPAS, { recursive: true });
    await fs.writeFile(
      path.join(PASTA_CAPAS, `${id}.png`),
      Buffer.from(await capaEnviada.arrayBuffer()),
    );
    capa = `/demo-capas/${id}.png`;
  }

  const agora = new Date().toISOString();
  const material: MaterialPainel = {
    id,
    titulo: arquivo.name.replace(/\.pdf$/i, "").replace(/[-_]+/g, " ").trim(),
    descricao: "",
    tipo: null,
    anos: [],
    niveis: [],
    gratuito: false,
    status: "rascunho",
    paginas,
    arquivo: `${id}.pdf`,
    capa,
    textoExtraido: String(formulario.get("texto") ?? "").slice(0, 20000),
    criadoEm: agora,
    atualizadoEm: agora,
  };

  const lista = await listarMateriais();
  lista.unshift(material);
  await salvarMateriais(lista);

  return NextResponse.json(material, { status: 201 });
}
