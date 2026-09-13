import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Link, usePathname } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { Pressable, Text, View } from 'react-native';

import { useDemo } from '../contexto/demo';
import { useCores } from '../hooks/use-cores';

const logoVazado = require('../../assets/images/logo-vazado.png');
const logoContorno = require('../../assets/images/logo-contorno.png');

const ITENS = [
  { href: '/', icone: 'home', rotulo: 'Início' },
  { href: '/novidades', icone: 'sparkles', rotulo: 'Novidades' },
  { href: '/buscar', icone: 'search', rotulo: 'Buscar' },
  { href: '/ferramentas', icone: 'grid', rotulo: 'Ferramentas' },
  { href: '/meus', icone: 'albums', rotulo: 'Meus materiais' }, // ícone tratado à parte (mochilinha)
] as const;

/** Navegação do modo desktop web: o rodapé vira menu lateral esquerdo. */
export function MenuLateral() {
  const demo = useDemo();
  const cores = useCores();
  const { colorScheme: esquema } = useColorScheme();
  const rota = usePathname();

  return (
    <View
      className="h-full justify-between border-r border-superficie-2 bg-fundo px-4 py-6"
      style={{ width: 232 }}
    >
      <View className="gap-6">
        <Image
          source={esquema === 'light' ? logoVazado : logoContorno}
          style={{ width: 110, height: 52, marginLeft: 8 }}
          contentFit="contain"
        />
        <View className="gap-1">
          {ITENS.map((item) => {
            const ativo = rota === item.href;
            return (
              <Link key={item.href} href={item.href} asChild>
                <Pressable
                  className={`flex-row items-center gap-3 rounded-xl px-3 py-2.5 ${
                    ativo ? 'bg-superficie-2' : ''
                  }`}
                >
                  {item.href === '/meus' ? (
                    <MaterialCommunityIcons
                      name={ativo ? 'bag-personal' : 'bag-personal-outline'}
                      size={20}
                      color={ativo ? cores.texto : cores.texto2}
                    />
                  ) : (
                    <Ionicons
                      name={ativo ? item.icone : (`${item.icone}-outline` as never)}
                      size={20}
                      color={ativo ? cores.texto : cores.texto2}
                    />
                  )}
                  <Text
                    className={`font-corpo-medio text-[15px] ${
                      ativo ? 'text-texto' : 'text-texto-2'
                    }`}
                  >
                    {item.rotulo}
                  </Text>
                </Pressable>
              </Link>
            );
          })}
        </View>
      </View>

      <View className="flex-row items-center gap-3 px-3">
        <View className="h-9 w-9 items-center justify-center rounded-full bg-marca">
          <Text className="font-corpo-forte text-sm text-[#16191F]">
            {demo.nome.charAt(0)}
          </Text>
        </View>
        <View>
          <Text className="font-corpo-medio text-sm text-texto">{demo.nome}</Text>
          <Text className="font-corpo text-xs text-texto-2">conta de demonstração</Text>
        </View>
      </View>
    </View>
  );
}
