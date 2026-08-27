import { criarClienteSupabase } from '@mdp/core';

/**
 * Cliente Supabase do app — só a chave anônima (regra de ouro 5).
 * A persistência de sessão em expo-secure-store entra no Bloco 2.
 */
export const supabase = criarClienteSupabase(
  process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
);
