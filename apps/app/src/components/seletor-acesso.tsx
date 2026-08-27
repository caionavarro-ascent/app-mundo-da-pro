import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';

import { cenariosAcesso, useDemo } from '../contexto/demo';

/**
 * SÓ DO AMBIENTE DE TESTE (D29): botão de frasco que troca o cenário de posse
 * da conta demo, para mostrar como a vitrine muda. Sai junto com o mock
 * quando o Supabase entrar.
 */
export function SeletorAcesso() {
  const demo = useDemo();
  const [aberto, setAberto] = useState(false);

  return (
    <>
      <Pressable
        hitSlop={8}
        onPress={() => setAberto(true)}
        className="flex-row items-center gap-1 rounded-full bg-superficie-2 px-2.5 py-1.5"
      >
        <Ionicons name="flask" size={14} color="#FFD84D" />
        <Text className="font-corpo-forte text-[11px] text-marca">teste</Text>
      </Pressable>

      <Modal
        visible={aberto}
        transparent
        animationType="slide"
        onRequestClose={() => setAberto(false)}
      >
        <Pressable className="flex-1 justify-end bg-black/60" onPress={() => setAberto(false)}>
          <Pressable
            className="gap-2 rounded-t-3xl bg-superficie p-5 pb-10"
            onPress={(e) => e.stopPropagation()}
          >
            <View className="mb-1 flex-row items-center justify-between">
              <View>
                <Text className="font-titulo-semi text-xl text-texto">Tipo de acesso</Text>
                <Text className="font-corpo text-xs text-texto-2">
                  Ambiente de teste — simula o que a professora possui
                </Text>
              </View>
              <Pressable onPress={() => setAberto(false)} hitSlop={12}>
                <Ionicons name="close" size={22} color="#A2A8B4" />
              </Pressable>
            </View>

            {cenariosAcesso.map((c) => {
              const ativo = demo.cenario === c.id;
              return (
                <Pressable
                  key={c.id}
                  onPress={() => {
                    demo.definirCenario(c.id);
                    setAberto(false);
                  }}
                  className={`flex-row items-center gap-3 rounded-xl px-4 py-3 ${
                    ativo ? 'bg-superficie-2' : ''
                  }`}
                >
                  <Ionicons
                    name={ativo ? 'radio-button-on' : 'radio-button-off'}
                    size={22}
                    color={ativo ? '#FFD84D' : '#A2A8B4'}
                  />
                  <View className="flex-1">
                    <Text className="font-corpo-forte text-base text-texto">{c.rotulo}</Text>
                    <Text className="font-corpo text-xs text-texto-2">{c.descricao}</Text>
                  </View>
                </Pressable>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
