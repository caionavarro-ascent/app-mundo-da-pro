/**
 * Busca inteligente da home (D42): entende a pergunta da professora do jeito
 * que ela escreve ("jogo de rimas pro 1º ano silábico") e pontua cada material.
 * Sem IA: regras de linguagem simples, instantâneas e iguais no app e no web.
 */

import { nomeAno, nomeNivel, nomeTipo, type AnoEscolar, type NivelEscrita, type TipoMaterial } from './tokens';

export function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[º°ª]/g, 'o');
}

// Ordem importa: o mais específico antes ("silabico alfabetico" antes de "silabico").
const PADROES_NIVEL: [NivelEscrita, RegExp][] = [
  ['pre', /\bpre[\s-]?silabic[oa]s?\b/g],
  ['sa', /\bsilabic[oa]s?[\s-]+alfabetic[oa]s?\b/g],
  ['sil', /\bsilabic[oa]s?\b/g],
  ['alf', /\balfabetic[oa]s?\b/g],
];

const ORDINAIS = ['primeiro', 'segundo', 'terceiro', 'quarto', 'quinto'];
const PADROES_ANO: [AnoEscolar, RegExp][] = [
  ['infantil', /\b(educacao\s+)?infantil\b|\bpre[\s-]?escola\b/g],
  ...([1, 2, 3, 4, 5] as const).map(
    (n): [AnoEscolar, RegExp] => [
      `${n}ano` as AnoEscolar,
      new RegExp(`\\b(${n}\\s*o?\\s*ano|${ORDINAIS[n - 1]}\\s+ano|${n}o)s?\\b`, 'g'),
    ],
  ),
];

const SINONIMOS_TIPO: Record<TipoMaterial, string[]> = {
  sequencia: ['sequencia', 'sequencias', 'sequencia didatica', 'projeto', 'projetos'],
  atividade: ['atividade', 'atividades', 'exercicio', 'exercicios', 'folha', 'folhas', 'folhinha', 'folhinhas'],
  jogo: ['jogo', 'jogos', 'brincadeira', 'brincadeiras', 'ludico', 'ludicos'],
  avaliacao: ['avaliacao', 'avaliacoes', 'prova', 'provas', 'sondagem', 'sondagens', 'diagnostica', 'diagnostico', 'teste'],
  cartaz: ['cartaz', 'cartazes', 'mural', 'painel', 'decoracao'],
  planner: ['planner', 'planejamento', 'planejamentos', 'agenda', 'rotina'],
  aula: ['aula', 'aulas', 'video', 'videos', 'formacao'],
  ebook: ['ebook', 'ebooks', 'livro', 'livros', 'apostila', 'apostilas'],
};

// Palavras que não ajudam a achar material: artigos, preposições e o "pedido" em si.
const PALAVRAS_VAZIAS = new Set(
  (
    'a o as os um uma uns umas de da do das dos d em na no nas nos num numa para pra pro pras pros ' +
    'por pelo pela com sem sobre que e ou ao aos à eu me minha meu minhas meus meus sua seu ' +
    'quero queria preciso precisava gostaria procuro procurando busco buscando tem ter tenha ' +
    'algum alguma alguns algumas material materiais coisa coisas ideia ideias sugestao sugestoes ' +
    'turma turmas aluno alunos aluna alunas crianca criancas trabalhar usar fazer ano anos nivel ' +
    'escrita hoje semana mais bem muito boa bom legal favor'
  )
    .split(/\s+/)
    .map(normalizar),
);

export interface ConsultaInterpretada {
  pergunta: string;
  anos: AnoEscolar[];
  niveis: NivelEscrita[];
  tipos: TipoMaterial[];
  /** o que sobrou: o tema da pergunta, já normalizado */
  palavras: string[];
  /** as mesmas palavras como ela escreveu (com acento), para mostrar na tela */
  termos: string[];
}

