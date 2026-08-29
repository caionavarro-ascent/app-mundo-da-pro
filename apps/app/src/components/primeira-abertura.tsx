import { Ionicons } from '@expo/vector-icons';
import { exemploNivel, nomeNivel, type NivelEscrita } from '@mdp/core';
import { useRef, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useDemo } from '../contexto/demo';
import { useCores } from '../hooks/use-cores';

/**
 * Onboarding visual (D34): sete telas deslizáveis com mini-mockups do próprio
 * app, para a professora entender o funcionamento inteiro antes de entrar.
 * Pulável a qualquer momento; pode ser revisto em Meus materiais.
 */

// ---------------------------------------------------------------------------
// Mini-mockups — desenhados com os próprios componentes visuais do app
// ---------------------------------------------------------------------------

function MiniVitrine() {
  return (
    <View className="w-64 gap-3">
      <View className="gap-2 rounded-2xl bg-[#E4574E] p-4">
        <Text className="font-corpo-forte text-[9px] uppercase text-white/80">
          Novo no seu acervo
        </Text>
        <Text className="font-titulo text-lg leading-tight text-white">
          Sequência Didática:{'\n'}Festa Junina
        </Text>
        <View className="mt-1 items-center rounded-md bg-white py-2">
          <Text className="font-corpo-forte text-xs text-[#16191F]">Baixar agora</Text>
        </View>
      </View>
      <View className="flex-row gap-2">
        {(['#3A57C4', '#1F9E77', '#7C5CBF'] as const).map((cor, i) => (
          <View
            key={cor}
            className="h-20 flex-1 justify-end rounded-lg p-1.5"
            style={{ backgroundColor: cor }}
          >
            {i === 2 && (
              <View className="absolute bottom-1 right-1 rounded-full bg-black/60 p-1">
                <Ionicons name="lock-closed" size={8} color="#FFFFFF" />
              </View>
            )}
            <View className="h-1.5 w-3/4 rounded-full bg-white/70" />
          </View>
        ))}
      </View>
    </View>
  );
}

function MiniCodigo() {
  return (
    <View className="w-64 items-center gap-4">
      <View className="w-full flex-row items-center gap-2 rounded-xl bg-superficie px-4 py-3">
        <Ionicons name="mail-outline" size={16} color="#A2A8B4" />
        <Text className="font-corpo text-sm text-texto-2">ana@gmail.com</Text>
      </View>
      <View className="flex-row gap-2">
        {['4', '7', '2', '9', '1', '3'].map((numero, i) => (
          <View
            key={i}
            className="h-12 w-9 items-center justify-center rounded-lg border border-superficie-2 bg-superficie"
          >
            <Text className="font-titulo text-lg text-texto">{numero}</Text>
          </View>
        ))}
      </View>
      <Text className="font-corpo text-xs text-texto-2">sem senha para lembrar</Text>
    </View>
  );
}

function MiniNiveis() {
  const cores = useCores();
  const niveis = Object.keys(nomeNivel) as NivelEscrita[];
  return (
    <View className="w-64 gap-2">
      {niveis.map((nivel) => (
        <View
          key={nivel}
          className="flex-row items-center justify-between rounded-xl bg-superficie px-4 py-2.5"
        >
          <Text className="font-corpo-medio text-sm text-texto">{nomeNivel[nivel]}</Text>
          <Text className="font-manuscrito text-lg" style={{ color: cores.marcaLegivel }}>
            {exemploNivel[nivel]}
          </Text>
        </View>
      ))}
    </View>
  );
}

function MiniCadeado() {
  return (
    <View className="w-64 flex-row items-center justify-center gap-3">
      <View className="h-36 w-24 justify-between rounded-lg bg-[#1F9E77] p-2">
        <Text className="font-corpo-forte text-[8px] uppercase text-white/80">
          2 págs de amostra
        </Text>
        <View className="items-end">
          <View className="rounded-full bg-black/60 p-1.5">
            <Ionicons name="lock-closed" size={10} color="#FFFFFF" />
          </View>
        </View>
      </View>
      <Ionicons name="arrow-forward" size={20} color="#A2A8B4" />
      <View className="h-36 w-24 justify-between rounded-lg bg-[#1F9E77] p-2">
        <Text className="font-corpo-forte text-[8px] uppercase text-white/80">
          liberado
        </Text>
        <View className="items-end">
          <View className="rounded-full bg-white p-1.5">
            <Ionicons name="checkmark" size={10} color="#16191F" />
          </View>
        </View>
      </View>
    </View>
  );
}

