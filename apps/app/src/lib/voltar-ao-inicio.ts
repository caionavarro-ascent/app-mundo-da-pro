/**
 * Toque em "Início" (aba do rodapé ou menu lateral do desktop): a home volta à
 * tela principal, com a pergunta limpa e o mosaico (D42/D43). Só no toque, e não
 * ao ganhar foco: quem volta de um material para as respostas continua nelas.
 */
type Ouvinte = () => void;

const ouvintes = new Set<Ouvinte>();

export function aoVoltarAoInicio(ouvinte: Ouvinte): () => void {
  ouvintes.add(ouvinte);
  return () => {
    ouvintes.delete(ouvinte);
  };
}

export function voltarAoInicio(): void {
  for (const ouvinte of ouvintes) ouvinte();
}
