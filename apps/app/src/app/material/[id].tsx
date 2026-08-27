import { Ionicons } from '@expo/vector-icons';
import {
  exemploNivel,
  formatarPreco,
  nomeAno,
  nomeNivel,
  nomeTipo,
} from '@mdp/core';
import {
  corDoMaterial,
  estaLiberado,
  materialPorId,
  parecidosCom,
  produtoPorId,
} from '@mdp/core/src/mock/acervo';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Prateleira } from '../../components/prateleira';
import { useDemo } from '../../contexto/demo';

const PAGINAS_AMOSTRA = 2; // virá de configuracoes.paginas_amostra (Bloco 7)

/** Ficha do material (A10), versão demonstração. */
export default function FichaMaterial() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const demo = useDemo();
  const [aba, setAba] = useState<'sobre' | 'como-usar'>('sobre');
  const [paywallAberto, setPaywallAberto] = useState(false);

  const material = materialPorId(id);
  if (!material) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-fundo">
        <Text className="font-corpo text-texto-2">Material não encontrado.</Text>
      </SafeAreaView>
    );
  }

  const produto = produtoPorId(material.produtoIds[0]);
  const liberado = estaLiberado(material, demo.posse);
  const cursoExterno = produto?.cursoExterno ?? false;
  const favoritado = demo.favoritos.has(material.id);
  const cor = corDoMaterial(material);

  const acaoPrincipal = () => {
    if (cursoExterno) {
      Alert.alert('The Members', 'A aula abre no navegador do sistema (Bloco 8).');
    } else if (liberado) {
      Alert.alert(
        'Download',
        'Na versão final, o PDF sai com marca d’água com seu nome e abre offline (Bloco 9).',
      );
    } else {
      setPaywallAberto(true);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-fundo" edges={['top']}>
      <ScrollView contentContainerClassName="gap-5 pb-10">
        {/* arte no topo, com voltar e favoritar */}
        <View style={{ backgroundColor: cor }} className="gap-4 p-4 pb-6">
          <View className="flex-row items-center justify-between">
            <Pressable
              onPress={() => router.back()}
              hitSlop={8}
              className="rounded-full bg-fundo/50 p-2"
            >
              <Ionicons name="chevron-back" size={20} color="#F5F6F8" />
            </Pressable>
            <Pressable
              onPress={() => demo.alternarFavorito(material.id)}
              hitSlop={8}
              className="rounded-full bg-fundo/50 p-2"
            >
              <Ionicons
                name={favoritado ? 'checkmark' : 'add'}
                size={20}
                color="#F5F6F8"
              />
            </Pressable>
          </View>
          <View className="gap-1 pt-8">
            <Text className="font-corpo-forte text-xs uppercase text-white/80">
              {produto?.nome}
            </Text>
            <Text className="font-titulo text-3xl leading-tight text-white">
              {material.titulo}
            </Text>
            <Text className="font-corpo text-sm text-white/90">
              {nomeTipo[material.tipo]}
              {material.paginas > 0 ? ` · ${material.paginas} páginas` : ' · em vídeo'}
            </Text>
          </View>
        </View>

        {/* ação principal */}
        <View className="px-4">
          <Pressable
            onPress={acaoPrincipal}
            className="flex-row items-center justify-center gap-2 rounded-lg bg-white py-3.5"
          >
            <Ionicons
              name={cursoExterno ? 'play' : liberado ? 'download' : 'lock-open'}
              size={18}
              color="#0B0D12"
            />
            <Text className="font-corpo-forte text-base text-fundo">
              {cursoExterno
                ? 'Assistir no The Members'
                : liberado
                  ? 'Baixar PDF'
                  : `Desbloquear por ${formatarPreco(produto?.precoCentavos ?? 0)}`}
            </Text>
          </Pressable>
        </View>

        {/* preview: amostra liberada, restante trancado (A10) */}
        {material.paginas > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-2 px-4"
          >
            {Array.from({ length: Math.min(material.paginas, 6) }).map((_, i) => {
              const naAmostra = liberado || i < PAGINAS_AMOSTRA;
              return (
                <View
                  key={i}
                  className={`h-36 w-28 items-center justify-center rounded-md ${
                    naAmostra ? 'bg-texto' : 'bg-superficie-2'
                  }`}
                >
                  {naAmostra ? (
                    <Text className="font-corpo text-xs text-fundo">página {i + 1}</Text>
                  ) : (
                    <Ionicons name="lock-closed" size={16} color="#A2A8B4" />
                  )}
                </View>
              );
            })}
          </ScrollView>
        )}

        {/* abas Sobre / Como usar — Como usar sempre liberada (D10) */}
        <View className="gap-4 px-4">
          <View className="flex-row gap-2">
            {(
              [
                ['sobre', 'Sobre'],
                ['como-usar', 'Como usar'],
              ] as const
            ).map(([chave, rotulo]) => (
              <Pressable
                key={chave}
                onPress={() => setAba(chave)}
                className={`rounded-full px-4 py-2 ${
                  aba === chave ? 'bg-texto' : 'bg-superficie'
                }`}
              >
                <Text
                  className={`font-corpo-forte text-sm ${
                    aba === chave ? 'text-fundo' : 'text-texto-2'
                  }`}
                >
                  {rotulo}
                </Text>
              </Pressable>
            ))}
          </View>

          {aba === 'sobre' ? (
            <View className="gap-4">
              <Text className="font-corpo text-base leading-relaxed text-texto">
                {material.descricao}
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {material.anos.map((ano) => (
                  <View key={ano} className="rounded-full bg-superficie px-3 py-1.5">
                    <Text className="font-corpo-medio text-xs text-texto">
                      {nomeAno[ano]}
                    </Text>
                  </View>
                ))}
              </View>
              <View className="gap-2">
                {material.niveis.map((nivel) => (
                  <View
                    key={nivel}
                    className="flex-row items-center justify-between rounded-xl bg-superficie px-4 py-2.5"
                  >
                    <Text className="font-corpo-medio text-sm text-texto">
                      {nomeNivel[nivel]}
                    </Text>
                    <Text className="font-manuscrito text-lg text-marca">
                      {exemploNivel[nivel]}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ) : material.passos.length > 0 ? (
            <View className="gap-3">
              {material.passos.map((passo, i) => (
                <View key={i} className="flex-row gap-3 rounded-xl bg-superficie p-4">
                  <Text className="font-titulo text-lg text-marca">{i + 1}</Text>
                  <Text className="flex-1 font-corpo text-sm leading-relaxed text-texto">
                    {passo}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text className="font-corpo text-sm text-texto-2">
              Esta aula se assiste direto na plataforma The Members.
            </Text>
          )}
        </View>

        <Prateleira
          titulo="Parecidos com este"
          materiais={parecidosCom(material)}
          posse={demo.posse}
        />
      </ScrollView>

      {/* A11 — paywall em folha inferior, com as duas ofertas */}
      <Modal
        visible={paywallAberto}
        transparent
        animationType="slide"
        onRequestClose={() => setPaywallAberto(false)}
      >
        <Pressable
          className="flex-1 justify-end bg-black/60"
          onPress={() => setPaywallAberto(false)}
        >
          <Pressable
            className="gap-4 rounded-t-3xl bg-superficie p-5 pb-10"
            onPress={(e) => e.stopPropagation()}
          >
            <Text className="font-titulo-semi text-xl text-texto">
              Desbloqueie este material
            </Text>

            <View className="gap-2 rounded-2xl bg-superficie-2 p-4">
              <Text className="font-corpo-forte text-base text-texto">{produto?.nome}</Text>
              <Text className="font-corpo text-sm text-texto-2">
                {produto?.pitchParaQue}
              </Text>
              <Pressable
                className="mt-1 h-12 items-center justify-center rounded-lg bg-white"
                onPress={() =>
                  Alert.alert(
                    'Checkout',
                    'Abre o checkout no navegador do sistema, com Pix e 12x (Bloco 10).',
                  )
                }
              >
                <Text className="font-corpo-forte text-base text-fundo">
                  {formatarPreco(produto?.precoCentavos ?? 0)} · {produto?.parcelasTexto}
                </Text>
              </Pressable>
            </View>

            <View className="gap-2 rounded-2xl border border-marca bg-superficie-2 p-4">
              <View className="flex-row items-center gap-2">
                <View className="rounded-full bg-marca px-2 py-0.5">
                  <Text className="font-corpo-forte text-[10px] uppercase text-fundo">
                    Happy Friday
                  </Text>
                </View>
              </View>
              <Text className="font-corpo-forte text-base text-texto">
                Acesso Total Mundo da Prô
              </Text>
              <Text className="font-corpo text-sm text-texto-2">
                Todos os materiais, atuais e futuros, num acesso só.
              </Text>
              <Pressable
                className="mt-1 h-12 items-center justify-center rounded-lg bg-marca"
                onPress={() =>
                  Alert.alert(
                    'Checkout',
                    'Abre o checkout no navegador do sistema, com Pix e 12x (Bloco 10).',
                  )
                }
              >
                <Text className="font-corpo-forte text-base text-fundo">
                  {formatarPreco(produtoPorId('acesso-total')?.precoCentavos ?? 0)} ·{' '}
                  {produtoPorId('acesso-total')?.parcelasTexto}
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
