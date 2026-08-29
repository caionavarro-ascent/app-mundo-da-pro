import { Ionicons } from '@expo/vector-icons';
import { corDoMaterial, estaLiberado, type MaterialDemo } from '@mdp/core/src/mock/acervo';
import { nomeTipo } from '@mdp/core';
import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

interface Props {
  material: MaterialDemo;
  posse: string[];
  /** número do "Mais baixados da semana" (A4) */
  posicao?: number;
  largura?: number;
}

/**
 * Cartaz 2:3 (A9). Sem PDF real ainda, a "capa" é gerada com a cor do produto;
 * quando o pipeline de capas existir (Bloco 3), vira imagem com expo-image.
 */
export function CardMaterial({ material, posse, posicao, largura = 112 }: Props) {
  const liberado = estaLiberado(material, posse);
  const cor = corDoMaterial(material);

  return (
    <Link href={{ pathname: '/material/[id]', params: { id: material.id } }} asChild>
      <Pressable className="gap-1.5" style={{ width: largura }}>
        <View
          className="overflow-hidden rounded-lg"
          style={{ width: largura, height: largura * 1.5, backgroundColor: cor }}
        >
          <View className="flex-1 justify-between p-2">
            <Text className="font-corpo-forte text-[10px] uppercase text-white/80">
              {nomeTipo[material.tipo]}
            </Text>
            <Text className="font-titulo-semi text-sm leading-tight text-white" numberOfLines={4}>
              {material.titulo}
            </Text>
          </View>

          {!liberado && (
            // Desfoque leve, não opaco: ela precisa ver que tem coisa boa ali (A9)
            <View className="absolute inset-0 items-end justify-end bg-black/40 p-1.5">
              <View className="rounded-full bg-black/70 p-1.5">
                <Ionicons name="lock-closed" size={12} color="#FFFFFF" />
              </View>
            </View>
          )}

          {material.novo && (
            <View className="absolute right-0 top-0 rounded-bl-lg bg-coral px-1.5 py-0.5">
              <Text className="font-corpo-forte text-[9px] uppercase text-white">Novo</Text>
            </View>
          )}

          {posicao != null && (
            <Text
              className="absolute bottom-0 right-1 font-titulo text-5xl text-white"
              style={{
                textShadowColor: 'rgba(0,0,0,0.6)',
                textShadowRadius: 6,
                textShadowOffset: { width: 0, height: 2 },
              }}
            >
              {posicao}
            </Text>
          )}
        </View>

        <Text className="font-corpo text-xs leading-snug text-texto-2" numberOfLines={2}>
          {material.titulo}
        </Text>
      </Pressable>
    </Link>
  );
}
