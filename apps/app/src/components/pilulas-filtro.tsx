import { Ionicons } from '@expo/vector-icons';
import {
  exemploNivel,
  nomeAno,
  nomeNivel,
  nomeTipo,
  type AnoEscolar,
  type NivelEscrita,
  type TipoMaterial,
} from '@mdp/core';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';

import { useDemo } from '../contexto/demo';
import { useArrastarMouseWeb } from '../hooks/arrastar-mouse-web';

type Folha = 'nivel' | 'ano' | 'categorias' | null;

/**
 * Faixa de pílulas da home (A1). Nível, Ano e Categorias abrem folha inferior;
 * a folha de Nível mostra o exemplo manuscrito de "borboleta" — a assinatura
 * visual do app.
 */
export function PilulasFiltro({ aoTocarNovidades }: { aoTocarNovidades?: () => void }) {
  const demo = useDemo();
  const [folha, setFolha] = useState<Folha>(null);
  const refPilulas = useArrastarMouseWeb<ScrollView>();

  return (
    <View>
      <ScrollView
        ref={refPilulas}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-2 px-4 py-2"
      >
        <Pilula
          rotulo="Nível"
          contagem={demo.niveis.size}
          aoTocar={() => setFolha('nivel')}
        />
        <Pilula rotulo="Ano" contagem={demo.anos.size} aoTocar={() => setFolha('ano')} />
        <Pilula rotulo="Novidades" contagem={0} aoTocar={aoTocarNovidades} />
        <Pilula
          rotulo="Categorias"
          contagem={demo.tipos.size}
          aoTocar={() => setFolha('categorias')}
        />
        {demo.temFiltro && (
          <Pressable
            onPress={demo.limparFiltros}
            className="h-9 flex-row items-center gap-1 rounded-full px-3"
          >
            <Ionicons name="close-circle" size={16} color="#A2A8B4" />
            <Text className="font-corpo-medio text-sm text-texto-2">limpar</Text>
          </Pressable>
        )}
      </ScrollView>

      <FolhaInferior visivel={folha === 'nivel'} titulo="Nível de escrita" aoFechar={() => setFolha(null)}>
        {(Object.keys(nomeNivel) as NivelEscrita[]).map((nivel) => (
          <Opcao
            key={nivel}
            marcado={demo.niveis.has(nivel)}
            aoTocar={() => demo.alternarNivel(nivel)}
            rotulo={nomeNivel[nivel]}
            extra={
              <Text className="font-manuscrito text-xl text-marca">{exemploNivel[nivel]}</Text>
            }
          />
        ))}
        <Text className="px-1 pt-1 font-corpo text-xs text-texto-2">
          Ao lado de cada nível, como a criança escreve “borboleta” naquele estágio.
        </Text>
      </FolhaInferior>

      <FolhaInferior visivel={folha === 'ano'} titulo="Ano" aoFechar={() => setFolha(null)}>
        {(Object.keys(nomeAno) as AnoEscolar[]).map((ano) => (
          <Opcao
            key={ano}
            marcado={demo.anos.has(ano)}
            aoTocar={() => demo.alternarAno(ano)}
            rotulo={nomeAno[ano]}
          />
        ))}
      </FolhaInferior>

      <FolhaInferior
        visivel={folha === 'categorias'}
        titulo="Categorias"
        aoFechar={() => setFolha(null)}
      >
        {(Object.keys(nomeTipo) as TipoMaterial[]).map((tipo) => (
          <Opcao
            key={tipo}
            marcado={demo.tipos.has(tipo)}
            aoTocar={() => demo.alternarTipo(tipo)}
            rotulo={nomeTipo[tipo]}
          />
        ))}
      </FolhaInferior>
    </View>
  );
}

function Pilula({
  rotulo,
  contagem,
  aoTocar,
}: {
  rotulo: string;
  contagem: number;
  aoTocar?: () => void;
}) {
  const ativa = contagem > 0;
  return (
    <Pressable
      onPress={aoTocar}
      className={`h-9 flex-row items-center rounded-full border px-4 ${
        ativa ? 'border-texto bg-texto' : 'border-superficie-2 bg-transparent'
      }`}
    >
      <Text
        className={`font-corpo-medio text-sm ${ativa ? 'text-fundo' : 'text-texto'}`}
      >
        {rotulo}
        {ativa ? ` · ${contagem}` : ''}
      </Text>
    </Pressable>
  );
}

function FolhaInferior({
  visivel,
  titulo,
  aoFechar,
  children,
}: {
  visivel: boolean;
  titulo: string;
  aoFechar: () => void;
  children: React.ReactNode;
}) {
  return (
    <Modal visible={visivel} transparent animationType="slide" onRequestClose={aoFechar}>
      <Pressable className="flex-1 justify-end bg-black/60" onPress={aoFechar}>
        <Pressable
          className="gap-2 rounded-t-3xl bg-superficie p-5 pb-10"
          onPress={(e) => e.stopPropagation()}
        >
          <View className="mb-1 flex-row items-center justify-between">
            <Text className="font-titulo-semi text-xl text-texto">{titulo}</Text>
            <Pressable onPress={aoFechar} hitSlop={12}>
              <Ionicons name="close" size={22} color="#A2A8B4" />
            </Pressable>
          </View>
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function Opcao({
  marcado,
  aoTocar,
  rotulo,
  extra,
}: {
  marcado: boolean;
  aoTocar: () => void;
  rotulo: string;
  extra?: React.ReactNode;
}) {
  return (
    <Pressable
      onPress={aoTocar}
      className={`min-h-[52px] flex-row items-center justify-between rounded-xl px-4 py-3 ${
        marcado ? 'bg-superficie-2' : ''
      }`}
    >
      <View className="flex-row items-center gap-3">
        <Ionicons
          name={marcado ? 'checkmark-circle' : 'ellipse-outline'}
          size={22}
          color={marcado ? '#FFD84D' : '#A2A8B4'}
        />
        <Text className="font-corpo-medio text-base text-texto">{rotulo}</Text>
      </View>
      {extra}
    </Pressable>
  );
}
