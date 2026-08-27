import { Ionicons } from '@expo/vector-icons';
import { materiaisDemo, produtoPorId } from '@mdp/core/src/mock/acervo';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Prateleira } from '../../components/prateleira';
import { useDemo } from '../../contexto/demo';

/** Aba Meus materiais (A8): possuídos, favoritos, baixados e conta. */
export default function MeusMateriais() {
  const demo = useDemo();
  const favoritos = materiaisDemo.filter((m) => demo.favoritos.has(m.id));
  const possuidos = materiaisDemo.filter((m) =>
    m.produtoIds.some((id) => demo.posse.includes(id)),
  );

  const emBreve = (recurso: string, bloco: string) => () =>
    Alert.alert(recurso, `Chega no ${bloco}.`);

  return (
    <SafeAreaView className="flex-1 bg-fundo" edges={['top']}>
      <ScrollView contentContainerClassName="gap-6 py-4 pb-10">
        <View className="flex-row items-center gap-3 px-4">
          <View className="h-14 w-14 items-center justify-center rounded-full bg-marca">
            <Text className="font-titulo text-xl text-fundo">{demo.nome.charAt(0)}</Text>
          </View>
          <View>
            <Text className="font-titulo-semi text-xl text-texto">{demo.nome}</Text>
            <Text className="font-corpo text-sm text-texto-2">conta de demonstração</Text>
          </View>
        </View>

        <View className="gap-2 px-4">
          <Text className="font-corpo-forte text-sm uppercase text-texto-2">
            Meus acessos
          </Text>
          {demo.posse.map((id) => {
            const produto = produtoPorId(id);
            if (!produto) return null;
            return (
              <View
                key={id}
                className="flex-row items-center gap-3 rounded-xl bg-superficie p-4"
              >
                <View
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: produto.cor }}
                />
                <Text className="flex-1 font-corpo-medio text-base text-texto">
                  {produto.nome}
                </Text>
                <Text className="font-corpo text-xs text-texto-2">liberado</Text>
              </View>
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

        <View className="mx-4 overflow-hidden rounded-xl bg-superficie">
          {(
            [
              ['notifications-outline', 'Notificações', 'Bloco 11'],
              ['logo-whatsapp', 'Ajuda no WhatsApp', 'Bloco 11'],
              ['document-text-outline', 'Termos e privacidade', 'Bloco 12'],
              ['exit-outline', 'Sair', 'Bloco 2'],
              ['trash-outline', 'Excluir minha conta', 'Bloco 11'],
            ] as const
          ).map(([icone, rotulo, bloco], i) => (
            <Pressable
              key={rotulo}
              onPress={emBreve(rotulo, bloco)}
              className={`flex-row items-center gap-3 p-4 ${
                i > 0 ? 'border-t border-superficie-2' : ''
              }`}
            >
              <Ionicons name={icone} size={20} color="#A2A8B4" />
              <Text className="font-corpo-medio text-base text-texto">{rotulo}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
