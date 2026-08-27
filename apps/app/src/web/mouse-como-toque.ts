import { Platform } from 'react-native';

/**
 * Só no web: faz o mouse se comportar como um dedo na tela. Segurar o botão
 * e arrastar rola o contêiner rolável mais próximo, no eixo dominante do
 * gesto (vertical ou horizontal), como num celular. No aparelho não faz nada.
 */

declare global {
  interface Window {
    __mouseComoToque?: boolean;
  }
}

function rolavelEmX(el: HTMLElement): boolean {
  const s = getComputedStyle(el);
  return (
    (s.overflowX === 'auto' || s.overflowX === 'scroll') &&
    el.scrollWidth > el.clientWidth + 1
  );
}

function rolavelEmY(el: HTMLElement): boolean {
  const s = getComputedStyle(el);
  return (
    (s.overflowY === 'auto' || s.overflowY === 'scroll') &&
    el.scrollHeight > el.clientHeight + 1
  );
}

export function ativarMouseComoToque(): void {
  if (Platform.OS !== 'web' || typeof document === 'undefined') return;
  if (window.__mouseComoToque) return;
  window.__mouseComoToque = true;

  let arrastando = false;
  let moveu = false;
  let x0 = 0;
  let y0 = 0;
  /** cadeia de ancestrais roláveis do ponto onde o gesto começou */
  let cadeia: { el: HTMLElement; left: number; top: number }[] = [];

  document.addEventListener(
    'mousedown',
    (e) => {
      if (e.button !== 0) return;
      const alvo = e.target as HTMLElement | null;
      // não sequestra campos de texto (seleção) nem barras nativas
      if (alvo?.closest('input, textarea, select')) return;
      arrastando = true;
      moveu = false;
      x0 = e.clientX;
      y0 = e.clientY;
      cadeia = [];
      let el: HTMLElement | null = alvo;
      while (el && el !== document.body) {
        if (rolavelEmX(el) || rolavelEmY(el)) {
          cadeia.push({ el, left: el.scrollLeft, top: el.scrollTop });
        }
        el = el.parentElement;
      }
    },
    true,
  );

  window.addEventListener('mousemove', (e) => {
    if (!arrastando || cadeia.length === 0) return;
    const dx = e.clientX - x0;
    const dy = e.clientY - y0;
    if (!moveu && Math.hypot(dx, dy) < 6) return;
    moveu = true;
    e.preventDefault();

    const horizontal = Math.abs(dx) > Math.abs(dy);
    const elo = horizontal
      ? cadeia.find((c) => rolavelEmX(c.el))
      : cadeia.find((c) => rolavelEmY(c.el));
    if (!elo) return;
    if (horizontal) elo.el.scrollLeft = elo.left - dx;
    else elo.el.scrollTop = elo.top - dy;
  });

  window.addEventListener('mouseup', () => {
    arrastando = false;
  });

  // depois de arrastar, engole o clique para não abrir um card sem querer
  document.addEventListener(
    'click',
    (e) => {
      if (moveu) {
        e.stopPropagation();
        e.preventDefault();
        moveu = false;
      }
    },
    true,
  );

  // sem seleção de texto acidental durante o arrasto
  document.addEventListener('selectstart', (e) => {
    if (arrastando && moveu) e.preventDefault();
  });
}
