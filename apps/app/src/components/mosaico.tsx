import { Ionicons } from '@expo/vector-icons';
import { corDoMaterial, estaLiberado, type MaterialDemo } from '@mdp/core/src/mock/acervo';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { useDemo } from '../contexto/demo';
import { TagTipo } from './tag-tipo';

interface Props {
  materiais: MaterialDemo[];
  posse: string[];
  /** largura disponível em px; decide quantas colunas cabem */
  largura: number;
}

const ESPACO = 12;
const ALTURA_LEGENDA = 40;

/** Sem capa (material da demo): altura variada, estável por id, para o mosaico não ficar em grade. */
function proporcaoSemCapa(id: string): number {
  let h = 0;
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return 1 + (h % 7) / 10; // 1,0 a 1,6
}

export function proporcaoDoBloco(m: MaterialDemo): number {
  return m.capaUrl ? (m.capaProporcao ?? 1.41) : proporcaoSemCapa(m.id);
}

/**
 * Mosaico estilo Pinterest (D43, experimento): colunas de alturas livres, cada
 * material entra na coluna mais curta. A proporção vem do painel, então as
 * colunas se montam antes de as imagens chegarem e nada pula de lugar.
 */
export function Mosaico({ materiais, posse, largura }: Props) {
  const quantas = largura < 520 ? 2 : largura < 860 ? 3 : largura < 1180 ? 4 : 5;
  const larguraColuna = (largura - ESPACO * (quantas - 1)) / quantas;

  const colunas = Array.from({ length: quantas }, () => ({
    altura: 0,
    itens: [] as MaterialDemo[],
  }));
  for (const material of materiais) {
    const maisCurta = colunas.reduce((a, b) => (b.altura < a.altura ? b : a));
    maisCurta.itens.push(material);
    maisCurta.altura += larguraColuna * proporcaoDoBloco(material) + ALTURA_LEGENDA + ESPACO;
  }

  return (
    <View className="flex-row" style={{ gap: ESPACO }}>
      {colunas.map((coluna, i) => (
        <View key={i} style={{ width: larguraColuna, gap: ESPACO }}>
          {coluna.itens.map((material) => (
            <Bloco
              key={material.id}
              material={material}
              liberado={estaLiberado(material, posse)}
              largura={larguraColuna}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

function Bloco({
  material,
  liberado,
  largura,
}: {
  material: MaterialDemo;
  liberado: boolean;
  largura: number;
}) {
  const demo = useDemo();
  return (
    <Link href={{ pathname: '/material/[id]', params: { id: material.id } }} asChild>
      <Pressable
        className="gap-1.5 active:opacity-80"
        onLongPress={() => demo.abrirSalvar(material)}
        delayLongPress={350}
      >
        <View
          className="overflow-hidden rounded-2xl"
          style={{
            width: largura,
            height: largura * proporcaoDoBloco(material),
            backgroundColor: corDoMaterial(material),
          }}
        >
          {material.capaUrl ? (
            <Image
              source={{ uri: material.capaUrl }}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
            />
          ) : (
            <View className="flex-1 justify-end p-3">
              <Text
                className="font-titulo-semi text-base leading-tight text-white"
                numberOfLines={5}
              >
                {material.titulo}
              </Text>
            </View>
          )}
          {!liberado && (
            <View className="absolute bottom-2 right-2 rounded-full bg-black/70 p-1.5">
              <Ionicons name="lock-closed" size={12} color="#FFFFFF" />
            </View>
          )}
          {/* tipo fixo em todo bloco (D46) */}
          <View className="absolute left-2 top-2">
            <TagTipo tipo={material.tipo} />
          </View>
          {material.novo && (
            <View className="absolute right-2 top-2 rounded-full bg-coral px-2 py-0.5">
              <Text className="font-corpo-forte text-[9px] uppercase text-white">Novo</Text>
            </View>
          )}
        </View>
        <Text className="px-0.5 font-corpo-medio text-xs leading-snug text-texto" numberOfLines={2}>
          {material.titulo}
        </Text>
      </Pressable>
    </Link>
  );
}
