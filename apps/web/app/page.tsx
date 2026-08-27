/**
 * Página provisória do Bloco 0. O site público e o /admin
 * entram nos Blocos 2 a 4.
 */
export default function PaginaInicial() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-3 p-8">
      <h1 className="text-3xl font-semibold text-tinta">Mundo da Prô</h1>
      <p className="text-tinta-clara">
        Fundação do site e do painel — em construção.
      </p>
    </main>
  );
}
