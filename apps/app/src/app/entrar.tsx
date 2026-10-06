import { Ionicons } from '@expo/vector-icons';
import { aulasPanda } from '@mdp/core/src/mock/aulas-panda';
import { corDoMaterial, materiaisDemo, type MaterialDemo } from '@mdp/core/src/mock/acervo';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState, type ComponentProps } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useDemo } from '../contexto/demo';
import { useSessao } from '../contexto/sessao';
import { useCores } from '../hooks/use-cores';
import { useDesktopWeb } from '../hooks/use-desktop-web';
import { useEsquema } from '../hooks/use-esquema';
import { doAcervo } from '../lib/acervo-reativo';

const logoModoClaro = require('../../assets/images/logo-vazado.png');
const logoModoEscuro = require('../../assets/images/logo-contorno.png');

/**
 * Entrar (Bloco 2, D19/D50/D52): e-mail → código numérico enviado pelo Supabase.
 * Sem link mágico no app. É o mesmo e-mail da compra: é por ele que a posse chega.
 * O tamanho do código é configuração do projeto no Supabase (6 a 10; hoje 8):
 * a tela aceita qualquer um nessa faixa.
 *
 * D52: tela cheia, fora das abas, com a visão geral do app ao lado (desktop) ou em
 * volta (celular) do formulário: quem chega aqui ainda não viu o app por dentro.
 */
const CODIGO_MINIMO = 6;
const CODIGO_MAXIMO = 10;

type Icone = ComponentProps<typeof Ionicons>['name'];

const RECURSOS: { icone: Icone; titulo: string; texto: string }[] = [
  {
    icone: 'sparkles',
    titulo: 'Pergunte e encontre',
    texto: 'Escreva do seu jeito ("jogo de rimas pro 1º ano") e veja os materiais que combinam.',
  },
  {
    icone: 'albums',
    titulo: 'Tudo o que existe, numa vitrine',
    texto: 'Coleções, kits e atividades em prateleiras. O que é seu abre direto.',
  },
  {
    icone: 'construct',
    titulo: 'Ferramentas prontas',
    texto: 'Cruzadinha e caça-palavras com as suas palavras, em PDF, e suas turmas organizadas.',
  },
  {
    icone: 'play-circle',
    titulo: 'Formações em vídeo',
    texto: 'As aulas das formações para assistir no app, quando e onde quiser.',
  },
];

/** Capas para a vitrine da tela: as reais do painel; sem painel, a demo em cores. */
function capasDaVitrine(_versao: number): MaterialDemo[] {
  const comCapa = materiaisDemo.filter((m) => m.capaUrl);
  return (comCapa.length >= 6 ? comCapa : materiaisDemo).slice(0, 12);
}

/** "mais de 380" para números grandes; o número exato para os pequenos. */
function arredondado(n: number): string {
  return n >= 50 ? `+${Math.floor(n / 10) * 10}` : String(n);
}

