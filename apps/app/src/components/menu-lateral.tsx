import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Link, usePathname } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { useDemo } from '../contexto/demo';
import { useSessao } from '../contexto/sessao';
import { useCores } from '../hooks/use-cores';
import { useEsquema } from '../hooks/use-esquema';
import { voltarAoInicio } from '../lib/voltar-ao-inicio';

const logoVazado = require('../../assets/images/logo-vazado.png');
const logoContorno = require('../../assets/images/logo-contorno.png');

const ITENS = [
  { href: '/', icone: 'sparkles', rotulo: 'Início' },
  { href: '/novidades', icone: 'notifications', rotulo: 'Novidades' },
  { href: '/vitrine', icone: 'film', rotulo: 'Vitrine' },
  { href: '/ferramentas', icone: 'grid', rotulo: 'Ferramentas' },
  { href: '/meus', icone: 'albums', rotulo: 'Meus materiais' }, // ícone tratado à parte (mochilinha)
] as const;

/** Navegação do modo desktop web: o rodapé vira menu lateral esquerdo. */
export function MenuLateral() {
  const demo = useDemo();
  const { email } = useSessao();
  const cores = useCores();
  const esquema = useEsquema();
  const rota = usePathname();

  return (
    <View
      className="h-full justify-between border-r border-borda bg-superficie px-4 py-6"
      style={{ width: 232 }}
    >
      <View className="gap-6">
        {/* marca do Clube Pedagógico (D54): logo grande + subtítulo */}
        <View className="items-center gap-1 pb-2">
          <Image
            source={esquema === 'light' ? logoVazado : logoContorno}
            style={{ width: 150, height: 71 }}
            contentFit="contain"
          />
          <Text className="font-corpo-forte text-[11px] uppercase tracking-[2px] text-texto-2">
            Clube Pedagógico
          </Text>
        </View>
        <View className="gap-1">
          {ITENS.map((item) => {
            const ativo = rota === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                // Início sempre volta à tela principal da home (pergunta limpa + mosaico)
                onPress={item.href === '/' ? voltarAoInicio : undefined}
                asChild
              >
                <Pressable
                  className={`flex-row items-center gap-3 rounded-xl px-3 py-2.5 ${
                    ativo ? 'bg-brand' : ''
                  }`}
                >
                  {item.href === '/meus' ? (
                    <MaterialCommunityIcons
                      name={ativo ? 'bag-personal' : 'bag-personal-outline'}
                      size={20}
                      color={ativo ? '#FFFFFF' : cores.texto2}
                    />
                  ) : (
                    <Ionicons
                      name={ativo ? item.icone : (`${item.icone}-outline` as never)}
                      size={20}
                      color={ativo ? '#FFFFFF' : cores.texto2}
                    />
                  )}
                  <Text
                    className={`font-corpo-medio text-[15px] ${
                      ativo ? 'text-white' : 'text-texto-2'
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
          <Text className="font-corpo-forte text-sm text-sobre-marca">
            {demo.nome.charAt(0)}
          </Text>
        </View>
        <View>
          <Text className="font-corpo-medio text-sm text-texto">{demo.nome}</Text>
          <Text className="font-corpo text-xs text-texto-2" numberOfLines={1}>
            {email ?? 'conta de demonstração'}
          </Text>
        </View>
      </View>
    </View>
  );
}
