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
import { coresApp } from '@mdp/core';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';

import { ProvedorDemo } from '../contexto/demo';
import { ativarMouseComoToque } from '../web/mouse-como-toque';
import '../global.css';

SplashScreen.preventAutoHideAsync();
ativarMouseComoToque();

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
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: coresApp.fundo },
        }}
      >
        <Stack.Screen name="(abas)" />
        <Stack.Screen name="material/[id]" />
      </Stack>
    </ProvedorDemo>
  );
}
