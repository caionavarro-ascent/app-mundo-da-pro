import { Ionicons } from '@expo/vector-icons';
import { formatarPreco } from '@mdp/core';
import {
  comecePorAqui,
  ebooks,
  maisBaixados,
  materialPorId,
  novidades,
  prateleirasPorProduto,
  produtoPorId,
  resolverDestaque,
  type MaterialDemo,
} from '@mdp/core/src/mock/acervo';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BlocoDeCurso } from '../../components/bloco-de-curso';
import { Destaque } from '../../components/destaque';
import { PilulasFiltro } from '../../components/pilulas-filtro';
import { Prateleira } from '../../components/prateleira';
import { SeletorAcesso } from '../../components/seletor-acesso';
import { useDemo } from '../../contexto/demo';
import { useCores } from '../../hooks/use-cores';
import { useEsquema } from '../../hooks/use-esquema';
import { useDesktopWeb } from '../../hooks/use-desktop-web';
import { doAcervo } from '../../lib/acervo-reativo';
import { buscarCursos, type CursoDaVitrine } from '../../lib/painel';

// Prancheta 33 (100% vazada) no tema claro; Prancheta 16 (contorno branco)
// no escuro, onde o contorno garante a leitura do azul-marinho.
const logoModoClaro = require('../../../assets/images/logo-vazado.png');
const logoModoEscuro = require('../../../assets/images/logo-contorno.png');

/**
 * Vitrine (Bloco 7), estrutura da referência Netflix bloco a bloco. Era a home;
 * desde a D42 é a aba Vitrine e a home é a busca por pergunta.
 */
export default function Vitrine() {
  const demo = useDemo();
  const router = useRouter();
  const cores = useCores();
  const esquema = useEsquema();
  const desktop = useDesktopWeb();
  // toda leitura do acervo carimbada com a versão: o painel chega depois (D43/D51)
  const versao = demo.versaoAcervo;
  const destaque = doAcervo(() => resolverDestaque(demo.posse), versao);
  const acessoTotal = produtoPorId('acesso-total')!;

  // coleções com PDFs organizados em volumes/módulos viram bloco (D47); só no aparelho,
  // depois de carregar (a página pré-gerada no build não tem o painel)
  const [cursos, setCursos] = useState<CursoDaVitrine[]>([]);
  useEffect(() => {
    buscarCursos()
      .then(setCursos)
      .catch(() => {});
  }, []);
  const blocos = cursos
    .map((curso) => ({ curso, produto: produtoPorId(curso.produtoId) }))
    .filter((b) => b.produto != null)
    .sort((a, b) => a.produto!.ordemVitrine - b.produto!.ordemVitrine);
  const emBloco = new Set(blocos.map((b) => b.curso.produtoId));

  const doProduto = doAcervo(() => prateleirasPorProduto(demo.posse), versao)
    .filter((p) => !emBloco.has(p.id))
    .map((p) => ({
      ...p,
      materiais: demo.filtrar(p.materiais),
    }));

  return (
    <SafeAreaView className="flex-1 bg-fundo" edges={['top']}>
      <ScrollView stickyHeaderIndices={[1]} contentContainerClassName="gap-6 pb-8">
        {/* A0 — topo enxuto, sem campo de busca */}
        <View className="flex-row items-center justify-between px-4 pt-2">
          {desktop ? (
            <Text className="font-titulo-semi text-2xl text-texto">Vitrine</Text>
          ) : (
            <View className="flex-row items-center gap-2.5">
              <Image
                source={esquema === 'light' ? logoModoClaro : logoModoEscuro}
                style={{ width: 68, height: 32 }}
                contentFit="contain"
              />
              <Text className="font-titulo-semi text-lg text-texto">Vitrine</Text>
            </View>
          )}
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
                <Text className="font-corpo-forte text-xs text-sobre-marca">
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

        {/* A3 — com histórico vira "Continue de onde parou"; nunca aparece vazia */}
        {(() => {
          const continuar = demo.vistos
            .map((id) => doAcervo(() => materialPorId(id), versao))
            .filter((m): m is MaterialDemo => m != null);
          const comHistorico = continuar.length > 0;
          return (
            <Prateleira
              titulo={
                comHistorico
                  ? `Continue de onde parou, ${demo.nome}`
                  : 'Comece por aqui, é seu'
              }
              materiais={demo.filtrar(
                comHistorico ? continuar : doAcervo(() => comecePorAqui(demo.posse), versao),
              )}
              posse={demo.posse}
            />
          );
        })()}

        {/* A4 — prova social com número de posição */}
        <Prateleira
          titulo="Mais baixados da semana"
          materiais={demo.filtrar(doAcervo(maisBaixados, versao))}
          posse={demo.posse}
          comPosicao
        />

        {/* Ebooks (D37): leitura longa, prateleira própria */}
        <Prateleira
          titulo="Ebooks"
          subtitulo="Para ler no celular ou imprimir por capítulo."
          materiais={demo.filtrar(doAcervo(ebooks, versao))}
          posse={demo.posse}
        />

        {/* Coleções em bloco (D47): capa da coleção + volumes → módulos → PDFs */}
        {blocos.length > 0 && (
          <View className="gap-4">
            <View className="gap-0.5 px-4">
              <Text className="font-titulo-semi text-lg text-texto">Coleções</Text>
              <Text className="font-corpo text-xs text-texto-2">
                Cada coleção com seus módulos. Toque num módulo para ver os PDFs.
              </Text>
            </View>
            {blocos.map(({ curso, produto }) => (
              <BlocoDeCurso
                key={curso.produtoId}
                curso={curso}
                produto={produto!}
                posse={demo.posse}
                versaoAcervo={demo.versaoAcervo}
              />
            ))}
          </View>
        )}

        {/* A5 — uma prateleira por produto não possuído (os que não viraram bloco) */}
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
          materiais={demo.filtrar(doAcervo(novidades, versao))}
          posse={demo.posse}
        />

        {/* A7 — faixa Acesso Total */}
        {!demo.posse.includes('acesso-total') && (
          <View className="mx-4 gap-3 rounded-2xl bg-superficie p-5">
            <View className="flex-row items-center gap-2">
              <View className="rounded-full bg-marca px-2 py-0.5">
                <Text className="font-corpo-forte text-[10px] uppercase text-sobre-marca">
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
