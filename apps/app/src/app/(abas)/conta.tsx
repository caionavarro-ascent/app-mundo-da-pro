import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { Alert, Linking, Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useDemo } from '../../contexto/demo';
import { useCores } from '../../hooks/use-cores';

const WHATSAPP_SUPORTE = process.env.EXPO_PUBLIC_SUPORTE_WHATSAPP;

/** Tela Conta: gestão da conta e configurações, fora da aba Meus materiais. */
export default function Conta() {
  const demo = useDemo();
  const cores = useCores();
  const router = useRouter();
  const { colorScheme: esquema, setColorScheme } = useColorScheme();

  const emBreve = (recurso: string, bloco: string) => () =>
    Alert.alert(recurso, `Chega no ${bloco}.`);

  const abrirWhatsApp = () => {
    if (!WHATSAPP_SUPORTE) {
      Alert.alert('Ajuda no WhatsApp', 'Chega no Bloco 11.');
      return;
    }
    Linking.openURL(WHATSAPP_SUPORTE).catch(() =>
      Alert.alert('Ajuda no WhatsApp', 'Não foi possível abrir o WhatsApp.'),
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-fundo" edges={['top']}>
      <ScrollView contentContainerClassName="gap-6 py-4 pb-10">
        <View className="flex-row items-center gap-3 px-4">
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <Ionicons name="chevron-back" size={26} color={cores.texto} />
          </Pressable>
          <Text className="font-titulo-semi text-2xl text-texto">Conta</Text>
        </View>

        <View className="flex-row items-center gap-3 px-4">
          <View className="h-14 w-14 items-center justify-center rounded-full bg-marca">
            <Text className="font-titulo text-xl text-[#16191F]">{demo.nome.charAt(0)}</Text>
          </View>
          <View>
            <Text className="font-titulo-semi text-xl text-texto">{demo.nome}</Text>
            <Text className="font-corpo text-sm text-texto-2">conta de demonstração</Text>
          </View>
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

        <Pressable
          onPress={demo.reverAbertura}
          className="mx-4 flex-row items-center gap-3 rounded-xl bg-superficie p-4"
        >
          <Ionicons name="sparkles-outline" size={20} color={cores.texto2} />
          <Text className="flex-1 font-corpo-medio text-base text-texto">
            Rever a apresentação do app
          </Text>
          <Ionicons name="chevron-forward" size={18} color={cores.texto2} />
        </Pressable>

        <View className="mx-4 overflow-hidden rounded-xl bg-superficie">
          <Pressable
            onPress={emBreve('Notificações', 'Bloco 11')}
            className="flex-row items-center gap-3 p-4"
          >
            <Ionicons name="notifications-outline" size={20} color={cores.texto2} />
            <Text className="font-corpo-medio text-base text-texto">Notificações</Text>
          </Pressable>
          <Pressable
            onPress={abrirWhatsApp}
            className="flex-row items-center gap-3 border-t border-superficie-2 p-4"
          >
            <Ionicons name="logo-whatsapp" size={20} color={cores.texto2} />
            <Text className="font-corpo-medio text-base text-texto">Ajuda no WhatsApp</Text>
          </Pressable>
          {(
            [
              ['document-text-outline', 'Termos e privacidade', 'Bloco 12'],
              ['exit-outline', 'Sair', 'Bloco 2'],
              ['trash-outline', 'Excluir minha conta', 'Bloco 11'],
            ] as const
          ).map(([icone, rotulo, bloco]) => (
            <Pressable
              key={rotulo}
              onPress={emBreve(rotulo, bloco)}
              className="flex-row items-center gap-3 border-t border-superficie-2 p-4"
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
