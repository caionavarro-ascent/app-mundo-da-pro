import { Ionicons } from '@expo/vector-icons';
import { nomeTipo } from '@mdp/core';
import { corDoMaterial, type DestaqueResolvido } from '@mdp/core/src/mock/acervo';
import { Link } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View, useWindowDimensions } from 'react-native';

import { useDemo } from '../contexto/demo';
import { useCores } from '../hooks/use-cores';
import { FolhaSalvar } from './folha-salvar';

/**
 * Bloco de destaque da dobra (A2): card grande 4:5, botão primário branco e
 * secundário "Salvar". Sem arte enviada ainda, o fallback é a cor do produto
 * com o título grande — quando houver capas reais, vira imagem.
 */
export function Destaque({ destaque }: { destaque: DestaqueResolvido }) {
  const demo = useDemo();
  const cores = useCores();
  const { width } = useWindowDimensions();
  const largura = Math.min(width - 48, 360);
  const { material } = destaque;
  const [salvarAberto, setSalvarAberto] = useState(false);
  const salvo =
    demo.favoritos.has(material.id) ||
    Object.values(demo.materiaisDaTurma).some((conjunto) => conjunto.has(material.id));

  return (
    <View className="items-center gap-3 px-6">
      <Link href={{ pathname: '/material/[id]', params: { id: material.id } }} asChild>
        <Pressable
          className="overflow-hidden rounded-2xl"
          style={{ width: largura, height: largura * 1.25, backgroundColor: corDoMaterial(material) }}
        >
          <View className="flex-1 justify-between p-5">
            <View className="flex-row items-center gap-2">
              <View className="h-6 w-6 items-center justify-center rounded bg-black/60">
                <Text className="font-titulo text-xs text-marca">M</Text>
              </View>
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
                {material.paginas > 0 ? ` completa, ${material.paginas} páginas` : ''}
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
          onPress={() => setSalvarAberto(true)}
          className="h-12 flex-row items-center justify-center gap-2 rounded-lg bg-superficie-2 px-4"
        >
          <Ionicons name={salvo ? 'checkmark' : 'add'} size={20} color={cores.texto} />
          <Text className="font-corpo-forte text-base text-texto">Salvar</Text>
        </Pressable>
      </View>

      <FolhaSalvar
        material={material}
        visivel={salvarAberto}
        aoFechar={() => setSalvarAberto(false)}
      />
    </View>
  );
}
