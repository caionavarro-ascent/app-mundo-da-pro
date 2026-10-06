/**
 * Base comum das atividades geradas (D44): cruzadinha e caça-palavras.
 * Listas temáticas prontas (com dica para a cruzadinha), limpeza das palavras
 * e o sorteio com semente, para a prévia do app e o PDF saírem idênticos.
 */

export interface PalavraDaAtividade {
  palavra: string;
  /** só a cruzadinha usa; sem dica, a folha sai com banco de palavras */
  dica?: string;
}

export interface TemaDePalavras {
  id: string;
  nome: string;
  palavras: PalavraDaAtividade[];
}

/** Cabeçalho da folha, como a professora já usa no papel (print do cliente, D44). */
export interface CabecalhoDaFolha {
  escola: string;
  professora: string;
  /** ex.: "4º ano A" */
  turma: string;
}

export const temasDePalavras: TemaDePalavras[] = [
  {
    id: 'animais',
    nome: 'Animais',
    palavras: [
      { palavra: 'GATO', dica: 'Animal que mia.' },
      { palavra: 'CACHORRO', dica: 'Animal que late.' },
      { palavra: 'PATO', dica: 'Ave que nada e faz quá-quá.' },
      { palavra: 'VACA', dica: 'Animal que dá leite.' },
      { palavra: 'CAVALO', dica: 'Animal que relincha.' },
      { palavra: 'GALINHA', dica: 'Ave que bota ovos.' },
      { palavra: 'PEIXE', dica: 'Vive na água e tem nadadeiras.' },
      { palavra: 'MACACO', dica: 'Adora banana e pula de galho em galho.' },
      { palavra: 'LEÃO', dica: 'É chamado de rei da selva.' },
      { palavra: 'SAPO', dica: 'Pula e coaxa perto da lagoa.' },
      { palavra: 'COELHO', dica: 'Tem orelhas compridas e gosta de cenoura.' },
      { palavra: 'ELEFANTE', dica: 'Animal grande com tromba.' },
    ],
  },
  {
    id: 'frutas',
    nome: 'Frutas',
    palavras: [
      { palavra: 'BANANA', dica: 'Fruta amarela e comprida.' },
      { palavra: 'MAÇÃ', dica: 'Fruta vermelha, famosa na história da Branca de Neve.' },
      { palavra: 'UVA', dica: 'Fruta pequena que nasce em cachos.' },
      { palavra: 'LARANJA', dica: 'Fruta que dá um suco muito comum no café da manhã.' },
      { palavra: 'MELANCIA', dica: 'Fruta grande, verde por fora e vermelha por dentro.' },
      { palavra: 'ABACAXI', dica: 'Fruta com coroa e casca espinhenta.' },
      { palavra: 'MORANGO', dica: 'Fruta vermelha com sementinhas por fora.' },
      { palavra: 'PERA', dica: 'Fruta verde ou amarela, parecida com a maçã.' },
      { palavra: 'MANGA', dica: 'Fruta de caroço grande e polpa amarela.' },
      { palavra: 'LIMÃO', dica: 'Fruta azeda usada na limonada.' },
      { palavra: 'CAJU', dica: 'A castanha dele é a verdadeira fruta.' },
      { palavra: 'GOIABA', dica: 'Fruta usada para fazer goiabada.' },
    ],
  },
  {
    id: 'cores',
    nome: 'Cores',
    palavras: [
      { palavra: 'AZUL', dica: 'Cor do céu num dia bonito.' },
      { palavra: 'VERMELHO', dica: 'Cor do morango.' },
      { palavra: 'AMARELO', dica: 'Cor do sol e da banana.' },
      { palavra: 'VERDE', dica: 'Cor das folhas.' },
      { palavra: 'PRETO', dica: 'Cor do céu à noite.' },
      { palavra: 'BRANCO', dica: 'Cor da nuvem e do leite.' },
      { palavra: 'ROSA', dica: 'Cor que também é nome de flor.' },
      { palavra: 'ROXO', dica: 'Cor da uva.' },
      { palavra: 'LARANJA', dica: 'Cor que também é nome de fruta.' },
      { palavra: 'MARROM', dica: 'Cor do chocolate.' },
    ],
  },
  {
    id: 'corpo',
    nome: 'Corpo humano',
    palavras: [
      { palavra: 'CABEÇA', dica: 'Parte do corpo onde fica o cérebro.' },
      { palavra: 'OLHO', dica: 'Usamos para enxergar.' },
      { palavra: 'NARIZ', dica: 'Usamos para sentir cheiros.' },
      { palavra: 'BOCA', dica: 'Usamos para comer e falar.' },
      { palavra: 'ORELHA', dica: 'Usamos para ouvir.' },
      { palavra: 'MÃO', dica: 'Tem cinco dedos e usamos para escrever.' },
      { palavra: 'PÉ', dica: 'Usamos para andar.' },
      { palavra: 'BRAÇO', dica: 'Fica entre o ombro e a mão.' },
      { palavra: 'PERNA', dica: 'Fica entre o quadril e o pé.' },
      { palavra: 'JOELHO', dica: 'Dobra no meio da perna.' },
      { palavra: 'DENTE', dica: 'Usamos para mastigar e escovamos todo dia.' },
      { palavra: 'CABELO', dica: 'Cresce na cabeça e penteamos.' },
    ],
  },
  {
    id: 'escola',
    nome: 'Escola',
    palavras: [
      { palavra: 'LÁPIS', dica: 'Usamos para escrever e dá para apagar.' },
      { palavra: 'BORRACHA', dica: 'Usamos para apagar o lápis.' },
      { palavra: 'CADERNO', dica: 'Onde fazemos as lições.' },
      { palavra: 'MOCHILA', dica: 'Levamos o material nas costas.' },
      { palavra: 'LIVRO', dica: 'Tem páginas com histórias para ler.' },
      { palavra: 'RÉGUA', dica: 'Usamos para medir e traçar linhas retas.' },
      { palavra: 'TESOURA', dica: 'Usamos para recortar papel.' },
      { palavra: 'COLA', dica: 'Usamos para grudar papel.' },
      { palavra: 'LOUSA', dica: 'Onde a professora escreve na sala.' },
      { palavra: 'ESTOJO', dica: 'Onde guardamos lápis e canetas.' },
      { palavra: 'RECREIO', dica: 'Hora de brincar e lanchar na escola.' },
      { palavra: 'PROFESSORA', dica: 'Quem ensina na sala de aula.' },
    ],
  },
  {
    id: 'brinquedos',
    nome: 'Brinquedos e brincadeiras',
    palavras: [
      { palavra: 'BOLA', dica: 'Redonda, usada no futebol.' },
      { palavra: 'BONECA', dica: 'Brinquedo parecido com uma pessoa.' },
      { palavra: 'PIPA', dica: 'Voa alto presa a uma linha.' },
      { palavra: 'PETECA', dica: 'Jogamos para cima com a palma da mão.' },
      { palavra: 'PIÃO', dica: 'Brinquedo que gira no chão.' },
      { palavra: 'CORDA', dica: 'Usamos para pular.' },
      { palavra: 'CARRINHO', dica: 'Brinquedo com rodas.' },
      { palavra: 'AMARELINHA', dica: 'Pulamos em casas desenhadas no chão.' },
      { palavra: 'BALANÇO', dica: 'Vai e vem no parquinho.' },
      { palavra: 'ESCONDE', dica: 'Brincadeira de achar quem se escondeu: ___-esconde.' },
    ],
  },
  {
    id: 'transportes',
    nome: 'Meios de transporte',
    palavras: [
      { palavra: 'CARRO', dica: 'Tem quatro rodas e anda na rua.' },
      { palavra: 'ÔNIBUS', dica: 'Leva muitas pessoas pela cidade.' },
      { palavra: 'AVIÃO', dica: 'Voa pelo céu levando passageiros.' },
      { palavra: 'BARCO', dica: 'Navega na água.' },
      { palavra: 'TREM', dica: 'Anda sobre trilhos.' },
      { palavra: 'BICICLETA', dica: 'Tem duas rodas e pedais.' },
      { palavra: 'MOTO', dica: 'Tem duas rodas e motor.' },
      { palavra: 'NAVIO', dica: 'Barco bem grande que atravessa o mar.' },
      { palavra: 'CAMINHÃO', dica: 'Leva cargas pesadas pela estrada.' },
      { palavra: 'HELICÓPTERO', dica: 'Voa com hélices em cima.' },
    ],
  },
  {
    id: 'familia',
    nome: 'Família',
    palavras: [
      { palavra: 'MÃE', dica: 'Quem cuida de nós desde que nascemos.' },
      { palavra: 'PAI', dica: 'O marido da mamãe.' },
      { palavra: 'AVÓ', dica: 'A mãe da mamãe ou do papai.' },
      { palavra: 'AVÔ', dica: 'O pai da mamãe ou do papai.' },
      { palavra: 'IRMÃO', dica: 'Menino filho dos mesmos pais que eu.' },
      { palavra: 'IRMÃ', dica: 'Menina filha dos mesmos pais que eu.' },
      { palavra: 'TIO', dica: 'O irmão da mamãe ou do papai.' },
      { palavra: 'TIA', dica: 'A irmã da mamãe ou do papai.' },
      { palavra: 'PRIMO', dica: 'O filho do meu tio.' },
      { palavra: 'BEBÊ', dica: 'Quem acabou de nascer.' },
    ],
  },
];

