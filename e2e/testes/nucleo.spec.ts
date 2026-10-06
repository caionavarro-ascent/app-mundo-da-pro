import { expect, test } from '@playwright/test';

import { interpretarPergunta, pontuarMaterial, resumoDaBusca } from '../../packages/core/src/busca';
import { gerarCacaPalavras } from '../../packages/core/src/atividades/caca-palavras';
import { gerarCruzadinha } from '../../packages/core/src/atividades/cruzadinha';
import {
  letrasDaGrade,
  sortearDoRepertorio,
  temasDePalavras,
} from '../../packages/core/src/atividades/palavras';

/** Lógica do packages/core (D42, D44, D45), a mesma do app e do painel. */

test.describe('busca inteligente', () => {
  test('interpreta ano, nível, tipo e tema', () => {
    expect(interpretarPergunta('Quero uma prova pros alunos silábicos do primeiro ano')).toMatchObject({
      anos: ['1ano'],
      niveis: ['sil'],
      tipos: ['avaliacao'],
      palavras: [],
    });
    expect(interpretarPergunta('sequência didática sobre alimentação').termos).toEqual(['alimentação']);
    expect(interpretarPergunta('silábico-alfabético').niveis).toEqual(['sa']);
  });

  test('tema que não aparece zera a nota, mesmo com o tipo certo', () => {
    const c = interpretarPergunta('jogo de dinossauros');
    const m = { titulo: 'Jogo da memória de rimas', tipo: 'jogo' as const, anos: [], niveis: [] };
    expect(pontuarMaterial(m, c).pontos).toBe(0);
  });

  test('casa só no começo da palavra', () => {
    const c = interpretarPergunta('rimas');
    const primavera = { titulo: 'A primavera chegou', tipo: 'atividade' as const, anos: [], niveis: [] };
    const rimado = { titulo: 'Delicionário rimado', tipo: 'atividade' as const, anos: [], niveis: [] };
    expect(pontuarMaterial(primavera, c).pontos).toBe(0);
    expect(pontuarMaterial(rimado, c).pontos).toBeGreaterThan(0);
  });

  test('resumo em português de conversa', () => {
    expect(resumoDaBusca(interpretarPergunta('jogo de rimas pro 1º ano'), 3)).toBe(
      'Encontrei 3 sugestões de jogo sobre “rimas” para o 1º ano. As que mais combinam vêm primeiro.',
    );
    expect(resumoDaBusca(interpretarPergunta('rimas'), 0)).toMatch(/^Não encontrei/);
  });
});

test.describe('cruzadinha', () => {
  /** Toda sequência de 2+ letras na grade (linha e coluna) tem de ser uma palavra colocada. */
  function sequenciasFalsas(c: ReturnType<typeof gerarCruzadinha>): string[] {
    const colocadas = new Set(c.entradas.map((e) => e.letras.join('')));
    const seqs: string[] = [];
    const varrer = (celulas: (string | null)[]) => {
      let atual = '';
      for (const x of [...celulas, null]) {
        if (x) atual += x;
        else {
          if (atual.length > 1) seqs.push(atual);
          atual = '';
        }
      }
    };
    c.grade.forEach(varrer);
    for (let col = 0; col < c.colunas; col++) varrer(c.grade.map((l) => l[col]));
    return seqs.filter((s) => !colocadas.has(s));
  }

  test('100 cruzadinhas sem palavra falsa e com números em ordem', () => {
    const todas = temasDePalavras.flatMap((t) => t.palavras);
    for (let semente = 1; semente <= 100; semente++) {
      const palavras = todas.slice(semente % 60, (semente % 60) + 12);
      const c = gerarCruzadinha(palavras, semente);
      expect(sequenciasFalsas(c)).toEqual([]);
      const numeros = c.entradas.map((e) => e.numero);
      expect(Math.max(...numeros)).toBeLessThanOrEqual(c.entradas.length);
      expect(c.entradas.length + c.deFora.length).toBe(new Set(palavras.map((p) => letrasDaGrade(p.palavra).join(''))).size);
    }
  });

  test('mesma semente, mesma cruzadinha (prévia = PDF)', () => {
    const p = temasDePalavras[0].palavras;
    expect(gerarCruzadinha(p, 42)).toEqual(gerarCruzadinha(p, 42));
  });

  test('casos-limite: vazia, uma palavra, sem letra em comum, repetidas', () => {
    expect(gerarCruzadinha([], 1).entradas).toHaveLength(0);
    expect(gerarCruzadinha([{ palavra: 'GATO' }], 1).entradas).toHaveLength(1);
    const semComum = gerarCruzadinha([{ palavra: 'ABC' }, { palavra: 'XYZ' }], 1);
    expect(semComum.deFora).toEqual(['XYZ']);
    const repetidas = gerarCruzadinha([{ palavra: 'Maçã' }, { palavra: 'MAÇA' }, { palavra: 'maca' }], 1);
    expect(repetidas.entradas.length + repetidas.deFora.length).toBe(2); // MAÇA ≠ MACA
  });

  test('letra da grade sem acento, mas com Ç', () => {
    expect(letrasDaGrade('Coração')).toEqual(['C', 'O', 'R', 'A', 'Ç', 'A', 'O']);
    expect(letrasDaGrade('guarda-chuva 2')).toEqual([...'GUARDACHUVA']);
  });
});

