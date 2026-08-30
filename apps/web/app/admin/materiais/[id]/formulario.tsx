"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  nomeAno,
  nomeNivel,
  nomeTipo,
  exemploNivel,
  type AnoEscolar,
  type NivelEscrita,
  type TipoMaterial,
} from "@mdp/core";

import { produtosDemo } from "@mdp/core/src/mock/acervo";

import type { MaterialPainel } from "@/lib/dados-locais";

function alternarItem<T>(lista: T[], item: T): T[] {
  return lista.includes(item) ? lista.filter((x) => x !== item) : [...lista, item];
}

export function FormularioFicha({ material }: { material: MaterialPainel }) {
  const rotas = useRouter();
  const [ficha, setFicha] = useState(material);
  const [salvando, setSalvando] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);

  async function salvar(status?: MaterialPainel["status"]) {
    setSalvando(true);
    setAviso(null);
    const corpo = { ...ficha, ...(status ? { status } : {}) };
    const resposta = await fetch(`/api/admin/materiais/${material.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(corpo),
    });
    setSalvando(false);
    if (!resposta.ok) {
      setAviso("Não consegui salvar. Tente de novo.");
      return;
    }
    if (status) setFicha((f) => ({ ...f, status }));
    setAviso(status === "publicado" ? "Publicado!" : "Salvo.");
    rotas.refresh();
  }

  const classeChip = (ativo: boolean) =>
    `rounded-full border px-3 py-1 text-sm transition-colors ${
      ativo
        ? "border-tinta bg-tinta text-white"
        : "border-tinta/20 bg-white text-tinta hover:border-tinta/50"
    }`;

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-5">
      <label className="flex flex-col gap-1 text-sm font-semibold text-tinta">
        Título
        <input
          value={ficha.titulo}
          onChange={(e) => setFicha({ ...ficha, titulo: e.target.value })}
          className="rounded-lg border border-tinta/20 bg-white px-3 py-2 font-normal"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm font-semibold text-tinta">
        Descrição
        <textarea
          value={ficha.descricao}
          onChange={(e) => setFicha({ ...ficha, descricao: e.target.value })}
          rows={3}
          placeholder="Para quem serve e o que resolve, em duas frases."
          className="rounded-lg border border-tinta/20 bg-white px-3 py-2 font-normal"
        />
      </label>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-semibold text-tinta">Tipo</legend>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(nomeTipo) as TipoMaterial[]).map((tipo) => (
            <button
              key={tipo}
              type="button"
              onClick={() => setFicha({ ...ficha, tipo })}
              className={classeChip(ficha.tipo === tipo)}
            >
              {nomeTipo[tipo]}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-semibold text-tinta">Produtos</legend>
        <div className="flex flex-wrap gap-2">
          {produtosDemo
            .filter((p) => !p.isCombo)
            .map((produto) => (
              <button
                key={produto.id}
                type="button"
                onClick={() =>
                  setFicha({
                    ...ficha,
                    produtoIds: alternarItem(ficha.produtoIds ?? [], produto.id),
                  })
                }
                className={classeChip((ficha.produtoIds ?? []).includes(produto.id))}
              >
                {produto.nome}
              </button>
            ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-semibold text-tinta">Anos</legend>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(nomeAno) as AnoEscolar[]).map((ano) => (
            <button
              key={ano}
              type="button"
              onClick={() => setFicha({ ...ficha, anos: alternarItem(ficha.anos, ano) })}
              className={classeChip(ficha.anos.includes(ano))}
            >
              {nomeAno[ano]}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-semibold text-tinta">Níveis de escrita</legend>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(nomeNivel) as NivelEscrita[]).map((nivel) => (
            <button
              key={nivel}
              type="button"
              onClick={() =>
                setFicha({ ...ficha, niveis: alternarItem(ficha.niveis, nivel) })
              }
              className={classeChip(ficha.niveis.includes(nivel))}
              title={`Como a criança escreve borboleta: ${exemploNivel[nivel]}`}
            >
              {nomeNivel[nivel]}{" "}
              <span className="opacity-60">· {exemploNivel[nivel]}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <label className="flex items-center gap-2 text-sm font-semibold text-tinta">
        <input
          type="checkbox"
          checked={ficha.gratuito}
          onChange={(e) => setFicha({ ...ficha, gratuito: e.target.checked })}
        />
        Material gratuito (isca da vitrine)
      </label>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => salvar()}
          disabled={salvando}
          className="rounded-lg border border-tinta px-5 py-2.5 text-sm font-semibold text-tinta disabled:opacity-50"
        >
          Salvar rascunho
        </button>
        <button
          type="button"
          onClick={() => salvar("publicado")}
          disabled={salvando}
          className="rounded-lg bg-tinta px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {ficha.status === "publicado" ? "Republicar" : "Publicar"}
        </button>
        {aviso && <span className="text-sm text-tinta-clara">{aviso}</span>}
      </div>
    </div>
  );
}
