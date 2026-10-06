import { criarClienteSupabase } from '@mdp/core';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/**
 * Cliente Supabase do app — só a chave anônima (regra de ouro 5).
 * Sessão (Bloco 2, D50): no celular, no expo-secure-store (criptografado pelo
 * sistema); no web, no localStorage padrão do supabase-js.
 */

// O secure-store guarda até ~2 KB por chave e a sessão passa disso: vai em pedaços.
const PEDACO = 1800;

const cofre = {
  async getItem(chave: string): Promise<string | null> {
    const quantos = await SecureStore.getItemAsync(`${chave}.n`);
    if (!quantos) return null;
    const partes = await Promise.all(
      Array.from({ length: Number(quantos) }, (_, i) => SecureStore.getItemAsync(`${chave}.${i}`)),
    );
    return partes.some((p) => p == null) ? null : partes.join('');
  },
  async setItem(chave: string, valor: string): Promise<void> {
    await cofre.removeItem(chave);
    const partes = valor.match(new RegExp(`[\\s\\S]{1,${PEDACO}}`, 'g')) ?? [''];
    await Promise.all(partes.map((p, i) => SecureStore.setItemAsync(`${chave}.${i}`, p)));
    await SecureStore.setItemAsync(`${chave}.n`, String(partes.length));
  },
  async removeItem(chave: string): Promise<void> {
    const quantos = Number((await SecureStore.getItemAsync(`${chave}.n`)) ?? 0);
    await Promise.all(
      Array.from({ length: quantos }, (_, i) => SecureStore.deleteItemAsync(`${chave}.${i}`)),
    );
    await SecureStore.deleteItemAsync(`${chave}.n`);
  },
};

export const supabase = criarClienteSupabase(
  process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
  {
    auth: {
      ...(Platform.OS === 'web' ? {} : { storage: cofre }),
      autoRefreshToken: true,
      persistSession: true,
      // login por código de 6 dígitos (D19): nada de sessão vinda de link na URL
      detectSessionInUrl: false,
    },
  },
);
