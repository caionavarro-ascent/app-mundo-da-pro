import { Ionicons } from '@expo/vector-icons';
import { formatarPreco } from '@mdp/core';
import {
  comecePorAqui,
  maisBaixados,
  novidades,
  prateleirasPorProduto,
  produtoPorId,
  resolverDestaque,
} from '@mdp/core/src/mock/acervo';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Destaque } from '../../components/destaque';
import { PilulasFiltro } from '../../components/pilulas-filtro';
import { Prateleira } from '../../components/prateleira';
import { SeletorAcesso } from '../../components/seletor-acesso';
import { useDemo } from '../../contexto/demo';
import { useCores } from '../../hooks/use-cores';

// Prancheta 33 (100% vazada) no tema claro; Prancheta 16 (contorno branco)
// no escuro, onde o contorno garante a leitura do azul-marinho.
const logoModoClaro = require('../../../assets/images/logo-vazado.png');
const logoModoEscuro = require('../../../assets/images/logo-contorno.png');

/** Home da vitrine (Bloco 7), estrutura da referência bloco a bloco. */
export default function Inicio() {
  const demo = useDemo();
  const router = useRouter();
  const cores = useCores();
  const { colorScheme: esquema } = useColorScheme();
  const destaque = resolverDestaque(demo.posse);
  const acessoTotal = produtoPorId('acesso-total')!;

  const doProduto = prateleirasPorProduto(demo.posse).map((p) => ({
    ...p,
    materiais: demo.filtrar(p.materiais),
  }));

  return (
    <SafeAreaView className="flex-1 bg-fundo" edges={['top']}>
      <ScrollView stickyHeaderIndices={[1]} contentContainerClassName="gap-6 pb-8">
        {/* A0 — topo enxuto, sem campo de busca */}
        <View className="flex-row items-center justify-between px-4 pt-2">
          <View className="flex-row items-center gap-2.5">
            <Image
              source={esquema === 'light' ? logoModoClaro : logoModoEscuro}
              style={{ width: 68, height: 32 }}
              contentFit="contain"
            />
            <Text className="font-titulo-semi text-lg text-texto">Início</Text>
          </View>
          <View className="flex-row items-center gap-4">
            <SeletorAcesso />
            <Pressable
              hitSlop={8}
              onPress={() => Alert.alert('Baixados', 'O download offline chega no Bloco 9.')}
            >
              <Ionicons name="arrow-down-circle-outline" size={24} color={cores.texto} />
            </Pressable>
            <Pressable hitSlop={8} onPress={() => router.navigate('/meus')}>
              <View className="h-7 w-7 items-center justify-center rounded-full bg-marca">
                <Text className="font-corpo-forte text-xs text-[#16191F]">
                  {demo.nome.charAt(0)}
                </Text>
              </View>
            </Pressable>
          </View>
        </View>

        {/* A1 — pílulas fixas na rolagem */}
        <View className="bg-fundo">
          <PilulasFiltro aoTocarNovidades={() => router.navigate('/novidades')} />
        </View>

        {/* A2 — destaque personalizado por posse */}
        <Destaque destaque={destaque} />

        {/* A3 — nunca aparece vazia: sem histórico vira "Comece por aqui, é seu" */}
        <Prateleira
          titulo="Comece por aqui, é seu"
          materiais={demo.filtrar(comecePorAqui(demo.posse))}
          posse={demo.posse}
        />

        {/* A4 — prova social com número de posição */}
        <Prateleira
          titulo="Mais baixados da semana"
          materiais={demo.filtrar(maisBaixados())}
          posse={demo.posse}
          comPosicao
        />

        {/* A5 — uma prateleira por produto não possuído */}
        {doProduto.map((p) => (
          <Prateleira
            key={p.id}
            titulo={p.titulo}
            subtitulo={p.subtitulo}
            materiais={p.materiais}
            posse={demo.posse}
            href={
              p.id === 'fda' || p.id === 'fpt'
                ? { pathname: '/formacao/[id]', params: { id: p.id } }
                : undefined
            }
          />
        ))}

        {/* A6 — novidades */}
        <Prateleira
          titulo="Novidades"
          materiais={demo.filtrar(novidades())}
          posse={demo.posse}
        />

        {/* A7 — faixa Acesso Total */}
        {!demo.posse.includes('acesso-total') && (
          <View className="mx-4 gap-3 rounded-2xl bg-superficie p-5">
            <View className="flex-row items-center gap-2">
              <View className="rounded-full bg-marca px-2 py-0.5">
                <Text className="font-corpo-forte text-[10px] uppercase text-[#16191F]">
                  Happy Friday
                </Text>
              </View>
            </View>
            <Text className="font-titulo-semi text-xl text-texto">{acessoTotal.nome}</Text>
            <Text className="font-corpo text-sm text-texto-2">
              {acessoTotal.pitchParaQue} {formatarPreco(acessoTotal.precoCentavos)},{' '}
              {acessoTotal.parcelasTexto}.
            </Text>
            <Pressable
              className="h-12 items-center justify-center rounded-lg bg-botao-prim"
              onPress={() =>
                Alert.alert('Acesso Total', 'O checkout externo chega no Bloco 10.')
              }
            >
              <Text className="font-corpo-forte text-base text-botao-prim-texto">
                Quero o acesso total
              </Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