export function interpretarPergunta(pergunta: string): ConsultaInterpretada {
  let resto = ` ${normalizar(pergunta)} `;
  const niveis: NivelEscrita[] = [];
  for (const [nivel, padrao] of PADROES_NIVEL) {
    if (padrao.test(resto)) {
      niveis.push(nivel);
      resto = resto.replace(padrao, ' ');
    }
    padrao.lastIndex = 0;
  }
  const anos: AnoEscolar[] = [];
  for (const [ano, padrao] of PADROES_ANO) {
    if (padrao.test(resto)) {
      anos.push(ano);
      resto = resto.replace(padrao, ' ');
    }
    padrao.lastIndex = 0;
  }
  const tipos: TipoMaterial[] = [];
  for (const [tipo, sinonimos] of Object.entries(SINONIMOS_TIPO) as [TipoMaterial, string[]][]) {
    // expressões de várias palavras primeiro, para "sequencia didatica" sair inteira
    for (const s of [...sinonimos].sort((a, b) => b.length - a.length)) {
      const padrao = new RegExp(`\\b${s}\\b`, 'g');
      if (padrao.test(resto)) {
        if (!tipos.includes(tipo)) tipos.push(tipo);
        resto = resto.replace(padrao, ' ');
      }
    }
  }
  const palavras = [
    ...new Set(
      resto
        .replace(/[^a-z0-9\s-]/g, ' ')
        .split(/[\s-]+/)
        .filter((p) => p.length > 1 && !PALAVRAS_VAZIAS.has(p)),
    ),
  ];
  const escrito = new Map<string, string>();
  for (const t of pergunta.toLowerCase().split(/[^\p{L}\p{N}]+/u)) escrito.set(normalizar(t), t);
  const termos = palavras.map((p) => escrito.get(p) ?? p);
  return { pergunta: pergunta.trim(), anos, niveis, tipos, palavras, termos };
}

/** "rimas" também acha "rima"; "animais" acha "animal". Raiz simples, sem dicionário. */
function raiz(palavra: string): string {
  if (palavra.length <= 4) return palavra;
  // "alimentação"/"alimentações" → "alimenta" (acha "alimentar" também)
  if (palavra.endsWith('coes')) return palavra.slice(0, -4);
  if (palavra.endsWith('cao')) return palavra.slice(0, -3);
  if (palavra.endsWith('oes') || palavra.endsWith('aes')) return palavra.slice(0, -3);
  if (palavra.endsWith('ais')) return palavra.slice(0, -2);
  if (palavra.endsWith('eis')) return palavra.slice(0, -2);
  if (palavra.endsWith('res') || palavra.endsWith('zes')) return palavra.slice(0, -2);
  if (palavra.endsWith('s')) return palavra.slice(0, -1);
  return palavra;
}

