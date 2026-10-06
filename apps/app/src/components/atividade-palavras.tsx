import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  embaralhar,
  palavraExibida,
  temasDePalavras,
  type CabecalhoDaFolha,
  type PalavraDaAtividade,
} from '@mdp/core';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useCores } from '../hooks/use-cores';

/**
 * Peças comuns das ferramentas Cruzadinha e Caça-palavras (D44): moldura da
 * tela, cabeçalho da folha (lembrado no aparelho) e a escolha das palavras.
 */

const CHAVE_CABECALHO = 'mdp:cabecalho-da-folha';

/** O cabeçalho que ela preencheu uma vez volta preenchido nas próximas folhas. */
export function useCabecalhoDaFolha() {
  const [cabecalho, setCabecalho] = useState<CabecalhoDaFolha>({
    escola: '',
    professora: '',
    turma: '',
  });
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(CHAVE_CABECALHO)
      .then((bruto) => bruto && setCabecalho((atual) => ({ ...atual, ...JSON.parse(bruto) })))
      .catch(() => {})
      .finally(() => setCarregado(true));
  }, []);

  useEffect(() => {
    if (carregado) AsyncStorage.setItem(CHAVE_CABECALHO, JSON.stringify(cabecalho)).catch(() => {});
  }, [cabecalho, carregado]);

  return [cabecalho, setCabecalho] as const;
}

