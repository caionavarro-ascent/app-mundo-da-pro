import { Ionicons } from '@expo/vector-icons';
import type { MaterialDemo } from '@mdp/core/src/mock/acervo';
import { Link, type Href } from 'expo-router';
import { FlatList, Pressable, Text, View } from 'react-native';

import { CardMaterial } from './card-material';

interface Props {
  titulo: string;
  subtitulo?: string;
  materiais: MaterialDemo[];
  posse: string[];
  /** liga o número de posição dos cards (A4) */
  comPosicao?: boolean;
  /** destino do cabeçalho, ex.: a página da formação (D31) */
  href?: Href;
}

export function Prateleira({ titulo, subtitulo, materiais, posse, comPosicao, href }: Props) {
  if (materiais.length === 0) return null;

  const cabecalho = (
    <View className="flex-1 gap-0.5">
      <Text className="font-titulo-semi text-lg text-texto">
        {titulo}
        <Text className="font-corpo text-sm text-texto-2">  · {materiais.length}</Text>
      </Text>
      {subtitulo ? (
        <Text className="font-corpo text-xs leading-snug text-texto-2">{subtitulo}</Text>
      ) : null}
    </View>
  );

  return (
    <View className="gap-2">
      {href ? (
        <Link href={href} asChild>
          <Pressable className="flex-row items-center gap-2 px-4">
            {cabecalho}
            <Ionicons name="chevron-forward" size={18} color="#A2A8B4" />
          </Pressable>
        </Link>
      ) : (
        <View className="px-4">{cabecalho}</View>
      )}
      <FlatList
        horizontal
        data={materiais}
        keyExtractor={(m) => m.id}
        renderItem={({ item, index }) => (
          <CardMaterial
            material={item}
            posse={posse}
            posicao={comPosicao ? index + 1 : undefined}
          />
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-3 px-4"
      />
    </View>
  );
}
