import {
  LineCapStyle,
  PDFDocument,
  StandardFonts,
  rgb,
  type PDFFont,
  type PDFPage,
} from "pdf-lib";
import type {
  CabecalhoDaFolha,
  CacaPalavrasGerado,
  CruzadinhaGerada,
} from "@mdp/core";

/**
 * PDF das atividades geradas (D44): cabeçalho como o da professora no papel
 * (escola, Prof., Nome, Nº, turma), a atividade e uma página de gabarito.
 * Regra de ouro 2, exceção da D44: folha para o aluno não leva nome/e-mail da
 * professora, só o rodapé discreto do app.
 */

const A4: [number, number] = [595.28, 841.89];
const MARGEM = 40;
const LARGURA_UTIL = A4[0] - MARGEM * 2;
const PRETO = rgb(0.1, 0.1, 0.12);
const CINZA = rgb(0.45, 0.47, 0.5);
const CINZA_CLARO = rgb(0.72, 0.74, 0.77);
// um traço por palavra no gabarito, alternando cores para palavras vizinhas não se confundirem
const MARCA_TEXTO = [rgb(1, 0.82, 0.2), rgb(0.35, 0.8, 0.6), rgb(0.45, 0.65, 1), rgb(1, 0.5, 0.5), rgb(0.75, 0.55, 1)];

interface Fontes {
  normal: PDFFont;
  negrito: PDFFont;
}

/** Fontes padrão do PDF só têm o alfabeto WinAnsi: acentos do português sim, emoji não. */
function seguro(texto: string): string {
  return [...texto.normalize("NFC")]
    .filter((c) => /[\x20-\x7E\xA0-\xFF–—‘’“”…•]/.test(c))
    .join("");
}

function quebrarLinhas(texto: string, fonte: PDFFont, tamanho: number, largura: number): string[] {
  const linhas: string[] = [];
  let atual = "";
  for (const palavra of seguro(texto).split(/\s+/).filter(Boolean)) {
    const tentativa = atual ? `${atual} ${palavra}` : palavra;
    if (fonte.widthOfTextAtSize(tentativa, tamanho) <= largura || !atual) {
      atual = tentativa;
    } else {
      linhas.push(atual);
      atual = palavra;
    }
  }
  if (atual) linhas.push(atual);
  return linhas;
}

function caixaArredondada(page: PDFPage, x: number, yTopo: number, w: number, h: number, r = 8) {
  // drawSvgPath usa y para baixo a partir do ponto (x, yTopo)
  const caminho = `M ${r} 0 H ${w - r} Q ${w} 0 ${w} ${r} V ${h - r} Q ${w} ${h} ${w - r} ${h} H ${r} Q 0 ${h} 0 ${h - r} V ${r} Q 0 0 ${r} 0 Z`;
  page.drawSvgPath(caminho, { x, y: yTopo, borderColor: CINZA_CLARO, borderWidth: 1.2 });
}

/** Linha para escrever à mão, depois de um rótulo. Devolve o x onde terminou. */
function campo(
  page: PDFPage,
  f: Fontes,
  rotulo: string,
  x: number,
  y: number,
  larguraLinha: number,
): number {
  const texto = seguro(rotulo);
  page.drawText(texto, { x, y, size: 10, font: f.normal, color: PRETO });
  const inicio = x + f.normal.widthOfTextAtSize(texto, 10) + 4;
  page.drawLine({
    start: { x: inicio, y: y - 2 },
    end: { x: inicio + larguraLinha, y: y - 2 },
    thickness: 0.8,
    color: PRETO,
  });
  return inicio + larguraLinha;
}

