import Link from "next/link";

import { listarMateriais } from "@/lib/dados-locais";
import { nomeTipo } from "@mdp/core";

export const dynamic = "force-dynamic";

/** Painel de conteúdo (B1) — versão sem banco (D33), desktop-first. */
export default async function PainelMateriais() {
  const materiais = await listarMateriais();

  const semTaxonomia = materiais.filter(
    (m) => !m.tipo || m.anos.length === 0 || m.niveis.length === 0,
  ).length;
  const semDescricao = materiais.filter((m) => !m.descricao.trim()).length;
  const semCapa = materiais.filter((m) => !m.capa).length;
  const publicados = materiais.filter((m) => m.status === "publicado").length;

  const placar: Array<[string, number]> = [
    ["Materiais", materiais.length],
    ["Publicados", publicados],
    ["Sem taxonomia", semTaxonomia],
    ["Sem descrição", semDescricao],
    ["Sem capa", semCapa],
  ];

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 p-8">
      <header className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-tinta-clara">
            Painel de conteúdo · ambiente sem banco
          </p>
          <h1 className="text-3xl font-semibold text-tinta">Materiais</h1>
        </div>
        <Link
          href="/admin/upload"
          className="rounded-lg bg-tinta px-5 py-2.5 text-sm font-semibold text-white"
        >
          + Subir PDFs
        </Link>
      </header>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {placar.map(([rotulo, numero]) => (
          <div key={rotulo} className="rounded-xl border border-tinta/10 bg-white p-4">
            <p className="text-2xl font-semibold tabular-nums text-tinta">{numero}</p>
            <p className="text-xs text-tinta-clara">{rotulo}</p>
          </div>
        ))}
      </section>

      {materiais.length === 0 ? (
        <section className="rounded-xl border border-dashed border-tinta/20 p-12 text-center">
          <p className="text-tinta">Nenhum material ainda.</p>
          <p className="mt-1 text-sm text-tinta-clara">
            Toque em “Subir PDFs” e arraste os primeiros arquivos — cada um vira um
            material com capa, contagem de páginas e texto para a curadoria.
          </p>
        </section>
      ) : (
        <section className="overflow-x-auto rounded-xl border border-tinta/10 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-tinta/10 text-left text-xs uppercase tracking-wide text-tinta-clara">
                <th className="p-3">Capa</th>
                <th className="p-3">Título</th>
                <th className="p-3">Tipo</th>
                <th className="p-3">Págs</th>
                <th className="p-3">Status</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {materiais.map((m) => (
                <tr key={m.id} className="border-b border-tinta/5 last:border-0">
                  <td className="p-3">
                    {m.capa ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={m.capa}
                        alt=""
                        className="h-14 w-10 rounded border border-tinta/10 object-cover"
                      />
                    ) : (
                      <div className="h-14 w-10 rounded bg-tinta/5" />
                    )}
                  </td>
                  <td className="p-3 font-medium text-tinta">{m.titulo}</td>
                  <td className="p-3 text-tinta-clara">
                    {m.tipo ? nomeTipo[m.tipo] : "—"}
                  </td>
                  <td className="p-3 tabular-nums text-tinta-clara">{m.paginas}</td>
                  <td className="p-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        m.status === "publicado"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {m.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <Link
                      href={`/admin/materiais/${m.id}`}
                      className="font-semibold text-tinta-clara hover:underline"
                    >
                      Abrir ficha →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </main>
  );
}
