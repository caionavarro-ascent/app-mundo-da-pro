import { Ionicons } from '@expo/vector-icons';
import { formatarPreco } from '@mdp/core';
import { materialPorId, type MaterialDemo, type ProdutoDemo } from '@mdp/core/src/mock/acervo';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';

import { useCores } from '../hooks/use-cores';
import { useDesktopWeb } from '../hooks/use-desktop-web';
import type { CursoDaVitrine } from '../lib/painel';
import { CardMaterial } from './card-material';

/**
 * Coleção em bloco na Vitrine (D47): capa principal da coleção, o resumo
 * (módulos, PDFs, para quem é, se já é dela) e, embaixo, volumes → módulos →
 * prateleira com os PDFs do módulo escolhido.
 */
export function BlocoDeCurso({
  curso,
  produto,
  posse,
  versaoAcervo,
}: {
  curso: CursoDaVitrine;
  produto: ProdutoDemo;
  posse: string[];
  /** refaz a busca dos PDFs quando o acervo do painel chega (React Compiler, D43) */
  versaoAcervo: number;
}) {
  const desktop = useDesktopWeb();
  const cores = useCores();
  const [volumeI, setVolumeI] = useState(0);
  const [moduloI, setModuloI] = useState(0);
  const liberado = posse.includes(produto.id) || posse.includes('acesso-total');

  const volume = curso.volumes[Math.min(volumeI, curso.volumes.length - 1)];
  const modulo = volume.modulos[Math.min(moduloI, volume.modulos.length - 1)];
  const doModulo = pdfs(modulo.materialIds, versaoAcervo);

  const todosIds = curso.volumes.flatMap((v) => v.modulos.flatMap((m) => m.materialIds));
  const totalModulos = curso.volumes.reduce((s, v) => s + v.modulos.length, 0);
  const temModulos = !(curso.volumes.length === 1 && volume.modulos.length === 1);
  // capa automática: um PDF de cada um dos primeiros módulos (mostra a variedade da coleção)
  const primeirosDeCadaModulo = curso.volumes.flatMap((v) =>
    v.modulos.map((m) => pdfs(m.materialIds, versaoAcervo).find((pdf) => pdf.capaUrl)),
  );
  const paraCapa = [
    ...primeirosDeCadaModulo,
    ...pdfs(todosIds, versaoAcervo).filter((m) => m.capaUrl),
  ]
    .filter((m, i, lista): m is MaterialDemo => m != null && lista.findIndex((x) => x?.id === m.id) === i)
    .slice(0, 3);
  const larguraCapa = desktop ? 190 : 118;

  return (
    <View className="mx-4 gap-4 overflow-hidden rounded-3xl bg-superficie py-4">
      <View className="flex-row gap-4 px-4">
        <CapaDaColecao
          produto={produto}
          capaUrl={curso.capaUrl}
          amostras={paraCapa}
          largura={larguraCapa}
        />
        <View className="flex-1 justify-center gap-2">
          <Text className="font-corpo-forte text-[11px] uppercase text-texto-2">
            Coleção · {totalModulos > 1 ? `${totalModulos} módulos · ` : ''}
            {todosIds.length} PDFs
          </Text>
          <Text className={`font-titulo text-texto ${desktop ? 'text-3xl' : 'text-xl'}`}>
            {produto.nome}
          </Text>
          <Text
            className="font-corpo text-sm leading-snug text-texto-2"
            numberOfLines={desktop ? 4 : 3}
          >
            {produto.pitchParaQuem} {produto.pitchParaQue}
          </Text>
          {liberado ? (
            <View className="flex-row items-center gap-1.5 self-start rounded-full bg-verde/15 px-3 py-1">
              <Ionicons name="checkmark-circle" size={14} color="#1F9E77" />
              <Text className="font-corpo-forte text-xs text-verde">Liberado para você</Text>
            </View>
          ) : (
            <View className="flex-row flex-wrap items-center gap-3">
              <Pressable
                onPress={() =>
                  Alert.alert(produto.nome, 'O checkout externo chega no Bloco 10.')
                }
                className="h-10 flex-row items-center gap-2 rounded-lg bg-botao-prim px-4"
              >
                <Ionicons name="lock-open" size={15} color={cores.botaoPrimarioTexto} />
                <Text className="font-corpo-forte text-sm text-botao-prim-texto">
                  Quero a coleção
                </Text>
              </Pressable>
              <Text className="font-corpo text-xs text-texto-2">
                {formatarPreco(produto.precoCentavos)} {produto.parcelasTexto}
              </Text>
            </View>
          )}
        </View>
      </View>

      {curso.volumes.length > 1 && (
        <View className="flex-row gap-2 px-4">
          {curso.volumes.map((v, i) => (
            <Pressable
              key={v.nome}
              onPress={() => {
                setVolumeI(i);
                setModuloI(0);
              }}
              className={`rounded-lg px-4 py-2 ${i === volumeI ? 'bg-texto' : 'bg-superficie-2'}`}
            >
              <Text
                className={`font-corpo-forte text-sm ${i === volumeI ? 'text-fundo' : 'text-texto'}`}
              >
                {v.nome}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      {temModulos && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-2 px-4"
        >
          {volume.modulos.map((m, i) => {
            const ativo = i === Math.min(moduloI, volume.modulos.length - 1);
            return (
              <Pressable
                key={m.nome}
                onPress={() => setModuloI(i)}
                className={`flex-row items-center gap-1.5 rounded-full border px-3.5 py-2 ${
                  ativo ? 'border-marca bg-superficie-2' : 'border-superficie-2'
                }`}
              >
                <Text className="font-corpo-medio text-sm text-texto">{m.nome}</Text>
                <Text className="font-corpo text-xs text-texto-2">{m.materialIds.length}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      )}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-3 px-4"
      >
        {doModulo.map((m) => (
          <CardMaterial key={m.id} material={m} posse={posse} />
        ))}
      </ScrollView>
    </View>
  );
}

/** Os PDFs do acervo, na ordem do módulo. `_versao` só para o React Compiler refazer (D43). */
function pdfs(ids: string[], _versao: number): MaterialDemo[] {
  return ids.map(materialPorId).filter((m): m is MaterialDemo => m != null);
}

/**
 * Capa principal: a oficial, se a equipe subiu uma (public/capas-colecoes);
 * senão, uma capa montada na cor da coleção, com três PDFs em leque e o nome.
 */
function CapaDaColecao({
  produto,
  capaUrl,
  amostras,
  largura,
}: {
  produto: ProdutoDemo;
  capaUrl: string | null;
  amostras: MaterialDemo[];
  largura: number;
}) {
  const altura = largura * 1.5;
  if (capaUrl) {
    return (
      <Image
        source={{ uri: capaUrl }}
        style={{ width: largura, height: altura, borderRadius: 16 }}
        contentFit="cover"
      />
    );
  }
  const folha = largura * 0.52;
  const leque = [
    { rotacao: '-10deg', x: -largura * 0.2, y: 6 },
    { rotacao: '9deg', x: largura * 0.2, y: 6 },
    { rotacao: '0deg', x: 0, y: 0 },
  ];
  return (
    <View
      className="items-center overflow-hidden rounded-2xl"
      style={{ width: largura, height: altura, backgroundColor: produto.cor }}
    >
      <View style={{ height: altura * 0.62, width: largura }} className="items-center justify-center">
        {amostras.map((m, i) => (
          <Image
            key={m.id}
            source={{ uri: m.capaUrl }}
            style={{
              position: 'absolute',
              width: folha,
              height: folha * 1.41,
              borderRadius: 4,
              borderWidth: 2,
              borderColor: '#FFFFFF',
              transform: [
                { translateX: leque[i].x },
                { translateY: leque[i].y },
                { rotate: leque[i].rotacao },
              ],
            }}
            contentFit="cover"
          />
        ))}
      </View>
      <View className="w-full flex-1 justify-end gap-0.5 bg-black/25 p-2.5">
        <Text className="font-corpo-forte text-[9px] uppercase tracking-wider text-white/80">
          Coleção
        </Text>
        <Text
          className={`font-titulo leading-tight text-white ${largura > 150 ? 'text-xl' : 'text-sm'}`}
          numberOfLines={3}
        >
          {produto.nome}
        </Text>
      </View>
    </View>
  );
}
