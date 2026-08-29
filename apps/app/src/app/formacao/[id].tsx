import { Ionicons } from '@expo/vector-icons';
import { formatarDuracao, formatarPreco } from '@mdp/core';
import { produtoPorId } from '@mdp/core/src/mock/acervo';
import {
  aulasDoModulo,
  aulasPanda,
  modulosDaFormacao,
} from '@mdp/core/src/mock/aulas-panda';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useDemo } from '../../contexto/demo';
import { useCores } from '../../hooks/use-cores';

/**
 * Página da formação (D31): módulos e aulas reais vindas do Panda.
 * A primeira aula é demonstração aberta; o resto pede a posse.
 */
export default function FichaFormacao() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const demo = useDemo();
  const cores = useCores();

  const formacao = id === 'fda' || id === 'fpt' ? id : null;
  const produto = formacao ? produtoPorId(formacao) : undefined;
  if (!formacao || !produto) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-fundo">
        <Text className="font-corpo text-texto-2">Formação não encontrada.</Text>
      </SafeAreaView>
    );
  }

  const liberado =
    demo.posse.includes(formacao) || demo.posse.includes('acesso-total');
  const idDemonstracao = aulasPanda.find((a) => a.formacao === formacao)?.id;
  const modulos = modulosDaFormacao(formacao);
  const totalAulas = aulasPanda.filter((a) => a.formacao === formacao).length;

  return (
    <SafeAreaView className="flex-1 bg-fundo" edges={['top']}>
      <ScrollView contentContainerClassName="gap-5 pb-10">
        <View style={{ backgroundColor: produto.cor }} className="gap-3 p-4 pb-6">
          <Pressable
            onPress={() => router.back()}
            hitSlop={8}
            className="self-start rounded-full bg-black/50 p-2"
          >
            <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
          </Pressable>
          <View className="gap-1 pt-4">
            <Text className="font-corpo-forte text-xs uppercase text-white/80">
              Formação · {modulos.length} módulos · {totalAulas} aulas
            </Text>
            <Text className="font-titulo text-3xl leading-tight text-white">
              {produto.nome}
            </Text>
            <Text className="font-corpo text-sm leading-snug text-white/90">
              {produto.pitchParaQuem}
            </Text>
          </View>
        </View>

        {!liberado && (
          <View className="mx-4 gap-2 rounded-2xl bg-superficie p-4">
            <Text className="font-corpo text-sm leading-snug text-texto-2">
              A primeira aula é aberta — assista e conheça o formato. As demais são
              liberadas com a formação.
            </Text>
            <Pressable
              onPress={() =>
                Alert.alert(
                  'Checkout',
                  'Abre o checkout no navegador do sistema, com Pix e 12x (Bloco 10).',
                )
              }
              className="items-center rounded-lg bg-botao-prim py-3"
            >
              <Text className="font-corpo-forte text-base text-botao-prim-texto">
                Quero a formação · {formatarPreco(produto.precoCentavos)}
              </Text>
            </Pressable>
          </View>
        )}

        {modulos.map((modulo) => (
          <View key={modulo} className="gap-2 px-4">
            <Text className="font-titulo-semi text-lg text-texto">{modulo}</Text>
            {aulasDoModulo(formacao, modulo).map((aula) => {
              const aberta = liberado || aula.id === idDemonstracao;
              return (
                <Link
                  key={aula.id}
                  href={{ pathname: '/aula/[id]', params: { id: aula.id } }}
                  asChild
                >
                  <Pressable className="flex-row items-center gap-3 rounded-xl bg-superficie p-3.5">
                    <View
                      className="h-9 w-9 items-center justify-center rounded-full"
                      style={{ backgroundColor: aberta ? produto.cor : cores.superficie2 }}
                    >
                      <Ionicons
                        name={aberta ? 'play' : 'lock-closed'}
                        size={16}
                        color={aberta ? '#FFFFFF' : cores.texto2}
                      />
                    </View>
                    <View className="flex-1">
                      <Text
                        className="font-corpo-medio text-sm leading-snug text-texto"
                        numberOfLines={2}
                      >
                        {aula.titulo}
                      </Text>
                      <Text className="font-corpo text-xs text-texto-2">
                        {aula.id === idDemonstracao && !liberado
                          ? 'Demonstração aberta'
                          : formatarDuracao(aula.duracaoSegundos)}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={cores.texto2} />
                  </Pressable>
                </Link>
              );
            })}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