export default function Entrar() {
  const router = useRouter();
  const cores = useCores();
  const sessao = useSessao();
  const desktop = useDesktopWeb();

  const voltar = () => (router.canGoBack() ? router.back() : router.replace('/'));

  if (sessao.email) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center gap-4 bg-fundo p-6">
        <Ionicons name="checkmark-circle" size={40} color={cores.verde} />
        <Text className="text-center font-titulo-semi text-xl text-texto">
          Você entrou como {sessao.email}
        </Text>
        <Pressable onPress={voltar} className="h-12 justify-center rounded-xl bg-botao-prim px-6">
          <Text className="font-corpo-forte text-base text-botao-prim-texto">Continuar</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (desktop) {
    return (
      <View className="flex-1 flex-row bg-fundo">
        <ScrollView className="flex-1 bg-superficie" contentContainerClassName="grow justify-center px-12 py-10">
          <VisaoGeral desktop />
        </ScrollView>
        <ScrollView
          style={{ width: 520, flexGrow: 0 }}
          keyboardShouldPersistTaps="handled"
          contentContainerClassName="grow justify-center px-14 py-12"
        >
          <Formulario aoEntrar={voltar} />
        </ScrollView>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-fundo" edges={['top']}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ maxWidth: 560, width: '100%', alignSelf: 'center' }}
        contentContainerClassName="gap-8 px-5 pb-12 pt-4"
      >
        <Cabecalho />
        <FaixaDeCapas />
        <Formulario aoEntrar={voltar} />
        <View className="h-px bg-superficie-2" />
        <VisaoGeral />
      </ScrollView>
    </SafeAreaView>
  );
}

function Logo({ tamanho = 1 }: { tamanho?: number }) {
  const esquema = useEsquema();
  return (
    <Image
      source={esquema === 'light' ? logoModoClaro : logoModoEscuro}
      style={{ width: 84 * tamanho, height: 40 * tamanho }}
      contentFit="contain"
    />
  );
}

function Cabecalho() {
  return (
    <View className="gap-4">
      <Logo />
      <View className="gap-2">
        <Text className="font-titulo text-3xl leading-tight text-texto">
          Seus materiais do Mundo da Prô, num lugar só.
        </Text>
        <Text className="font-corpo text-base leading-relaxed text-texto-2">
          Encontre, veja por dentro e baixe o que você precisa para a sua aula.
        </Text>
      </View>
    </View>
  );
}

function Capa({ material, largura }: { material: MaterialDemo; largura: number }) {
  const altura = Math.round(largura * 1.41);
  return (
    <View
      className="overflow-hidden rounded-xl"
      style={{ width: largura, height: altura, backgroundColor: corDoMaterial(material) }}
    >
      {material.capaUrl ? (
        <Image source={{ uri: material.capaUrl }} style={{ width: largura, height: altura }} contentFit="cover" />
      ) : (
        <View className="flex-1 justify-end p-2">
          <Text numberOfLines={3} className="font-titulo-semi text-xs text-[#16191F]">
            {material.titulo}
          </Text>
        </View>
      )}
    </View>
  );
}

/** Celular: uma fileira de capas que rola de lado, como uma prateleira da Vitrine. */
function FaixaDeCapas() {
  const demo = useDemo();
  const capas = doAcervo(() => capasDaVitrine(demo.versaoAcervo), demo.versaoAcervo);
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="-mx-5"
      contentContainerClassName="gap-3 px-5"
    >
      {capas.map((m) => (
        <Capa key={m.id} material={m} largura={96} />
      ))}
    </ScrollView>
  );
}

/** Desktop: capas em leque, as do meio maiores e na frente. */
function LequeDeCapas() {
  const demo = useDemo();
  const capas = doAcervo(() => capasDaVitrine(demo.versaoAcervo), demo.versaoAcervo).slice(0, 7);
  const meio = (capas.length - 1) / 2;
  return (
    <View className="flex-row items-center justify-center" style={{ height: 220 }}>
      {capas.map((m, i) => {
        const distancia = Math.abs(i - meio);
        return (
          <View
            key={m.id}
            style={{
              marginHorizontal: -14,
              zIndex: 10 - distancia,
              transform: [{ rotate: `${(i - meio) * 4}deg` }, { translateY: distancia * 10 }],
              shadowColor: '#000',
              shadowOpacity: 0.3,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 6 },
            }}
          >
            <Capa material={m} largura={132 - distancia * 10} />
          </View>
        );
      })}
    </View>
  );
}

