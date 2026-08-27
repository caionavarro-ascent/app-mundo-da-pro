import { Ionicons } from '@expo/vector-icons';
import { nomeTipo, type TipoMaterial } from '@mdp/core';
import { buscarMateriais } from '@mdp/core/src/mock/acervo';
import { useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CardMaterial } from '../../components/card-material';
import { useDemo } from '../../contexto/demo';

/** Aba Buscar (A8): campo em tela cheia, com sugestões. */
export default function Buscar() {
  const demo = useDemo();
  const [termo, setTermo] = useState('');
  const resultados = buscarMateriais(termo);

  return (
    <SafeAreaView className="flex-1 bg-fundo" edges={['top']}>
      <View className="gap-4 p-4">
        <View className="flex-row items-center gap-2 rounded-xl bg-superficie px-3">
          <Ionicons name="search" size={18} color="#A2A8B4" />
          <TextInput
            value={termo}
            onChangeText={setTermo}
            placeholder="Atividade, jogo, avaliação…"
            placeholderTextColor="#A2A8B4"
            className="h-12 flex-1 font-corpo text-base text-texto"
            autoCorrect={false}
          />
          {termo.length > 0 && (
            <Pressable onPress={() => setTermo('')} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color="#A2A8B4" />
            </Pressable>
          )}
        </View>

        {termo.trim().length === 0 ? (
          <View className="gap-3">
            <Text className="font-corpo-forte text-sm uppercase text-texto-2">
              Sugestões
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {(Object.keys(nomeTipo) as TipoMaterial[]).map((tipo) => (
                <Pressable
                  key={tipo}
                  onPress={() => setTermo(nomeTipo[tipo])}
                  className="rounded-full bg-superficie-2 px-4 py-2"
                >
                  <Text className="font-corpo-medio text-sm text-texto">
                    {nomeTipo[tipo]}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        ) : resultados.length === 0 ? (
          <Text className="pt-4 text-center font-corpo text-sm text-texto-2">
            Nada encontrado para “{termo}”. Tente outro termo.
          </Text>
        ) : (
          <FlatList
            data={resultados}
            keyExtractor={(m) => m.id}
            numColumns={3}
            columnWrapperClassName="gap-3"
            contentContainerClassName="gap-4 pb-24"
            renderItem={({ item }) => (
              <CardMaterial material={item} posse={demo.posse} largura={104} />
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
