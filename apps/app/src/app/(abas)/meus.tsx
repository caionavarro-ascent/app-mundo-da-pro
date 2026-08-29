import { Ionicons } from '@expo/vector-icons';
import { estaLiberado, materiaisDemo, produtoPorId } from '@mdp/core/src/mock/acervo';
import { useColorScheme } from 'nativewind';
import { Alert, Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Prateleira } from '../../components/prateleira';
import { useDemo } from '../../contexto/demo';
import { useCores } from '../../hooks/use-cores';

/** Aba Meus materiais (A8): possuídos, favoritos, baixados e conta. */
export default function MeusMateriais() {
  const demo = useDemo();
  const cores = useCores();
  const { colorScheme: esquema, setColorScheme } = useColorScheme();
  const favoritos = materiaisDemo.filter((m) => demo.favoritos.has(m.id));
  const possuidos = materiaisDemo.filter(
    (m) => !m.gratuito && estaLiberado(m, demo.posse),
  );

  const emBreve = (recurso: string, bloco: string) => () =>
    Alert.alert(recurso, `Chega no ${bloco}.`);

  return (
    <SafeAreaView className="flex-1 bg-fundo" edges={['top']}>
      <ScrollView contentContainerClassName="gap-6 py-4 pb-10">
        <View className="flex-row items-center gap-3 px-4">
          <View className="h-14 w-14 items-center justify-center rounded-full bg-marca">
            <Text className="font-titulo text-xl text-[#16191F]">{demo.nome.charAt(0)}</Text>
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
          {demo.posse.length === 0 && (
            <Text className="font-corpo text-sm text-texto-2">
              Nenhum produto neste cenário de teste — só os materiais gratuitos.
            </Text>
          )}
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

        <View className="mx-4 flex-row items-center gap-3 rounded-xl bg-superficie p-4">
          <Ionicons
            name={esquema === 'light' ? 'sunny-outline' : 'moon-outline'}
            size={20}
            color={cores.texto2}
          />
          <View className="flex-1">
            <Text className="font-corpo-medio text-base text-texto">Tema escuro</Text>
            <Text className="font-corpo text-xs text-texto-2">
              Compare os dois fundos — decisão em aberto com a equipe (D14)
            </Text>
          </View>
          <Switch
            value={esquema !== 'light'}
            onValueChange={(escuro) => setColorScheme(escuro ? 'dark' : 'light')}
            trackColor={{ false: cores.superficie2, true: '#1F9E77' }}
            thumbColor="#FFFFFF"
          />
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
              <Ionicons name={icone} size={20} color={cores.texto2} />
              <Text className="font-corpo-medio text-base text-texto">{rotulo}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
