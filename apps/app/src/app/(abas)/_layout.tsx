import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { Text, View } from 'react-native';

import { useDemo } from '../../contexto/demo';
import { useCores } from '../../hooks/use-cores';

/** Barra de abas do rodapé (A8 + D30). */
export default function LayoutAbas() {
  const demo = useDemo();
  const cores = useCores();
  const { colorScheme: esquema } = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor:
            esquema === 'light' ? 'rgba(244,244,242,0.96)' : 'rgba(11,13,18,0.96)',
          borderTopColor: cores.superficie2,
        },
        tabBarActiveTintColor: cores.texto,
        tabBarInactiveTintColor: cores.texto2,
        tabBarLabelStyle: { fontFamily: 'InstrumentSans_500Medium', fontSize: 10 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="novidades"
        options={{
          title: 'Novidades',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="sparkles" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="buscar"
        options={{
          title: 'Buscar',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="turmas"
        options={{
          title: 'Turmas',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="meus"
        options={{
          title: 'Meus materiais',
          // A8: o ícone desta aba usa as iniciais da professora
          tabBarIcon: () => (
            <View
              className="h-6 w-6 items-center justify-center rounded-full"
              style={{ backgroundColor: cores.marca }}
            >
              <Text className="font-corpo-forte text-[11px] text-[#16191F]">
                {demo.nome.charAt(0)}
              </Text>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
