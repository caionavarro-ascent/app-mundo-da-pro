import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useDemo } from '../contexto/demo';
import { useCores } from '../hooks/use-cores';

const CARTOES = [
  {
    icone: 'sparkles' as const,
    titulo: 'Todos os seus materiais num só lugar',
    texto:
      'Chega de PDF perdido no WhatsApp. Aqui você encontra, folheia e organiza tudo do Mundo da Prô em segundos.',
  },
  {
    icone: 'mail-open' as const,
    titulo: 'Entre com o e-mail da compra',
    texto:
      'Sem senha para decorar: você digita o e-mail que usou na compra e recebe um código de 6 dígitos. Pronto.',
  },
  {
    icone: 'cloud-offline' as const,
    titulo: 'Baixe, imprima e use sem internet',
    texto:
      'Os materiais baixados abrem na escola mesmo sem sinal, direto no modo avião — e vão para o xerox pelo próprio celular.',
  },
];

/** Primeira abertura (A15): três cartões curtos e puláveis, uma vez por sessão. */
export function PrimeiraAbertura() {
  const demo = useDemo();
  const cores = useCores();
  const [indice, setIndice] = useState(0);

  if (demo.viuAbertura) return null;
  const cartao = CARTOES[indice];
  const ultimo = indice === CARTOES.length - 1;

  return (
    <Modal visible transparent={false} animationType="fade">
      <SafeAreaView className="flex-1 bg-fundo">
        <View className="flex-1 justify-between p-6">
          <View className="items-end">
            <Pressable onPress={demo.concluirAbertura} hitSlop={12}>
              <Text className="font-corpo-medio text-sm text-texto-2">Pular</Text>
            </Pressable>
          </View>

          <View className="items-center gap-6 px-4">
            <View className="h-24 w-24 items-center justify-center rounded-full bg-superficie">
              <Ionicons name={cartao.icone} size={44} color={cores.marcaLegivel} />
            </View>
            <Text className="text-center font-titulo text-3xl leading-tight text-texto">
              {cartao.titulo}
            </Text>
            <Text className="text-center font-corpo text-base leading-relaxed text-texto-2">
              {cartao.texto}
            </Text>
          </View>

          <View className="gap-5">
            <View className="flex-row justify-center gap-2">
              {CARTOES.map((_, i) => (
                <View
                  key={i}
                  className={`h-2 rounded-full ${
                    i === indice ? 'w-6 bg-marca' : 'w-2 bg-superficie-2'
                  }`}
                />
              ))}
            </View>
            <Pressable
              onPress={() =>
                ultimo ? demo.concluirAbertura() : setIndice((i) => i + 1)
              }
              className="items-center rounded-full bg-botao-prim py-4"
            >
              <Text className="font-corpo-forte text-base text-botao-prim-texto">
                {ultimo ? 'Começar' : 'Continuar'}
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
