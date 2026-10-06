import { coresApp, coresAppClara } from '@mdp/core';
import { useEsquema } from './use-esquema';

/**
 * Cores do tema atual para o que não passa por className — ícones e estilos
 * inline. As classes (bg-fundo etc.) trocam sozinhas pelas variáveis CSS.
 */
export function useCores() {
  return useEsquema() === 'light' ? coresAppClara : coresApp;
}
