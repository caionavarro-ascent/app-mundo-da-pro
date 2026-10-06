import {
  embaralhar,
  letrasDaGrade,
  palavraExibida,
  sorteador,
  type PalavraDaAtividade,
} from './palavras';

/**
 * Gerador de cruzadinha (D44). Encaixa as palavras cruzando por letras em
 * comum, com as regras de uma cruzadinha de verdade: nenhuma palavra encosta
 * em outra de lado, e toda palavra (menos a primeira) cruza com alguma.
 * Tenta várias ordens e fica com a que coloca mais palavras na menor área.
 */

export type Direcao = 'horizontal' | 'vertical';

export interface EntradaDaCruzadinha {
  numero: number;
  /** como a professora escreveu (com acento), para o gabarito e o banco */
  palavra: string;
  letras: string[];
  dica?: string;
  linha: number;
  coluna: number;
  direcao: Direcao;
}

export interface CruzadinhaGerada {
  linhas: number;
  colunas: number;
  /** letra da resposta em cada casa; null = casa vazia (fora da cruzadinha) */
  grade: (string | null)[][];
  /** número impresso no canto da casa onde uma palavra começa */
  numeros: (number | null)[][];
  entradas: EntradaDaCruzadinha[];
  /** palavras sem letra em comum com as outras (ou que não couberam) */
  deFora: string[];
}

const TAMANHO_TABULEIRO = 60;
const TENTATIVAS = 40;

interface Colocada {
  item: PalavraDaAtividade;
  letras: string[];
  linha: number;
  coluna: number;
  direcao: Direcao;
}

type Tabuleiro = (string | null)[][];

function passo(direcao: Direcao): [number, number] {
  return direcao === 'horizontal' ? [0, 1] : [1, 0];
}

/** Quantos cruzamentos a palavra faria ali; -1 se a posição não é válida. */
function avaliar(
  tab: Tabuleiro,
  dono: (Direcao | 'ambas' | null)[][],
  letras: string[],
  linha: number,
  coluna: number,
  direcao: Direcao,
): number {
  const [dl, dc] = passo(direcao);
  const fimL = linha + dl * (letras.length - 1);
  const fimC = coluna + dc * (letras.length - 1);
  if (linha < 1 || coluna < 1 || fimL >= TAMANHO_TABULEIRO - 1 || fimC >= TAMANHO_TABULEIRO - 1) {
    return -1;
  }
  // casa antes do começo e depois do fim precisam estar livres
  if (tab[linha - dl][coluna - dc] !== null) return -1;
  if (tab[fimL + dl][fimC + dc] !== null) return -1;

  let cruzamentos = 0;
  for (let i = 0; i < letras.length; i++) {
    const l = linha + dl * i;
    const c = coluna + dc * i;
    const atual = tab[l][c];
    if (atual !== null) {
      // cruzamento: mesma letra, e a casa não pode já ser desta direção
      if (atual !== letras[i] || dono[l][c] === direcao || dono[l][c] === 'ambas') return -1;
      cruzamentos++;
    } else {
      // casa nova: os vizinhos de lado precisam estar vazios (senão forma "palavra" falsa)
      const [vl, vc] = direcao === 'horizontal' ? [1, 0] : [0, 1];
      if (tab[l + vl][c + vc] !== null || tab[l - vl][c - vc] !== null) return -1;
    }
  }
  return cruzamentos;
}

function colocar(
  tab: Tabuleiro,
  dono: (Direcao | 'ambas' | null)[][],
  p: Colocada,
): void {
  const [dl, dc] = passo(p.direcao);
  p.letras.forEach((letra, i) => {
    const l = p.linha + dl * i;
    const c = p.coluna + dc * i;
    tab[l][c] = letra;
    dono[l][c] = dono[l][c] && dono[l][c] !== p.direcao ? 'ambas' : p.direcao;
  });
}

function tentativa(itens: PalavraDaAtividade[], aleatorio: () => number): Colocada[] {
  const tab: Tabuleiro = Array.from({ length: TAMANHO_TABULEIRO }, () =>
    Array(TAMANHO_TABULEIRO).fill(null),
  );
  const dono: (Direcao | 'ambas' | null)[][] = Array.from({ length: TAMANHO_TABULEIRO }, () =>
    Array(TAMANHO_TABULEIRO).fill(null),
  );
  const colocadas: Colocada[] = [];
  let pendentes = itens.map((item) => ({ item, letras: letrasDaGrade(item.palavra) }));

  // a primeira no meio, na horizontal
  const primeira = pendentes.shift()!;
  const inicio: Colocada = {
    ...primeira,
    linha: Math.floor(TAMANHO_TABULEIRO / 2),
    coluna: Math.floor((TAMANHO_TABULEIRO - primeira.letras.length) / 2),
    direcao: 'horizontal',
  };
  colocar(tab, dono, inicio);
  colocadas.push(inicio);

  // repete enquanto alguma encaixar: uma palavra que não cabia pode caber depois
  let avancou = true;
  while (pendentes.length > 0 && avancou) {
    avancou = false;
    const restantes: typeof pendentes = [];
    for (const p of pendentes) {
      let melhores: Colocada[] = [];
      let melhorNota = 0;
      for (const ja of colocadas) {
        const direcao: Direcao = ja.direcao === 'horizontal' ? 'vertical' : 'horizontal';
        const [dl, dc] = passo(ja.direcao);
        ja.letras.forEach((letraJa, i) => {
          p.letras.forEach((letra, j) => {
            if (letra !== letraJa) return;
            const [nl, nc] = passo(direcao);
            const linha = ja.linha + dl * i - nl * j;
            const coluna = ja.coluna + dc * i - nc * j;
            const nota = avaliar(tab, dono, p.letras, linha, coluna, direcao);
            if (nota > melhorNota) {
              melhorNota = nota;
              melhores = [];
            }
            if (nota > 0 && nota === melhorNota) {
              melhores.push({ ...p, linha, coluna, direcao });
            }
          });
        });
      }
      if (melhores.length > 0) {
        const escolhida = melhores[Math.floor(aleatorio() * melhores.length)];
        colocar(tab, dono, escolhida);
        colocadas.push(escolhida);
        avancou = true;
      } else {
        restantes.push(p);
      }
    }
    pendentes = restantes;
  }
  return colocadas;
}

