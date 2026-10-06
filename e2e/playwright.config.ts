import { defineConfig, devices } from '@playwright/test';

/**
 * Testes de ponta a ponta (D51) contra o app e o painel PUBLICADOS (nada de dev server,
 * CLAUDE.md). Rodar no servidor, depois do publicar:
 *
 *   cd e2e && npx playwright test
 *
 * APP_URL / PAINEL_URL mudam o alvo (ex.: domínio novo). Os testes logados criam um
 * usuário temporário no Supabase com a service_role do apps/web/.env.local e o apagam
 * no fim; sem essa chave, eles são pulados.
 */
export const APP_URL = process.env.APP_URL ?? 'http://187.127.38.236:8082';
export const PAINEL_URL = process.env.PAINEL_URL ?? 'http://187.127.38.236:8083';

export default defineConfig({
  testDir: './testes',
  globalSetup: './configuracao-global.ts',
  globalTeardown: './limpeza-global.ts',
  outputDir: './resultados',
  // servidor de 1 CPU: dois navegadores de cada vez
  workers: 2,
  fullyParallel: true,
  timeout: 45_000,
  expect: { timeout: 10_000 },
  reporter: [['list'], ['html', { outputFolder: './relatorio', open: 'never' }]],
  use: {
    baseURL: APP_URL,
    locale: 'pt-BR',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'api', testMatch: /(api|nucleo)\.spec\.ts/ },
    {
      name: 'computador',
      testIgnore: /(api|nucleo)\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'celular',
      testIgnore: /(api|nucleo)\.spec\.ts/,
      use: { ...devices['Pixel 7'] },
    },
  ],
});
