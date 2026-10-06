import { expect, test } from '@playwright/test';
import { existsSync, readFileSync } from 'fs';

import { ARQUIVO_SESSAO } from '../supabase-teste';

/** API do painel (D33–D50): contratos, limites e as regras de ouro 1 e 4. */
const PAINEL = process.env.PAINEL_URL ?? 'http://187.127.38.236:8083';

async function json(caminho: string, init?: RequestInit) {
  const r = await fetch(PAINEL + caminho, init);
  return { status: r.status, corpo: r.headers.get('content-type')?.includes('json') ? await r.json() : null, r };
}

test.describe('materiais e busca', () => {
  test('lista os materiais publicados, com capa e proporção', async () => {
    const { status, corpo } = await json('/api/materiais');
    expect(status).toBe(200);
    expect(corpo.length).toBeGreaterThan(300);
    for (const m of corpo.slice(0, 20)) {
      expect(m).toMatchObject({ id: expect.any(String), titulo: expect.any(String), paginas: expect.any(Number) });
      expect(m.produtoIds.length).toBeGreaterThan(0);
      expect([0.71, 1.41]).toContain(m.capaProporcao);
    }
  });

  test('busca entende tipo, ano e tema e não casa "rima" com "primavera"', async () => {
    const q = encodeURIComponent('jogo de rimas para o 1º ano');
    const { corpo } = await json(`/api/busca?q=${q}`);
    expect(corpo.consulta).toMatchObject({ tipos: ['jogo'], anos: ['1ano'], palavras: ['rimas'] });
    const titulos = await json('/api/materiais').then((x) => new Map(x.corpo.map((m: any) => [m.id, m.titulo])));
    for (const r of corpo.resultados) expect(String(titulos.get(r.id))).not.toMatch(/primavera/i);
  });

  test('busca acha o tema dentro do texto dos PDFs, com trecho', async () => {
    const { corpo } = await json(`/api/busca?q=${encodeURIComponent('frutas')}`);
    const comTrecho = corpo.resultados.filter((r: any) => r.trecho);
    expect(comTrecho.length).toBeGreaterThan(3);
    expect(comTrecho[0].trecho.toLowerCase()).toContain('frut');
  });

  test('busca vazia ou absurda não quebra', async () => {
    for (const q of ['', '%%%', 'x'.repeat(500), 'zzzzqqqq']) {
      const { status, corpo } = await json(`/api/busca?q=${encodeURIComponent(q)}`);
      expect(status).toBe(200);
      expect(Array.isArray(corpo.resultados)).toBe(true);
    }
  });
});

test.describe('coleções e repertório', () => {
  test('coleções com volumes e módulos batendo com as pastas', async () => {
    const { corpo } = await json('/api/cursos');
    const porId = Object.fromEntries(corpo.map((c: any) => [c.produtoId, c]));
    const imagine = porId.imagine;
    expect(imagine.volumes.map((v: any) => v.nome)).toEqual(['Imagine 1', 'Imagine 2']);
    expect(imagine.volumes[0].modulos.map((m: any) => m.materialIds.length)).toEqual([7, 11, 22, 11]);
    expect(imagine.volumes[1].modulos).toHaveLength(10);
    expect(imagine.volumes[1].modulos.every((m: any) => m.materialIds.length === 13)).toBe(true);
    expect(porId.educakits.volumes[0].modulos[0].nome).toBe('Viviana, Rainha do Pijama');
    expect(porId.educakits.volumes[0].modulos).toHaveLength(28);
  });

  test('repertório: resumo e palavras de um material', async () => {
    const { corpo: resumo } = await json('/api/repertorio');
    const ids = Object.keys(resumo);
    expect(ids.length).toBeGreaterThan(150);
    const { status, corpo } = await json(`/api/repertorio/${ids[0]}`);
    expect(status).toBe(200);
    expect(corpo.palavras.length).toBe(resumo[ids[0]].palavras);
    for (const p of corpo.palavras) {
      expect(p.palavra).toMatch(/^[A-ZÀ-Ý]{3,12}$/);
      if (p.dica) expect(p.dica).toContain('________');
    }
  });

  test('repertório de material inexistente responde 404', async () => {
    expect((await json('/api/repertorio/nao-existe')).status).toBe(404);
  });
});

