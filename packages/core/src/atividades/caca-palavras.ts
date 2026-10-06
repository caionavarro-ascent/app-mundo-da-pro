import { embaralhar, letrasDaGrade, palavraExibida, sorteador } from './palavras';

/**
 * Gerador de caça-palavras (D44). O nível decide as direções: no fácil, só
 * para a direita e para baixo (quem está se alfabetizando lê assim); no médio,
 * também na diagonal; no difícil, em todas as direções, inclusive de trás pra frente.
 */

export type NivelCacaPalavras = 'facil' | 'medio' | 'dificil';

export const nomeNivelCacaPalavras: Record<NivelCacaPalavras, string> = {
  facil: 'Fácil: → e ↓',
  medio: 'Médio: → ↓ e diagonal',
  dificil: 'Difícil: todas as direções',
};

const DIRECOES: Record<NivelCacaPalavras, [number, number][]> = {
  facil: [
    [0, 1],
    [1, 0],
  ],
  medio: [
    [0, 1],
    [1, 0],
    [1, 1],
  ],
  dificil: [
    [0, 1],
    [1, 0],
    [1, 1],
    [-1, 1],
    [0, -1],
    [-1, 0],
    [-1, -1],
    [1, -1],
  ],
};

export interface PalavraEscondida {
  palavra: string;
  letras: string[];
  linha: number;
  coluna: number;
  /** passo por letra: [linha, coluna] */
  passo: [number, number];
}

export interface CacaPalavrasGerado {
  tamanho: number;
  grade: string[][];
  escondidas: PalavraEscondida[];
  deFora: string[];
}

// letras de preenchimento com o peso do português, para a grade não parecer sorteada demais
const PREENCHIMENTO = 'AAAAAEEEEOOOOIIIUURRRSSSNNNDDMMTTTCCLLPPVGBFHQJZXÇ';

export function gerarCacaPalavras(
  palavras: string[],
  nivel: NivelCacaPalavras,
  semente: number,
): CacaPalavrasGerado {
  const aleatorio = sorteador(semente);
  const vistas = new Set<string>();
  const itens = palavras
    .map((p) => ({ palavra: palavraExibida(p), letras: letrasDaGrade(p) }))
    .filter((p) => {
      const chave = p.letras.join('');
      if (chave.length < 2 || vistas.has(chave)) return false;
      vistas.add(chave);
      return true;
    })
    // as longas primeiro: são as mais difíceis de encaixar
    .sort((a, b) => b.letras.length - a.letras.length);

  if (itens.length === 0) return { tamanho: 0, grade: [], escondidas: [], deFora: [] };

  const maior = itens[0].letras.length;
  const totalLetras = itens.reduce((s, p) => s + p.letras.length, 0);
  const inicial = Math.min(16, Math.max(8, maior, Math.ceil(Math.sqrt(totalLetras * 2.2))));

  // se não couber tudo, tenta de novo com a grade um pouco maior
  let resultado: { tamanho: number; grade: (string | null)[][]; escondidas: PalavraEscondida[] } | null =
    null;
  for (let tamanho = inicial; tamanho <= Math.max(inicial, 16); tamanho++) {
    const tentativa = esconder(itens, tamanho, DIRECOES[nivel], aleatorio);
    if (!resultado || tentativa.escondidas.length > resultado.escondidas.length) {
      resultado = tentativa;
    }
    if (tentativa.escondidas.length === itens.length) break;
  }
  const { tamanho, grade, escondidas } = resultado!;

  const final = grade.map((linha) =>
    linha.map((c) => c ?? PREENCHIMENTO[Math.floor(aleatorio() * PREENCHIMENTO.length)]),
  );
  const achadas = new Set(escondidas.map((e) => e.palavra));
  const deFora = itens.filter((p) => !achadas.has(p.palavra)).map((p) => p.palavra);
  return { tamanho, grade: final, escondidas, deFora };
}

function esconder(
  itens: { palavra: string; letras: string[] }[],
  tamanho: number,
  direcoes: [number, number][],
  aleatorio: () => number,
) {
  const grade: (string | null)[][] = Array.from({ length: tamanho }, () => Array(tamanho).fill(null));
  const escondidas: PalavraEscondida[] = [];

  for (const item of itens) {
    const n = item.letras.length;
    const candidatas: { linha: number; coluna: number; passo: [number, number]; cruza: number }[] = [];
    for (const [dl, dc] of direcoes) {
      for (let linha = 0; linha < tamanho; linha++) {
        for (let coluna = 0; coluna < tamanho; coluna++) {
          const fimL = linha + dl * (n - 1);
          const fimC = coluna + dc * (n - 1);
          if (fimL < 0 || fimL >= tamanho || fimC < 0 || fimC >= tamanho) continue;
          let cruza = 0;
          let cabe = true;
          for (let i = 0; i < n && cabe; i++) {
            const atual = grade[linha + dl * i][coluna + dc * i];
            if (atual === null) continue;
            if (atual === item.letras[i]) cruza++;
            else cabe = false;
          }
          if (cabe) candidatas.push({ linha, coluna, passo: [dl, dc], cruza });
        }
      }
    }
    if (candidatas.length === 0) continue;
    // sorteia, mas com leve preferência por cruzar (grade mais "misturada")
    const sorteio = embaralhar(candidatas, aleatorio).sort((a, b) => b.cruza - a.cruza);
    const escolhida = aleatorio() < 0.35 ? sorteio[0] : sorteio[Math.floor(aleatorio() * sorteio.length)];
    item.letras.forEach((letra, i) => {
      grade[escolhida.linha + escolhida.passo[0] * i][escolhida.coluna + escolhida.passo[1] * i] = letra;
    });
    escondidas.push({ ...item, linha: escolhida.linha, coluna: escolhida.coluna, passo: escolhida.passo });
  }
  return { tamanho, grade, escondidas };
}
