import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { View } from 'react-native';

import { MenuLateral } from '../../components/menu-lateral';
import { useCores } from '../../hooks/use-cores';
import { useEsquema, useNoAparelho } from '../../hooks/use-esquema';
import { useDesktopWeb } from '../../hooks/use-desktop-web';
import { voltarAoInicio } from '../../lib/voltar-ao-inicio';

/** Barra de abas do rodapé (A8 + D30); no desktop web, menu lateral. */
export default function LayoutAbas() {
  const cores = useCores();
  const esquema = useEsquema();
  // a barra de abas não sai igual no HTML pré-gerado (largura 0 some com os rótulos):
  // só aparece depois da hidratação, senão o React refaz a página inteira (#418, D51)
  const noAparelho = useNoAparelho();
  const desktop = useDesktopWeb();

  return (
    <View className="flex-1 flex-row">
      {desktop && <MenuLateral />}
      <View className="flex-1">
    <Tabs
      {...(noAparelho ? {} : { tabBar: () => null })}
      screenOptions={{
        headerShown: false,
        tabBarStyle: desktop
          ? { display: 'none' }
          : {
              backgroundColor:
                esquema === 'light' ? 'rgba(244,244,242,0.96)' : 'rgba(11,13,18,0.96)',
              borderTopColor: cores.superficie2,
            },
        tabBarActiveTintColor: cores.texto,
        tabBarInactiveTintColor: cores.texto2,
        tabBarLabelStyle: { fontFamily: 'NunitoSans_600SemiBold', fontSize: 10 },
      }}
    >
      <Tabs.Screen
        name="index"
        // tocar em Início sempre volta à tela principal da home (pergunta limpa + mosaico)
        listeners={{ tabPress: () => voltarAoInicio() }}
        options={{
          // D42: a home é a busca por pergunta, estilo assistente
          title: 'Início',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="sparkles" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="novidades"
        options={{
          title: 'Novidades',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="vitrine"
        options={{
          title: 'Vitrine',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="film" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ferramentas"
        options={{
          title: 'Ferramentas',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="meus"
        options={{
          title: 'Meus materiais',
          // mochilinha: os conteúdos que são dela (pedido do cliente, revisa A8)
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="bag-personal" size={size} color={color} />
          ),
        }}
      />
      {/* telas de detalhe: dentro do navegador de abas (barra sempre visível),
          mas sem botão próprio no rodapé */}
      <Tabs.Screen name="conta" options={{ href: null }} />
      <Tabs.Screen name="turmas" options={{ href: null }} />
      <Tabs.Screen name="material/[id]" options={{ href: null }} />
      <Tabs.Screen name="turma/[id]" options={{ href: null }} />
      <Tabs.Screen name="turma/criar" options={{ href: null }} />
      <Tabs.Screen name="formacao/[id]" options={{ href: null }} />
      <Tabs.Screen name="aula/[id]" options={{ href: null }} />
      <Tabs.Screen name="ferramenta/cruzadinha" options={{ href: null }} />
      <Tabs.Screen name="ferramenta/caca-palavras" options={{ href: null }} />
    </Tabs>
      </View>
    </View>
  );
}
