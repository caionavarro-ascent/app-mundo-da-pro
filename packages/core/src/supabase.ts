import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

export type ClienteSupabase = SupabaseClient<Database>;

/**
 * Fábrica única do cliente Supabase. Cada superfície chama com as próprias
 * variáveis de ambiente e opções (o app injeta storage do expo-secure-store;
 * o web usa os helpers de cookie do Next).
 *
 * Aqui só entra a chave ANÔNIMA. A service_role vive apenas em rotas de
 * servidor do apps/web e nunca passa por esta função.
 */
export function criarClienteSupabase(
  url: string,
  chaveAnonima: string,
  opcoes?: Parameters<typeof createClient>[2],
): ClienteSupabase {
  if (!url || !chaveAnonima) {
    throw new Error(
      'Supabase não configurado: defina URL e chave anônima no .env da superfície.',
    );
  }
  return createClient<Database>(url, chaveAnonima, opcoes);
}