test.describe('caça-palavras', () => {
  const lerNaGrade = (c: ReturnType<typeof gerarCacaPalavras>, e: (typeof c.escondidas)[number]) =>
    e.letras.map((_, i) => c.grade[e.linha + e.passo[0] * i][e.coluna + e.passo[1] * i]).join('');

  test('toda palavra escondida está mesmo na grade, na direção do nível', () => {
    const palavras = temasDePalavras[1].palavras.map((p) => p.palavra);
    for (const nivel of ['facil', 'medio', 'dificil'] as const) {
      for (let s = 1; s <= 30; s++) {
        const c = gerarCacaPalavras(palavras, nivel, s);
        expect(c.deFora).toEqual([]);
        for (const e of c.escondidas) {
          expect(lerNaGrade(c, e)).toBe(e.letras.join(''));
          if (nivel === 'facil') expect([[0, 1], [1, 0]]).toContainEqual(e.passo);
          if (nivel === 'medio') expect(e.passo.every((x) => x >= 0)).toBe(true);
        }
        expect(c.grade.flat().every((l) => /^[A-ZÇ]$/.test(l))).toBe(true);
      }
    }
  });

  test('palavra maior que 16 letras vai para "de fora", sem travar', () => {
    const c = gerarCacaPalavras(['PARALELEPIPEDOSGRANDES', 'SOL', 'LUA'], 'facil', 1);
    expect(c.deFora).toContain('PARALELEPIPEDOSGRANDES');
    expect(c.tamanho).toBeLessThanOrEqual(16);
  });
});

test.describe('sorteio do repertório', () => {
  const repertorio = Array.from({ length: 30 }, (_, i) => ({
    palavra: `PALAVRA${String.fromCharCode(65 + i)}`,
    ...(i % 2 === 0 ? { dica: `Complete: “ ${i} ________”` } : {}),
  }));

  test('semente diferente, versão diferente; mesma semente, mesma versão', () => {
    const a = sortearDoRepertorio(repertorio, 8, 1, false).map((p) => p.palavra);
    expect(sortearDoRepertorio(repertorio, 8, 1, false).map((p) => p.palavra)).toEqual(a);
    expect(sortearDoRepertorio(repertorio, 8, 2, false).map((p) => p.palavra)).not.toEqual(a);
  });

  test('cruzadinha: com 5+ dicas, só palavras com dica; caça: nunca leva dica', () => {
    expect(sortearDoRepertorio(repertorio, 10, 3, true).every((p) => p.dica)).toBe(true);
    expect(sortearDoRepertorio(repertorio, 10, 3, false).some((p) => p.dica)).toBe(false);
    const poucasDicas = repertorio.map((p, i) => (i < 3 ? p : { palavra: p.palavra }));
    const s = sortearDoRepertorio(poucasDicas, 8, 1, true);
    expect(s).toHaveLength(8);
    expect(s.some((p) => p.dica)).toBe(false); // sem misturar: vira banco de palavras
  });
});