function VisaoGeral({ desktop = false }: { desktop?: boolean }) {
  const cores = useCores();
  const demo = useDemo();
  const totalMateriais = doAcervo(() => materiaisDemo.length, demo.versaoAcervo);

  const numeros = [
    { valor: arredondado(totalMateriais), rotulo: 'materiais' },
    { valor: String(aulasPanda.length), rotulo: 'aulas em vídeo' },
    { valor: 'Offline', rotulo: 'para usar na escola' },
  ];

  return (
    <View className={desktop ? 'gap-7' : 'gap-8'} style={desktop ? { maxWidth: 720, width: '100%', alignSelf: 'center' } : undefined}>
      {desktop && (
        <>
          <Logo tamanho={1.2} />
          <View className="gap-3">
            <Text className="font-titulo text-4xl leading-tight text-texto">
              Seus materiais do Mundo da Prô, num lugar só.
            </Text>
            <Text className="font-corpo text-lg leading-relaxed text-texto-2">
              Encontre, veja por dentro e baixe o que você precisa para a sua aula. Sem PDF
              perdido no WhatsApp.
            </Text>
          </View>
          <LequeDeCapas />
        </>
      )}

      {!desktop && (
        <Text className="font-titulo-semi text-xl text-texto">O que você encontra no app</Text>
      )}

      <View className={desktop ? 'flex-row flex-wrap' : 'gap-5'} style={desktop ? { gap: 24 } : undefined}>
        {RECURSOS.map((r) => (
          <View key={r.titulo} className="flex-row gap-3" style={desktop ? { width: '47%' } : undefined}>
            <View className="h-10 w-10 items-center justify-center rounded-xl bg-marca">
              <Ionicons name={r.icone} size={20} color="#FFFFFF" />
            </View>
            <View className="flex-1 gap-1">
              <Text className="font-corpo-forte text-base text-texto">{r.titulo}</Text>
              <Text className="font-corpo text-sm leading-relaxed text-texto-2">{r.texto}</Text>
            </View>
          </View>
        ))}
      </View>

      <View className="flex-row gap-3">
        {numeros.map((n) => (
          <View key={n.rotulo} className="flex-1 gap-0.5 rounded-xl bg-superficie-2 p-3">
            <Text className="font-titulo-semi text-lg text-marca-legivel">{n.valor}</Text>
            <Text className="font-corpo text-xs text-texto-2">{n.rotulo}</Text>
          </View>
        ))}
      </View>

      {!desktop && (
        <View className="flex-row gap-2 rounded-xl bg-superficie p-3">
          <Ionicons name="lock-closed" size={16} color={cores.texto2} />
          <Text className="flex-1 font-corpo text-sm leading-relaxed text-texto-2">
            O que você ainda não tem aparece com cadeado e uma amostra, para você conhecer antes.
          </Text>
        </View>
      )}
    </View>
  );
}

