import { Ionicons } from '@expo/vector-icons';
import { createElement, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Modal,
  Platform,
  Pressable,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useCores } from '../hooks/use-cores';

/**
 * Pré-visualizar o PDF antes de baixar (D46): a folha exatamente como vai sair
 * (cabeçalho, atividade, gabarito). No web, o PDF abre dentro do app, numa
 * janela por cima; no celular, no leitor de PDF do sistema, sem baixar.
 */
export function BotoesDoPdf({
  urlDoPdf,
  habilitado,
}: {
  /** monta o endereço; `baixar` false = só visualizar (inline) */
  urlDoPdf: (baixar: boolean) => string;
  habilitado: boolean;
}) {
  const cores = useCores();
  const [aberta, setAberta] = useState(false);

  const previsualizar = () => {
    if (Platform.OS !== 'web') {
      Linking.openURL(urlDoPdf(false));
      return;
    }
    setAberta(true);
  };
  const baixar = () => Linking.openURL(urlDoPdf(true));

  return (
    <>
      <View className="flex-row flex-wrap gap-3">
        <Pressable
          onPress={previsualizar}
          disabled={!habilitado}
          className={`h-12 flex-1 flex-row items-center justify-center gap-2 rounded-xl border ${
            habilitado ? 'border-texto-2 bg-superficie' : 'border-superficie-2 bg-superficie-2'
          }`}
        >
          <Ionicons name="eye" size={18} color={habilitado ? cores.texto : cores.texto2} />
          <Text
            className={`font-corpo-forte text-base ${habilitado ? 'text-texto' : 'text-texto-2'}`}
          >
            Pré-visualizar
          </Text>
        </Pressable>
        <Pressable
          onPress={baixar}
          disabled={!habilitado}
          className={`h-12 flex-1 flex-row items-center justify-center gap-2 rounded-xl ${
            habilitado ? 'bg-botao-prim' : 'bg-superficie-2'
          }`}
        >
          <Ionicons
            name="download"
            size={18}
            color={habilitado ? cores.botaoPrimarioTexto : cores.texto2}
          />
          <Text
            className={`font-corpo-forte text-base ${
              habilitado ? 'text-botao-prim-texto' : 'text-texto-2'
            }`}
          >
            Baixar PDF
          </Text>
        </Pressable>
      </View>

      <Modal visible={aberta} animationType="fade" onRequestClose={() => setAberta(false)}>
        <SafeAreaView className="flex-1 bg-fundo">
          <View className="flex-row items-center justify-between gap-3 border-b border-superficie-2 px-4 py-3">
            <Pressable
              onPress={() => setAberta(false)}
              hitSlop={8}
              className="flex-row items-center gap-1"
            >
              <Ionicons name="close" size={20} color={cores.texto} />
              <Text className="font-corpo-medio text-sm text-texto">Fechar</Text>
            </Pressable>
            <Text className="font-corpo-forte text-sm text-texto-2">Pré-visualização</Text>
            <Pressable
              onPress={baixar}
              className="h-10 flex-row items-center gap-2 rounded-xl bg-botao-prim px-4"
            >
              <Ionicons name="download" size={16} color={cores.botaoPrimarioTexto} />
              <Text className="font-corpo-forte text-sm text-botao-prim-texto">Baixar PDF</Text>
            </Pressable>
          </View>
          <View className="flex-1 bg-superficie-2">
            {/* o aviso fica POR BAIXO do PDF: aparece enquanto a folha não chega e some
                quando o leitor pinta por cima (o onLoad do leitor de PDF não é confiável) */}
            <View className="absolute inset-0 items-center justify-center gap-2">
              <ActivityIndicator color={cores.texto2} />
              <Text className="font-corpo text-sm text-texto-2">Montando a folha…</Text>
            </View>
            {aberta &&
              Platform.OS === 'web' &&
              // leitor de PDF do navegador; só existe no web (no celular vai para o sistema)
              createElement('iframe', {
                src: `${urlDoPdf(false)}#view=FitH`,
                title: 'Pré-visualização do PDF',
                style: {
                  position: 'absolute',
                  inset: 0,
                  border: 'none',
                  width: '100%',
                  height: '100%',
                  background: 'transparent',
                },
              })}
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
}
