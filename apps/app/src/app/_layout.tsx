import { Baloo2_600SemiBold, Baloo2_700Bold } from '@expo-google-fonts/baloo-2';
import {
  NunitoSans_400Regular,
  NunitoSans_500Medium,
  NunitoSans_700Bold,
} from '@expo-google-fonts/nunito-sans';
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
      </Stack>
      <FolhaSalvarGlobal />
      <PrimeiraAbertura />
    </>
  );

  return conteudo;
}

export default function LayoutRaiz() {
  const [fontesProntas] = useFonts({
    Baloo2_600SemiBold,
    Baloo2_700Bold,
    NunitoSans_400Regular,
    NunitoSans_500Medium,
    NunitoSans_700Bold,
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