function Formulario({ aoEntrar }: { aoEntrar: () => void }) {
  const router = useRouter();
  const cores = useCores();
  const sessao = useSessao();
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [etapa, setEtapa] = useState<'email' | 'codigo'>('email');
  const [aguardando, setAguardando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const enviar = async () => {
    if (!emailValido || aguardando) return;
    setAguardando(true);
    setErro(null);
    try {
      await sessao.enviarCodigo(email);
      setEtapa('codigo');
    } catch (e) {
      setErro((e as Error).message);
    } finally {
      setAguardando(false);
    }
  };

  const codigoCompleto = codigo.length >= CODIGO_MINIMO;

  const confirmar = async (valor = codigo) => {
    if (valor.length < CODIGO_MINIMO || aguardando) return;
    setAguardando(true);
    setErro(null);
    try {
      const { temPerfil } = await sessao.confirmarCodigo(email, valor);
      // primeiro login: as boas-vindas perguntam a turma e o que ela usa (D53)
      if (temPerfil) aoEntrar();
      else router.replace('/boas-vindas');
    } catch (e) {
      setErro((e as Error).message);
      setCodigo('');
    } finally {
      setAguardando(false);
    }
  };

  return (
    <View className="gap-5 rounded-2xl bg-superficie p-5">
      {etapa === 'email' ? (
        <View className="gap-5">
          <View className="gap-2">
            <Text className="font-titulo text-2xl text-texto">Entre na sua conta</Text>
            <Text className="font-corpo text-base leading-relaxed text-texto-2">
              Use o <Text className="font-corpo-forte text-texto">mesmo e-mail da sua compra</Text>.
              A gente manda um código de números para você digitar aqui. Sem senha.
            </Text>
          </View>
          <TextInput
            value={email}
            onChangeText={setEmail}
            onSubmitEditing={enviar}
            placeholder="seuemail@exemplo.com"
            placeholderTextColor={cores.texto2}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            className="h-14 rounded-xl bg-fundo px-4 font-corpo text-lg text-texto"
          />
          <Pressable
            onPress={enviar}
            disabled={!emailValido || aguardando}
            className={`h-14 flex-row items-center justify-center gap-2 rounded-xl ${
              emailValido ? 'bg-botao-prim' : 'bg-superficie-2'
            }`}
          >
            {aguardando ? (
              <ActivityIndicator color={cores.botaoPrimarioTexto} />
            ) : (
              <Text
                className={`font-corpo-forte text-base ${
                  emailValido ? 'text-botao-prim-texto' : 'text-texto-2'
                }`}
              >
                Receber o código
              </Text>
            )}
          </Pressable>
        </View>
      ) : (
        <View className="gap-5">
          <View className="gap-2">
            <Text className="font-titulo text-2xl text-texto">Confira seu e-mail</Text>
            <Text className="font-corpo text-base leading-relaxed text-texto-2">
              Mandamos um código de números para{' '}
              <Text className="font-corpo-forte text-texto">{email.trim().toLowerCase()}</Text>.
              Pode levar um minutinho; olhe também o spam.
            </Text>
          </View>
          <TextInput
            value={codigo}
            onChangeText={(v) => setCodigo(v.replace(/\D/g, '').slice(0, CODIGO_MAXIMO))}
            onSubmitEditing={() => confirmar()}
            placeholder="Código"
            placeholderTextColor={cores.texto2}
            keyboardType="number-pad"
            autoComplete="one-time-code"
            textContentType="oneTimeCode"
            maxLength={CODIGO_MAXIMO}
            className="h-16 rounded-xl bg-fundo text-center font-titulo text-3xl tracking-[8px] text-texto"
          />
          <Pressable
            onPress={() => confirmar()}
            disabled={!codigoCompleto || aguardando}
            className={`h-14 items-center justify-center rounded-xl ${
              codigoCompleto ? 'bg-botao-prim' : 'bg-superficie-2'
            }`}
          >
            {aguardando ? (
              <ActivityIndicator color={cores.botaoPrimarioTexto} />
            ) : (
              <Text
                className={`font-corpo-forte text-base ${
                  codigoCompleto ? 'text-botao-prim-texto' : 'text-texto-2'
                }`}
              >
                Entrar
              </Text>
            )}
          </Pressable>
          <View className="flex-row justify-between">
            <Pressable
              onPress={() => {
                setEtapa('email');
                setCodigo('');
                setErro(null);
              }}
              hitSlop={8}
            >
              <Text className="font-corpo-medio text-sm text-texto-2">Trocar o e-mail</Text>
            </Pressable>
            <Pressable onPress={enviar} disabled={aguardando} hitSlop={8}>
              <Text className="font-corpo-medio text-sm text-texto-2">Mandar outro código</Text>
            </Pressable>
          </View>
        </View>
      )}

      {erro && (
        <View className="flex-row gap-2 rounded-xl bg-superficie-2 p-3">
          <Ionicons name="alert-circle" size={18} color={cores.coral} />
          <Text className="flex-1 font-corpo text-sm text-texto">{erro}</Text>
        </View>
      )}

      <Pressable
        onPress={aoEntrar}
        hitSlop={8}
        className="flex-row items-center justify-center gap-1 pt-1"
      >
        <Text className="font-corpo-medio text-sm text-texto-2">Explorar o app sem entrar</Text>
        <Ionicons name="arrow-forward" size={14} color={cores.texto2} />
      </Pressable>
    </View>
  );
}
