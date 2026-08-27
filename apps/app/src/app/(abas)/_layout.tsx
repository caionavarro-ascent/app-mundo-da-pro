import { Ionicons } from '@expo/vector-icons';
import { coresApp } from '@mdp/core';
import { Tabs } from 'expo-router';
import { Text, View } from 'react-native';

import { useDemo } from '../../contexto/demo';

/** Barra de abas do rodapé (A8): Início, Novidades, Buscar, Meus materiais. */
export default function LayoutAbas() {
  const demo = useDemo();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(11,13,18,0.96)',
          borderTopColor: coresApp.superficie2,
        },
        tabBarActiveTintColor: coresApp.texto,
        tabBarInactiveTintColor: coresApp.texto2,
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
        name="meus"
        options={{
          title: 'Meus materiais',
          // A8: o ícone desta aba usa as iniciais da professora
          tabBarIcon: ({ color }) => (
            <View
              className="h-6 w-6 items-center justify-center rounded-full"
              style={{ backgroundColor: coresApp.marca }}
            >
              <Text className="font-corpo-forte text-[11px] text-fundo">
                {demo.nome.charAt(0)}
              </Text>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
