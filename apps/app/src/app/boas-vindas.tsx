import { Ionicons } from '@expo/vector-icons';
import {
  descricaoRecurso,
  exemploNivel,
  nomeAno,
  nomeContexto,
  nomeNivel,
  nomeRecurso,
  nomeTipo,
  perguntaNivel,
  rotaDoRecurso,
  TIPOS_DE_SALA,
  type AnoEscolar,
  type ContextoAula,
  type NivelEscrita,
  type PerfilProfessora,
  type RecursoApp,
  type TipoMaterial,
} from '@mdp/core';
import { useRouter, type Href } from 'expo-router';
import { useRef, useState, type ComponentProps, type ReactNode } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useDemo } from '../contexto/demo';
import { useSessao } from '../contexto/sessao';
import { useCores } from '../hooks/use-cores';

/**
 * Boas-vindas do primeiro login (D53): cinco perguntas curtas para o app abrir no
 * jeito dela. Turma (ano e nível de escrita), o que mais usa em sala e o que quer
 * ver primeiro. Tudo pulável; dá para refazer em Conta → Minhas preferências.
 * As respostas personalizam a home (saudação e "Experimente perguntar") e decidem
 * a primeira tela depois daqui.
 */

type Icone = ComponentProps<typeof Ionicons>['name'];

const IDADE_DO_ANO: Record<AnoEscolar, string> = {
  infantil: '4 e 5 anos',
  '1ano': '6 anos',
  '2ano': '7 anos',
  '3ano': '8 anos',
  '4ano': '9 anos',
  '5ano': '10 anos',
};

const ICONE_DO_TIPO: Partial<Record<TipoMaterial, Icone>> = {
  atividade: 'document-text',
  jogo: 'game-controller',
  sequencia: 'layers',
  avaliacao: 'clipboard',
  cartaz: 'image',
  ebook: 'book',
};

const TEXTO_DO_TIPO: Partial<Record<TipoMaterial, string>> = {
  atividade: 'Folhinhas para o aluno fazer',
  jogo: 'Bingo, trilha, memória, dominó',
  sequencia: 'Projetos de vários dias',
  avaliacao: 'Sondagens e diagnósticos',
  cartaz: 'Para a parede da sala',
  ebook: 'Leitura e formação para você',
};

const ICONE_DO_RECURSO: Record<RecursoApp, Icone> = {
  perguntar: 'sparkles',
  vitrine: 'albums',
  ferramentas: 'construct',
  turmas: 'people',
  formacoes: 'play-circle',
};

type Etapa = 'voce' | 'turma' | 'nivel' | 'sala' | 'comecar';

function alternar<T>(lista: T[], item: T): T[] {
  return lista.includes(item) ? lista.filter((i) => i !== item) : [...lista, item];
}

