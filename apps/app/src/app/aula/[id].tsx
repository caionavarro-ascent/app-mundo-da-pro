import { Ionicons } from '@expo/vector-icons';
import { formatarDuracao, formatarPreco } from '@mdp/core';
import { produtoPorId } from '@mdp/core/src/mock/acervo';
import { aulaPorId, aulasDoModulo, aulasPanda } from '@mdp/core/src/mock/aulas-panda';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PlayerAula } from '../../components/player-aula';
import { useDemo } from '../../contexto/demo';
import { useCores } from '../../hooks/use-cores';

/** Tela de aula (D31): player do Panda, com as próximas aulas do módulo. */
export default function TelaAula() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const demo = useDemo();
  const cores = useCores();

  const aula = aulaPorId(id);
  const produto = aula ? produtoPorId(aula.formacao) : undefined;
  if (!aula || !produto) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-fundo">
        <Text className="font-corpo text-texto-2">Aula não encontrada.</Text>
      </SafeAreaView>
    );
  }

  const liberado =
    demo.posse.includes(aula.formacao) || demo.posse.includes('acesso-total');
  const idDemonstracao = aulasPanda.find((a) => a.formacao === aula.formacao)?.id;
  const aberta = liberado || aula.id === idDemonstracao;
  const doModulo = aulasDoModulo(aula.formacao, aula.modulo).filter(
    (a) => a.id !== aula.id,
  );

  return (
    <SafeAreaView className="flex-1 bg-fundo" edges={['top']}>
      <ScrollView contentContainerStyle={{ maxWidth: 960, width: '100%', alignSelf: 'center' }}
        contentContainerClassName="gap-5 pb-10">
        <View className="flex-row items-center gap-3 px-4 pt-2">
          <Pressable
            onPress={() =>
              router.canGoBack()
                ? router.back()
                : router.replace({ pathname: '/formacao/[id]', params: { id: aula.formacao } })
            }
            hitSlop={8}
            className="rounded-full bg-superficie p-2"
          >
            <Ionicons name="chevron-back" size={20} color={cores.texto} />
          </Pressable>
          <View className="flex-1">
            <Text className="font-corpo-forte text-xs uppercase text-texto-2">
              {produto.nome} · {aula.modulo}
            </Text>
            <Text className="font-titulo-semi text-lg leading-snug text-texto" numberOfLines={2}>
              {aula.titulo}
            </Text>
          </View>
        </View>

        {aberta ? (
          <PlayerAula url={aula.embedUrl} />
        ) : (
          <View className="mx-4 items-center gap-3 rounded-2xl bg-superficie p-6">
            <Ionicons name="lock-closed" size={28} color={cores.texto2} />
            <Text className="text-center font-corpo text-sm leading-snug text-texto-2">
              Esta aula faz parte da {produto.nome}. A primeira aula da formação é
              aberta para você conhecer o formato.
            </Text>
            <Pressable
              onPress={() =>
                Alert.alert(
                  'Checkout',
                  'Abre o checkout no navegador do sistema, com Pix e 12x (Bloco 10).',
                )
              }
              className="items-center self-stretch rounded-lg bg-botao-prim py-3"
            >
              <Text className="font-corpo-forte text-base text-botao-prim-texto">
                Desbloquear por {formatarPreco(produto.precoCentavos)}
              </Text>
            </Pressable>
          </View>
        )}

        {doModulo.length > 0 && (
          <View className="gap-2 px-4">
            <Text className="font-corpo-forte text-sm uppercase text-texto-2">
              Mais aulas do {aula.modulo}
            </Text>
            {doModulo.slice(0, 8).map((proxima) => (
              <Link
                key={proxima.id}
                href={{ pathname: '/aula/[id]', params: { id: proxima.id } }}
                replace
                asChild
              >
                <Pressable className="flex-row items-center gap-3 rounded-xl bg-superficie p-3">
                  <Ionicons
                    name={liberado || proxima.id === idDemonstracao ? 'play-circle' : 'lock-closed'}
                    size={20}
                    color={cores.texto2}
                  />
                  <Text
                    className="flex-1 font-corpo-medio text-sm text-texto"
                    numberOfLines={1}
                  >
                    {proxima.titulo}
                  </Text>
                  <Text className="font-corpo text-xs text-texto-2">
                    {formatarDuracao(proxima.duracaoSegundos)}
                  </Text>
                </Pressable>
              </Link>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
