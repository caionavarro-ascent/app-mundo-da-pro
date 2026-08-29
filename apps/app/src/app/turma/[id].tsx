import { Ionicons } from '@expo/vector-icons';
import { nomeAno, nomeTipo } from '@mdp/core';
import {
  atividadesParaTurma,
  corDoMaterial,
  diasDaSemana,
  insightDaTurma,
  materialPorId,
  nomeDia,
  sugeridosParaTurma,
  turmaPorId,
  type DiaDaSemana,
  type MaterialDemo,
} from '@mdp/core/src/mock/acervo';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Prateleira } from '../../components/prateleira';
import { useDemo } from '../../contexto/demo';
import { useCores } from '../../hooks/use-cores';

/**
 * Tela da turma (D30): insight da sondagem, plano da semana, controle do que
 * já foi aplicado e sugestões para a turma.
 */
export default function FichaTurma() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const demo = useDemo();
  const cores = useCores();
  const [diaEscolhendo, setDiaEscolhendo] = useState<DiaDaSemana | null>(null);

  const turma = turmaPorId(id);
  if (!turma) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-fundo">
        <Text className="font-corpo text-texto-2">Turma não encontrada.</Text>
      </SafeAreaView>
    );
  }

  const automaticas = atividadesParaTurma(turma, demo.posse);
  const manuais = [...(demo.materiaisDaTurma[turma.id] ?? new Set<string>())]
    .map(materialPorId)
    .filter((m): m is MaterialDemo => m != null)
    .filter((m) => !automaticas.some((a) => a.id === m.id));
  const atividades = [...automaticas, ...manuais];
  const marcadas = demo.aplicadas[turma.id] ?? new Set<string>();
  const pendentes = atividades.filter((m) => !marcadas.has(m.id));
  const passadas = atividades.filter((m) => marcadas.has(m.id));
  const planoDaTurma = demo.plano[turma.id] ?? {};

  const LinhaAtividade = ({
    material,
    aplicada,
  }: {
    material: MaterialDemo;
    aplicada: boolean;
  }) => (
    <View className="flex-row items-center gap-3 rounded-xl bg-superficie p-3">
      <Link href={{ pathname: '/material/[id]', params: { id: material.id } }} asChild>
        <Pressable className="flex-1 flex-row items-center gap-3">
          <View
            className="h-14 w-10 items-center justify-center rounded-md p-0.5"
            style={{ backgroundColor: corDoMaterial(material) }}
          >
            <Text
              className="text-center font-titulo-semi text-[7px] text-white"
              numberOfLines={3}
            >
              {material.titulo}
            </Text>
          </View>
          <View className="flex-1">
            <Text
              className={`font-corpo-medio text-sm ${
                aplicada ? 'text-texto-2 line-through' : 'text-texto'
              }`}
              numberOfLines={2}
            >
              {material.titulo}
            </Text>
            <Text className="font-corpo text-xs text-texto-2">
              {nomeTipo[material.tipo]}
              {material.paginas > 0 ? ` · ${material.paginas} págs` : ''}
            </Text>
          </View>
        </Pressable>
      </Link>
      <Pressable
        onPress={() => demo.alternarAplicada(turma.id, material.id)}
        hitSlop={8}
        className="p-1"
      >
        <Ionicons
          name={aplicada ? 'checkmark-circle' : 'ellipse-outline'}
          size={26}
          color={aplicada ? '#1F9E77' : cores.texto2}
        />
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-fundo" edges={['top']}>
      <ScrollView contentContainerClassName="gap-6 py-4 pb-10">
        {/* cabeçalho, como na referência: voltar, resumo e insight da sondagem */}
        <View className="gap-3 px-4">
          <Pressable
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/turmas'))}
            hitSlop={8}
            className="flex-row items-center gap-1 self-start"
          >
            <Ionicons name="chevron-back" size={16} color={cores.texto2} />
            <Text className="font-corpo-medio text-sm text-texto-2">
              todas as turmas
            </Text>
          </Pressable>
          <View className="gap-1">
            <Text className="font-corpo-forte text-xs uppercase text-texto-2">
              {nomeAno[turma.ano]} · {turma.alunos} alunos
            </Text>
            <Text className="font-titulo text-3xl text-texto">{turma.nome}</Text>
            <Text className="font-corpo text-sm leading-relaxed text-texto-2">
              {insightDaTurma(turma)}
            </Text>
          </View>
        </View>

        {/* plano da semana, como na referência */}
        <View className="gap-2.5 px-4">
          <Text className="font-titulo-semi text-xl text-texto">Plano da semana</Text>
          {diasDaSemana.map((dia) => {
            const doDia = (planoDaTurma[dia] ?? [])
              .map((materialId) => materialPorId(materialId))
              .filter((m): m is MaterialDemo => m != null);
            return (
              <View key={dia} className="gap-2 rounded-2xl bg-superficie p-3.5">
                <Text className="font-corpo-forte text-xs uppercase text-texto-2">
                  {nomeDia[dia]}
                </Text>
                {doDia.map((material) => (
                  <View
                    key={material.id}
                    className="flex-row items-center gap-2 rounded-lg bg-superficie-2 px-3 py-2.5"
                  >
                    <View
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: corDoMaterial(material) }}
                    />
                    <Text
                      className="flex-1 font-corpo-medio text-sm text-texto"
                      numberOfLines={1}
                    >
                      {material.titulo}
                    </Text>
                    <Pressable
                      onPress={() => demo.removerDoPlano(turma.id, dia, material.id)}
                      hitSlop={8}
                    >
                      <Ionicons name="close" size={16} color={cores.texto2} />
                    </Pressable>
                  </View>
                ))}
                <Pressable
                  onPress={() => setDiaEscolhendo(dia)}
                  className="items-center rounded-lg border border-dashed border-superficie-2 py-2.5"
                >
                  <Text className="font-corpo-medio text-sm text-texto-2">
                    + material
                  </Text>
                </Pressable>
              </View>
            );
          })}
          <Pressable
            onPress={() =>
              Alert.alert(
                'Plano em PDF',
                'Na versão final, a semana inteira sai num PDF único para o xerox (Bloco 9).',
              )
            }
            className="flex-row items-center justify-center gap-2 rounded-lg bg-botao-prim py-3.5"
          >
            <Ionicons name="download" size={18} color={cores.botaoPrimarioTexto} />
            <Text className="font-corpo-forte text-base text-botao-prim-texto">
              Baixar a semana em um PDF
            </Text>
          </Pressable>
        </View>

        {/* controle do que já foi passado — o pedido original da aba */}
        <View className="gap-2.5 px-4">
          <Text className="font-titulo-semi text-xl text-texto">Atividades da turma</Text>
          <Text className="-mt-1 font-corpo text-xs text-texto-2">
            Toque no círculo quando passar a atividade em sala.
          </Text>
          {pendentes.map((m) => (
            <LinhaAtividade key={m.id} material={m} aplicada={false} />
          ))}
          {passadas.length > 0 && (
            <Text className="pt-1 font-corpo-forte text-sm uppercase text-texto-2">
              Já apliquei · {passadas.length}
            </Text>
          )}
          {passadas.map((m) => (
            <LinhaAtividade key={m.id} material={m} aplicada />
          ))}
        </View>

        {/* cross-sell, como na referência */}
        <Prateleira
          titulo="Sugerido para esta turma"
          subtitulo={`Materiais do ${nomeAno[turma.ano]} que você ainda não tem.`}
          materiais={sugeridosParaTurma(turma, demo.posse)}
          posse={demo.posse}
        />
      </ScrollView>

      {/* folha para escolher material do dia */}
      <Modal
        visible={diaEscolhendo != null}
        transparent
        animationType="slide"
        onRequestClose={() => setDiaEscolhendo(null)}
      >
        <Pressable
          className="flex-1 justify-end bg-black/60"
          onPress={() => setDiaEscolhendo(null)}
        >
          <Pressable
            className="max-h-[70%] gap-2 rounded-t-3xl bg-superficie p-5 pb-10"
            onPress={(e) => e.stopPropagation()}
          >
            <View className="mb-1 flex-row items-center justify-between">
              <Text className="font-titulo-semi text-xl text-texto">
                {diaEscolhendo ? nomeDia[diaEscolhendo] : ''} — escolher material
              </Text>
              <Pressable onPress={() => setDiaEscolhendo(null)} hitSlop={12}>
                <Ionicons name="close" size={22} color={cores.texto2} />
              </Pressable>
            </View>
            <ScrollView contentContainerClassName="gap-2">
              {atividades
                .filter(
                  (m) => !(diaEscolhendo && planoDaTurma[diaEscolhendo]?.includes(m.id)),
                )
                .map((material) => (
                  <Pressable
                    key={material.id}
                    onPress={() => {
                      if (diaEscolhendo)
                        demo.adicionarAoPlano(turma.id, diaEscolhendo, material.id);
                      setDiaEscolhendo(null);
                    }}
                    className="flex-row items-center gap-3 rounded-xl bg-superficie-2 px-4 py-3"
                  >
                    <View
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: corDoMaterial(material) }}
                    />
                    <View className="flex-1">
                      <Text className="font-corpo-medio text-sm text-texto" numberOfLines={1}>
                        {material.titulo}
                      </Text>
                      <Text className="font-corpo text-xs text-texto-2">
                        {nomeTipo[material.tipo]}
                      </Text>
                    </View>
                    <Ionicons name="add-circle" size={22} color="#1F9E77" />
                  </Pressable>
                ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
