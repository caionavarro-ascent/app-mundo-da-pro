import { Ionicons } from '@expo/vector-icons';
import {
  exemploNivel,
  formatarPreco,
  nomeAno,
  PAGINAS_AMOSTRA,
  nomeNivel,
  nomeTipo,
} from '@mdp/core';
import {
  corDoMaterial,
  estaLiberado,
  materialPorId,
  parecidosCom,
  produtoPorId,
} from '@mdp/core/src/mock/acervo';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PlayerAula } from '../../../components/player-aula';
import { Prateleira } from '../../../components/prateleira';
import { useDemo } from '../../../contexto/demo';
import { useCores } from '../../../hooks/use-cores';
import { useSessao } from '../../../contexto/sessao';
import { doAcervo } from '../../../lib/acervo-reativo';
import { buscarPaginasDoMaterial, urlDaPagina, type PaginasDoMaterial } from '../../../lib/painel';

/** Material do painel (tem PDF e capa real)? `_versao` só para o React Compiler refazer (D43). */
function temPdfNoAcervo(id: string | undefined, _versao: number): boolean {
  return id ? materialPorId(id)?.capaUrl != null : false;
}

/** Ficha do material (A10), versão demonstração. */
export default function FichaMaterial() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const demo = useDemo();
  const cores = useCores();
  const [aba, setAba] = useState<'sobre' | 'como-usar'>('sobre');
  const [paywallAberto, setPaywallAberto] = useState(false);
  const [paginaAberta, setPaginaAberta] = useState<number | null>(null);
  const sessao = useSessao();

  // quais páginas ela pode ver: o SERVIDOR decide, pelo token (D50, regra de ouro 4).
  // Só material do painel tem PDF (tem capa real); os da demo ficam com "página N".
  const [doServidor, setDoServidor] = useState<PaginasDoMaterial | null>(null);
  // versaoAcervo: o material do painel chega depois da 1ª renderização (React Compiler, D43)
  const temPdf = temPdfNoAcervo(id, demo.versaoAcervo);
  useEffect(() => {
    if (!id || !temPdf) return;
    let vivo = true;
    buscarPaginasDoMaterial(id, sessao.token)
      .then((p) => vivo && setDoServidor(p))
      .catch(() => {});
    return () => {
      vivo = false;
    };
  }, [id, temPdf, sessao.token]);
  const registrarVisto = demo.registrarVisto;

  // A3/C5: material_visto alimenta o "Continue de onde parou"
  useEffect(() => {
    if (id) registrarVisto(id);
  }, [id, registrarVisto]);

  // link direto para a ficha: o material do painel chega depois da 1ª renderização
  const material = doAcervo(() => materialPorId(id), demo.versaoAcervo);
  if (!material) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-fundo">
        <Text className="font-corpo text-texto-2">Material não encontrado.</Text>
      </SafeAreaView>
    );
  }

  const produto = produtoPorId(material.produtoIds[0]);
  const liberado = estaLiberado(material, demo.posse);
  const cursoExterno = produto?.cursoExterno ?? false;
  const salvo =
    demo.favoritos.has(material.id) ||
    Object.values(demo.materiaisDaTurma).some((conjunto) => conjunto.has(material.id));
  const cor = corDoMaterial(material);
  // só material do painel tem PDF (e capa real); os da demo continuam com o quadro "página N"
  const doPainel = material.capaUrl != null;
  // quadro da página no formato dela: A4 deitado (rubricas, tabelas) ganha quadro deitado.
  // A proporção vem da capa, que é a página 1 (D43)
  const amostra = Array.from({ length: Math.min(material.paginas, PAGINAS_AMOSTRA) }, (_, i) => ({
    numero: i + 1,
    mini: urlDaPagina(material.id, i + 1),
    grande: urlDaPagina(material.id, i + 1, true),
  }));
  const paginasVisiveis = doServidor?.paginas ?? amostra;
  const paginasRestantes = material.paginas - paginasVisiveis.length;
  const alturaPagina = 208;
  const larguraPagina = Math.round(alturaPagina / (material.capaProporcao ?? 1.41));

  // D31: aula liberada com embed toca dentro do app, sem botão de ação
  const tocaNoApp = Boolean(material.embedUrl) && liberado;

  const acaoPrincipal = () => {
    if (!liberado) {
      setPaywallAberto(true);
    } else if (cursoExterno) {
      Alert.alert('The Members', 'A aula abre no navegador do sistema (Bloco 8).');
    } else {
      Alert.alert(
        'Download',
        'Na versão final, o PDF sai com marca d’água com seu nome e abre offline (Bloco 9).',
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-fundo" edges={['top']}>
      <ScrollView contentContainerStyle={{ maxWidth: 960, width: '100%', alignSelf: 'center' }}
        contentContainerClassName="gap-5 pb-10">
        {/* arte no topo, com voltar e favoritar */}
        <View style={{ backgroundColor: cor }} className="gap-4 p-4 pb-6">
          <View className="flex-row items-center justify-between">
            <Pressable
              onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
              hitSlop={8}
              className="rounded-full bg-black/50 p-2"
            >
              <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
            </Pressable>
            <Pressable
              onPress={() => demo.abrirSalvar(material)}
              hitSlop={8}
              className="rounded-full bg-black/50 p-2"
            >
              <Ionicons name={salvo ? 'checkmark' : 'add'} size={20} color="#FFFFFF" />
            </Pressable>
          </View>
          <View className="gap-1 pt-8">
            <Text className="font-corpo-forte text-xs uppercase text-white/80">
              {produto?.nome}
            </Text>
            <Text className="font-titulo text-3xl leading-tight text-white">
              {material.titulo}
            </Text>
            <Text className="font-corpo text-sm text-white/90">
              {nomeTipo[material.tipo]}
              {material.paginas > 0 ? ` · ${material.paginas} páginas` : ' · em vídeo'}
            </Text>
          </View>
        </View>

        {/* aula liberada: o player do Panda no lugar do botão (D31) */}
        {tocaNoApp && <PlayerAula url={material.embedUrl!} />}

        {/* ação principal */}
        {!tocaNoApp && (
          <View className="px-4">
            <Pressable
              onPress={acaoPrincipal}
              className="flex-row items-center justify-center gap-2 rounded-lg bg-botao-prim py-3.5"
            >
              <Ionicons
                name={!liberado ? 'lock-open' : cursoExterno ? 'play' : 'download'}
                size={18}
                color={cores.botaoPrimarioTexto}
              />
              <Text className="font-corpo-forte text-base text-botao-prim-texto">
                {!liberado
                  ? `Desbloquear por ${formatarPreco(produto?.precoCentavos ?? 0)}`
                  : cursoExterno
                    ? 'Assistir no The Members'
                    : material.tipo === 'ebook'
                      ? 'Ler ebook'
                      : 'Baixar PDF'}
              </Text>
            </Pressable>
          </View>
        )}

        {/* preview (A10, D49/D50): as páginas que o servidor liberou (todas, se conferiu a
            posse; senão a amostra) e, se sobrar, o card "+N páginas" com o caminho para ver */}
        {material.paginas > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-3 px-4"
          >
            {paginasVisiveis.map((p) => (
              <Pressable
                key={p.numero}
                onPress={() => doPainel && setPaginaAberta(p.numero)}
                disabled={!doPainel}
                accessibilityLabel={`Ver a página ${p.numero}`}
                className="overflow-hidden rounded-lg border border-superficie-2 bg-white active:opacity-80"
                style={{ width: larguraPagina, height: alturaPagina }}
              >
                {doPainel ? (
                  <Image
                    source={{ uri: p.mini }}
                    style={{ width: '100%', height: '100%' }}
                    contentFit="contain"
                  />
                ) : (
                  <View className="flex-1 items-center justify-center">
                    <Text className="font-corpo text-xs text-[#16191F]">página {p.numero}</Text>
                  </View>
                )}
              </Pressable>
            ))}
            {paginasRestantes > 0 && (
              <Pressable
                onPress={() =>
                  sessao.email ? setPaywallAberto(true) : router.push('/entrar')
                }
                className="w-36 items-center justify-center gap-2 rounded-lg bg-superficie-2 p-3"
                style={{ height: alturaPagina }}
              >
                <Ionicons
                  name={sessao.email ? 'lock-closed' : 'person-circle-outline'}
                  size={22}
                  color={cores.texto2}
                />
                <Text className="text-center font-corpo-forte text-sm text-texto">
                  +{paginasRestantes} {paginasRestantes === 1 ? 'página' : 'páginas'}
                </Text>
                <Text className="text-center font-corpo text-xs text-texto-2">
                  {sessao.email
                    ? 'Desbloqueie para ver todas'
                    : 'Já comprou? Entre com seu e-mail para ver todas'}
                </Text>
              </Pressable>
            )}
          </ScrollView>
        )}

        {/* abas Sobre / Como usar — Como usar sempre liberada (D10) */}
        <View className="gap-4 px-4">
          <View className="flex-row gap-2">
            {(
              [
                ['sobre', 'Sobre'],
                ['como-usar', 'Como usar'],
              ] as const
            ).map(([chave, rotulo]) => (
              <Pressable
                key={chave}
                onPress={() => setAba(chave)}
                className={`rounded-full px-4 py-2 ${
                  aba === chave ? 'bg-texto' : 'bg-superficie'
                }`}
              >
                <Text
                  className={`font-corpo-forte text-sm ${
                    aba === chave ? 'text-fundo' : 'text-texto-2'
                  }`}
                >
                  {rotulo}
                </Text>
              </Pressable>
            ))}
          </View>

          {aba === 'sobre' ? (
            <View className="gap-4">
              <Text className="font-corpo text-base leading-relaxed text-texto">
                {material.descricao}
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {material.anos.map((ano) => (
                  <View key={ano} className="rounded-full bg-superficie px-3 py-1.5">
                    <Text className="font-corpo-medio text-xs text-texto">
                      {nomeAno[ano]}
                    </Text>
                  </View>
                ))}
              </View>
              <View className="gap-2">
                {material.niveis.map((nivel) => (
                  <View
                    key={nivel}
                    className="flex-row items-center justify-between rounded-xl bg-superficie px-4 py-2.5"
                  >
                    <Text className="font-corpo-medio text-sm text-texto">
                      {nomeNivel[nivel]}
                    </Text>
                    <Text className="font-manuscrito text-lg text-marca-legivel">
                      {exemploNivel[nivel]}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ) : material.passos.length > 0 ? (
            <View className="gap-3">
              {material.passos.map((passo, i) => (
                <View key={i} className="flex-row gap-3 rounded-xl bg-superficie p-4">
                  <Text className="font-titulo text-lg text-marca-legivel">{i + 1}</Text>
                  <Text className="flex-1 font-corpo text-sm leading-relaxed text-texto">
                    {passo}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text className="font-corpo text-sm text-texto-2">
              Esta aula se assiste direto na plataforma The Members.
            </Text>
          )}
        </View>

        <Prateleira
          titulo="Parecidos com este"
          materiais={parecidosCom(material)}
          posse={demo.posse}
        />
      </ScrollView>

      {/* A11 — paywall em folha inferior, com as duas ofertas */}
      {/* página da amostra em tamanho de leitura (D49) */}
      <Modal
        visible={paginaAberta != null}
        animationType="fade"
        onRequestClose={() => setPaginaAberta(null)}
      >
        <SafeAreaView className="flex-1" style={{ backgroundColor: '#000000' }}>
          <View className="flex-row items-center justify-between px-4 py-3">
            <Pressable
              onPress={() => setPaginaAberta(null)}
              hitSlop={8}
              className="flex-row items-center gap-1"
            >
              <Ionicons name="close" size={22} color="#FFFFFF" />
              <Text className="font-corpo-medio text-sm text-white">Fechar</Text>
            </Pressable>
            <Text className="font-corpo text-sm text-white/70">
              Página {paginaAberta} de {material.paginas}
              {paginasRestantes > 0 ? ' · amostra' : ''}
            </Text>
            <View className="flex-row gap-2">
              {[-1, 1].map((passo) => {
                const destino = (paginaAberta ?? 1) + passo;
                const pode = destino >= 1 && destino <= paginasVisiveis.length;
                return (
                  <Pressable
                    key={passo}
                    onPress={() => pode && setPaginaAberta(destino)}
                    disabled={!pode}
                    accessibilityLabel={passo < 0 ? 'Página anterior' : 'Próxima página'}
                    className={`h-9 w-9 items-center justify-center rounded-full bg-white/15 ${
                      pode ? '' : 'opacity-30'
                    }`}
                  >
                    <Ionicons
                      name={passo < 0 ? 'chevron-back' : 'chevron-forward'}
                      size={18}
                      color="#FFFFFF"
                    />
                  </Pressable>
                );
              })}
            </View>
          </View>
          {/* contêiner com tamanho: no web, imagem só com flex: 1 fica com altura zero */}
          <View className="flex-1 p-3">
            {paginaAberta != null && (
              <Image
                source={{
                  uri:
                    paginasVisiveis.find((p) => p.numero === paginaAberta)?.grande ??
                    urlDaPagina(material.id, paginaAberta, true),
                }}
                style={{ width: '100%', height: '100%' }}
                contentFit="contain"
              />
            )}
          </View>
        </SafeAreaView>
      </Modal>

      <Modal
        visible={paywallAberto}
        transparent
        animationType="slide"
        onRequestClose={() => setPaywallAberto(false)}
      >
        <Pressable
          className="flex-1 justify-end bg-black/60"
          onPress={() => setPaywallAberto(false)}
        >
          <Pressable
            className="gap-4 rounded-t-3xl bg-superficie p-5 pb-10"
            onPress={(e) => e.stopPropagation()}
          >
            <Text className="font-titulo-semi text-xl text-texto">
              Desbloqueie este material
            </Text>

            <View className="gap-2 rounded-2xl bg-superficie-2 p-4">
              <Text className="font-corpo-forte text-base text-texto">{produto?.nome}</Text>
              <Text className="font-corpo text-sm text-texto-2">
                {produto?.pitchParaQue}
              </Text>
              <Pressable
                className="mt-1 h-12 items-center justify-center rounded-lg bg-botao-prim"
                onPress={() =>
                  Alert.alert(
                    'Checkout',
                    'Abre o checkout no navegador do sistema, com Pix e 12x (Bloco 10).',
                  )
                }
              >
                <Text className="font-corpo-forte text-base text-botao-prim-texto">
                  {formatarPreco(produto?.precoCentavos ?? 0)} · {produto?.parcelasTexto}
                </Text>
              </Pressable>
            </View>

            <View className="gap-2 rounded-2xl border border-marca bg-superficie-2 p-4">
              <View className="flex-row items-center gap-2">
                <View className="rounded-full bg-marca px-2 py-0.5">
                  <Text className="font-corpo-forte text-[10px] uppercase text-sobre-marca">
                    Happy Friday
                  </Text>
                </View>
              </View>
              <Text className="font-corpo-forte text-base text-texto">
                Acesso Total Mundo da Prô
              </Text>
              <Text className="font-corpo text-sm text-texto-2">
                Todos os materiais, atuais e futuros, num acesso só.
              </Text>
              <Pressable
                className="mt-1 h-12 items-center justify-center rounded-lg bg-marca"
                onPress={() =>
                  Alert.alert(
                    'Checkout',
                    'Abre o checkout no navegador do sistema, com Pix e 12x (Bloco 10).',
                  )
                }
              >
                <Text className="font-corpo-forte text-base text-sobre-marca">
                  {formatarPreco(produtoPorId('acesso-total')?.precoCentavos ?? 0)} ·{' '}
                  {produtoPorId('acesso-total')?.parcelasTexto}
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