/** Cabeçalho do print do cliente. Devolve o y logo abaixo dele. */
function desenharCabecalho(page: PDFPage, f: Fontes, c: CabecalhoDaFolha): number {
  const topo = A4[1] - MARGEM;
  const altura = 64;
  caixaArredondada(page, MARGEM, topo, LARGURA_UTIL, altura);

  const esq = MARGEM + 14;
  const dir = MARGEM + LARGURA_UTIL - 14;
  const linha1 = topo - 24;
  const linha2 = topo - 48;

  if (c.escola.trim()) {
    page.drawText(seguro(c.escola.trim()), { x: esq, y: linha1, size: 12, font: f.negrito, color: PRETO });
  } else {
    campo(page, f, "Escola:", esq, linha1, 220);
  }
  const prof = c.professora.trim() ? `Prof. ${c.professora.trim()}` : "Prof.:";
  const larguraProf = f.normal.widthOfTextAtSize(seguro(prof), 10);
  if (c.professora.trim()) {
    page.drawText(seguro(prof), { x: dir - larguraProf, y: linha1, size: 10, font: f.normal, color: PRETO });
  } else {
    campo(page, f, prof, dir - larguraProf - 124, linha1, 120);
  }

  // Nome ____________ Nº ____ 4º ano A ______
  const turma = c.turma.trim() || "Turma:";
  const larguraTurma = f.normal.widthOfTextAtSize(seguro(turma), 10) + 4 + 60;
  const larguraNumero = f.normal.widthOfTextAtSize("Nº:", 10) + 4 + 44;
  const espaco = 22;
  const larguraNome =
    dir - esq - larguraTurma - larguraNumero - espaco * 2 - f.normal.widthOfTextAtSize("Nome:", 10) - 4;
  let x = campo(page, f, "Nome:", esq, linha2, larguraNome);
  x = campo(page, f, "Nº:", x + espaco, linha2, 44);
  campo(page, f, turma, x + espaco, linha2, 60);

  return topo - altura - 22;
}

function desenharTitulo(page: PDFPage, f: Fontes, titulo: string, instrucao: string, y: number): number {
  const t = seguro(titulo);
  page.drawText(t, {
    x: (A4[0] - f.negrito.widthOfTextAtSize(t, 18)) / 2,
    y,
    size: 18,
    font: f.negrito,
    color: PRETO,
  });
  let yAtual = y - 20;
  for (const linha of quebrarLinhas(instrucao, f.normal, 11, LARGURA_UTIL)) {
    page.drawText(linha, {
      x: (A4[0] - f.normal.widthOfTextAtSize(linha, 11)) / 2,
      y: yAtual,
      size: 11,
      font: f.normal,
      color: CINZA,
    });
    yAtual -= 14;
  }
  return yAtual - 10;
}

function rodape(page: PDFPage, f: Fontes) {
  const texto = seguro("Feito com o app Mundo da Prô");
  page.drawText(texto, {
    x: (A4[0] - f.normal.widthOfTextAtSize(texto, 7)) / 2,
    y: 20,
    size: 7,
    font: f.normal,
    color: CINZA_CLARO,
  });
}

/** Quadro de palavras (banco): caixa com as palavras em colunas. Devolve a altura usada. */
function bancoDePalavras(
  page: PDFPage,
  f: Fontes,
  titulo: string,
  palavras: string[],
  yTopo: number,
  comQuadradinho: boolean,
  simular = false,
): number {
  const tamanho = 12;
  const maisLarga = Math.max(...palavras.map((p) => f.negrito.widthOfTextAtSize(seguro(p), tamanho)));
  const larguraColuna = maisLarga + (comQuadradinho ? 22 : 8) + 16;
  const colunas = Math.max(1, Math.min(4, Math.floor((LARGURA_UTIL - 24) / larguraColuna)));
  const linhas = Math.ceil(palavras.length / colunas);
  const altura = 34 + linhas * 20;
  if (simular) return altura;

  caixaArredondada(page, MARGEM, yTopo, LARGURA_UTIL, altura);
  page.drawText(seguro(titulo), { x: MARGEM + 14, y: yTopo - 20, size: 10, font: f.negrito, color: CINZA });
  const passoColuna = (LARGURA_UTIL - 28) / colunas;
  palavras.forEach((p, i) => {
    const col = Math.floor(i / linhas);
    const lin = i % linhas;
    const x = MARGEM + 14 + col * passoColuna;
    const y = yTopo - 40 - lin * 20;
    let xTexto = x;
    if (comQuadradinho) {
      page.drawRectangle({ x, y: y - 1, width: 10, height: 10, borderColor: PRETO, borderWidth: 0.8 });
      xTexto = x + 16;
    }
    page.drawText(seguro(p), { x: xTexto, y, size: tamanho, font: f.negrito, color: PRETO });
  });
  return altura;
}

async function novoDocumento(titulo: string) {
  const doc = await PDFDocument.create();
  doc.setTitle(seguro(titulo));
  doc.setCreator("Mundo da Prô");
  doc.setProducer("Mundo da Prô");
  const f: Fontes = {
    normal: await doc.embedFont(StandardFonts.Helvetica),
    negrito: await doc.embedFont(StandardFonts.HelveticaBold),
  };
  return { doc, f };
}

// ---------------------------------------------------------------------------
// Cruzadinha
// ---------------------------------------------------------------------------

interface ItemDeDica {
  linhas: string[];
}

