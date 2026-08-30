import { Ionicons } from '@expo/vector-icons';
import { nomeTipo } from '@mdp/core';
import { corDoMaterial, type DestaqueResolvido } from '@mdp/core/src/mock/acervo';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Pressable, Text, View, useWindowDimensions } from 'react-native';

import { useDemo } from '../contexto/demo';
import { useCores } from '../hooks/use-cores';
import { useDesktopWeb } from '../hooks/use-desktop-web';

/**
 * Bloco de destaque da dobra (A2): card grande 4:5, botão primário branco e
 * secundário "Salvar". Sem arte enviada ainda, o fallback é a cor do produto
 * com o título grande — quando houver capas reais, vira imagem.
 */
export function Destaque({ destaque }: { destaque: DestaqueResolvido }) {
  const demo = useDemo();
  const cores = useCores();
  const desktop = useDesktopWeb();
  const { width } = useWindowDimensions();
  const largura = Math.min(width - 48, 360);
  const { material } = destaque;
  const salvo =
    demo.favoritos.has(material.id) ||
    Object.values(demo.materiaisDaTurma).some((conjunto) => conjunto.has(material.id));

  // desktop web: hero widescreen no estilo Netflix, texto e botões à esquerda
  if (desktop) {
    return (
      <View className="px-6">
        <Link href={{ pathname: '/material/[id]', params: { id: material.id } }} asChild>
          <Pressable
            className="overflow-hidden rounded-2xl"
            style={{ height: 440, backgroundColor: corDoMaterial(material) }}
          >
            {material.capaUrl && (
              <Image
                source={{ uri: material.capaUrl }}
                style={{ position: 'absolute', width: '100%', height: '100%' }}
                contentFit="cover"
              />
            )}
            <View className="absolute inset-0 bg-black/40" />
            <View className="flex-1 justify-end gap-3 p-10" style={{ maxWidth: 620 }}>
              <View className="flex-row items-center gap-2">
                <Image
                  source={require('../../assets/images/logo-contorno.png')}
                  style={{ width: 52, height: 25 }}
                  contentFit="contain"
                />
                <Text className="font-corpo-forte text-sm uppercase text-white/90">
                  {destaque.chamada}
                </Text>
              </View>
              <Text className="font-titulo text-5xl leading-tight text-white">
                {material.titulo}
              </Text>
              <Text className="font-corpo text-base text-white/90">
                {nomeTipo[material.tipo]}
                {material.paginas > 0 ? ` · ${material.paginas} páginas` : ''}
                {'  —  '}
                {material.descricao}
              </Text>
              <View className="mt-2 flex-row gap-3">
                <View className="h-12 flex-row items-center justify-center gap-2 rounded-lg bg-white px-6">
                  <Ionicons name="download" size={18} color="#16191F" />
                  <Text className="font-corpo-forte text-base text-[#16191F]">
                    {destaque.ctaPrimario}
                  </Text>
                </View>
                <Pressable
                  onPress={(e) => {
                    e.stopPropagation();
                    demo.abrirSalvar(material);
                  }}
                  className="h-12 flex-row items-center justify-center gap-2 rounded-lg bg-white/25 px-6"
                >
                  <Ionicons name={salvo ? 'checkmark' : 'add'} size={20} color="#FFFFFF" />
                  <Text className="font-corpo-forte text-base text-white">Salvar</Text>
                </Pressable>
              </View>
            </View>
          </Pressable>
        </Link>
      </View>
    );
  }

  return (
    <View className="items-center gap-3 px-6">
      <Link href={{ pathname: '/material/[id]', params: { id: material.id } }} asChild>
        <Pressable
          className="overflow-hidden rounded-2xl"
          style={{ width: largura, height: largura * 1.25, backgroundColor: corDoMaterial(material) }}
        >
          {material.capaUrl && (
            <>
              <Image
                source={{ uri: material.capaUrl }}
                style={{ position: 'absolute', width: '100%', height: '100%' }}
                contentFit="cover"
              />
              {/* garante a leitura do título sobre a página branca */}
              <View className="absolute inset-0 bg-black/35" />
            </>
          )}
          <View className="flex-1 justify-between p-5">
            <View className="flex-row items-center gap-2">
              <Image
                source={require('../../assets/images/logo-contorno.png')}
                style={{ width: 46, height: 22 }}
                contentFit="contain"
              />
              <Text className="font-corpo-forte text-xs uppercase text-white/90">
                {destaque.chamada}
              </Text>
            </View>
            <View className="gap-1">
              <Text className="font-titulo text-3xl leading-tight text-white">
                {material.titulo}
              </Text>
              <Text className="font-corpo text-sm text-white/90">
                {nomeTipo[material.tipo]}
                {material.paginas > 0 ? ` · ${material.paginas} páginas` : ''}
              </Text>
            </View>
          </View>
        </Pressable>
      </Link>

      <View className="flex-row gap-3" style={{ width: largura }}>
        <Link
          href={{ pathname: '/material/[id]', params: { id: material.id } }}
          asChild
        >
          <Pressable className="h-12 flex-1 flex-row items-center justify-center gap-2 rounded-lg bg-botao-prim">
            <Ionicons name="download" size={18} color={cores.botaoPrimarioTexto} />
            <Text className="font-corpo-forte text-base text-botao-prim-texto">
              {destaque.ctaPrimario}
            </Text>
          </Pressable>
        </Link>
        <Pressable
          onPress={() => demo.abrirSalvar(material)}
          className="h-12 flex-row items-center justify-center gap-2 rounded-lg bg-superficie-2 px-4"
        >
          <Ionicons name={salvo ? 'checkmark' : 'add'} size={20} color={cores.texto} />
          <Text className="font-corpo-forte text-base text-texto">Salvar</Text>
        </Pressable>
      </View>
    </View>
  );
}
