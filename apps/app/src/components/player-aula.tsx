import { Platform, View } from 'react-native';

/**
 * Player das aulas (D31): o vídeo fica hospedado no Panda Video e o app só
 * embute o player — WebView pontual no aparelho, iframe no web. É o único
 * uso de WebView fora de checkout e páginas legais, permitido por ser um
 * player, não uma tela do app (LOJAS.md §1).
 */
export function PlayerAula({ url }: { url: string }) {
  if (Platform.OS === 'web') {
    return (
      <View
        className="mx-4 overflow-hidden rounded-xl bg-black"
        style={{ aspectRatio: 16 / 9 }}
      >
        <iframe
          src={url}
          style={{ border: 0, width: '100%', height: '100%' }}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </View>
    );
  }

  // import dinâmico: react-native-webview não existe no bundle web
  const { WebView } = require('react-native-webview');
  return (
    <View
      className="mx-4 overflow-hidden rounded-xl bg-black"
      style={{ aspectRatio: 16 / 9 }}
    >
      <WebView
        source={{ uri: url }}
        allowsFullscreenVideo
        allowsInlineMediaPlayback
        style={{ backgroundColor: '#000000' }}
      />
    </View>
  );
}
