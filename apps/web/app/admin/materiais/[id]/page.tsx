import Link from "next/link";
import { notFound } from "next/navigation";

import { materialPorId } from "@/lib/dados-locais";
import { FormularioFicha } from "./formulario";

export const dynamic = "force-dynamic";

/** Ficha do material no painel (B3), versão sem banco (D33). */
export default async function FichaMaterial({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const material = await materialPorId(id);
  if (!material) notFound();

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-8">
      <header>
        <Link href="/admin" className="text-sm font-semibold text-tinta-clara">
          ← Materiais
        </Link>
        <h1 className="mt-1 text-3xl font-semibold text-tinta">{material.titulo}</h1>
        <p className="mt-1 text-sm text-tinta-clara">
          {material.paginas} páginas · enviado em{" "}
          {new Date(material.criadoEm).toLocaleDateString("pt-BR")}
        </p>
      </header>

      <div className="flex gap-6">
        {material.capa && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={material.capa}
            alt="Capa do material"
            className="h-64 w-44 shrink-0 rounded-lg border border-tinta/10 object-cover"
          />
        )}
        <FormularioFicha material={material} />
      </div>

      {material.textoExtraido && (
        <details className="rounded-xl border border-tinta/10 bg-white p-4 text-sm">
          <summary className="cursor-pointer font-semibold text-tinta">
            Texto extraído (para curadoria e IA)
          </summary>
          <p className="mt-2 whitespace-pre-wrap text-tinta-clara">
            {material.textoExtraido.slice(0, 2500)}
          </p>
        </details>
      )}
    </main>
  );
}