/**
 * Letra da grade: maiúscula e sem acento (a criança não precisa decidir o acento
 * no quadradinho), mas o Ç fica, porque é outra letra.
 */
export function letrasDaGrade(palavra: string): string[] {
  return [...palavra.toUpperCase()]
    .map((c) => (c === 'Ç' ? c : c.normalize('NFD').replace(/[̀-ͯ]/g, '')))
    .filter((c) => /^[A-ZÇ]$/.test(c));
}

/** Como a palavra aparece no banco e nas dicas: maiúscula, com acento, sem espaços. */
export function palavraExibida(palavra: string): string {
  return palavra.trim().toUpperCase().replace(/\s+/g, '');
}

/** Sorteio com semente (mulberry32): mesma semente, mesma atividade no app e no PDF. */
export function sorteador(semente: number): () => number {
  let a = semente >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function embaralhar<T>(lista: T[], aleatorio: () => number): T[] {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(aleatorio() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

/**
 * Sorteia palavras do repertório de um material (D45): cada semente é uma versão
 * nova da atividade, e a mesma semente repete a mesma (prévia = PDF).
 * `comDica` (cruzadinha): com 5+ palavras com dica, sai só com elas (folha de dicas);
 * senão, sai sem nenhuma dica (folha com banco de palavras), para não misturar os dois.
 */
export function sortearDoRepertorio(
  repertorio: PalavraDaAtividade[],
  quantidade: number,
  semente: number,
  comDica: boolean,
): PalavraDaAtividade[] {
  const embaralhadas = embaralhar(repertorio, sorteador(semente * 7919 + 13));
  if (!comDica) return embaralhadas.slice(0, quantidade).map(({ palavra }) => ({ palavra }));
  const comDicaPronta = embaralhadas.filter((p) => p.dica);
  if (comDicaPronta.length >= Math.min(5, quantidade)) return comDicaPronta.slice(0, quantidade);
  return embaralhadas.slice(0, quantidade).map(({ palavra }) => ({ palavra }));
}
