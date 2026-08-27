import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';

/**
 * Só no web: permite arrastar listas horizontais com o mouse, já que o
 * react-native-web não traduz drag de mouse em rolagem (no aparelho o toque
 * rola nativamente e este hook não faz nada).
 */
export function useArrastarMouseWeb<T>(chaveRemontagem?: unknown) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const node = (ref.current as { getScrollableNode?: () => HTMLElement } | null)
      ?.getScrollableNode?.();
    if (!node) return;

    let arrastando = false;
    let moveu = false;
    let xInicial = 0;
    let scrollInicial = 0;

    const aoDescer = (e: MouseEvent) => {
      arrastando = true;
      moveu = false;
      xInicial = e.clientX;
      scrollInicial = node.scrollLeft;
    };
    const aoMover = (e: MouseEvent) => {
      if (!arrastando) return;
      const dx = e.clientX - xInicial;
      if (Math.abs(dx) > 5) moveu = true;
      if (moveu) {
        node.scrollLeft = scrollInicial - dx;
        e.preventDefault();
      }
    };
    const aoSoltar = () => {
      arrastando = false;
    };
    // depois de arrastar, engole o clique para não abrir o card sem querer
    const aoClicar = (e: MouseEvent) => {
      if (moveu) {
        e.stopPropagation();
        e.preventDefault();
        moveu = false;
      }
    };

    node.style.cursor = 'grab';
    node.addEventListener('mousedown', aoDescer);
    window.addEventListener('mousemove', aoMover);
    window.addEventListener('mouseup', aoSoltar);
    node.addEventListener('click', aoClicar, true);
    return () => {
      node.removeEventListener('mousedown', aoDescer);
      window.removeEventListener('mousemove', aoMover);
      window.removeEventListener('mouseup', aoSoltar);
      node.removeEventListener('click', aoClicar, true);
    };
    // chaveRemontagem: reanexa quando a lista some (filtro) e volta a existir
  }, [chaveRemontagem]);

  return ref;
}