function dicasEmColunas(c: CruzadinhaGerada, f: Fontes) {
  const larguraColuna = (LARGURA_UTIL - 24) / 2;
  const grupo = (direcao: "horizontal" | "vertical"): ItemDeDica[] =>
    c.entradas
      .filter((e) => e.direcao === direcao)
      .sort((a, b) => a.numero - b.numero)
      .map((e) => ({ linhas: quebrarLinhas(`${e.numero}. ${e.dica}`, f.normal, 11, larguraColuna) }));
  const horizontais = grupo("horizontal");
  const verticais = grupo("vertical");
  const alturaDe = (itens: ItemDeDica[]) => 22 + itens.reduce((s, i) => s + i.linhas.length * 14 + 4, 0);
  return { horizontais, verticais, larguraColuna, altura: Math.max(alturaDe(horizontais), alturaDe(verticais)) };
}

function desenharGradeCruzadinha(
  page: PDFPage,
  f: Fontes,
  c: CruzadinhaGerada,
  yTopo: number,
  celula: number,
  comRespostas: boolean,
) {
  const x0 = (A4[0] - c.colunas * celula) / 2;
  for (let l = 0; l < c.linhas; l++) {
    for (let col = 0; col < c.colunas; col++) {
      const letra = c.grade[l][col];
      if (!letra) continue;
      const x = x0 + col * celula;
      const y = yTopo - (l + 1) * celula;
      page.drawRectangle({
        x,
        y,
        width: celula,
        height: celula,
        borderColor: PRETO,
        borderWidth: 0.9,
        color: rgb(1, 1, 1),
      });
      const numero = c.numeros[l][col];
      if (numero != null) {
        page.drawText(String(numero), {
          x: x + 2,
          y: y + celula - Math.max(6, celula * 0.28) - 1,
          size: Math.max(6, celula * 0.28),
          font: f.negrito,
          color: CINZA,
        });
      }
      if (comRespostas) {
        const tamanho = celula * 0.55;
        page.drawText(letra, {
          x: x + (celula - f.negrito.widthOfTextAtSize(letra, tamanho)) / 2,
          y: y + celula * 0.24,
          size: tamanho,
          font: f.negrito,
          color: PRETO,
        });
      }
    }
  }
}

export interface DadosCruzadinha {
  titulo: string;
  cabecalho: CabecalhoDaFolha;
  cruzadinha: CruzadinhaGerada;
  gabarito: boolean;
}

export async function pdfDaCruzadinha(d: DadosCruzadinha): Promise<Uint8Array> {
  const { doc, f } = await novoDocumento(d.titulo);
  const c = d.cruzadinha;
  const comDicas = c.entradas.length > 0 && c.entradas.every((e) => e.dica);
  const instrucao = comDicas
    ? "Leia as dicas e complete a cruzadinha. Cada quadradinho recebe uma letra."
    : "Conte as letras e encaixe as palavras do quadro na cruzadinha.";

  const page = doc.addPage(A4);
  let y = desenharCabecalho(page, f, d.cabecalho);
  y = desenharTitulo(page, f, d.titulo, instrucao, y);

  const palavrasDoBanco = [...c.entradas]
    .map((e) => e.palavra)
    .sort((a, b) => a.length - b.length || a.localeCompare(b, "pt-BR"));
  const dicas = comDicas ? dicasEmColunas(c, f) : null;
  const alturaAbaixo = dicas
    ? dicas.altura
    : bancoDePalavras(page, f, "", palavrasDoBanco, 0, false, true);

  // a grade ocupa o que sobrar; se ficar pequena demais, as dicas vão para a página seguinte
  const livre = y - MARGEM - 20;
  let celula = Math.min(36, LARGURA_UTIL / c.colunas, (livre - alturaAbaixo - 24) / c.linhas);
  const dicasNaOutraPagina = celula < 16;
  if (dicasNaOutraPagina) celula = Math.min(36, LARGURA_UTIL / c.colunas, livre / c.linhas);

  desenharGradeCruzadinha(page, f, c, y, celula, false);
  let yAbaixo = y - c.linhas * celula - 24;
  let paginaDasDicas = page;
  if (dicasNaOutraPagina) {
    paginaDasDicas = doc.addPage(A4);
    rodape(paginaDasDicas, f);
    yAbaixo = A4[1] - MARGEM;
  }

  if (dicas) {
    const colunasDeDicas: [string, ItemDeDica[]][] = [
      ["Horizontais", dicas.horizontais],
      ["Verticais", dicas.verticais],
    ];
    colunasDeDicas.forEach(([titulo, itens], i) => {
      const x = MARGEM + i * (dicas.larguraColuna + 24);
      let yDica = yAbaixo;
      paginaDasDicas.drawText(titulo, { x, y: yDica, size: 12, font: f.negrito, color: PRETO });
      yDica -= 20;
      for (const item of itens) {
        for (const linha of item.linhas) {
          paginaDasDicas.drawText(linha, { x, y: yDica, size: 11, font: f.normal, color: PRETO });
          yDica -= 14;
        }
        yDica -= 4;
      }
    });
  } else {
    bancoDePalavras(paginaDasDicas, f, "Palavras para encaixar", palavrasDoBanco, yAbaixo + 10, false);
  }
  rodape(page, f);

  if (d.gabarito) {
    const g = doc.addPage(A4);
    const yG = desenharTitulo(g, f, `Gabarito · ${d.titulo}`, "Página da professora.", A4[1] - MARGEM - 10);
    const celulaG = Math.min(36, LARGURA_UTIL / c.colunas, (yG - MARGEM - 40) / c.linhas);
    desenharGradeCruzadinha(g, f, c, yG, celulaG, true);
    rodape(g, f);
  }
  return doc.save();
}

