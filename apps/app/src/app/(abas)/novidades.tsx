import { nomeTipo } from '@mdp/core';
import { corDoMaterial, novidades } from '@mdp/core/src/mock/acervo';
import { Link } from 'expo-router';
import { FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useDemo } from '../../contexto/demo';

/** Aba Novidades (A8): lista cronológica completa. */
export default function Novidades() {
  const demo = useDemo();

  return (
    <SafeAreaView className="flex-1 bg-fundo" edges={['top']}>
      <FlatList
        data={novidades()}
        keyExtractor={(m) => m.id}
        contentContainerClassName="gap-3 p-4"
        ListHeaderComponent={
          <Text className="pb-2 font-titulo text-2xl text-texto">Novidades</Text>
        }
        renderItem={({ item }) => (
          <Link href={{ pathname: '/material/[id]', params: { id: item.id } }} asChild>
            <Pressable className="flex-row gap-3 rounded-xl bg-superficie p-3">
              <View
                className="h-24 w-16 items-center justify-center rounded-md p-1"
                style={{ backgroundColor: corDoMaterial(item) }}
              >
                <Text
                  className="text-center font-titulo-semi text-[9px] text-white"
                  numberOfLines={4}
                >
                  {item.titulo}
                </Text>
              </View>
              <View className="flex-1 gap-1">
                <View className="flex-row items-center gap-2">
                  <View className="rounded bg-coral px-1.5 py-0.5">
                    <Text className="font-corpo-forte text-[9px] uppercase text-white">
                      Novo
                    </Text>
                  </View>
                  <Text className="font-corpo text-xs text-texto-2">
                    {nomeTipo[item.tipo]}
                  </Text>
                </View>
                <Text className="font-corpo-forte text-base text-texto">{item.titulo}</Text>
                <Text className="font-corpo text-xs leading-snug text-texto-2" numberOfLines={2}>
                  {item.descricao}
                </Text>
              </View>
            </Pressable>
          </Link>
        )}
      />
    </SafeAreaView>
  );
}