export function TelaDaFerramenta({
  titulo,
  descricao,
  etapa,
  children,
}: {
  titulo: string;
  descricao: string;
  /** muda de etapa → volta ao topo (D48) */
  etapa?: number;
  children: ReactNode;
}) {
  const router = useRouter();
  const cores = useCores();
  const rolagem = useRef<ScrollView>(null);
  useEffect(() => {
    rolagem.current?.scrollTo({ y: 0, animated: false });
  }, [etapa]);
  return (
    <SafeAreaView className="flex-1 bg-fundo" edges={['top']}>
      <ScrollView
        ref={rolagem}
        contentContainerStyle={{ maxWidth: 960, width: '100%', alignSelf: 'center' }}
        contentContainerClassName="gap-6 p-4 pb-16"
        keyboardShouldPersistTaps="handled"
      >
        <View className="gap-3">
          <Pressable
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/ferramentas'))}
            hitSlop={8}
            className="flex-row items-center gap-1 self-start"
          >
            <Ionicons name="chevron-back" size={16} color={cores.texto2} />
            <Text className="font-corpo-medio text-sm text-texto-2">Ferramentas</Text>
          </Pressable>
          <View className="gap-1">
            <Text className="font-titulo text-2xl text-texto">{titulo}</Text>
            <Text className="font-corpo text-sm leading-relaxed text-texto-2">{descricao}</Text>
          </View>
        </View>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

/** Quantas palavras: − N +, dentro do limite da ferramenta (e do que há para sortear). */
export function SeletorDeQuantidade({
  valor,
  minimo,
  maximo,
  aoMudar,
}: {
  valor: number;
  minimo: number;
  maximo: number;
  aoMudar: (n: number) => void;
}) {
  const cores = useCores();
  const botao = (delta: number, icone: 'remove' | 'add', desligado: boolean) => (
    <Pressable
      onPress={() => aoMudar(Math.min(maximo, Math.max(minimo, valor + delta)))}
      disabled={desligado}
      hitSlop={6}
      accessibilityLabel={delta < 0 ? 'Menos palavras' : 'Mais palavras'}
      className={`h-9 w-9 items-center justify-center rounded-lg ${
        desligado ? 'bg-superficie' : 'bg-superficie-2'
      }`}
    >
      <Ionicons name={icone} size={18} color={desligado ? cores.superficie2 : cores.texto} />
    </Pressable>
  );
  return (
    <View className="flex-row items-center gap-2 rounded-xl bg-superficie p-1">
      {botao(-1, 'remove', valor <= minimo)}
      <Text className="min-w-[32px] text-center font-titulo-semi text-lg text-texto">{valor}</Text>
      {botao(1, 'add', valor >= maximo)}
    </View>
  );
}

/**
 * Etapas da ferramenta (D48): 1 Palavras → 2 Montar → 3 Folha e PDF. Mostra onde ela
 * está e deixa voltar (ou pular para frente, se já pode) tocando no número.
 */
export function Etapas({
  nomes,
  atual,
  liberada,
  aoIr,
}: {
  nomes: string[];
  atual: number;
  /** se dá para ir até a etapa i (ex.: Montar só com 2+ palavras) */
  liberada: (i: number) => boolean;
  aoIr: (i: number) => void;
}) {
  const cores = useCores();
  return (
    <View className="flex-row items-center gap-1.5 rounded-2xl bg-superficie p-2">
      {nomes.map((nome, i) => {
        const feita = i < atual;
        const ativa = i === atual;
        const pode = liberada(i);
        return (
          <View key={nome} className="flex-1 flex-row items-center gap-1.5">
            <Pressable
              onPress={() => pode && aoIr(i)}
              disabled={!pode || ativa}
              accessibilityLabel={`Etapa ${i + 1}: ${nome}`}
              className={`flex-1 flex-row items-center gap-2 rounded-xl px-2.5 py-2 ${
                ativa ? 'bg-superficie-2' : ''
              } ${pode ? '' : 'opacity-40'}`}
            >
              <View
                className={`h-7 w-7 items-center justify-center rounded-full ${
                  ativa ? 'bg-marca' : feita ? 'bg-verde' : 'bg-superficie-2'
                }`}
              >
                {feita ? (
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                ) : (
                  <Text
                    className={`font-corpo-forte text-sm ${ativa ? 'text-sobre-marca' : 'text-texto-2'}`}
                  >
                    {i + 1}
                  </Text>
                )}
              </View>
              <Text
                className={`flex-1 font-corpo-forte text-sm ${ativa ? 'text-texto' : 'text-texto-2'}`}
                numberOfLines={1}
              >
                {nome}
              </Text>
            </Pressable>
            {i < nomes.length - 1 && (
              <Ionicons name="chevron-forward" size={14} color={cores.texto2} />
            )}
          </View>
        );
      })}
    </View>
  );
}

/** Voltar / Próximo no fim de cada etapa, com o motivo quando ainda não dá para seguir. */
export function NavegacaoDasEtapas({
  atual,
  nomes,
  podeAvancar,
  motivo,
  aoIr,
}: {
  atual: number;
  nomes: string[];
  podeAvancar: boolean;
  /** por que ainda não dá (ex.: "Escolha pelo menos 2 palavras") */
  motivo?: string;
  aoIr: (i: number) => void;
}) {
  const cores = useCores();
  const ultima = atual === nomes.length - 1;
  return (
    <View className="gap-2 border-t border-superficie-2 pt-4">
      {!podeAvancar && motivo && !ultima && (
        <Text className="text-right font-corpo text-xs text-texto-2">{motivo}</Text>
      )}
      <View className="flex-row gap-3">
        {atual > 0 && (
          <Pressable
            onPress={() => aoIr(atual - 1)}
            className="h-12 flex-row items-center justify-center gap-1.5 rounded-xl bg-superficie px-5"
          >
            <Ionicons name="arrow-back" size={18} color={cores.texto} />
            <Text className="font-corpo-forte text-base text-texto">Voltar</Text>
          </Pressable>
        )}
        {!ultima && (
          <Pressable
            onPress={() => podeAvancar && aoIr(atual + 1)}
            disabled={!podeAvancar}
            className={`h-12 flex-1 flex-row items-center justify-center gap-2 rounded-xl ${
              podeAvancar ? 'bg-botao-prim' : 'bg-superficie-2'
            }`}
          >
            <Text
              className={`font-corpo-forte text-base ${
                podeAvancar ? 'text-botao-prim-texto' : 'text-texto-2'
              }`}
            >
              Próximo: {nomes[atual + 1]}
            </Text>
            <Ionicons
              name="arrow-forward"
              size={18}
              color={podeAvancar ? cores.botaoPrimarioTexto : cores.texto2}
            />
          </Pressable>
        )}
      </View>
    </View>
  );
}

export function Secao({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <View className="gap-3">
      <Text className="font-corpo-forte text-xs uppercase text-texto-2">{titulo}</Text>
      {children}
    </View>
  );
}

function Campo({
  rotulo,
  valor,
  aoMudar,
  exemplo,
}: {
  rotulo: string;
  valor: string;
  aoMudar: (v: string) => void;
  exemplo: string;
}) {
  const cores = useCores();
  return (
    <View className="min-w-[160px] flex-1 gap-1.5">
      <Text className="font-corpo-medio text-xs text-texto-2">{rotulo}</Text>
      <TextInput
        value={valor}
        onChangeText={aoMudar}
        placeholder={exemplo}
        placeholderTextColor={cores.texto2}
        className="h-11 rounded-xl bg-superficie px-3 font-corpo text-base text-texto"
      />
    </View>
  );
}

/** Escola, professora e turma. Nome e número ficam em branco: o aluno preenche. */
export function CamposDoCabecalho({
  cabecalho,
  aoMudar,
}: {
  cabecalho: CabecalhoDaFolha;
  aoMudar: (c: CabecalhoDaFolha) => void;
}) {
  return (
    <Secao titulo="Cabeçalho da folha">
      <View className="flex-row flex-wrap gap-3">
        <Campo
          rotulo="Escola"
          valor={cabecalho.escola}
          aoMudar={(escola) => aoMudar({ ...cabecalho, escola })}
          exemplo="Nome da escola"
        />
        <Campo
          rotulo="Professor(a)"
          valor={cabecalho.professora}
          aoMudar={(professora) => aoMudar({ ...cabecalho, professora })}
          exemplo="Ex.: Maria"
        />
        <Campo
          rotulo="Série / turma"
          valor={cabecalho.turma}
          aoMudar={(turma) => aoMudar({ ...cabecalho, turma })}
          exemplo="Ex.: 4º ano A"
        />
      </View>
      <Text className="font-corpo text-xs text-texto-2">
        Nome e número ficam em branco para o aluno preencher. Campo vazio vira linha para escrever à
        mão. Fica salvo para as próximas folhas.
      </Text>
    </Secao>
  );
}

/** Temas prontos + palavras dela. `comDica`: a cruzadinha pede a dica de cada palavra. */
export function EscolherPalavras({
  selecionadas,
  aoMudar,
  comDica,
  maximo,
}: {
  selecionadas: PalavraDaAtividade[];
  aoMudar: (lista: PalavraDaAtividade[]) => void;
  comDica: boolean;
  maximo: number;
}) {
  const cores = useCores();
  const [temaId, setTemaId] = useState(temasDePalavras[0].id);
  const [quantas, setQuantas] = useState(8);
  const [nova, setNova] = useState('');
  const [novaDica, setNovaDica] = useState('');
  const tema = temasDePalavras.find((t) => t.id === temaId)!;
  const chave = (p: string) => palavraExibida(p);
  const escolhidas = new Set(selecionadas.map((s) => chave(s.palavra)));
  const cheia = selecionadas.length >= maximo;
  const limiteDoTema = Math.min(maximo, tema.palavras.length);
  const quantasNoTema = Math.min(quantas, limiteDoTema);

  // sorteia N palavras do tema no lugar da seleção atual (cada toque, outra combinação)
  const sortearDoTema = () =>
    aoMudar(embaralhar(tema.palavras, Math.random).slice(0, quantasNoTema));

  const alternar = (item: PalavraDaAtividade) => {
    if (escolhidas.has(chave(item.palavra))) {
      aoMudar(selecionadas.filter((s) => chave(s.palavra) !== chave(item.palavra)));
    } else if (!cheia) {
      aoMudar([...selecionadas, item]);
    }
  };

  const adicionar = () => {
    const palavra = nova.trim();
    if (!palavra || escolhidas.has(chave(palavra)) || cheia) return;
    aoMudar([...selecionadas, { palavra: chave(palavra), dica: novaDica.trim() || undefined }]);
    setNova('');
    setNovaDica('');
  };

  return (
    <Secao titulo={`Palavras · ${selecionadas.length} de ${maximo}`}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-2"
      >
        {temasDePalavras.map((t) => (
          <Pressable
            key={t.id}
            onPress={() => setTemaId(t.id)}
            className={`rounded-full px-4 py-2 ${t.id === temaId ? 'bg-marca' : 'bg-superficie-2'}`}
          >
            <Text
              className={`font-corpo-medio text-sm ${t.id === temaId ? 'text-sobre-marca' : 'text-texto'}`}
            >
              {t.nome}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <View className="flex-row flex-wrap gap-2">
        {tema.palavras.map((item) => {
          const ativa = escolhidas.has(chave(item.palavra));
          return (
            <Pressable
              key={item.palavra}
              onPress={() => alternar(item)}
              className={`flex-row items-center gap-1.5 rounded-xl border px-3 py-2 ${
                ativa ? 'border-marca bg-superficie-2' : 'border-superficie-2 bg-superficie'
              } ${!ativa && cheia ? 'opacity-40' : ''}`}
            >
              <Ionicons
                name={ativa ? 'checkmark-circle' : 'add-circle-outline'}
                size={16}
                color={ativa ? cores.marca : cores.texto2}
              />
              <Text className="font-corpo-forte text-sm text-texto">{item.palavra}</Text>
            </Pressable>
          );
        })}
        <Pressable
          onPress={() => {
            const faltam = tema.palavras.filter((p) => !escolhidas.has(chave(p.palavra)));
            aoMudar([...selecionadas, ...faltam].slice(0, maximo));
          }}
          className="flex-row items-center gap-1.5 rounded-xl px-3 py-2"
        >
          <Text className="font-corpo-medio text-sm text-texto-2">Usar todas do tema</Text>
        </Pressable>
      </View>

      <View className="flex-row flex-wrap items-center gap-3">
        <SeletorDeQuantidade
          valor={quantasNoTema}
          minimo={2}
          maximo={limiteDoTema}
          aoMudar={setQuantas}
        />
        <Pressable
          onPress={sortearDoTema}
          className="h-11 flex-row items-center gap-2 rounded-xl bg-superficie-2 px-4 active:opacity-80"
        >
          <Ionicons name="shuffle" size={16} color={cores.texto} />
          <Text className="font-corpo-forte text-sm text-texto">
            Sortear {quantasNoTema} palavras de {tema.nome}
          </Text>
        </Pressable>
      </View>

      <View className="gap-2 rounded-2xl bg-superficie p-3">
        <Text className="font-corpo-medio text-xs text-texto-2">Ou escreva a sua palavra</Text>
        <View className="flex-row flex-wrap gap-2">
          <TextInput
            value={nova}
            onChangeText={setNova}
            onSubmitEditing={adicionar}
            placeholder="Palavra"
            placeholderTextColor={cores.texto2}
            autoCapitalize="characters"
            maxLength={20}
            className="h-11 min-w-[140px] flex-1 rounded-xl bg-superficie-2 px-3 font-corpo text-base text-texto"
          />
          {comDica && (
            <TextInput
              value={novaDica}
              onChangeText={setNovaDica}
              onSubmitEditing={adicionar}
              placeholder="Dica (opcional)"
              placeholderTextColor={cores.texto2}
              maxLength={140}
              className="h-11 min-w-[200px] flex-[2] rounded-xl bg-superficie-2 px-3 font-corpo text-base text-texto"
            />
          )}
          <Pressable
            onPress={adicionar}
            disabled={!nova.trim() || cheia}
            className={`h-11 flex-row items-center justify-center gap-1 rounded-xl px-4 ${
              nova.trim() && !cheia ? 'bg-botao-prim' : 'bg-superficie-2'
            }`}
          >
            <Ionicons
              name="add"
              size={18}
              color={nova.trim() && !cheia ? cores.botaoPrimarioTexto : cores.texto2}
            />
            <Text
              className={`font-corpo-forte text-sm ${
                nova.trim() && !cheia ? 'text-botao-prim-texto' : 'text-texto-2'
              }`}
            >
              Adicionar
            </Text>
          </Pressable>
        </View>
      </View>

      {selecionadas.length > 0 && (
        <View className="gap-2">
          {selecionadas.map((item, i) => (
            <View
              key={chave(item.palavra)}
              className="flex-row items-center gap-3 rounded-xl bg-superficie px-3 py-2"
            >
              <Text className="w-28 font-corpo-forte text-sm text-texto" numberOfLines={1}>
                {chave(item.palavra)}
              </Text>
              {comDica ? (
                <TextInput
                  value={item.dica ?? ''}
                  onChangeText={(dica) =>
                    aoMudar(selecionadas.map((s, j) => (j === i ? { ...s, dica } : s)))
                  }
                  placeholder="Escreva a dica…"
                  placeholderTextColor={cores.texto2}
                  maxLength={140}
                  className="h-9 flex-1 font-corpo text-sm text-texto"
                />
              ) : (
                <View className="flex-1" />
              )}
              <Pressable
                onPress={() => aoMudar(selecionadas.filter((_, j) => j !== i))}
                hitSlop={8}
                accessibilityLabel={`Tirar ${item.palavra}`}
              >
                <Ionicons name="close-circle" size={18} color={cores.texto2} />
              </Pressable>
            </View>
          ))}
          <Pressable onPress={() => aoMudar([])} className="self-start py-1">
            <Text className="font-corpo-medio text-xs text-texto-2">Limpar todas</Text>
          </Pressable>
        </View>
      )}
    </Secao>
  );
}
