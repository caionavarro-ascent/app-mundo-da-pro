import { Ionicons } from '@expo/vector-icons';
import { exemploNivel, nomeAno, nomeNivel, type NivelEscrita } from '@mdp/core';
import { atividadesParaTurma, materialPorId, turmasDemo } from '@mdp/core/src/mock/acervo';
import { Link, useRouter } from 'expo-router';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useDemo } from '../../contexto/demo';
import { useCores } from '../../hooks/use-cores';

const CORES_NIVEL: Record<NivelEscrita, string> = {
  pre: '#E4574E',
  sil: '#FFD84D',
  sa: '#3A57C4',
  alf: '#1F9E77',
};

const ROTULO_CURTO: Record<NivelEscrita, string> = {
  pre: 'Pré',
  sil: 'Silábico',
  sa: 'Sil.–alf.',
  alf: 'Alfabético',
};

/** Aba Minhas turmas (D30): as turmas que a professora atende. */
export default function MinhasTurmas() {
  const demo = useDemo();
  const cores = useCores();
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-fundo" edges={['top']}>
      <ScrollView contentContainerClassName="gap-4 p-4 pb-10">
        <Pressable
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/ferramentas'))}
          hitSlop={8}
          className="flex-row items-center gap-1 self-start"
        >
          <Ionicons name="chevron-back" size={16} color={cores.texto2} />
          <Text className="font-corpo-medio text-sm text-texto-2">Ferramentas</Text>
        </Pressable>

        <View className="gap-1">
          <Text className="font-corpo-forte text-xs uppercase text-texto-2">
            Sondagem e planejamento
          </Text>
          <Text className="font-titulo text-2xl text-texto">Minhas turmas</Text>
          <Text className="font-corpo text-sm leading-relaxed text-texto-2">
            Registre o nível de cada aluno uma vez. O app passa a sugerir material só
            do que a turma precisa.
          </Text>
        </View>

        {turmasDemo.map((turma) => {
          const automaticas = atividadesParaTurma(turma, demo.posse);
          const manuais = [...(demo.materiaisDaTurma[turma.id] ?? new Set<string>())]
            .map(materialPorId)
            .filter(
              (m): m is NonNullable<typeof m> =>
                m != null && !automaticas.some((a) => a.id === m.id),
            );
          const atividades = [...automaticas, ...manuais];
          const passadas = atividades.filter((m) =>
            demo.aplicadas[turma.id]?.has(m.id),
          ).length;
          const progresso = atividades.length > 0 ? passadas / atividades.length : 0;

          return (
            <Link
              key={turma.id}
              href={{ pathname: '/turma/[id]', params: { id: turma.id } }}
              asChild
            >
              <Pressable className="gap-4 rounded-2xl bg-superficie p-4">
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="font-titulo-semi text-lg text-texto">
                      {turma.nome}
                    </Text>
                    <Text className="font-corpo text-sm text-texto-2">
                      {nomeAno[turma.ano]} · {turma.alunos} alunos
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={cores.texto2} />
                </View>

                {/* distribuição da sondagem por nível de escrita */}
                <View className="gap-2">
                  <View className="h-2 flex-row overflow-hidden rounded-full">
                    {(Object.keys(turma.dist) as NivelEscrita[]).map((nivel) => (
                      <View
                        key={nivel}
                        style={{
                          flex: turma.dist[nivel] || 0.0001,
                          backgroundColor: CORES_NIVEL[nivel],
                        }}
                      />
                    ))}
                  </View>
                  <View className="flex-row flex-wrap gap-x-3 gap-y-1">
                    {(Object.keys(turma.dist) as NivelEscrita[]).map((nivel) => (
                      <View key={nivel} className="flex-row items-center gap-1">
                        <View
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: CORES_NIVEL[nivel] }}
                        />
                        <Text className="font-corpo text-xs text-texto-2">
                          {ROTULO_CURTO[nivel]} · {turma.dist[nivel]}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* progresso de atividades aplicadas */}
                <View className="gap-1.5">
                  <View className="flex-row justify-between">
                    <Text className="font-corpo-medio text-xs text-texto-2">
                      Atividades aplicadas
                    </Text>
                    <Text className="font-corpo-forte text-xs text-texto">
                      {passadas} de {atividades.length}
                    </Text>
                  </View>
                  <View className="h-1.5 overflow-hidden rounded-full bg-superficie-2">
                    <View
                      className="h-full rounded-full bg-verde"
                      style={{ width: `${Math.round(progresso * 100)}%` }}
                    />
                  </View>
                </View>
              </Pressable>
            </Link>
          );
        })}

        <Pressable
          onPress={() =>
            Alert.alert('Nova turma', 'Criar e editar turmas chega com a versão final.')
          }
          className="items-center rounded-2xl border border-dashed border-superficie-2 py-8"
        >
          <Text className="font-corpo-forte text-base text-texto-2">+ Criar turma</Text>
        </Pressable>

        <Text className="px-1 font-corpo text-xs leading-snug text-texto-2">
          A distribuição por nível vem da sondagem — {exemploNivel.pre} →{' '}
          {exemploNivel.alf}.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
