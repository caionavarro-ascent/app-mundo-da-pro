import { nomeTipo, type TipoMaterial } from '@mdp/core';
import { Text, View } from 'react-native';

/**
 * Etiqueta fixa do tipo do material (D46, teste): em todo card, sobre a capa,
 * diz de cara se é Atividade, Jogo, Ebook… Uma cor por tipo, sempre com texto
 * branco (contraste AA sobre qualquer capa, clara ou escura).
 */
const COR_DO_TIPO: Record<TipoMaterial, string> = {
  atividade: '#2F5BD3',
  sequencia: '#6A3FD1',
  jogo: '#C23D0A',
  avaliacao: '#2B7A3E',
  cartaz: '#C2255C',
  planner: '#0B7285',
  aula: '#C92A2A',
  ebook: '#8A5A00',
};

export function TagTipo({ tipo, pequena = false }: { tipo: TipoMaterial; pequena?: boolean }) {
  return (
    <View
      className={`self-start rounded-full ${pequena ? 'px-1.5 py-px' : 'px-2 py-0.5'}`}
      style={{
        backgroundColor: COR_DO_TIPO[tipo],
        // leve sombra: a etiqueta se destaca até em capa da mesma cor
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 1 },
        elevation: 2,
      }}
    >
      <Text
        className={`font-corpo-forte uppercase text-white ${pequena ? 'text-[8px]' : 'text-[9px]'}`}
        numberOfLines={1}
      >
        {nomeTipo[tipo]}
      </Text>
    </View>
  );
}
