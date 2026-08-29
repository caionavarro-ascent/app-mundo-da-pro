"use client";

import Link from "next/link";
import { useRef, useState } from "react";

interface ItemFila {
  nome: string;
  estado: "processando" | "enviado" | "erro";
  detalhe?: string;
}

/**
 * Upload do painel (B2, versão D33): a capa e o texto saem do navegador via
 * pdfjs; o servidor confere as páginas e grava. Com o Supabase, este
 * processamento migra inteiro para o servidor.
 */
export default function UploadPdfs() {
  const [fila, setFila] = useState<ItemFila[]>([]);
  const [arrastando, setArrastando] = useState(false);
  const entrada = useRef<HTMLInputElement>(null);

  async function processar(arquivos: FileList | File[]) {
    for (const arquivo of Array.from(arquivos)) {
      if (!arquivo.name.toLowerCase().endsWith(".pdf")) continue;
      setFila((f) => [...f, { nome: arquivo.name, estado: "processando" }]);
      const marcar = (estado: ItemFila["estado"], detalhe?: string) =>
        setFila((f) =>
          f.map((i) => (i.nome === arquivo.name ? { ...i, estado, detalhe } : i)),
        );

      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
        const dados = await arquivo.arrayBuffer();
        const pdf = await pdfjs.getDocument({ data: dados.slice(0) }).promise;

        // capa: página 1 renderizada em cartaz
        const pagina = await pdf.getPage(1);
        const escala = 600 / pagina.getViewport({ scale: 1 }).width;
        const viewport = pagina.getViewport({ scale: escala });
        const tela = document.createElement("canvas");
        tela.width = viewport.width;
        tela.height = viewport.height;
        const contexto = tela.getContext("2d")!;
        await pagina.render({ canvas: tela, canvasContext: contexto, viewport }).promise;
        const capa: Blob = await new Promise((resolver) =>
          tela.toBlob((b) => resolver(b!), "image/png"),
        );

        // texto das 5 primeiras páginas, para a curadoria e a IA
        let texto = "";
        for (let n = 1; n <= Math.min(5, pdf.numPages); n++) {
          const p = await pdf.getPage(n);
          const conteudo = await p.getTextContent();
          texto +=
            conteudo.items
              .map((item) => ("str" in item ? item.str : ""))
              .join(" ") + "\n";
        }

        const formulario = new FormData();
        formulario.append("arquivo", arquivo);
        formulario.append("capa", capa, "capa.png");
        formulario.append("texto", texto.trim());

        const resposta = await fetch("/api/admin/materiais", {
          method: "POST",
          body: formulario,
        });
        if (!resposta.ok) {
          const corpo = await resposta.json().catch(() => ({}));
          throw new Error(corpo.erro ?? `Falha no envio (${resposta.status}).`);
        }
        marcar("enviado", `${pdf.numPages} páginas`);
      } catch (erro) {
        marcar("erro", erro instanceof Error ? erro.message : "Erro inesperado.");
      }
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-8">
      <header>
        <Link href="/admin" className="text-sm font-semibold text-tinta-clara">
          ← Materiais
        </Link>
        <h1 className="mt-1 text-3xl font-semibold text-tinta">Subir PDFs</h1>
        <p className="mt-1 text-sm text-tinta-clara">
          Arraste um ou vários arquivos. Cada PDF vira um material em rascunho, com
          capa da primeira página, contagem de páginas e texto extraído.
        </p>
      </header>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setArrastando(true);
        }}
        onDragLeave={() => setArrastando(false)}
        onDrop={(e) => {
          e.preventDefault();
          setArrastando(false);
          processar(e.dataTransfer.files);
        }}
        onClick={() => entrada.current?.click()}
        className={`cursor-pointer rounded-2xl border-2 border-dashed p-14 text-center transition-colors ${
          arrastando ? "border-tinta bg-tinta/5" : "border-tinta/25 bg-white"
        }`}
      >
        <p className="text-lg font-semibold text-tinta">Solte os PDFs aqui</p>
        <p className="mt-1 text-sm text-tinta-clara">ou clique para escolher</p>
        <input
          ref={entrada}
          type="file"
          accept="application/pdf"
          multiple
          hidden
          onChange={(e) => e.target.files && processar(e.target.files)}
        />
      </div>

      {fila.length > 0 && (
        <ul className="flex flex-col gap-2">
          {fila.map((item) => (
            <li
              key={item.nome}
              className="flex items-center justify-between rounded-xl border border-tinta/10 bg-white px-4 py-3 text-sm"
            >
              <span className="font-medium text-tinta">{item.nome}</span>
              <span
                className={
                  item.estado === "enviado"
                    ? "font-semibold text-emerald-700"
                    : item.estado === "erro"
                      ? "font-semibold text-red-700"
                      : "text-tinta-clara"
                }
              >
                {item.estado === "processando" && "gerando capa…"}
                {item.estado === "enviado" && `pronto · ${item.detalhe}`}
                {item.estado === "erro" && item.detalhe}
              </span>
            </li>
          ))}
        </ul>
      )}

      {fila.some((i) => i.estado === "enviado") && (
        <Link
          href="/admin"
          className="self-start rounded-lg bg-tinta px-5 py-2.5 text-sm font-semibold text-white"
        >
          Ver materiais →
        </Link>
      )}
    </main>
  );
}
