import { Ionicons } from '@expo/vector-icons';
import {
  interpretarPergunta,
  nomeAno,
  nomeNivel,
  nomeTipo,
  perguntasDoPerfil,
  pontuarMaterial,
  resumoDaBusca,
  type Pontuacao,
} from '@mdp/core';
import { aulasPanda } from '@mdp/core/src/mock/aulas-panda';
import { materiaisDemo } from '@mdp/core/src/mock/acervo';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Mosaico } from '../../components/mosaico';
import { SeletorAcesso } from '../../components/seletor-acesso';
import { SugestaoMaterial } from '../../components/sugestao-material';
import { useDemo } from '../../contexto/demo';
import { useSessao } from '../../contexto/sessao';
import { useCores } from '../../hooks/use-cores';
import { useEsquema, useNoAparelho } from '../../hooks/use-esquema';
import { useDesktopWeb } from '../../hooks/use-desktop-web';
import { buscarNoPainel } from '../../lib/painel';
import { aoVoltarAoInicio } from '../../lib/voltar-ao-inicio';

const logoModoClaro = require('../../../assets/images/logo-vazado.png');
const logoModoEscuro = require('../../../assets/images/logo-contorno.png');

const EXEMPLOS = [
  'Jogo de rimas para o 1º ano',
  'Avaliação diagnóstica para alunos silábicos',
  'Atividades sobre o alfabeto',
  'Sequência didática sobre animais',
];

// texto padrão das fichas vindas do painel: não é tema, não pode casar com a pergunta
const DESCRICAO_PADRAO_PAINEL = 'Material publicado pelo painel do Mundo da Prô.';
const MAXIMO_SUGESTOES = 30;
// mosaico (D43): carrega aos poucos, como o Pinterest, conforme ela rola
const MOSAICO_POR_VEZ = 30;
const LARGURA_MENU_LATERAL = 232;
// pergunta e resposta ficam numa coluna de leitura; o mosaico usa a largura toda
/** card-surface (D54): sombra suave por baixo da borda */
const SOMBRA_SUAVE = {
  shadowColor: '#0E2447',
  shadowOpacity: 0.06,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 4 },
} as const;

const COLUNA_DE_LEITURA = {
  width: '100%',
  maxWidth: 760,
  alignSelf: 'center',
} as const;

/** Embaralha sempre do mesmo jeito (por id): o mosaico varia, mas não muda a cada abertura. */
function pesoEstavel(id: string): number {
  let h = 2166136261;
  for (const c of id) h = Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0;
  return h;
}

/**
 * O acervo do módulo, "carimbado" com a versão do contexto. `_versao` não é usada no
 * corpo de propósito: é o que faz o React Compiler refazer os cálculos quando o
 * acervo do painel chega (ver versaoAcervo no contexto).
 */
function acervo(_versao: number) {
  return materiaisDemo;
}

/** Materiais com capa real (é o que faz o mosaico); sem painel, a demo inteira. */
function materiaisDoMosaico(versao: number) {
  const todos = acervo(versao);
  const comCapa = todos.filter((m) => m.capaUrl);
  return [...(comCapa.length > 0 ? comCapa : todos)].sort(
    (a, b) => pesoEstavel(a.id) - pesoEstavel(b.id),
  );
}

/**
 * Home (D42): uma pergunta, como num assistente. A resposta repete o que foi
 * entendido e lista os materiais que combinam, com o porquê de cada um.
 * A vitrine Netflix, que era a home, virou a aba Vitrine.
 */