test.describe('PDF das ferramentas', () => {
  const pedir = (dados: object, baixar = true) =>
    fetch(`${PAINEL}/api/ferramentas/pdf?d=${encodeURIComponent(JSON.stringify(dados))}${baixar ? '' : '&baixar=0'}`);

  test('cruzadinha e caça-palavras saem como PDF (baixar e visualizar)', async () => {
    const palavras = ['GATO', 'PATO', 'VACA', 'CAVALO', 'MACACO'].map((palavra) => ({ palavra, dica: `Dica de ${palavra}` }));
    const cab = { escola: 'Escola Teste', professora: 'Maria', turma: '4º ano A' };
    for (const tipo of ['cruzadinha', 'caca-palavras']) {
      const baixar = await pedir({ tipo, palavras, cabecalho: cab, semente: 3, nivel: 'dificil' });
      expect(baixar.status).toBe(200);
      expect(baixar.headers.get('content-type')).toBe('application/pdf');
      expect(baixar.headers.get('content-disposition')).toMatch(/^attachment/);
      const bytes = Buffer.from(await baixar.arrayBuffer());
      expect(bytes.subarray(0, 5).toString()).toBe('%PDF-');
      const ver = await pedir({ tipo, palavras, semente: 3 }, false);
      expect(ver.headers.get('content-disposition')).toMatch(/^inline/);
    }
  });

  test('pedidos inválidos são recusados com 400', async () => {
    expect((await fetch(`${PAINEL}/api/ferramentas/pdf?d=nao-e-json`)).status).toBe(400);
    expect((await pedir({ tipo: 'outra-coisa', palavras: [] })).status).toBe(400);
    expect((await pedir({ tipo: 'cruzadinha', palavras: [{ palavra: 'SO' }] })).status).toBe(400);
  });

  test('emoji e texto enorme no cabeçalho não quebram o PDF', async () => {
    const r = await pedir({
      tipo: 'cruzadinha',
      palavras: [{ palavra: 'BOLA' }, { palavra: 'LOBO' }, { palavra: 'ABELHA' }],
      cabecalho: { escola: '🏫 '.repeat(100), professora: 'Ana 😀', turma: '1º ano ✨' },
      titulo: 'Título 🎉 '.repeat(20),
    });
    expect(r.status).toBe(200);
  });
});

test.describe('páginas do material (regras de ouro 1 e 4)', () => {
  let material: { id: string; paginas: number; produtoIds: string[] };

  test.beforeAll(async () => {
    const lista = (await json('/api/materiais')).corpo;
    material = lista.find((m: any) => m.produtoIds.includes('imagine') && m.paginas > 4);
  });

  test('sem login: só a amostra, e a página 3 é recusada', async () => {
    const { corpo } = await json(`/api/materiais/${material.id}/paginas`);
    expect(corpo).toMatchObject({ liberado: false, total: material.paginas });
    expect(corpo.paginas).toHaveLength(2);
    const p1 = await fetch(PAINEL + corpo.paginas[0].mini);
    expect(p1.headers.get('content-type')).toBe('image/png');
    expect((await fetch(`${PAINEL}/api/materiais/${material.id}/paginas/3`)).status).toBe(404);
  });

  test('token falso não libera nada', async () => {
    const { corpo } = await json(`/api/materiais/${material.id}/paginas`, {
      headers: { Authorization: 'Bearer eyJ.falso.token' },
    });
    expect(corpo.paginas).toHaveLength(2);
  });

  test('caminho malicioso e página zero são recusados', async () => {
    for (const c of ['/api/materiais/..%2F..%2Fetc/paginas/1', `/api/materiais/${material.id}/paginas/0`]) {
      expect((await fetch(PAINEL + c)).status).toBe(404);
    }
  });

  test('com a compra: todas as páginas; assinatura adulterada é recusada', async () => {
    test.skip(!existsSync(ARQUIVO_SESSAO), 'sem sessão de teste');
    const token = JSON.parse(readFileSync(ARQUIVO_SESSAO, 'utf8')).access_token;
    const { corpo } = await json(`/api/materiais/${material.id}/paginas`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(corpo.liberado).toBe(true);
    expect(corpo.paginas).toHaveLength(material.paginas);
    const p3 = corpo.paginas[2].mini as string;
    expect((await fetch(PAINEL + p3)).status).toBe(200);
    expect((await fetch(PAINEL + p3.replace(/sig=.{4}/, 'sig=XXXX'))).status).toBe(404);
    expect((await fetch(PAINEL + p3.replace('/paginas/3?', '/paginas/4?'))).status).toBe(404);
  });

  test('com a compra de outra coleção: continua a amostra', async () => {
    test.skip(!existsSync(ARQUIVO_SESSAO), 'sem sessão de teste');
    const token = JSON.parse(readFileSync(ARQUIVO_SESSAO, 'utf8')).access_token;
    const outro = (await json('/api/materiais')).corpo.find(
      (m: any) => m.produtoIds.includes('educakits') && m.paginas > 2,
    );
    const { corpo } = await json(`/api/materiais/${outro.id}/paginas`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(corpo.liberado).toBe(false);
    expect(corpo.paginas).toHaveLength(2);
  });
});
