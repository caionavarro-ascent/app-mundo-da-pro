/**
 * Leitura do acervo "carimbada" com a versão do contexto (D43, D51).
 *
 * O acervo mora num array do módulo (@mdp/core mock) e os materiais do painel
 * entram nele depois da primeira renderização. O React Compiler memoriza pelo
 * que é reativo DENTRO do cálculo; uma leitura sem valor reativo (`novidades()`,
 * `materialPorId(id)` com o mesmo id) ficaria congelada no acervo inicial.
 * Passar `demo.versaoAcervo` aqui faz o compilador refazer quando o painel chega.
 *
 *   const lista = doAcervo(() => novidades(), demo.versaoAcervo);
 */
export function doAcervo<T>(ler: () => T, _versao: number): T {
  return ler();
}