/** Ocorrências da raiz no começo de uma palavra ("rima" acha "rimas", não "primavera"). */
function ocorrencias(texto: string, r: string): number {
  return texto.match(new RegExp(`(^|[^a-z0-9])${r.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g'))?.length ?? 0;
}

export interface MaterialPesquisavel {
  titulo: string;
  descricao?: string;
  tipo: TipoMaterial;
  anos: AnoEscolar[];
  niveis: NivelEscrita[];
  /** texto extraído do PDF, quando houver (só no servidor) */
  texto?: string;
}

export interface Pontuacao {
  pontos: number;
  /** por que o material foi sugerido, em linguagem da professora */
  motivos: string[];
  /** pedacinho do PDF onde o tema aparece */
  trecho?: string;
}

export function pontuarMaterial(m: MaterialPesquisavel, c: ConsultaInterpretada): Pontuacao {
  const titulo = normalizar(m.titulo);
  const descricao = normalizar(m.descricao ?? '');
  const texto = m.texto ? normalizar(m.texto) : '';
  let pontos = 0;
  let temasAchados = 0;
  const motivos: string[] = [];
  const noTitulo: string[] = [];
  const noTexto: string[] = [];

  c.palavras.forEach((palavra, i) => {
    const r = raiz(palavra);
    const termo = c.termos[i] ?? palavra;
    if (ocorrencias(titulo, r) > 0) {
      pontos += 6;
      temasAchados++;
      noTitulo.push(termo);
    } else if (ocorrencias(descricao, r) > 0) {
      pontos += 3;
      temasAchados++;
      noTitulo.push(termo);
    } else if (ocorrencias(texto, r) > 0) {
      // quantas vezes aparece no PDF, com teto: um tema central aparece muito
      const vezes = Math.min(ocorrencias(texto, r), 5);
      pontos += 1 + vezes * 0.6;
      temasAchados++;
      noTexto.push(termo);
    }
  });
  if (noTitulo.length > 0) motivos.push(`Fala de “${noTitulo.join('”, “')}”`);
  if (noTexto.length > 0) motivos.push(`“${noTexto.join('”, “')}” aparece no material`);

  const tipoCombina = c.tipos.includes(m.tipo);
  if (tipoCombina) {
    pontos += 4;
    motivos.push(nomeTipo[m.tipo]);
  }
  const anosCombinam = m.anos.filter((a) => c.anos.includes(a));
  if (anosCombinam.length > 0) {
    pontos += 3;
    motivos.push(anosCombinam.map((a) => nomeAno[a]).join(', '));
  }
  const niveisCombinam = m.niveis.filter((n) => c.niveis.includes(n));
  if (niveisCombinam.length > 0) {
    pontos += 3;
    motivos.push(niveisCombinam.map((n) => nomeNivel[n]).join(', '));
  }

  // Pediu um tema e nada do tema apareceu: não serve, mesmo que o tipo combine.
  if (c.palavras.length > 0 && temasAchados === 0) return { pontos: 0, motivos: [] };
  // Pediu um tipo específico e o material é de outro: cai bastante, mas não some.
  if (c.tipos.length > 0 && !tipoCombina) pontos *= 0.4;
  // Pediu ano/nível e o material está marcado com outros: cai um pouco.
  if (c.anos.length > 0 && m.anos.length > 0 && anosCombinam.length === 0) pontos *= 0.6;
  if (c.niveis.length > 0 && m.niveis.length > 0 && niveisCombinam.length === 0) pontos *= 0.6;
  // Cobrir todos os temas da pergunta vale mais do que repetir um só.
  if (c.palavras.length > 1) pontos *= 0.5 + (0.5 * temasAchados) / c.palavras.length;

  const trecho = noTexto.length > 0 && m.texto ? trechoDoTexto(m.texto, noTexto[0]) : undefined;
  return { pontos: Math.round(pontos * 10) / 10, motivos, trecho };
}

/** ~160 caracteres ao redor da primeira ocorrência, cortando em palavra inteira. */
export function trechoDoTexto(texto: string, palavra: string): string | undefined {
  const limpo = texto.replace(/\s+/g, ' ').trim();
  const r = raiz(normalizar(palavra));
  const achado = new RegExp(`(^|[^a-z0-9])${r}`).exec(normalizar(limpo));
  if (!achado) return undefined;
  const i = achado.index + achado[1].length;
  const inicio = Math.max(0, limpo.lastIndexOf(' ', Math.max(0, i - 60)));
  const fim = limpo.indexOf(' ', Math.min(limpo.length, i + 100));
  const corte = limpo.slice(inicio, fim < 0 ? undefined : fim).trim();
  return `${inicio > 0 ? '…' : ''}${corte}${fim > 0 && fim < limpo.length ? '…' : ''}`;
}

/** Frase de abertura da resposta: repete o que foi entendido, como uma conversa. */
export function resumoDaBusca(c: ConsultaInterpretada, total: number): string {
  const partes: string[] = [];
  if (c.tipos.length > 0) partes.push(c.tipos.map((t) => nomeTipo[t].toLowerCase()).join(' ou '));
  const tema = c.termos.length > 0 ? ` sobre “${c.termos.join(' ')}”` : '';
  const ano = c.anos.length > 0 ? ` para ${c.anos.map((a) => (a === 'infantil' ? 'a Ed. Infantil' : `o ${nomeAno[a]}`)).join(' e ')}` : '';
  const nivel = c.niveis.length > 0 ? `, nível ${c.niveis.map((n) => nomeNivel[n].toLowerCase()).join(' ou ')}` : '';
  const oQue = `${partes.length > 0 ? partes[0] : 'materiais'}${tema}${ano}${nivel}`;
  if (total === 0) return `Não encontrei ${oQue}. Tente dizer de outro jeito ou com menos detalhes.`;
  if (total === 1) return `Encontrei 1 sugestão de ${oQue}.`;
  return `Encontrei ${total} sugestões de ${oQue}. As que mais combinam vêm primeiro.`;
}
