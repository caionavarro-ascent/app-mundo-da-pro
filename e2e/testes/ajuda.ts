import { test as base, expect, type Page } from '@playwright/test';
import { existsSync, readFileSync } from 'fs';

import { ARQUIVO_SESSAO } from '../supabase-teste';

export { expect };
export const PAINEL_URL = process.env.PAINEL_URL ?? 'http://187.127.38.236:8083';
const REF_SUPABASE = 'rrtvbkiesjuvvvgygmmk';

/**
 * `test` com um vigia em toda página: erro de JavaScript, erro no console e pedido
 * que falhou reprovam o teste no fim (D51). É o que pega problema "invisível", como
 * o erro de hidratação #418, que a tela esconde mas o console mostra.
 */
export const test = base.extend<{ vigia: string[] }>({
  vigia: [
    async ({ page }, usar) => {
      const problemas: string[] = [];
      page.on('pageerror', (e) => problemas.push(`erro JS: ${e.message.split('\n')[0]}`));
      page.on('console', (m) => {
        if (m.type() === 'error') problemas.push(`console: ${m.text().split('\n')[0].slice(0, 200)}`);
      });
      page.on('requestfailed', (r) => {
        const motivo = r.failure()?.errorText ?? '';
        // navegação interrompida/abortada de propósito (troca de tela) não é defeito
        if (!/ERR_ABORTED|NS_BINDING_ABORTED/.test(motivo)) {
          problemas.push(`pedido falhou: ${r.url().split('?')[0]} (${motivo})`);
        }
      });
      page.on('response', (r) => {
        const url = r.url();
        // 404 esperado: página além da amostra sem assinatura (testado de propósito)
        if (r.status() >= 400 && !url.includes('/paginas/')) {
          problemas.push(`HTTP ${r.status()}: ${url.split('?')[0]}`);
        }
      });
      await usar(problemas);
      expect(problemas, 'erros no console, pedidos que falharam ou respostas de erro').toEqual([]);
    },
    { auto: true },
  ],
});

/** Espera o acervo do painel chegar (o app o injeta depois da 1ª renderização). */
export async function abrir(page: Page, caminho: string) {
  const acervo = page.waitForResponse((r) => r.url().includes('/api/materiais') && r.ok(), {
    timeout: 20_000,
  });
  await page.goto(caminho);
  await acervo;
  await page.waitForTimeout(600); // o React refaz as telas com o acervo novo
}

/** Há sessão de teste (criada na configuração global)? */
export const temSessaoDeTeste = () => existsSync(ARQUIVO_SESSAO);

/** Entra como a professora de teste: grava a sessão onde o supabase-js procura. */
export async function entrarComoTeste(page: Page) {
  const sessao = readFileSync(ARQUIVO_SESSAO, 'utf8');
  await page.addInitScript(
    ([chave, valor]) => window.localStorage.setItem(chave, valor),
    [`sb-${REF_SUPABASE}-auth-token`, sessao],
  );
}

/** Troca o window.open (Linking.openURL no web) por um gravador: nada é baixado. */
export async function gravarAberturas(page: Page) {
  await page.addInitScript(() => {
    (window as any).__abertas = [];
    window.open = ((url: string) => {
      (window as any).__abertas.push(String(url));
      return null;
    }) as typeof window.open;
  });
}

export async function aberturas(page: Page): Promise<string[]> {
  return page.evaluate(() => (window as any).__abertas as string[]);
}

/** Id de um material publicado que satisfaz o filtro (lido da API do painel). */
export async function materialDoPainel(
  filtro: (m: { id: string; titulo: string; produtoIds: string[]; paginas: number }) => boolean,
) {
  const lista = (await (await fetch(`${PAINEL_URL}/api/materiais`)).json()) as any[];
  const m = lista.find(filtro);
  if (!m) throw new Error('nenhum material do painel satisfaz o filtro');
  return m as { id: string; titulo: string; produtoIds: string[]; paginas: number };
}