function MiniOffline() {
  return (
    <View className="w-64 items-center gap-3">
      <View className="w-full flex-row items-center gap-3 rounded-xl bg-superficie p-4">
        <Ionicons name="document-text" size={22} color="#E4574E" />
        <View className="flex-1 gap-1">
          <View className="h-2 w-4/5 rounded-full bg-superficie-2" />
          <View className="h-2 w-3/5 rounded-full bg-superficie-2" />
        </View>
        <Ionicons name="checkmark-circle" size={20} color="#2FBE94" />
      </View>
      <View className="flex-row gap-2">
        {(
          [
            ['airplane', 'modo avião'],
            ['print', 'imprimir'],
            ['share-social', 'enviar'],
          ] as const
        ).map(([icone, rotulo]) => (
          <View
            key={rotulo}
            className="flex-row items-center gap-1.5 rounded-full bg-superficie px-3 py-2"
          >
            <Ionicons name={icone} size={13} color="#A2A8B4" />
            <Text className="font-corpo-medio text-xs text-texto-2">{rotulo}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function MiniTurma() {
  return (
    <View className="w-64 gap-3 rounded-2xl bg-superficie p-4">
      <Text className="font-corpo-forte text-sm text-texto">2º ano B · 26 alunos</Text>
      <View className="h-2 flex-row overflow-hidden rounded-full">
        <View style={{ flex: 4, backgroundColor: '#E4574E' }} />
        <View style={{ flex: 9, backgroundColor: '#FFD84D' }} />
        <View style={{ flex: 8, backgroundColor: '#3A57C4' }} />
        <View style={{ flex: 5, backgroundColor: '#1F9E77' }} />
      </View>
      {(
        [
          ['Trilha da Leitura', true],
          ['Ditado Recortado', false],
        ] as const
      ).map(([titulo, feito]) => (
        <View key={titulo} className="flex-row items-center gap-2">
          <Ionicons
            name={feito ? 'checkmark-circle' : 'ellipse-outline'}
            size={18}
            color={feito ? '#2FBE94' : '#A2A8B4'}
          />
          <Text
            className={`font-corpo text-xs ${
              feito ? 'text-texto-2 line-through' : 'text-texto'
            }`}
          >
            {titulo}
          </Text>
        </View>
      ))}
    </View>
  );
}

function MiniAula() {
  return (
    <View className="w-64 gap-2">
      <View className="h-36 items-center justify-center rounded-xl bg-black">
        <View className="h-14 w-14 items-center justify-center rounded-full bg-[#E4574E]">
          <Ionicons name="play" size={24} color="#FFFFFF" />
        </View>
      </View>
      <Text className="font-corpo-medio text-xs text-texto-2">
        Formação Destrava Aluno · Módulo 1 · 14 min
      </Text>
    </View>
  );
}

// ---------------------------------------------------------------------------

const TELAS = [
  {
    titulo: 'A vitrine dos seus materiais',
    texto:
      'O que você já comprou abre direto. O resto aparece com um cadeado discreto, para você conhecer o que existe.',
    Visual: MiniVitrine,
  },
  {
    titulo: 'Entrar é só com o e-mail',
    texto:
      'Use o mesmo e-mail da compra. Chega um código de 6 números e pronto — sem senha para lembrar.',
    Visual: MiniCodigo,
  },
  {
    titulo: 'Filtre pelo nível da sua turma',
    texto:
      'Toque em «Nível» e escolha pelo jeitinho que a criança escreve — você reconhece o caderno da sua aluna na hora.',
    Visual: MiniNiveis,
  },
  {
    titulo: 'Espie antes de ter',
    texto:
      'Todo material mostra páginas de amostra e o «Como usar» completo. Gostou? O cadeado abre na hora, com Pix ou cartão.',
    Visual: MiniCadeado,
  },
  {
    titulo: 'Baixe e use sem internet',
    texto:
      'O PDF fica guardado no seu celular, abre até no modo avião e vai para o xerox da escola pelo botão de imprimir.',
    Visual: MiniOffline,
  },
  {
    titulo: 'Suas turmas organizadas',
    texto:
      'Registre a sondagem, monte o plano da semana e marque o que já aplicou. O app sugere material do que a turma precisa.',
    Visual: MiniTurma,
  },
  {
    titulo: 'As formações moram aqui',
    texto:
      'As aulas do Destrava Aluno e da Produção de Texto tocam dentro do app, módulo por módulo, no seu ritmo.',
    Visual: MiniAula,
  },
];

export function PrimeiraAbertura() {
  const demo = useDemo();
  const cores = useCores();
  const { width } = useWindowDimensions();
  const [indice, setIndice] = useState(0);
  const lista = useRef<FlatList<(typeof TELAS)[number]>>(null);

  if (!demo.hidratado || demo.viuAbertura) return null;
  const ultimo = indice === TELAS.length - 1;

  const avancar = () => {
    if (ultimo) demo.concluirAbertura();
    else lista.current?.scrollToIndex({ index: indice + 1, animated: true });
  };

  return (
    <Modal visible transparent={false} animationType="fade">
      <SafeAreaView className="flex-1 bg-fundo">
        <View className="flex-row items-center justify-between px-6 pt-2">
          <Text className="font-titulo-semi text-base text-texto">Mundo da Prô</Text>
          <Pressable onPress={demo.concluirAbertura} hitSlop={12}>
            <Text className="font-corpo-medio text-sm text-texto-2">Pular</Text>
          </Pressable>
        </View>

        <FlatList
          ref={lista}
          data={TELAS}
          keyExtractor={(tela) => tela.titulo}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(evento) =>
            setIndice(Math.round(evento.nativeEvent.contentOffset.x / width))
          }
          renderItem={({ item }) => (
            <View style={{ width }} className="flex-1 justify-center gap-8 px-8">
              <View className="items-center">
                <item.Visual />
              </View>
              <View className="gap-3">
                <Text className="text-center font-titulo text-2xl leading-tight text-texto">
                  {item.titulo}
                </Text>
                <Text className="text-center font-corpo text-base leading-relaxed text-texto-2">
                  {item.texto}
                </Text>
              </View>
            </View>
          )}
        />

        <View className="gap-5 px-8 pb-8">
          <View className="flex-row justify-center gap-2">
            {TELAS.map((tela, i) => (
              <Pressable
                key={tela.titulo}
                onPress={() => lista.current?.scrollToIndex({ index: i, animated: true })}
                hitSlop={6}
              >
                <View
                  className={`h-2 rounded-full ${
                    i === indice ? 'w-6' : 'w-2 bg-superficie-2'
                  }`}
                  style={i === indice ? { backgroundColor: cores.marca } : undefined}
                />
              </Pressable>
            ))}
          </View>
          <Pressable
            onPress={avancar}
            className="items-center rounded-full bg-botao-prim py-4"
          >
            <Text className="font-corpo-forte text-base text-botao-prim-texto">
              {ultimo ? 'Começar a explorar' : 'Continuar'}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
