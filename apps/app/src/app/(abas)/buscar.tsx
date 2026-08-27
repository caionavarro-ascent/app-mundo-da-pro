import { Ionicons } from '@expo/vector-icons';
import { nomeTipo, type TipoMaterial } from '@mdp/core';
import { buscarMateriais } from '@mdp/core/src/mock/acervo';
import { useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CardMaterial } from '../../components/card-material';
import { useDemo } from '../../contexto/demo';

/**
 * Aba Buscar (A8): campo em tela cheia, resultado ao vivo a cada letra,
 * sugestões e buscas recentes.
 */
export default function Buscar() {
  const demo = useDemo();
  const [termo, setTermo] = useState('');
  const resultados = buscarMateriais(termo);
  const buscando = termo.trim().length > 0;

  return (
    <SafeAreaView className="flex-1 bg-fundo" edges={['top']}>
      <View className="flex-1 gap-4 p-4">
        <View className="flex-row items-center gap-2 rounded-xl bg-superficie px-3">
          <Ionicons name="search" size={18} color="#A2A8B4" />
          <TextInput
            value={termo}
            onChangeText={setTermo}
            onSubmitEditing={() => demo.registrarBusca(termo)}
            placeholder="Atividade, jogo, 1º ano, silábico…"
            placeholderTextColor="#A2A8B4"
            className="h-12 flex-1 font-corpo text-base text-texto"
            autoCorrect={false}
            returnKeyType="search"
          />
          {termo.length > 0 && (
            <Pressable
              onPress={() => {
                demo.registrarBusca(termo);
                setTermo('');
              }}
              hitSlop={8}
            >
              <Ionicons name="close-circle" size={18} color="#A2A8B4" />
            </Pressable>
          )}
        </View>

        {!buscando ? (
          <View className="gap-5">
            {demo.buscasRecentes.length > 0 && (
              <View className="gap-3">
                <Text className="font-corpo-forte text-sm uppercase text-texto-2">
                  Buscas recentes
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {demo.buscasRecentes.map((busca) => (
                    <Pressable
                      key={busca}
                      onPress={() => setTermo(busca)}
                      className="flex-row items-center gap-1.5 rounded-full bg-superficie px-4 py-2"
                    >
                      <Ionicons name="time-outline" size={14} color="#A2A8B4" />
                      <Text className="font-corpo-medio text-sm text-texto">{busca}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}
            <View className="gap-3">
              <Text className="font-corpo-forte text-sm uppercase text-texto-2">
                Sugestões
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {(Object.keys(nomeTipo) as TipoMaterial[]).map((tipo) => (
                  <Pressable
                    key={tipo}
                    onPress={() => {
                      setTermo(nomeTipo[tipo]);
                      demo.registrarBusca(nomeTipo[tipo]);
                    }}
                    className="rounded-full bg-superficie-2 px-4 py-2"
                  >
                    <Text className="font-corpo-medio text-sm text-texto">
                      {nomeTipo[tipo]}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        ) : resultados.length === 0 ? (
          <View className="items-center gap-2 pt-8">
            <Ionicons name="search" size={32} color="#A2A8B4" />
            <Text className="text-center font-corpo text-sm text-texto-2">
              Nada encontrado para “{termo}”.{'\n'}Tente “jogo”, “avaliação” ou um nível,
              como “silábico”.
            </Text>
          </View>
        ) : (
          <FlatList
            data={resultados}
            keyExtractor={(m) => m.id}
            numColumns={3}
            columnWrapperClassName="gap-3"
            contentContainerClassName="gap-4 pb-24"
            keyboardShouldPersistTaps="handled"
            ListHeaderComponent={
              <Text className="font-corpo text-xs text-texto-2">
                {resultados.length}{' '}
                {resultados.length === 1 ? 'material encontrado' : 'materiais encontrados'}
              </Text>
            }
            renderItem={({ item }) => (
              <CardMaterial material={item} posse={demo.posse} largura={104} />
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
