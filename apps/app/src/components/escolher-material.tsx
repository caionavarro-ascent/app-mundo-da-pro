import { Ionicons } from '@expo/vector-icons';
import { normalizar, type PalavraDaAtividade } from '@mdp/core';
import {
  corDoMaterial,
  estaLiberado,
  materiaisDemo,
  type MaterialDemo,
} from '@mdp/core/src/mock/acervo';
import { Image } from 'expo-image';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';

import { useDemo } from '../contexto/demo';
import { useCores } from '../hooks/use-cores';
import { buscarPalavrasDoMaterial, buscarRepertorios } from '../lib/painel';
import { Secao, SeletorDeQuantidade } from './atividade-palavras';

const MOSTRAR = 8;

/**
 * Origem "de um material do acervo" (D45): ela escolhe um material e recebe o
 * repertório de palavras tirado do PDF dele; a tela sorteia as versões.
 */
export function EscolherMaterial({
  escolhido,
  aoEscolher,
}: {
  escolhido: MaterialDemo | null;
  aoEscolher: (material: MaterialDemo | null, repertorio: PalavraDaAtividade[]) => void;
}) {
  const demo = useDemo();
  const cores = useCores();
  const [resumo, setResumo] = useState<Record<string, { palavras: number; comDica: number }> | null>(
    null,
  );
  const [falhou, setFalhou] = useState(false);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState<string | null>(null);
  const [verTodos, setVerTodos] = useState(false);

  useEffect(() => {
    buscarRepertorios()
      .then(setResumo)
      .catch(() => setFalhou(true));
  }, []);

  // o acervo do painel pode chegar depois: versaoAcervo refaz a lista (ver D43)
  const disponiveis = useMemo(() => {
    if (!resumo) return [];
    const termo = normalizar(busca.trim());
    return materiaisDemo
      .filter((m) => resumo[m.id] && demo.versaoAcervo >= 0)
      .filter((m) => !termo || normalizar(m.titulo).includes(termo))
      .sort((a, b) => a.titulo.localeCompare(b.titulo, 'pt-BR'));
  }, [resumo, busca, demo.versaoAcervo]);

  const escolher = async (material: MaterialDemo) => {
    setCarregando(material.id);
    try {
      aoEscolher(material, await buscarPalavrasDoMaterial(material.id));
    } catch {
      setFalhou(true);
    } finally {
      setCarregando(null);
    }
  };

  if (escolhido) {
    const r = resumo?.[escolhido.id];
    return (
      <Secao titulo="Material">
        <View className="flex-row items-center gap-3 rounded-2xl bg-superficie p-3">
          <Capa material={escolhido} />
          <View className="flex-1 gap-0.5">
            <Text className="font-corpo-forte text-sm text-texto" numberOfLines={2}>
              {escolhido.titulo}
            </Text>
            {r && (
              <Text className="font-corpo text-xs text-texto-2">
                {r.palavras} palavras tiradas do PDF · {r.comDica} com dica
              </Text>
            )}
          </View>
          <Pressable
            onPress={() => aoEscolher(null, [])}
            className="rounded-xl bg-superficie-2 px-3 py-2"
          >
            <Text className="font-corpo-medio text-xs text-texto">Trocar</Text>
          </Pressable>
        </View>
      </Secao>
    );
  }

  return (
    <Secao titulo="Escolha o material">
      {falhou ? (
        <Text className="font-corpo text-sm text-texto-2">
          Não foi possível carregar os materiais agora. Tente de novo em instantes.
        </Text>
      ) : !resumo ? (
        <ActivityIndicator color={cores.texto2} />
      ) : (
        <View className="gap-2">
          <View className="flex-row items-center gap-2 rounded-xl bg-superficie px-3">
            <Ionicons name="search" size={16} color={cores.texto2} />
            <TextInput
              value={busca}
              onChangeText={setBusca}
              placeholder={`Buscar entre ${disponiveis.length} materiais`}
              placeholderTextColor={cores.texto2}
              className="h-11 flex-1 font-corpo text-base text-texto"
            />
          </View>
          {(verTodos ? disponiveis : disponiveis.slice(0, MOSTRAR)).map((material) => {
            const r = resumo[material.id];
            return (
              <Pressable
                key={material.id}
                onPress={() => escolher(material)}
                disabled={carregando != null}
                className="flex-row items-center gap-3 rounded-xl bg-superficie p-2.5 active:opacity-80"
              >
                <Capa material={material} />
                <View className="flex-1 gap-0.5">
                  <Text className="font-corpo-medio text-sm text-texto" numberOfLines={2}>
                    {material.titulo}
                  </Text>
                  <Text className="font-corpo text-xs text-texto-2">
                    {r.palavras} palavras · {r.comDica} com dica
                    {estaLiberado(material, demo.posse) ? '' : ' · ainda não é seu'}
                  </Text>
                </View>
                {carregando === material.id ? (
                  <ActivityIndicator size="small" color={cores.texto2} />
                ) : (
                  <Ionicons name="chevron-forward" size={16} color={cores.texto2} />
                )}
              </Pressable>
            );
          })}
          {!verTodos && disponiveis.length > MOSTRAR && (
            <Pressable onPress={() => setVerTodos(true)} className="self-start py-1">
              <Text className="font-corpo-medio text-sm text-texto-2">
                Ver todos os {disponiveis.length}
              </Text>
            </Pressable>
          )}
          {disponiveis.length === 0 && (
            <Text className="font-corpo text-sm text-texto-2">Nenhum material com esse nome.</Text>
          )}
        </View>
      )}
    </Secao>
  );
}

