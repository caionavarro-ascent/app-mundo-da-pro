import { existsSync, readFileSync } from 'fs';
import path from 'path';

/**
 * Usuário temporário para os testes logados (D51): criado pela API administrativa
 * do Supabase (service_role, só no servidor), com o código de entrada gerado sem
 * mandar e-mail, e apagado no fim (perfil e posse caem em cascata).
 */

export const EMAIL_TESTE = 'e2e-mundo-da-pro@example.com';
export const ARQUIVO_SESSAO = path.join(__dirname, '.auth', 'sessao.json');
export const PRODUTO_DO_TESTE = 'colecao-imagine';

export function credenciais(): { url: string; anon: string; servico: string } | null {
  const arquivo = path.join(__dirname, '..', 'apps', 'web', '.env.local');
  if (!existsSync(arquivo)) return null;
  const env = Object.fromEntries(
    readFileSync(arquivo, 'utf8')
      .split('\n')
      .filter((l) => /^[A-Z_]+=/.test(l))
      .map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1)]),
  );
  const { NEXT_PUBLIC_SUPABASE_URL: url, NEXT_PUBLIC_SUPABASE_ANON_KEY: anon } = env;
  const servico = env.SUPABASE_SERVICE_ROLE_KEY;
  return url && anon && servico ? { url, anon, servico } : null;
}

export async function supabase(
  metodo: string,
  caminho: string,
  corpo?: unknown,
  chave: 'servico' | 'anon' = 'servico',
): Promise<any> {
  const c = credenciais()!;
  const k = chave === 'servico' ? c.servico : c.anon;
  const resposta = await fetch(c.url + caminho, {
    method: metodo,
    headers: {
      apikey: k,
      Authorization: `Bearer ${k}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: corpo === undefined ? undefined : JSON.stringify(corpo),
  });
  const texto = await resposta.text();
  if (!resposta.ok) throw new Error(`${metodo} ${caminho} → ${resposta.status} ${texto.slice(0, 200)}`);
  return texto ? JSON.parse(texto) : null;
}

/** Apaga o usuário de teste, se existir (perfil e posse vão junto). */
export async function apagarUsuarioDeTeste(): Promise<void> {
  const perfil = await supabase('GET', `/rest/v1/perfis?select=id&email=eq.${EMAIL_TESTE}`);
  for (const { id } of perfil ?? []) await supabase('DELETE', `/auth/v1/admin/users/${id}`);
}
