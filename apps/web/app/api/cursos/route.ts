import { NextResponse } from "next/server";

import { cursosDaVitrine } from "@/lib/cursos";

/** Coleções da Vitrine em blocos (D47): produto → volumes → módulos → ids dos PDFs. */
export async function GET() {
  return NextResponse.json(await cursosDaVitrine(), {
    headers: { "Access-Control-Allow-Origin": "*", "Cache-Control": "no-store" },
  });
}
