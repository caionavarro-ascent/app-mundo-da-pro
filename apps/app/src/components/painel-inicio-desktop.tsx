import { Ionicons } from '@expo/vector-icons';
import { materiaisDemo, novidades } from '@mdp/core/src/mock/acervo';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Linking, Pressable, Text, TextInput, View } from 'react-native';

import { useDemo } from '../contexto/demo';
import { useCores } from '../hooks/use-cores';

const WHATSAPP_SUPORTE = process.env.EXPO_PUBLIC_SUPORTE_WHATSAPP;

const MAIS_BUSCADOS = ['Alfabetização', 'Leitura', 'Sondagem', 'Produção de texto'];

const MES_ATUAL = new Date().toLocaleDateString('pt-BR', { month: 'long' });

/**
 * Cabeçalho da home no modo desktop web: cartões de resumo e saudação com
 * busca central, na estrutura do painel de referência do cliente. Só desktop —
 * no celular a home segue a estrutura Netflix do PRD (busca é aba, não campo).
 */
export function PainelInicioDesktop() {
  const demo = useDemo();
  const cores = useCores();
  const router = useRouter();
  const [termo, setTermo] = useState('');

  const buscar = (texto: string) => {
    const limpo = texto.trim();
    if (!limpo) {
      router.navigate('/buscar');
      return;
    }
    demo.registrarBusca(limpo);
    router.navigate({ pathname: '/buscar', params: { q: limpo } });
  };

  const abrirGrupo = () => {
    if (!WHATSAPP_SUPORTE) {
      Alert.alert('Grupo de professoras', 'O link do grupo chega no Bloco 11.');
      return;
    }
    Linking.openURL(WHATSAPP_SUPORTE);
  };

  const sugerirMaterial = () =>
    Alert.alert(
      'Sugerir um material',
      'Na versão final, abre a conversa com a equipe no WhatsApp.',
    );

  return (
    <View className="gap-6 px-4">
      {/* cartões de resumo (sem créditos nem downloads, a pedido) */}
      <View className="flex-row gap-4">
        <View className="flex-1 justify-between gap-4 rounded-2xl bg-superficie p-5">
          <View className="gap-1">
            <Text className="font-corpo-forte text-xs uppercase text-texto-2">
              Materiais disponíveis
            </Text>
            <Text className="font-titulo text-3xl text-texto">
              {materiaisDemo.length}
            </Text>
            <Text className="font-corpo text-sm text-texto-2">
              atividades, jogos, ebooks e mais
            </Text>
          </View>
          <View className="h-9 w-9 items-center justify-center rounded-lg bg-superficie-2">
            <Ionicons name="library-outline" size={18} color={cores.marcaLegivel} />
          </View>
        </View>

        <View className="flex-1 justify-between gap-4 rounded-2xl bg-superficie p-5">
          <View className="gap-1">
            <Text className="font-corpo-forte text-xs uppercase text-texto-2">
              Novidades de {MES_ATUAL}
            </Text>
            <Text className="font-titulo text-3xl text-texto">{novidades().length}</Text>
            <Text className="font-corpo text-sm text-texto-2">
              novos materiais adicionados
            </Text>
          </View>
          <View className="h-9 w-9 items-center justify-center rounded-lg bg-superficie-2">
            <Ionicons name="sparkles-outline" size={18} color={cores.verde} />
          </View>
        </View>

        <View className="flex-1 justify-between gap-3 rounded-2xl bg-[#DFF6EA] p-5">
          <View className="gap-1">
            <View className="flex-row items-center justify-between">
              <View className="h-9 w-9 items-center justify-center rounded-lg bg-[#1F9E77]">
                <Ionicons name="logo-whatsapp" size={18} color="#FFFFFF" />
              </View>
              <View className="rounded-full bg-white px-2 py-0.5">
                <Text className="font-corpo-forte text-[10px] uppercase text-[#0E7A58]">
                  Avisos
                </Text>
              </View>
            </View>
            <Text className="mt-2 font-titulo-semi text-lg leading-tight text-[#0E7A58]">
              Entre no grupo de professoras
            </Text>
            <Text className="font-corpo text-sm text-[#2B5A4B]">
              Receba avisos de material novo e novidades do Mundo da Prô.
            </Text>
          </View>
          <Pressable
            onPress={abrirGrupo}
            className="h-10 items-center justify-center rounded-lg bg-white"
          >
            <Text className="font-corpo-forte text-sm uppercase text-[#0E7A58]">
              Entrar no grupo
            </Text>
          </Pressable>
        </View>

        <Pressable
          onPress={sugerirMaterial}
          className="flex-1 justify-between gap-4 rounded-2xl bg-superficie p-5"
        >
          <View className="gap-1">
            <Text className="font-corpo-forte text-xs uppercase text-texto-2">
              Sugestão
            </Text>
            <Text className="font-titulo-semi text-lg leading-tight text-texto">
              Sugerir um material
            </Text>
            <Text className="font-corpo text-sm text-texto-2">
              Não encontrou o que precisa? Conta pra gente.
            </Text>
          </View>
          <View className="h-9 w-9 items-center justify-center rounded-lg bg-superficie-2">
            <Ionicons name="bulb-outline" size={18} color={cores.marcaLegivel} />
          </View>
        </Pressable>
      </View>

      {/* saudação com busca central (gradiente só roda no web) */}
      <View
        className="items-center gap-4 rounded-3xl px-10 py-12"
        style={{
          backgroundImage: 'linear-gradient(120deg, #16325A 0%, #8E1D5B 65%, #FF0167 130%)',
        } as object}
      >
        <Text className="text-center font-titulo text-4xl text-white">
          Olá {demo.nome}, o que você precisa hoje?
        </Text>
        <Text className="text-center font-corpo text-lg text-white/85">
          Pergunte do seu jeito: o tema, o ano, o nível de escrita ou o tipo de material.
        </Text>

        <View className="mt-2 w-full max-w-[640px] flex-row items-center rounded-full bg-white p-1.5 pl-5">
          <Ionicons name="search" size={20} color="#4E5F7C" />
          <TextInput
            value={termo}
            onChangeText={setTermo}
            onSubmitEditing={() => buscar(termo)}
            placeholder="Ex: subtração, alfabetização, interpretação de texto…"
            placeholderTextColor="#8A97AC"
            className="h-12 flex-1 px-3 font-corpo text-base text-[#0E2447]"
            autoCorrect={false}
            returnKeyType="search"
          />
          <Pressable
            onPress={() => buscar(termo)}
            className="h-12 flex-row items-center gap-2 rounded-full bg-marca px-6"
          >
            <Ionicons name="search" size={16} color="#FFFFFF" />
            <Text className="font-corpo-forte text-base text-white">Buscar</Text>
          </Pressable>
        </View>

        <View className="flex-row items-center gap-2">
          <Text className="font-corpo text-sm text-white/75">Mais buscados:</Text>
          {MAIS_BUSCADOS.map((sugestao) => (
            <Pressable
              key={sugestao}
              onPress={() => buscar(sugestao)}
              className="rounded-full bg-white/15 px-3 py-1.5"
            >
              <Text className="font-corpo-medio text-sm text-white">{sugestao}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}