export default function Inicio() {
  const demo = useDemo();
  const sessao = useSessao();
  // "Experimente perguntar" com a turma e o que ela usa (D53); sem perfil, os exemplos fixos
  const exemplos = perguntasDoPerfil(sessao.perfil, EXEMPLOS);
  // números do topo (D54): o acervo cresce quando o painel chega (versaoAcervo)
  const totalRecursos = acervo(demo.versaoAcervo).length;
  const totalNovidades = acervo(demo.versaoAcervo).filter((m) => m.novo).length;
  const router = useRouter();
  const cores = useCores();
  const esquema = useEsquema();
  const desktop = useDesktopWeb();
  const [texto, setTexto] = useState('');
  const [pergunta, setPergunta] = useState<string | null>(null);
  // resposta do painel guardada com a pergunta a que responde: "pensando" é derivado
  // (a resposta que temos não é da pergunta atual), sem setState dentro do efeito
  const [resposta, setResposta] = useState<{ pergunta: string; porId: Map<string, Pontuacao> } | null>(
    null,
  );
  const pensando = pergunta != null && resposta?.pergunta !== pergunta;
  const doPainel = useMemo(
    () => (resposta && resposta.pergunta === pergunta ? resposta.porId : new Map<string, Pontuacao>()),
    [resposta, pergunta],
  );
  const [noMosaico, setNoMosaico] = useState(MOSAICO_POR_VEZ);
  // A home é pré-gerada no build (export estático), sem largura de tela nem acervo do
  // painel: o mosaico só existe no aparelho, senão a hidratação diverge (React #418).
  const noAparelho = useNoAparelho();
  const { width: larguraTela } = useWindowDimensions();
  const larguraMosaico = Math.min(larguraTela - (desktop ? LARGURA_MENU_LATERAL : 0) - 32, 1200);

  const doMosaico = useMemo(() => materiaisDoMosaico(demo.versaoAcervo), [demo.versaoAcervo]);

  // o painel enxerga o texto dos PDFs; sem ele no ar, vale só a busca local
  useEffect(() => {
    if (!pergunta) return;
    let vivo = true;
    Promise.all([
      buscarNoPainel(pergunta).catch(() => new Map<string, Pontuacao>()),
      new Promise((ok) => setTimeout(ok, 450)), // tempo de "leitura": a resposta não pisca
    ]).then(([porId]) => {
      if (vivo) setResposta({ pergunta, porId });
    });
    return () => {
      vivo = false;
    };
  }, [pergunta]);

  const consulta = useMemo(() => (pergunta ? interpretarPergunta(pergunta) : null), [pergunta]);

  const sugestoes = useMemo(() => {
    if (!consulta) return [];
    return acervo(demo.versaoAcervo)
      .map((material) => {
        const local = pontuarMaterial(
          {
            ...material,
            descricao: material.descricao === DESCRICAO_PADRAO_PAINEL ? '' : material.descricao,
          },
          consulta,
        );
        const remota = doPainel.get(material.id);
        return {
          material,
          pontuacao: remota && remota.pontos > local.pontos ? remota : local,
        };
      })
      .filter((s) => s.pontuacao.pontos > 0)
      .sort((a, b) => b.pontuacao.pontos - a.pontuacao.pontos)
      .slice(0, MAXIMO_SUGESTOES);
  }, [consulta, doPainel, demo.versaoAcervo]);

  const entendido = consulta
    ? [
        ...consulta.tipos.map((t) => nomeTipo[t]),
        ...consulta.anos.map((a) => nomeAno[a]),
        ...consulta.niveis.map((n) => nomeNivel[n]),
        ...consulta.termos,
      ]
    : [];

  const perguntar = (t: string) => {
    const limpa = t.trim();
    if (!limpa) return;
    Keyboard.dismiss();
    setTexto(limpa);
    setPergunta(limpa);
    demo.registrarBusca(limpa);
  };

  const rolagem = useRef<ScrollView>(null);
  const recomecar = () => {
    setPergunta(null);
    setTexto('');
    setResposta(null);
    setNoMosaico(MOSAICO_POR_VEZ);
    rolagem.current?.scrollTo({ y: 0, animated: false });
  };

  // toque em "Início" (rodapé ou menu lateral): volta à pergunta limpa + mosaico
  // (recomecar só usa setters e a ref, que não mudam entre renderizações)
  useEffect(() => aoVoltarAoInicio(recomecar), []);

  const campo = (
    <View className="flex-row items-center gap-2 rounded-2xl border border-borda bg-superficie py-1.5 pl-4 pr-1.5">
      <Ionicons name="search" size={18} color={cores.texto2} />
      <TextInput
        value={texto}
        onChangeText={setTexto}
        onSubmitEditing={() => perguntar(texto)}
        placeholder="Digite aqui o que precisa"
        placeholderTextColor={cores.texto2}
        className="h-11 min-w-0 flex-1 font-corpo text-base text-texto"
        // no web o input tem largura própria; sem min-w-0 ele empurra o Buscar para fora
        style={{ minWidth: 0 }}
        returnKeyType="search"
        autoFocus={!pergunta && desktop}
      />
      <Pressable
        onPress={() => perguntar(texto)}
        disabled={!texto.trim()}
        hitSlop={6}
        className={`h-11 flex-row items-center justify-center gap-1.5 rounded-xl px-4 ${
          texto.trim() ? 'bg-marca' : 'bg-superficie-2'
        }`}
        accessibilityLabel="Buscar"
      >
        <Text
          className={`font-corpo-forte text-sm ${texto.trim() ? 'text-sobre-marca' : 'text-texto-2'}`}
        >
          Buscar
        </Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-fundo" edges={['top']}>
      {/* topo enxuto, igual ao da vitrine */}
      <View className="flex-row items-center justify-between px-4 pb-2 pt-2">
        {desktop ? (
          <Text className="font-titulo-semi text-2xl text-texto">Início</Text>
        ) : (
          <View className="flex-row items-center gap-2.5">
            <Image
              source={esquema === 'light' ? logoModoClaro : logoModoEscuro}
              style={{ width: 68, height: 32 }}
              contentFit="contain"
            />
            <Text className="font-titulo-semi text-lg text-texto">Início</Text>
          </View>
        )}
        <View className="flex-row items-center gap-4">
          <SeletorAcesso />
          <Pressable hitSlop={8} onPress={() => router.navigate('/meus')}>
            <View className="h-7 w-7 items-center justify-center rounded-full bg-marca">
              <Text className="font-corpo-forte text-xs text-sobre-marca">{demo.nome.charAt(0)}</Text>
            </View>
          </Pressable>
        </View>
      </View>

      <ScrollView
        ref={rolagem}
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="grow px-4 pb-10"
        scrollEventThrottle={200}
        onScroll={({ nativeEvent: { contentOffset, layoutMeasurement, contentSize } }) => {
          const pertoDoFim = contentOffset.y + layoutMeasurement.height > contentSize.height - 900;
          if (!pergunta && pertoDoFim && noMosaico < doMosaico.length) {
            setNoMosaico((n) => n + MOSAICO_POR_VEZ);
          }
        }}
      >
        {!pergunta ? (
          <View className="gap-10 pt-8">
            <View className="gap-7" style={COLUNA_DE_LEITURA}>
              {/* banner do Clube Pedagógico (D54): azul-marinho, pergunta e busca */}
              <View className="overflow-hidden rounded-3xl bg-brand p-6" style={{ gap: 14 }}>
                {/* bolhas decorativas: dão profundidade ao azul sem depender de gradiente nativo */}
                <View
                  pointerEvents="none"
                  className="absolute rounded-full bg-marca"
                  style={{ width: 220, height: 220, right: -70, top: -90, opacity: 0.22 }}
                />
                <View
                  pointerEvents="none"
                  className="absolute rounded-full bg-white"
                  style={{ width: 160, height: 160, right: 40, bottom: -110, opacity: 0.06 }}
                />
                <View className="flex-row items-center gap-1.5 self-start rounded-full bg-white/10 px-3 py-1">
                  <Ionicons name="sparkles" size={12} color="#FFFFFF" />
                  <Text className="font-corpo-forte text-[11px] uppercase tracking-wider text-white">
                    Clube Pedagógico
                  </Text>
                </View>
                <View className="gap-1">
                  <Text className="font-corpo-medio text-sm text-white/80">Oi, {demo.nome}!</Text>
                  <Text className="font-titulo text-3xl leading-tight text-white">
                    O que você precisa hoje?
                  </Text>
                  <Text className="font-corpo text-sm leading-relaxed text-white/75">
                    Pergunte do seu jeito: o tema, o ano, o nível de escrita ou o tipo de material.
                  </Text>
                </View>
                {campo}
              </View>

              <View className="flex-row gap-3">
                {[
                  { icone: 'library' as const, valor: totalRecursos, rotulo: 'Recursos disponíveis' },
                  { icone: 'flash' as const, valor: totalNovidades, rotulo: 'Novidades do mês' },
                  { icone: 'play-circle' as const, valor: aulasPanda.length, rotulo: 'Aulas em vídeo' },
                ].map((m) => (
                  <View
                    key={m.rotulo}
                    className="flex-1 gap-2 rounded-2xl border border-borda bg-superficie p-3.5"
                    style={SOMBRA_SUAVE}
                  >
                    <View className="h-8 w-8 items-center justify-center rounded-lg bg-marca/10">
                      <Ionicons name={m.icone} size={16} color={cores.marcaLegivel} />
                    </View>
                    <Text className="font-titulo text-2xl leading-none text-texto">{m.valor}</Text>
                    <Text className="font-corpo text-xs leading-snug text-texto-2">{m.rotulo}</Text>
                  </View>
                ))}
              </View>

              {/* quem ainda não contou da turma (pulou ou usa sem entrar): convite discreto (D53) */}
              {sessao.perfilCarregado && !sessao.perfil && (
                <Pressable
                  onPress={() => router.push('/boas-vindas')}
                  className="flex-row items-center gap-3 rounded-xl border border-marca/40 bg-superficie p-4 active:opacity-80"
                >
                  <Ionicons name="color-wand" size={20} color={cores.marcaLegivel} />
                  <View className="flex-1">
                    <Text className="font-corpo-forte text-sm text-texto">Conte sobre a sua turma</Text>
                    <Text className="font-corpo text-xs text-texto-2">
                      4 perguntas rápidas e o app mostra primeiro o que serve para você.
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={cores.texto2} />
                </Pressable>
              )}

              <View className="gap-2">
                <Text className="font-corpo-forte text-xs uppercase text-texto-2">
                  Experimente perguntar
                </Text>
                {exemplos.map((exemplo) => (
                  <Pressable
                    key={exemplo}
                    onPress={() => perguntar(exemplo)}
                    className="flex-row items-center justify-between rounded-xl bg-superficie px-4 py-3 active:opacity-80"
                  >
                    <Text className="flex-1 font-corpo-medio text-sm text-texto">{exemplo}</Text>
                    <Ionicons name="arrow-forward" size={16} color={cores.texto2} />
                  </Pressable>
                ))}
              </View>

              {demo.buscasRecentes.length > 0 && (
                <View className="gap-2">
                  <Text className="font-corpo-forte text-xs uppercase text-texto-2">
                    Suas últimas perguntas
                  </Text>
                  <View className="flex-row flex-wrap gap-2">
                    {demo.buscasRecentes.map((busca) => (
                      <Pressable
                        key={busca}
                        onPress={() => perguntar(busca)}
                        className="flex-row items-center gap-1.5 rounded-full bg-superficie-2 px-4 py-2"
                      >
                        <Ionicons name="time-outline" size={14} color={cores.texto2} />
                        <Text className="font-corpo-medio text-sm text-texto">{busca}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              )}

              <Pressable
                onPress={() => router.navigate('/vitrine')}
                className="flex-row items-center justify-center gap-1.5 py-2"
              >
                <Text className="font-corpo-medio text-sm text-texto-2">
                  Prefere navegar? Ver a vitrine completa
                </Text>
                <Ionicons name="chevron-forward" size={14} color={cores.texto2} />
              </Pressable>
            </View>

            {/* mosaico estilo Pinterest (D43, experimento) */}
            {noAparelho && (
              <View className="gap-4" style={{ width: larguraMosaico, alignSelf: 'center' }}>
                <View className="gap-1">
                  <Text className="font-titulo-semi text-xl text-texto">Inspire-se no acervo</Text>
                  <Text className="font-corpo text-sm text-texto-2">
                    Role e toque no que chamar sua atenção.
                  </Text>
                </View>
                <Mosaico
                  materiais={doMosaico.slice(0, noMosaico)}
                  posse={demo.posse}
                  largura={larguraMosaico}
                />
              </View>
            )}
          </View>
        ) : (
          <View className="gap-5 pt-2" style={COLUNA_DE_LEITURA}>
            {campo}

            {/* a pergunta, como numa conversa */}
            <View className="max-w-[85%] self-end rounded-2xl rounded-br-md bg-superficie-2 px-4 py-2.5">
              <Text className="font-corpo text-base text-texto">{pergunta}</Text>
            </View>

            {/* a resposta */}
            <View className="flex-row gap-3">
              <View className="h-8 w-8 items-center justify-center rounded-full bg-marca">
                <Ionicons name="sparkles" size={16} color="#FFFFFF" />
              </View>
              <View className="flex-1 gap-2 pt-1">
                {pensando || !consulta ? (
                  <View className="flex-row items-center gap-2">
                    <ActivityIndicator size="small" color={cores.texto2} />
                    <Text className="font-corpo text-sm text-texto-2">
                      Procurando nos materiais…
                    </Text>
                  </View>
                ) : (
                  <>
                    <Text className="font-corpo text-base leading-relaxed text-texto">
                      {resumoDaBusca(consulta, sugestoes.length)}
                    </Text>
                    {entendido.length > 0 && (
                      <View className="flex-row flex-wrap items-center gap-1.5">
                        <Text className="font-corpo text-xs text-texto-2">Entendi:</Text>
                        {entendido.map((e) => (
                          <View key={e} className="rounded-full bg-superficie-2 px-2.5 py-1">
                            <Text className="font-corpo-medio text-xs text-texto">{e}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </>
                )}
              </View>
            </View>

            {!pensando && (
              <View className="gap-3">
                {sugestoes.map(({ material, pontuacao }) => (
                  <SugestaoMaterial
                    key={material.id}
                    material={material}
                    pontuacao={pontuacao}
                    posse={demo.posse}
                  />
                ))}
              </View>
            )}

            {!pensando && sugestoes.length === 0 && (
              <View className="gap-2">
                <Text className="font-corpo-forte text-xs uppercase text-texto-2">
                  Que tal tentar
                </Text>
                {exemplos.map((exemplo) => (
                  <Pressable
                    key={exemplo}
                    onPress={() => perguntar(exemplo)}
                    className="rounded-xl bg-superficie px-4 py-3"
                  >
                    <Text className="font-corpo-medio text-sm text-texto">{exemplo}</Text>
                  </Pressable>
                ))}
              </View>
            )}

            {!pensando && (
              <Pressable
                onPress={recomecar}
                className="flex-row items-center justify-center gap-1.5 py-3"
              >
                <Ionicons name="refresh" size={14} color={cores.texto2} />
                <Text className="font-corpo-medio text-sm text-texto-2">Nova pergunta</Text>
              </Pressable>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
