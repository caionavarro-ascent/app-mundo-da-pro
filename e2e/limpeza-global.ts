import { rmSync } from 'fs';

import { apagarUsuarioDeTeste, ARQUIVO_SESSAO, credenciais } from './supabase-teste';

/** Depois de tudo: apaga o usuário de teste e o arquivo com a sessão dele. */
export default async function limpezaGlobal() {
  rmSync(ARQUIVO_SESSAO, { force: true });
  if (credenciais()) await apagarUsuarioDeTeste();
}