// ---------------------------------------------------------------------------
// Caça-palavras
// ---------------------------------------------------------------------------

export interface DadosCacaPalavras {
  titulo: string;
  cabecalho: CabecalhoDaFolha;
  caca: CacaPalavrasGerado;
  gabarito: boolean;
}

function desenharGradeCaca(
  page: PDFPage,
  f: Fontes,
  c: CacaPalavrasGerado,
  yTopo: number,
  celula: number,
  destacar: boolean,
) {
  const x0 = (A4[0] - c.tamanho * celula) / 2;
  // moldura da grade
  const lado = c.tamanho * celula;
  caixaArredondada(page, x0 - 8, yTopo + 8, lado + 16, lado + 16, 10);
  const centro = (l: number, col: number) => ({
    x: x0 + col * celula + celula / 2,
    y: yTopo - l * celula - celula / 2,
  });
  if (destacar) {
    c.escondidas.forEach((e, i) => {
      const n = e.letras.length - 1;
      page.drawLine({
        start: centro(e.linha, e.coluna),
        end: centro(e.linha + e.passo[0] * n, e.coluna + e.passo[1] * n),
        thickness: celula * 0.78,
        lineCap: LineCapStyle.Round,
        color: MARCA_TEXTO[i % MARCA_TEXTO.length],
        opacity: 0.55,
      });
    });
  }
  const tamanho = celula * 0.56;
  for (let l = 0; l < c.tamanho; l++) {
    for (let col = 0; col < c.tamanho; col++) {
      const x = x0 + col * celula;
      const y = yTopo - (l + 1) * celula;
      const letra = c.grade[l][col];
      page.drawText(letra, {
        x: x + (celula - f.negrito.widthOfTextAtSize(letra, tamanho)) / 2,
        y: y + celula * 0.28,
        size: tamanho,
        font: f.negrito,
        color: PRETO,
      });
    }
  }
}

export async function pdfDoCacaPalavras(d: DadosCacaPalavras): Promise<Uint8Array> {
  const { doc, f } = await novoDocumento(d.titulo);
  const c = d.caca;
  const page = doc.addPage(A4);
  let y = desenharCabecalho(page, f, d.cabecalho);
  y = desenharTitulo(page, f, d.titulo, "Encontre no quadro as palavras abaixo e pinte cada uma que achar.", y);

  const palavras = c.escondidas.map((e) => e.palavra).sort((a, b) => a.localeCompare(b, "pt-BR"));
  const alturaBanco = bancoDePalavras(page, f, "", palavras, 0, true, true);
  const livre = y - MARGEM - 20 - alturaBanco - 34;
  const celula = Math.min(34, (LARGURA_UTIL - 16) / c.tamanho, livre / c.tamanho);
  desenharGradeCaca(page, f, c, y - 8, celula, false);
  bancoDePalavras(page, f, "Palavras para encontrar", palavras, y - 8 - c.tamanho * celula - 30, true);
  rodape(page, f);

  if (d.gabarito) {
    const g = doc.addPage(A4);
    const yG = desenharTitulo(g, f, `Gabarito · ${d.titulo}`, "Página da professora.", A4[1] - MARGEM - 10);
    const celulaG = Math.min(34, (LARGURA_UTIL - 16) / c.tamanho, (yG - MARGEM - 60) / c.tamanho);
    desenharGradeCaca(g, f, c, yG - 8, celulaG, true);
    rodape(g, f);
  }
  return doc.save();
}
