import { Baloo2_600SemiBold, Baloo2_700Bold } from '@expo-google-fonts/baloo-2';
import {
  NunitoSans_400Regular,
  NunitoSans_600SemiBold,
  NunitoSans_700Bold,
} from '@expo-google-fonts/nunito-sans';
import { PatrickHand_400Regular } from '@expo-google-fonts/patrick-hand';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import Head from 'expo-router/head';
import * as SplashScreen from 'expo-splash-screen';
import { colorScheme } from 'nativewind';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';

import { FolhaSalvarGlobal } from '../components/folha-salvar';
import { PrimeiraAbertura } from '../components/primeira-abertura';
import { ProvedorDemo } from '../contexto/demo';
import { ProvedorSessao } from '../contexto/sessao';
import { useCores } from '../hooks/use-cores';
import { useEsquema } from '../hooks/use-esquema';
import { ativarMouseComoToque } from '../web/mouse-como-toque';
import '../global.css';

SplashScreen.preventAutoHideAsync();
ativarMouseComoToque();
// o claro é o tema padrão do app (D54); o switch da Conta alterna para o escuro.
// A guarda evita o render estático do web, que roda fora do browser.
if (typeof window !== 'undefined') {
  colorScheme.set('light');
}

function Navegacao() {
  const cores = useCores();
  const esquema = useEsquema();

  const conteudo = (
    <>
      {/* título da aba do navegador (D51): pelo Head do Expo Router (react-helmet), que
          senão gera um <title> vazio antes de qualquer outro no HTML pré-gerado */}
      <Head>
        <title>Mundo da Prô | Clube Pedagógico</title>
      </Head>
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
    NunitoSans_600SemiBold,
    NunitoSans_700Bold,
    PatrickHand_400Regular,
  });

  useEffect(() => {
    if (fontesProntas) SplashScreen.hideAsync();
  }, [fontesProntas]);

  if (!fontesProntas) return null;

  return (
    <ProvedorSessao>
      <ProvedorDemo>
        <Navegacao />
      </ProvedorDemo>
    </ProvedorSessao>
  );
}
