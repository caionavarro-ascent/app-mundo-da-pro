import { criarClienteSupabase } from "@mdp/core";

/**
 * Cliente Supabase do web (browser) — só a chave anônima.
 * Rotas de servidor que precisem da service_role criam o próprio cliente
 * em Route Handlers, nunca por aqui (regra de ouro 5).
 */
export const supabase = criarClienteSupabase(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
);
