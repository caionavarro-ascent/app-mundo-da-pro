import { Ionicons } from '@expo/vector-icons';
import { nomeTipo, type Pontuacao } from '@mdp/core';
import {
  corDoMaterial,
  estaLiberado,
  produtoPorId,
  type MaterialDemo,
} from '@mdp/core/src/mock/acervo';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { useDemo } from '../contexto/demo';
import { TagTipo } from './tag-tipo';

interface Props {
  material: MaterialDemo;
  pontuacao: Pontuacao;
  posse: string[];
}

/**
 * Uma sugestão da resposta da home (D42): linha com capa pequena, o porquê da
 * sugestão e, quando o tema foi achado dentro do PDF, o trecho onde aparece.
 */
export function SugestaoMaterial({ material, pontuacao, posse }: Props) {
  const demo = useDemo();
  const liberado = estaLiberado(material, posse);
  const produto = produtoPorId(material.produtoIds[0]);

  return (
    <Link href={{ pathname: '/material/[id]', params: { id: material.id } }} asChild>
      <Pressable
        className="flex-row gap-3 rounded-2xl bg-superficie p-3 active:opacity-80"
        onLongPress={() => demo.abrirSalvar(material)}
        delayLongPress={350}
      >
        <View
          className="overflow-hidden rounded-lg"
          style={{ width: 64, height: 96, backgroundColor: corDoMaterial(material) }}
        >
          {material.capaUrl ? (
            <Image
              source={{ uri: material.capaUrl }}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
            />
          ) : (
            <Text className="p-1.5 font-corpo-forte text-[9px] uppercase text-white/80">
              {nomeTipo[material.tipo]}
            </Text>
          )}
          {!liberado && (
            <View className="absolute bottom-1 right-1 rounded-full bg-black/70 p-1">
              <Ionicons name="lock-closed" size={10} color="#FFFFFF" />
            </View>
          )}
        </View>

        <View className="flex-1 gap-1">
          <Text className="font-corpo-forte text-sm leading-snug text-texto" numberOfLines={2}>
            {material.titulo}
          </Text>
          <View className="flex-row items-center gap-2">
            <TagTipo tipo={material.tipo} pequena />
            <Text className="font-corpo text-xs text-texto-2">
              {material.paginas} {material.paginas === 1 ? 'página' : 'páginas'}
            </Text>
          </View>
          {pontuacao.motivos.length > 0 && (
            <Text className="font-corpo text-xs text-texto-2" numberOfLines={2}>
              <Text className="font-corpo-forte text-marca-legivel">Por quê: </Text>
              {pontuacao.motivos.join(' · ')}
            </Text>
          )}
          {pontuacao.trecho && (
            <Text className="font-corpo text-xs italic text-texto-2" numberOfLines={2}>
              {pontuacao.trecho}
            </Text>
          )}
          <Text className={`font-corpo-medio text-xs ${liberado ? 'text-verde' : 'text-texto-2'}`}>
            {liberado ? 'Liberado para você' : `Faz parte de ${produto?.nome ?? 'um produto'}`}
          </Text>
        </View>
      </Pressable>
    </Link>
  );
}
