import { useColorScheme } from 'nativewind';
import { useSyncExternalStore } from 'react';

const nuncaMuda = () => () => {};

/**
 * Tema para o que não passa por className (cores inline, logo, ícones, D51).
 * A página web é pré-gerada no build, onde o nativewind responde "light"; no
 * aparelho o app nasce claro (D54). Lido direto, o tema divergia na
 * hidratação e o React deixava cores erradas ("won't be patched up").
 * Durante a hidratação vale o claro, igual ao HTML pré-gerado; depois, o real.
 */
export function useEsquema(): 'light' | 'dark' {
  const { colorScheme } = useColorScheme();
  const noAparelho = useSyncExternalStore(
    nuncaMuda,
    () => true,
    () => false,
  );
  return noAparelho && colorScheme === 'dark' ? 'dark' : 'light';
}

/** true só depois da hidratação: para o que o HTML pré-gerado não consegue desenhar igual. */
export function useNoAparelho(): boolean {
  return useSyncExternalStore(
    nuncaMuda,
    () => true,
    () => false,
  );
}