export default function BoasVindas() {
  const router = useRouter();
  const cores = useCores();
  const sessao = useSessao();
  const demo = useDemo();
  const rolagem = useRef<ScrollView>(null);
  const inicial = sessao.perfil;

  const [nome, setNome] = useState(inicial?.nome ?? '');
  const [contexto, setContexto] = useState<ContextoAula | null>(inicial?.contexto ?? null);
  const [anos, setAnos] = useState<AnoEscolar[]>(inicial?.anos ?? []);
  const [niveis, setNiveis] = useState<NivelEscrita[]>(inicial?.niveis ?? []);
  const [tipos, setTipos] = useState<TipoMaterial[]>(inicial?.tipos ?? []);
  const [recursos, setRecursos] = useState<RecursoApp[]>(inicial?.recursos ?? []);
  const [indice, setIndice] = useState(0);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // o nível de escrita só aparece para quem alfabetiza (Infantil ao 3º ano)
  const etapas: Etapa[] = perguntaNivel(anos)
    ? ['voce', 'turma', 'nivel', 'sala', 'comecar']
    : ['voce', 'turma', 'sala', 'comecar'];
  const etapa = etapas[Math.min(indice, etapas.length - 1)];
  const ultima = indice >= etapas.length - 1;

  const irPara = (novo: number) => {
    setIndice(novo);
    rolagem.current?.scrollTo({ y: 0, animated: false });
  };

  const concluir = async (pulou = false) => {
    if (salvando) return;
    setSalvando(true);
    setErro(null);
    const perfil: PerfilProfessora = {
      versao: 1,
      nome: nome.trim(),
      contexto,
      anos,
      niveis: perguntaNivel(anos) ? niveis : [],
      tipos,
      recursos,
      concluidoEm: new Date().toISOString(),
    };
    // as boas-vindas já mostraram o app: a apresentação de 4 telas não abre por cima
    demo.concluirAbertura();
    try {
      await sessao.salvarPerfil(perfil);
    } catch (e) {
      // ficou salvo no aparelho; não prende a professora aqui por causa da rede
      setErro((e as Error).message);
    } finally {
      setSalvando(false);
    }
    router.replace((pulou ? '/' : rotaDoRecurso(recursos[0])) as Href);
  };

  const podeSeguir =
    etapa === 'turma' ? anos.length > 0 : etapa === 'sala' ? tipos.length > 0 : true;
  const motivo =
    etapa === 'turma'
      ? 'Escolha pelo menos um ano.'
      : etapa === 'sala'
        ? 'Escolha pelo menos uma opção.'
        : null;

  return (
    <SafeAreaView className="flex-1 bg-fundo">
      {/* topo: progresso e pular */}
      <View
        className="w-full flex-row items-center gap-4 px-5 pb-3 pt-3"
        style={{ maxWidth: 680, alignSelf: 'center' }}
      >
        <View className="flex-1 flex-row gap-1.5">
          {etapas.map((e, i) => (
            <View
              key={e}
              className={`h-1.5 flex-1 rounded-full ${i <= indice ? 'bg-marca' : 'bg-superficie-2'}`}
            />
          ))}
        </View>
        <Pressable onPress={() => concluir(true)} hitSlop={8} disabled={salvando}>
          <Text className="font-corpo-medio text-sm text-texto-2">Pular</Text>
        </Pressable>
      </View>

      <ScrollView
        ref={rolagem}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ maxWidth: 680, width: '100%', alignSelf: 'center' }}
        contentContainerClassName="grow gap-6 px-5 pb-8 pt-4"
      >
        {etapa === 'voce' && (
          <>
            <Titulo
              chapeu="Boas-vindas ao Mundo da Prô"
              titulo="Vamos deixar o app com a sua cara?"
              texto="São 4 perguntinhas rápidas. Com elas, a gente mostra primeiro o que serve para a sua turma."
            />
            <View className="gap-2">
              <Text className="font-corpo-forte text-sm text-texto">Como podemos te chamar?</Text>
              <TextInput
                value={nome}
                onChangeText={setNome}
                placeholder="Seu nome"
                placeholderTextColor={cores.texto2}
                autoComplete="given-name"
                autoCapitalize="words"
                maxLength={40}
                className="h-14 rounded-xl bg-superficie px-4 font-corpo text-lg text-texto"
              />
            </View>
            <View className="gap-2">
              <Text className="font-corpo-forte text-sm text-texto">Onde você dá aula?</Text>
              <View className="flex-row flex-wrap gap-2">
                {(Object.keys(nomeContexto) as ContextoAula[]).map((c) => (
                  <Pilula
                    key={c}
                    rotulo={nomeContexto[c]}
                    ativo={contexto === c}
                    aoTocar={() => setContexto(contexto === c ? null : c)}
                  />
                ))}
              </View>
            </View>
          </>
        )}

        {etapa === 'turma' && (
          <>
            <Titulo
              chapeu="Sua turma"
              titulo={nome.trim() ? `${nome.trim().split(/\s+/)[0]}, para qual turma você dá aula?` : 'Para qual turma você dá aula?'}
              texto="Pode marcar mais de uma, se tiver turmas diferentes."
            />
            <View className="flex-row flex-wrap" style={{ gap: 10 }}>
              {(Object.keys(nomeAno) as AnoEscolar[]).map((a) => (
                <Cartao
                  key={a}
                  ativo={anos.includes(a)}
                  aoTocar={() => setAnos(alternar(anos, a))}
                  largura="48%"
                >
                  <Text className="font-titulo-semi text-lg text-texto">{nomeAno[a]}</Text>
                  <Text className="font-corpo text-xs text-texto-2">{IDADE_DO_ANO[a]}</Text>
                </Cartao>
              ))}
            </View>
          </>
        )}

        {etapa === 'nivel' && (
          <>
            <Titulo
              chapeu="Sua turma"
              titulo="Como a sua turma está escrevendo?"
              texto={'Pense em como escrevem "borboleta". Marque os níveis que você tem na sala.'}
            />
            <View className="gap-2.5">
              {(Object.keys(nomeNivel) as NivelEscrita[]).map((n) => (
                <Cartao key={n} ativo={niveis.includes(n)} aoTocar={() => setNiveis(alternar(niveis, n))} semVisto>
                  <View className="flex-row items-center justify-between">
                    <Text className="font-corpo-forte text-base text-texto">{nomeNivel[n]}</Text>
                    <Text className="font-manuscrito text-2xl" style={{ color: cores.marcaLegivel }}>
                      {exemploNivel[n]}
                    </Text>
                  </View>
                </Cartao>
              ))}
            </View>
            <Text className="font-corpo text-sm text-texto-2">
              Ainda não sabe ou varia muito? Pode seguir sem marcar.
            </Text>
          </>
        )}

        {etapa === 'sala' && (
          <>
            <Titulo
              chapeu="Na sala de aula"
              titulo="O que você mais gosta de usar com a turma?"
              texto="Marque quantos quiser. É isso que vai aparecer primeiro para você."
            />
            <View className="flex-row flex-wrap" style={{ gap: 10 }}>
              {TIPOS_DE_SALA.map((t) => (
                <Cartao key={t} ativo={tipos.includes(t)} aoTocar={() => setTipos(alternar(tipos, t))} largura="48%">
                  <Ionicons
                    name={ICONE_DO_TIPO[t] ?? 'document'}
                    size={22}
                    color={tipos.includes(t) ? cores.marcaLegivel : cores.texto2}
                  />
                  <Text className="font-corpo-forte text-base text-texto">{nomeTipo[t]}</Text>
                  <Text className="font-corpo text-xs leading-snug text-texto-2">{TEXTO_DO_TIPO[t]}</Text>
                </Cartao>
              ))}
            </View>
          </>
        )}

        {etapa === 'comecar' && (
          <>
            <Titulo
              chapeu="Quase lá"
              titulo="O que você quer ver primeiro?"
              texto="Toque na ordem do que mais te interessa. O app abre no número 1."
            />
            <View className="gap-2.5">
              {(Object.keys(nomeRecurso) as RecursoApp[]).map((r) => {
                const posicao = recursos.indexOf(r);
                const ativo = posicao >= 0;
                return (
                  <Cartao key={r} ativo={ativo} aoTocar={() => setRecursos(alternar(recursos, r))} semVisto>
                    <View className="flex-row items-center gap-3">
                      <View
                        className={`h-10 w-10 items-center justify-center rounded-xl ${ativo ? 'bg-marca' : 'bg-superficie-2'}`}
                      >
                        {ativo ? (
                          <Text className="font-titulo text-base text-sobre-marca">{posicao + 1}</Text>
                        ) : (
                          <Ionicons name={ICONE_DO_RECURSO[r]} size={20} color={cores.texto2} />
                        )}
                      </View>
                      <View className="flex-1 gap-0.5">
                        <Text className="font-corpo-forte text-base text-texto">{nomeRecurso[r]}</Text>
                        <Text className="font-corpo text-xs text-texto-2">{descricaoRecurso[r]}</Text>
                      </View>
                    </View>
                  </Cartao>
                );
              })}
            </View>
          </>
        )}

        {erro && (
          <View className="flex-row gap-2 rounded-xl bg-superficie-2 p-3">
            <Ionicons name="alert-circle" size={18} color={cores.coral} />
            <Text className="flex-1 font-corpo text-sm text-texto">{erro}</Text>
          </View>
        )}
      </ScrollView>

      {/* rodapé: voltar e seguir, como nas etapas das ferramentas (D48) */}
      <View
        className="w-full gap-2 border-t border-superficie-2 px-5 pb-4 pt-3"
        style={{ maxWidth: 680, alignSelf: 'center' }}
      >
        {!podeSeguir && motivo && (
          <Text className="text-center font-corpo text-xs text-texto-2">{motivo}</Text>
        )}
        <View className="flex-row gap-3">
          {indice > 0 && (
            <Pressable
              onPress={() => irPara(indice - 1)}
              className="h-14 items-center justify-center rounded-xl bg-superficie px-5"
            >
              <Text className="font-corpo-forte text-base text-texto">Voltar</Text>
            </Pressable>
          )}
          <Pressable
            onPress={() => (ultima ? concluir() : irPara(indice + 1))}
            disabled={!podeSeguir || salvando}
            className={`h-14 flex-1 flex-row items-center justify-center gap-2 rounded-xl ${
              podeSeguir ? 'bg-botao-prim' : 'bg-superficie-2'
            }`}
          >
            {salvando ? (
              <ActivityIndicator color={cores.botaoPrimarioTexto} />
            ) : (
              <>
                <Text
                  className={`font-corpo-forte text-base ${podeSeguir ? 'text-botao-prim-texto' : 'text-texto-2'}`}
                >
                  {ultima ? 'Começar a usar' : 'Continuar'}
                </Text>
                <Ionicons
                  name="arrow-forward"
                  size={18}
                  color={podeSeguir ? cores.botaoPrimarioTexto : cores.texto2}
                />
              </>
            )}
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

