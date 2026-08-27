import { exemploNivel, nomeNivel, type NivelEscrita } from '@mdp/core';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Tela provisória do Bloco 0: comprova tema, fontes e tokens.
 * A vitrine de verdade entra no Bloco 7.
 */
export default function TelaFundacao() {
  const niveis = Object.keys(nomeNivel) as NivelEscrita[];

  return (
    <SafeAreaView className="flex-1 bg-fundo">
      <ScrollView contentContainerClassName="gap-6 p-6">
        <View className="gap-1">
          <Text className="font-titulo text-3xl text-texto">Mundo da Prô</Text>
          <Text className="font-corpo text-base text-texto-2">
            Fundação pronta — a vitrine vem nos próximos blocos.
          </Text>
        </View>

        <View className="gap-3 rounded-2xl bg-superficie p-4">
          <Text className="font-corpo-forte text-sm uppercase text-texto-2">
            Níveis de escrita
          </Text>
          {niveis.map((nivel) => (
            <View
              key={nivel}
              className="flex-row items-center justify-between rounded-xl bg-superficie-2 px-4 py-3"
            >
              <Text className="font-corpo-medio text-base text-texto">
                {nomeNivel[nivel]}
              </Text>
              <Text className="font-manuscrito text-xl text-marca">
                {exemploNivel[nivel]}
              </Text>
            </View>
          ))}
        </View>

        <View className="items-center rounded-full bg-white py-4">
          <Text className="font-corpo-forte text-base text-fundo">
            Botão primário da referência
          </Text>
        </View>

        <Text className="text-center font-corpo text-sm text-texto-2">
          Amostra visual do tema — nada nesta tela é clicável ainda.{'\n'}
          As abas chegam no Bloco 6 e a vitrine no Bloco 7.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
