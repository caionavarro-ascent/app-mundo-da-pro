import {
  BricolageGrotesque_600SemiBold,
  BricolageGrotesque_700Bold,
} from '@expo-google-fonts/bricolage-grotesque';
import {
  InstrumentSans_400Regular,
  InstrumentSans_500Medium,
  InstrumentSans_600SemiBold,
} from '@expo-google-fonts/instrument-sans';
import { PatrickHand_400Regular } from '@expo-google-fonts/patrick-hand';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { colorScheme, useColorScheme } from 'nativewind';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';

import { FolhaSalvarGlobal } from '../components/folha-salvar';
import { PrimeiraAbertura } from '../components/primeira-abertura';
import { ProvedorDemo } from '../contexto/demo';
import { useCores } from '../hooks/use-cores';
import { ativarMouseComoToque } from '../web/mouse-como-toque';
import '../global.css';

SplashScreen.preventAutoHideAsync();
ativarMouseComoToque();
// o escuro é o tema padrão do app (D14); o switch da demo alterna.
// A guarda evita o render estático do web, que roda fora do browser.
if (typeof window !== 'undefined') {
  colorScheme.set('dark');
}

function Navegacao() {
  const cores = useCores();
  const { colorScheme: esquema } = useColorScheme();

  const conteudo = (
    <>
      <StatusBar style={esquema === 'light' ? 'dark' : 'light'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: cores.fundo },
        }}
      >
        <Stack.Screen name="(abas)" />
        <Stack.Screen name="turmas" />
        <Stack.Screen name="material/[id]" />
        <Stack.Screen name="turma/[id]" />
        <Stack.Screen name="formacao/[id]" />
        <Stack.Screen name="aula/[id]" />
      </Stack>
      <FolhaSalvarGlobal />
      <PrimeiraAbertura />
    </>
  );

  return conteudo;
}

export default function LayoutRaiz() {
  const [fontesProntas] = useFonts({
    BricolageGrotesque_600SemiBold,
    BricolageGrotesque_700Bold,
    InstrumentSans_400Regular,
    InstrumentSans_500Medium,
    InstrumentSans_600SemiBold,
    PatrickHand_400Regular,
  });

  useEffect(() => {
    if (fontesProntas) SplashScreen.hideAsync();
  }, [fontesProntas]);

  if (!fontesProntas) return null;

  return (
    <ProvedorDemo>
      <Navegacao />
    </ProvedorDemo>
  );
}