function Titulo({ chapeu, titulo, texto }: { chapeu: string; titulo: string; texto: string }) {
  return (
    <View className="gap-2">
      <Text className="font-corpo-forte text-xs uppercase tracking-wider text-marca-legivel">{chapeu}</Text>
      <Text className="font-titulo text-3xl leading-tight text-texto">{titulo}</Text>
      <Text className="font-corpo text-base leading-relaxed text-texto-2">{texto}</Text>
    </View>
  );
}

function Pilula({ rotulo, ativo, aoTocar }: { rotulo: string; ativo: boolean; aoTocar: () => void }) {
  return (
    <Pressable
      onPress={aoTocar}
      className={`rounded-full border px-4 py-2.5 ${ativo ? 'border-marca bg-marca' : 'border-superficie-2 bg-superficie'}`}
    >
      <Text className={`font-corpo-medio text-sm ${ativo ? 'text-sobre-marca' : 'text-texto'}`}>{rotulo}</Text>
    </Pressable>
  );
}

function Cartao({
  ativo,
  aoTocar,
  largura,
  semVisto = false,
  children,
}: {
  ativo: boolean;
  aoTocar: () => void;
  largura?: `${number}%`;
  /** sem o ✓ do canto, onde ele cobriria o conteúdo (exemplo do nível, número da ordem) */
  semVisto?: boolean;
  children: ReactNode;
}) {
  const cores = useCores();
  return (
    <Pressable
      onPress={aoTocar}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: ativo }}
      className={`gap-1.5 rounded-2xl border-2 bg-superficie p-4 active:opacity-80 ${
        ativo ? 'border-marca' : 'border-transparent'
      }`}
      style={largura ? { width: largura } : undefined}
    >
      {children}
      {ativo && !semVisto && (
        <View className="absolute right-2.5 top-2.5">
          <Ionicons name="checkmark-circle" size={18} color={cores.marcaLegivel} />
        </View>
      )}
    </Pressable>
  );
}
