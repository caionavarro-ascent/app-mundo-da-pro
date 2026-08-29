import { Ionicons } from '@expo/vector-icons';
import { nomeAno } from '@mdp/core';
import { turmasDemo, type MaterialDemo } from '@mdp/core/src/mock/acervo';
import { Modal, Pressable, Text, View } from 'react-native';

import { useDemo } from '../contexto/demo';
import { useCores } from '../hooks/use-cores';

/**
 * Folha do botão Salvar: em vez de favoritar direto, a professora escolhe
 * onde guardar — nos favoritos e/ou numa turma. Cada linha é um toggle.
 * Renderizada uma única vez no layout raiz; abre via demo.abrirSalvar().
 */
export function FolhaSalvarGlobal() {
  const demo = useDemo();
  if (!demo.materialSalvando) return null;
  return (
    <FolhaSalvar
      material={demo.materialSalvando}
      visivel
      aoFechar={demo.fecharSalvar}
    />
  );
}

function FolhaSalvar({
  material,
  visivel,
  aoFechar,
}: {
  material: MaterialDemo;
  visivel: boolean;
  aoFechar: () => void;
}) {
  const demo = useDemo();
  const cores = useCores();
  const favoritado = demo.favoritos.has(material.id);

  return (
    <Modal visible={visivel} transparent animationType="slide" onRequestClose={aoFechar}>
      <Pressable className="flex-1 justify-end bg-black/60" onPress={aoFechar}>
        <Pressable
          className="gap-2 rounded-t-3xl bg-superficie p-5 pb-10"
          onPress={(e) => e.stopPropagation()}
        >
          <View className="mb-1 flex-row items-center justify-between">
            <View className="flex-1 pr-3">
              <Text className="font-titulo-semi text-xl text-texto">Salvar</Text>
              <Text className="font-corpo text-xs text-texto-2" numberOfLines={1}>
                {material.titulo}
              </Text>
            </View>
            <Pressable onPress={aoFechar} hitSlop={12}>
              <Ionicons name="close" size={22} color={cores.texto2} />
            </Pressable>
          </View>

          <Pressable
            onPress={() => demo.alternarFavorito(material.id)}
            className={`flex-row items-center gap-3 rounded-xl px-4 py-3.5 ${
              favoritado ? 'bg-superficie-2' : ''
            }`}
          >
            <Ionicons
              name={favoritado ? 'heart' : 'heart-outline'}
              size={22}
              color={favoritado ? '#E4574E' : cores.texto2}
            />
            <Text className="flex-1 font-corpo-medio text-base text-texto">
              Meus favoritos
            </Text>
            <Ionicons
              name={favoritado ? 'checkmark-circle' : 'ellipse-outline'}
              size={22}
              color={favoritado ? cores.marcaLegivel : cores.texto2}
            />
          </Pressable>

          <Text className="px-1 pt-2 font-corpo-forte text-xs uppercase text-texto-2">
            Adicionar a uma turma
          </Text>
          {turmasDemo.map((turma) => {
            const naTurma = demo.materiaisDaTurma[turma.id]?.has(material.id) ?? false;
            return (
              <Pressable
                key={turma.id}
                onPress={() => demo.alternarMaterialDaTurma(turma.id, material.id)}
                className={`flex-row items-center gap-3 rounded-xl px-4 py-3.5 ${
                  naTurma ? 'bg-superficie-2' : ''
                }`}
              >
                <Ionicons name="people" size={22} color={cores.texto2} />
                <View className="flex-1">
                  <Text className="font-corpo-medio text-base text-texto">
                    {turma.nome}
                  </Text>
                  <Text className="font-corpo text-xs text-texto-2">
                    {nomeAno[turma.ano]} · {turma.alunos} alunos
                  </Text>
                </View>
                <Ionicons
                  name={naTurma ? 'checkmark-circle' : 'ellipse-outline'}
                  size={22}
                  color={naTurma ? cores.marcaLegivel : cores.texto2}
                />
              </Pressable>
            );
          })}

          <Pressable
            onPress={aoFechar}
            className="mt-2 items-center rounded-lg bg-botao-prim py-3"
          >
            <Text className="font-corpo-forte text-base text-botao-prim-texto">
              Concluído
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
