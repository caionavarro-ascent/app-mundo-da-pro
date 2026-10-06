import { abrir, expect, materialDoPainel, test } from './ajuda';

/**
 * Varredura (D51): toda rota abre, mostra o que deve e não deixa erro no console
 * (o vigia de ajuda.ts reprova qualquer erro de JS, console ou pedido).
 */
const ROTAS: [string, RegExp][] = [
  ['/', /O que você precisa hoje\?/],
  ['/vitrine', /Coleções/],
  ['/novidades', /Novidades/],
  ['/ferramentas', /Cruzadinha/],
  ['/meus', /Meus materiais|materiais/i],
  ['/conta', /Tema escuro/],
  ['/turmas', /turma/i],
  ['/entrar', /Entre na sua conta/],
  ['/ferramenta/cruzadinha', /De onde vêm as palavras\?/],
  ['/ferramenta/caca-palavras', /De onde vêm as palavras\?/],
];

for (const [rota, esperado] of ROTAS) {
  test(`abre ${rota} sem erros`, async ({ page }) => {
    await abrir(page, rota);
    await expect(page.locator('body')).toContainText(esperado);
    await expect(page).toHaveTitle(/Mundo da Prô/);
  });
}

test('link direto para a ficha de um material do painel abre o material', async ({ page }) => {
  const m = await materialDoPainel((x) => x.produtoIds.includes('imagine') && x.paginas > 2);
  await abrir(page, `/material/${m.id}`);
  await expect(page.getByText('Material não encontrado.')).toHaveCount(0);
  await expect(page.locator('body')).toContainText(m.titulo);
});

test('abas do rodapé ou menu lateral levam a cada tela', async ({ page }) => {
  await abrir(page, '/');
  for (const [nome, texto] of [
    ['Vitrine', /Coleções/],
    ['Novidades', /Novidades/],
    ['Ferramentas', /Cruzadinha/],
    ['Início', /O que você precisa hoje\?/],
  ] as const) {
    await page.getByRole('link', { name: nome }).or(page.getByRole('tab', { name: nome })).first().click();
    await expect(page.locator('body')).toContainText(texto);
  }
});
