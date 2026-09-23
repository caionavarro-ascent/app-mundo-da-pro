import { Ionicons } from '@expo/vector-icons';
import {
  estaLiberado,
  materiaisDemo,
  produtosDemo,
  type ProdutoDemo,
} from '@mdp/core/src/mock/acervo';
import { aulasPanda } from '@mdp/core/src/mock/aulas-panda';
import { Link } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Prateleira } from '../../components/prateleira';
import { useDemo } from '../../contexto/demo';
import { useCores } from '../../hooks/use-cores';

/** Resumo curto do card: o pitch do produto + tamanho do acervo dele. */
function resumoDoProduto(p: ProdutoDemo): string {
  if (p.cursoExterno) {
    const aulas = aulasPanda.filter((a) => a.formacao === p.id).length;
    return aulas > 0 ? `${aulas} aulas em vídeo` : 'Aulas em vídeo';
  }
  const materiais = materiaisDemo.filter((m) => m.produtoIds.includes(p.id)).length;
  return materiais === 1 ? '1 material no app' : `${materiais} materiais no app`;
}

/** Aba Meus materiais (A8): os produtos comprados e os materiais deles. */
export default function MeusMateriais() {
  const demo = useDemo();
  const cores = useCores();
  const favoritos = materiaisDemo.filter((m) => demo.favoritos.has(m.id));
  const possuidos = materiaisDemo.filter(
    (m) => !m.gratuito && estaLiberado(m, demo.posse),
  );

  const temCombo = demo.posse.includes('acesso-total');
  const meusProdutos = produtosDemo
    .filter((p) => !p.isCombo && (temCombo || demo.posse.includes(p.id)))
    .sort((a, b) => a.ordemVitrine - b.ordemVitrine);

  return (
    <SafeAreaView className="flex-1 bg-fundo" edges={['top']}>
      <ScrollView contentContainerClassName="gap-6 py-4 pb-10">
        <View className="flex-row items-center gap-3 px-4">
          <View className="h-12 w-12 items-center justify-center rounded-full bg-marca">
            <Text className="font-titulo text-lg text-[#16191F]">{demo.nome.charAt(0)}</Text>
          </View>
          <View className="flex-1">
            <Text className="font-titulo-semi text-xl text-texto">{demo.nome}</Text>
            <Text className="font-corpo text-sm text-texto-2">conta de demonstração</Text>
          </View>
          <Link href="/conta" asChild>
            <Pressable
              hitSlop={8}
              className="h-11 w-11 items-center justify-center rounded-full bg-superficie"
            >
              <Ionicons name="settings-outline" size={22} color={cores.texto} />
            </Pressable>
          </Link>
        </View>

        <View className="gap-2 px-4">
          <Text className="font-corpo-forte text-sm uppercase text-texto-2">
            Meus produtos
          </Text>
          {temCombo && (
            <View className="flex-row items-center gap-2 rounded-xl bg-marca/15 p-3">
              <Ionicons name="star" size={16} color={cores.texto} />
              <Text className="flex-1 font-corpo-medio text-sm text-texto">
                Acesso Total: todos os produtos liberados
              </Text>
            </View>
          )}
          {meusProdutos.length === 0 && (
            <Text className="font-corpo text-sm text-texto-2">
              Você ainda não tem produtos — explore a vitrine e conheça o acervo.
              Os materiais gratuitos continuam abertos para você.
            </Text>
          )}
          {meusProdutos.map((produto) => {
            const conteudo = (
              <View className="flex-row items-center gap-3 rounded-xl bg-superficie p-4">
                <View
                  className="h-12 w-12 items-center justify-center rounded-xl"
                  style={{ backgroundColor: produto.cor }}
                >
                  <Text className="font-titulo text-lg text-white">
                    {produto.nome.charAt(0)}
                  </Text>
                </View>
                <View className="flex-1 gap-0.5">
                  <Text className="font-corpo-forte text-base text-texto">
                    {produto.nome}
                  </Text>
                  <Text className="font-corpo text-xs text-texto-2" numberOfLines={2}>
                    {produto.pitchParaQue}
                  </Text>
                  <Text className="font-corpo-medio text-xs" style={{ color: produto.cor }}>
                    {resumoDoProduto(produto)}
                  </Text>
                </View>
                {produto.cursoExterno && (
                  <Ionicons name="chevron-forward" size={18} color={cores.texto2} />
                )}
              </View>
            );
            return produto.cursoExterno ? (
              <Link
                key={produto.id}
                href={{ pathname: '/formacao/[id]', params: { id: produto.id } }}
                asChild
              >
                <Pressable>{conteudo}</Pressable>
              </Link>
            ) : (
              <View key={produto.id}>{conteudo}</View>
            );
          })}
        </View>

        <Prateleira titulo="Seus materiais" materiais={possuidos} posse={demo.posse} />

        {favoritos.length > 0 ? (
          <Prateleira titulo="Salvos" materiais={favoritos} posse={demo.posse} />
        ) : (
          <View className="gap-1 px-4">
            <Text className="font-corpo-forte text-sm uppercase text-texto-2">Salvos</Text>
            <Text className="font-corpo text-sm text-texto-2">
              Toque em “Salvar” em qualquer material para guardar aqui.
            </Text>
          </View>
        )}

        <View className="gap-1 px-4">
          <Text className="font-corpo-forte text-sm uppercase text-texto-2">Baixados</Text>
          <Text className="font-corpo text-sm text-texto-2">
            O download para usar sem internet chega no Bloco 9.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
