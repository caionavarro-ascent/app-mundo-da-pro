import { Ionicons } from '@expo/vector-icons';
import { turmasDemo } from '@mdp/core/src/mock/acervo';
import { useRouter } from 'expo-router';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useDemo } from '../../contexto/demo';
import { useCores } from '../../hooks/use-cores';

interface Ferramenta {
  icone: keyof typeof Ionicons.glyphMap;
  nome: string;
  descricao: string;
  estado: 'ativa' | 'em-breve' | 'sugestao';
  aoTocar?: () => void;
}

/**
 * Aba Ferramentas (D36): a caixa de utilitários da professora, em grid de
 * duas colunas. Minhas turmas vira a primeira ferramenta; os demais slots
 * anunciam o que vem — o app é mais que download de PDF.
 */
export default function Ferramentas() {
  const router = useRouter();
  const demo = useDemo();
  const cores = useCores();

  const emBreve = (nome: string) => () =>
    Alert.alert(
      nome,
      'Esta ferramenta está em construção — em breve nesta tela, sem precisar atualizar o app.',
    );

  const ferramentas: Ferramenta[] = [
    {
      icone: 'people',
      nome: 'Minhas turmas',
      descricao: `Sondagem, plano da semana e o que já foi aplicado · ${turmasDemo.length} turma`,
      estado: 'ativa',
      aoTocar: () => router.push('/turmas'),
    },
    {
      icone: 'checkmark-done-circle',
      nome: 'Corretor de Provas',
      descricao: 'Fotografe a prova e receba a correção pronta.',
      estado: 'em-breve',
      aoTocar: emBreve('Corretor de Provas'),
    },
    {
      icone: 'color-wand',
      nome: 'Adaptador de Provas',
      descricao: 'Adapte qualquer prova para crianças atípicas.',
      estado: 'em-breve',
      aoTocar: emBreve('Adaptador de Provas'),
    },
    {
      icone: 'analytics',
      nome: 'Sondagem Digital',
      descricao: 'Registre a hipótese de escrita de cada aluno.',
      estado: 'em-breve',
      aoTocar: emBreve('Sondagem Digital'),
    },
    {
      icone: 'calendar',
      nome: 'Plano da Semana',
      descricao: 'Monte a semana e baixe num PDF único.',
      estado: 'ativa',
      aoTocar: () =>
        router.push({ pathname: '/turma/[id]', params: { id: turmasDemo[0].id } }),
    },
    {
      icone: 'bulb',
      nome: 'Sugira uma ferramenta',
      descricao: 'O que facilitaria a sua semana? Conta pra gente.',
      estado: 'sugestao',
      aoTocar: () =>
        Alert.alert(
          'Sugerir ferramenta',
          'Na versão final, abre a conversa com o suporte no WhatsApp.',
        ),
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-fundo" edges={['top']}>
      <ScrollView
        contentContainerStyle={{ maxWidth: 960, width: '100%', alignSelf: 'center' }}
        contentContainerClassName="gap-5 p-4 pb-10"
      >
        <View className="gap-1">
          <Text className="font-corpo-forte text-xs uppercase text-texto-2">
            Sala de aula
          </Text>
          <Text className="font-titulo text-2xl text-texto">Ferramentas</Text>
          <Text className="font-corpo text-sm leading-relaxed text-texto-2">
            Utilitários para o dia a dia da professora — aqui o app vai muito além do
            material para imprimir.
          </Text>
        </View>

        <View className="flex-row flex-wrap justify-between gap-y-3">
          {ferramentas.map((ferramenta) => (
            <Pressable
              key={ferramenta.nome}
              onPress={ferramenta.aoTocar}
              className={`gap-3 rounded-2xl p-4 ${
                ferramenta.estado === 'sugestao'
                  ? 'border border-dashed border-superficie-2'
                  : 'bg-superficie'
              }`}
              style={{ width: '48.5%', minHeight: 148 }}
            >
              <View className="flex-row items-start justify-between">
                <View
                  className="h-11 w-11 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor:
                      ferramenta.estado === 'ativa' ? cores.marca : cores.superficie2,
                  }}
                >
                  <Ionicons
                    name={ferramenta.icone}
                    size={22}
                    color={ferramenta.estado === 'ativa' ? '#16191F' : cores.texto2}
                  />
                </View>
                {ferramenta.estado === 'em-breve' && (
                  <View className="rounded-full bg-superficie-2 px-2 py-0.5">
                    <Text className="font-corpo-forte text-[9px] uppercase text-texto-2">
                      Em breve
                    </Text>
                  </View>
                )}
              </View>
              <View className="gap-0.5">
                <Text className="font-corpo-forte text-[15px] leading-snug text-texto">
                  {ferramenta.nome}
                </Text>
                <Text className="font-corpo text-xs leading-snug text-texto-2">
                  {ferramenta.descricao}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>

        <Text className="px-1 font-corpo text-xs leading-snug text-texto-2">
          As ferramentas chegam por atualização remota — quando uma ficar pronta, ela
          aparece aqui sozinha.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
