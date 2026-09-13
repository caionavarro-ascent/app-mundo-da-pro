import { Ionicons } from '@expo/vector-icons';
import { exemploNivel, nomeAno, nomeNivel, type AnoEscolar, type NivelEscrita } from '@mdp/core';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useDemo } from '../../../contexto/demo';
import { useCores } from '../../../hooks/use-cores';

const NIVEIS = Object.keys(nomeNivel) as NivelEscrita[];

/** Criar turma (D30/D36): nome, ano, alunos e a sondagem inicial por nível. */
export default function CriarTurma() {
  const router = useRouter();
  const demo = useDemo();
  const cores = useCores();

  const [nome, setNome] = useState('');
  const [ano, setAno] = useState<AnoEscolar | null>(null);
  const [dist, setDist] = useState<Record<NivelEscrita, number>>({
    pre: 0,
    sil: 0,
    sa: 0,
    alf: 0,
  });

  const alunos = NIVEIS.reduce((soma, nivel) => soma + dist[nivel], 0);
  const valido = nome.trim().length > 0 && ano != null;

  const ajustar = (nivel: NivelEscrita, delta: number) =>
    setDist((atual) => ({
      ...atual,
      [nivel]: Math.max(0, Math.min(60, atual[nivel] + delta)),
    }));

  const criar = () => {
    if (!valido) return;
    const nova = demo.criarTurma({ nome: nome.trim(), ano: ano!, alunos, dist });
    router.replace({ pathname: '/turma/[id]', params: { id: nova.id } });
  };

  return (
    <SafeAreaView className="flex-1 bg-fundo" edges={['top']}>
      <ScrollView
        contentContainerStyle={{ maxWidth: 960, width: '100%', alignSelf: 'center' }}
        contentContainerClassName="gap-6 p-4 pb-10"
        keyboardShouldPersistTaps="handled"
      >
        <View className="gap-3">
          <Pressable
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/turmas'))}
            hitSlop={8}
            className="flex-row items-center gap-1 self-start"
          >
            <Ionicons name="chevron-back" size={16} color={cores.texto2} />
            <Text className="font-corpo-medio text-sm text-texto-2">Minhas turmas</Text>
          </Pressable>
          <View className="gap-1">
            <Text className="font-titulo text-2xl text-texto">Criar turma</Text>
            <Text className="font-corpo text-sm leading-relaxed text-texto-2">
              Registre a sondagem uma vez — o app passa a sugerir material do que a
              turma precisa.
            </Text>
          </View>
        </View>

        <View className="gap-2">
          <Text className="font-corpo-forte text-sm text-texto">Nome da turma</Text>
          <TextInput
            value={nome}
            onChangeText={setNome}
            placeholder="Ex.: 1º ano A — manhã"
            placeholderTextColor={cores.texto2}
            className="h-12 rounded-xl bg-superficie px-4 font-corpo text-base text-texto"
            autoCorrect={false}
          />
        </View>

        <View className="gap-2">
          <Text className="font-corpo-forte text-sm text-texto">Ano</Text>
          <View className="flex-row flex-wrap gap-2">
            {(Object.keys(nomeAno) as AnoEscolar[]).map((opcao) => {
              const ativo = ano === opcao;
              return (
                <Pressable
                  key={opcao}
                  onPress={() => setAno(opcao)}
                  className={`rounded-full border px-4 py-2 ${
                    ativo ? 'border-texto bg-texto' : 'border-superficie-2'
                  }`}
                >
                  <Text
                    className={`font-corpo-medio text-sm ${
                      ativo ? 'text-fundo' : 'text-texto'
                    }`}
                  >
                    {nomeAno[opcao]}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View className="gap-2">
          <View className="flex-row items-baseline justify-between">
            <Text className="font-corpo-forte text-sm text-texto">
              Sondagem — quantos alunos em cada nível?
            </Text>
            <Text className="font-corpo text-xs text-texto-2">{alunos} alunos</Text>
          </View>
          <View className="gap-2">
            {NIVEIS.map((nivel) => (
              <View
                key={nivel}
                className="flex-row items-center gap-3 rounded-xl bg-superficie px-4 py-2.5"
              >
                <View className="flex-1">
                  <Text className="font-corpo-medio text-sm text-texto">
                    {nomeNivel[nivel]}
                  </Text>
                  <Text
                    className="font-manuscrito text-base"
                    style={{ color: cores.marcaLegivel }}
                  >
                    {exemploNivel[nivel]}
                  </Text>
                </View>
                <Pressable
                  onPress={() => ajustar(nivel, -1)}
                  hitSlop={6}
                  className="h-9 w-9 items-center justify-center rounded-full bg-superficie-2"
                >
                  <Ionicons name="remove" size={18} color={cores.texto} />
                </Pressable>
                <Text className="w-8 text-center font-titulo-semi text-lg text-texto">
                  {dist[nivel]}
                </Text>
                <Pressable
                  onPress={() => ajustar(nivel, 1)}
                  hitSlop={6}
                  className="h-9 w-9 items-center justify-center rounded-full bg-superficie-2"
                >
                  <Ionicons name="add" size={18} color={cores.texto} />
                </Pressable>
              </View>
            ))}
          </View>
          <Text className="font-corpo text-xs leading-snug text-texto-2">
            Não fez a sondagem ainda? Deixe zerado e preencha depois — a turma já
            funciona para o plano da semana e as atividades.
          </Text>
        </View>

        <Pressable
          onPress={criar}
          disabled={!valido}
          className={`items-center rounded-full py-4 ${
            valido ? 'bg-botao-prim' : 'bg-superficie-2'
          }`}
        >
          <Text
            className={`font-corpo-forte text-base ${
              valido ? 'text-botao-prim-texto' : 'text-texto-2'
            }`}
          >
            Criar turma
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
