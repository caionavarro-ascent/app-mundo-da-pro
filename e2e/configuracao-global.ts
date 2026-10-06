import { mkdirSync, rmSync, writeFileSync } from 'fs';
import path from 'path';

import {
  apagarUsuarioDeTeste,
  ARQUIVO_SESSAO,
  credenciais,
  EMAIL_TESTE,
  PRODUTO_DO_TESTE,
  supabase,
} from './supabase-teste';

/**
 * Antes de tudo: um usuário de teste com a Coleção Imagine, e a sessão dele em
 * .auth/sessao.json (fora do git) para os testes logados injetarem no navegador.
 */
export default async function configuracaoGlobal() {
  rmSync(ARQUIVO_SESSAO, { force: true });
  if (!credenciais()) {
    console.warn('⚠ sem apps/web/.env.local com a service_role: testes logados serão pulados');
    return;
  }
  await apagarUsuarioDeTeste(); // sobra de uma rodada interrompida

  const usuario = await supabase('POST', '/auth/v1/admin/users', {
    email: EMAIL_TESTE,
    email_confirm: true,
  });
  const [produto] = await supabase('GET', `/rest/v1/produtos?select=id&slug=eq.${PRODUTO_DO_TESTE}`);
  await supabase('POST', '/rest/v1/entitlements', {
    user_id: usuario.id,
    produto_id: produto.id,
    origem: 'manual',
  });

  // o código que iria por e-mail, gerado sem enviar; a entrada é a mesma do app (verifyOtp)
  const link = await supabase('POST', '/auth/v1/admin/generate_link', {
    type: 'magiclink',
    email: EMAIL_TESTE,
  });
  const codigo = link.email_otp ?? link.properties?.email_otp;
  const sessao = await supabase(
    'POST',
    '/auth/v1/verify',
    { type: 'email', email: EMAIL_TESTE, token: codigo },
    'anon',
  );
  mkdirSync(path.dirname(ARQUIVO_SESSAO), { recursive: true });
  writeFileSync(ARQUIVO_SESSAO, JSON.stringify(sessao));
}