function area(colocadas: Colocada[]): number {
  let [minL, minC, maxL, maxC] = [Infinity, Infinity, -Infinity, -Infinity];
  for (const p of colocadas) {
    const [dl, dc] = passo(p.direcao);
    minL = Math.min(minL, p.linha);
    minC = Math.min(minC, p.coluna);
    maxL = Math.max(maxL, p.linha + dl * (p.letras.length - 1));
    maxC = Math.max(maxC, p.coluna + dc * (p.letras.length - 1));
  }
  const altura = maxL - minL + 1;
  const largura = maxC - minC + 1;
  // folha A4 em pé: prefere formas que não fiquem muito mais largas que altas
  return altura * largura * (largura > altura * 1.6 ? 1.3 : 1);
}

export function gerarCruzadinha(palavras: PalavraDaAtividade[], semente: number): CruzadinhaGerada {
  const aleatorio = sorteador(semente);
  const vistas = new Set<string>();
  const validas = palavras.filter((p) => {
    const chave = letrasDaGrade(p.palavra).join('');
    if (chave.length < 2 || vistas.has(chave)) return false;
    vistas.add(chave);
    return true;
  });
  if (validas.length === 0) {
    return { linhas: 0, colunas: 0, grade: [], numeros: [], entradas: [], deFora: [] };
  }

  let melhor: Colocada[] = [];
  for (let t = 0; t < TENTATIVAS; t++) {
    // a mais longa costuma ser a melhor espinha; nas outras tentativas, ordem sorteada
    const ordem =
      t === 0
        ? [...validas].sort((a, b) => letrasDaGrade(b.palavra).length - letrasDaGrade(a.palavra).length)
        : embaralhar(validas, aleatorio);
    const resultado = tentativa(ordem, aleatorio);
    if (
      resultado.length > melhor.length ||
      (resultado.length === melhor.length && area(resultado) < area(melhor))
    ) {
      melhor = resultado;
    }
  }

  // recorta a área usada
  let [minL, minC, maxL, maxC] = [Infinity, Infinity, -Infinity, -Infinity];
  for (const p of melhor) {
    const [dl, dc] = passo(p.direcao);
    minL = Math.min(minL, p.linha);
    minC = Math.min(minC, p.coluna);
    maxL = Math.max(maxL, p.linha + dl * (p.letras.length - 1));
    maxC = Math.max(maxC, p.coluna + dc * (p.letras.length - 1));
  }
  const linhas = maxL - minL + 1;
  const colunas = maxC - minC + 1;
  const grade: (string | null)[][] = Array.from({ length: linhas }, () => Array(colunas).fill(null));
  const numeros: (number | null)[][] = Array.from({ length: linhas }, () => Array(colunas).fill(null));

  // numeração de cruzadinha: de cima para baixo, da esquerda para a direita
  const ordenadas = melhor
    .map((p) => ({ ...p, linha: p.linha - minL, coluna: p.coluna - minC }))
    .sort((a, b) => a.linha - b.linha || a.coluna - b.coluna);
  let proximo = 1;
  const entradas: EntradaDaCruzadinha[] = ordenadas.map((p) => {
    const [dl, dc] = passo(p.direcao);
    p.letras.forEach((letra, i) => {
      grade[p.linha + dl * i][p.coluna + dc * i] = letra;
    });
    let numero = numeros[p.linha][p.coluna];
    if (numero == null) {
      numero = proximo++;
      numeros[p.linha][p.coluna] = numero;
    }
    return {
      numero,
      palavra: palavraExibida(p.item.palavra),
      letras: p.letras,
      dica: p.item.dica?.trim() || undefined,
      linha: p.linha,
      coluna: p.coluna,
      direcao: p.direcao,
    };
  });

  const colocadasChaves = new Set(melhor.map((p) => p.letras.join('')));
  const deFora = validas
    .filter((p) => !colocadasChaves.has(letrasDaGrade(p.palavra).join('')))
    .map((p) => palavraExibida(p.palavra));

  return { linhas, colunas, grade, numeros, entradas, deFora };
}
