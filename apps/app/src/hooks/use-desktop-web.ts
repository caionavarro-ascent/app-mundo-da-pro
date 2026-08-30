import { Platform, useWindowDimensions } from 'react-native';

/** Web em tela larga: layout de desktop (menu lateral, hero widescreen). */
export function useDesktopWeb(): boolean {
  const { width } = useWindowDimensions();
  return Platform.OS === 'web' && width >= 1024;
}
