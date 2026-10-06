import { useSyncExternalStore } from 'react';
import { Dimensions, Platform } from 'react-native';

const LARGURA_DESKTOP = 1024;

function assinar(aoMudar: () => void) {
  const inscricao = Dimensions.addEventListener('change', aoMudar);
  return () => inscricao.remove();
}

/**
 * Web em tela larga: layout de desktop (menu lateral, hero widescreen).
 * useSyncExternalStore com "não" como valor do servidor: a página pré-gerada no
 * build não sabe a largura, e na hidratação o React usa esse mesmo valor antes de
 * trocar para o real. Com useWindowDimensions direto, o desktop divergia do HTML
 * pré-gerado e o React acusava o erro de hidratação #418 (D51).
 */
export function useDesktopWeb(): boolean {
  return useSyncExternalStore(
    assinar,
    () => Platform.OS === 'web' && Dimensions.get('window').width >= LARGURA_DESKTOP,
    () => false,
  );
}
