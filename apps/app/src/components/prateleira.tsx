import type { MaterialDemo } from '@mdp/core/src/mock/acervo';
import { FlatList, Text, View } from 'react-native';

import { useArrastarMouseWeb } from '../hooks/arrastar-mouse-web';
import { CardMaterial } from './card-material';

interface Props {
  titulo: string;
  subtitulo?: string;
  materiais: MaterialDemo[];
  posse: string[];
  /** liga o número de posição dos cards (A4) */
  comPosicao?: boolean;
}

export function Prateleira({ titulo, subtitulo, materiais, posse, comPosicao }: Props) {
  const refLista = useArrastarMouseWeb<FlatList<MaterialDemo>>(materiais.length > 0);
  if (materiais.length === 0) return null;

  return (
    <View className="gap-2">
      <View className="gap-0.5 px-4">
        <Text className="font-titulo-semi text-lg text-texto">
          {titulo}
          <Text className="font-corpo text-sm text-texto-2">  · {materiais.length}</Text>
        </Text>
        {subtitulo ? (
          <Text className="font-corpo text-xs leading-snug text-texto-2">{subtitulo}</Text>
        ) : null}
      </View>
      <FlatList
        ref={refLista}
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
