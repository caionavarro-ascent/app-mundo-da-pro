import { coresApp, coresAppClara } from '@mdp/core';
import { useColorScheme } from 'nativewind';

/**
 * Cores do tema atual para o que não passa por className — ícones e estilos
 * inline. As classes (bg-fundo etc.) trocam sozinhas pelas variáveis CSS.
 */
export function useCores() {
  const { colorScheme } = useColorScheme();
  return colorScheme === 'light' ? coresAppClara : coresApp;
}