function Capa({ material }: { material: MaterialDemo }) {
  return (
    <View
      className="overflow-hidden rounded-md"
      style={{ width: 40, height: 56, backgroundColor: corDoMaterial(material) }}
    >
      {material.capaUrl && (
        <Image
          source={{ uri: material.capaUrl }}
          style={{ width: '100%', height: '100%' }}
          contentFit="cover"
        />
      )}
    </View>
  );
}

export type OrigemDasPalavras = 'temas' | 'material';

/** "De onde vêm as palavras?": temas prontos e as dela, ou o PDF de um material (D45). */
export function SeletorDeOrigem({
  origem,
  aoMudar,
}: {
  origem: OrigemDasPalavras;
  aoMudar: (o: OrigemDasPalavras) => void;
}) {
  const opcoes: [OrigemDasPalavras, string, string][] = [
    ['temas', 'Temas e minhas palavras', 'Escolha palavra por palavra'],
    ['material', 'De um material do acervo', 'Versões novas a cada toque'],
  ];
  return (
    <Secao titulo="De onde vêm as palavras?">
      <View className="flex-row gap-2">
        {opcoes.map(([id, nome, sub]) => (
          <Pressable
            key={id}
            onPress={() => aoMudar(id)}
            className={`flex-1 gap-0.5 rounded-2xl border p-3 ${
              origem === id ? 'border-marca bg-superficie-2' : 'border-superficie-2 bg-superficie'
            }`}
          >
            <Text className="font-corpo-forte text-sm text-texto">{nome}</Text>
            <Text className="font-corpo text-xs text-texto-2">{sub}</Text>
          </Pressable>
        ))}
      </View>
    </Secao>
  );
}

/** Quantas palavras sortear do material e quais saíram nesta versão. */
export function PalavrasSorteadas({
  maximo,
  quantidade,
  aoMudarQuantidade,
  palavras,
}: {
  /** limite da ferramenta ou do repertório do material, o que for menor */
  maximo: number;
  quantidade: number;
  aoMudarQuantidade: (n: number) => void;
  palavras: PalavraDaAtividade[];
}) {
  const comDica = palavras.length > 0 && palavras.every((p) => p.dica);
  return (
    <Secao titulo="Palavras desta versão">
      <View className="flex-row items-center gap-3">
        <Text className="font-corpo text-sm text-texto-2">Quantas palavras</Text>
        <SeletorDeQuantidade
          valor={Math.min(quantidade, maximo)}
          minimo={2}
          maximo={maximo}
          aoMudar={aoMudarQuantidade}
        />
      </View>
      <View className="flex-row flex-wrap gap-2">
        {palavras.map((p) => (
          <View key={p.palavra} className="rounded-xl bg-superficie px-3 py-2">
            <Text className="font-corpo-forte text-sm text-texto">{p.palavra}</Text>
          </View>
        ))}
      </View>
      {comDica && (
        <View className="gap-1.5 rounded-xl bg-superficie p-3">
          <Text className="font-corpo-medio text-xs text-texto-2">Dicas tiradas do material</Text>
          {palavras.slice(0, 3).map((p) => (
            <Text key={p.palavra} className="font-corpo text-xs text-texto" numberOfLines={2}>
              {p.dica}
            </Text>
          ))}
          {palavras.length > 3 && (
            <Text className="font-corpo text-xs text-texto-2">
              e mais {palavras.length - 3} na folha
            </Text>
          )}
        </View>
      )}
    </Secao>
  );
}
