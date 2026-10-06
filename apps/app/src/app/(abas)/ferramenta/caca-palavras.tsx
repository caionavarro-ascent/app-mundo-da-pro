import { Ionicons } from '@expo/vector-icons';
import {
  gerarCacaPalavras,
  nomeNivelCacaPalavras,
  type NivelCacaPalavras,
  sortearDoRepertorio,
  type PalavraDaAtividade,
} from '@mdp/core';
import type { MaterialDemo } from '@mdp/core/src/mock/acervo';
import { useMemo, useState } from 'react';
import { Pressable, Switch, Text, TextInput, useWindowDimensions, View } from 'react-native';

import {
  CamposDoCabecalho,
  EscolherPalavras,
  Secao,
  TelaDaFerramenta,
  useCabecalhoDaFolha,
  Etapas,
  NavegacaoDasEtapas,
} from '../../../components/atividade-palavras';
import {
  EscolherMaterial,
  PalavrasSorteadas,
  SeletorDeOrigem,
  type OrigemDasPalavras,
} from '../../../components/escolher-material';
import { BotoesDoPdf } from '../../../components/previa-pdf';
import { useCores } from '../../../hooks/use-cores';
import { useDesktopWeb } from '../../../hooks/use-desktop-web';
import { urlDoPdfDaFerramenta } from '../../../lib/painel';

const ETAPAS = ['Palavras', 'Montar', 'Folha e PDF'];
const MAXIMO = 20;
const NIVEIS = Object.keys(nomeNivelCacaPalavras) as NivelCacaPalavras[];

/**
 * Gerador de caça-palavras (D44): ela escolhe as palavras e o nível, vê a grade
 * e baixa o PDF com cabeçalho, quadro de palavras e gabarito.
 */
export default function CacaPalavras() {
  const cores = useCores();
  const desktop = useDesktopWeb();
  const { width } = useWindowDimensions();
  const [cabecalho, setCabecalho] = useCabecalhoDaFolha();
  const [origem, setOrigem] = useState<OrigemDasPalavras>('temas');
  const [minhas, setMinhas] = useState<PalavraDaAtividade[]>([]);
  const [material, setMaterial] = useState<MaterialDemo | null>(null);
  const [repertorio, setRepertorio] = useState<PalavraDaAtividade[]>([]);
  const [quantidade, setQuantidade] = useState(10);
  const [nivel, setNivel] = useState<NivelCacaPalavras>('facil');
  const [titulo, setTitulo] = useState('');
  const [semente, setSemente] = useState(1);
  const [gabarito, setGabarito] = useState(true);
  // etapas (D48): 1 Palavras → 2 Montar → 3 Folha e PDF
  const [etapa, setEtapa] = useState(0);

  // do material (D45): cada semente sorteia outras palavras do repertório = versão nova
  const doMaterial = origem === 'material' && material != null;
  const palavras = useMemo(
    () =>
      origem === 'material'
        ? material
          ? sortearDoRepertorio(repertorio, quantidade, semente, false)
          : []
        : minhas,
    [origem, material, repertorio, quantidade, semente, minhas],
  );
  const tituloPadrao = doMaterial
    ? `Caça-palavras: ${material.titulo.split(' — ')[0]}`.slice(0, 60)
    : 'Caça-palavras';

  const caca = useMemo(
    () =>
      palavras.length >= 2
        ? gerarCacaPalavras(
            palavras.map((p) => p.palavra),
            nivel,
            semente,
          )
        : null,
    [palavras, nivel, semente],
  );
  // Montar e Folha só com a atividade de pé (2+ palavras)
  const liberada = (i: number) => i === 0 || !!caca;
  const larguraPrevia = Math.min(width - (desktop ? 232 : 0) - 64, 520);
  const celula = caca ? Math.floor(Math.max(16, Math.min(32, larguraPrevia / caca.tamanho))) : 0;

  const urlDoPdf = (baixar: boolean) =>
    urlDoPdfDaFerramenta(
      {
        tipo: 'caca-palavras',
        titulo: titulo.trim() || tituloPadrao,
        cabecalho,
        palavras: palavras.map((p) => ({ palavra: p.palavra })),
        nivel,
        semente,
        gabarito,
      },
      baixar,
    );

  return (
    <TelaDaFerramenta
      etapa={etapa}
      titulo="Caça-palavras"
      descricao="Escolha as palavras e o nível. O caça-palavras se monta sozinho e sai em PDF pronto para imprimir, com cabeçalho e gabarito."
    >
      <Etapas nomes={ETAPAS} atual={etapa} liberada={liberada} aoIr={setEtapa} />

      {etapa === 0 && (
        <>
          <SeletorDeOrigem origem={origem} aoMudar={setOrigem} />

          {origem === 'temas' ? (
            <EscolherPalavras
              selecionadas={minhas}
              aoMudar={setMinhas}
              comDica={false}
              maximo={MAXIMO}
            />
          ) : (
            <>
              <EscolherMaterial
                escolhido={material}
                aoEscolher={(m, lista) => {
                  setMaterial(m);
                  setRepertorio(lista);
                  setSemente(1);
                }}
              />
              {doMaterial && (
                <PalavrasSorteadas
                  maximo={Math.min(MAXIMO, repertorio.length)}
                  quantidade={quantidade}
                  aoMudarQuantidade={setQuantidade}
                  palavras={palavras}
                />
              )}
            </>
          )}
        </>
      )}

      {etapa === 1 && (
        <>
          <Secao titulo="Nível">
            <View className="flex-row flex-wrap gap-2">
              {NIVEIS.map((n) => (
                <Pressable
                  key={n}
                  onPress={() => setNivel(n)}
                  className={`rounded-xl px-4 py-2.5 ${n === nivel ? 'bg-marca' : 'bg-superficie'}`}
                >
                  <Text
                    className={`font-corpo-medio text-sm ${n === nivel ? 'text-sobre-marca' : 'text-texto'}`}
                  >
                    {nomeNivelCacaPalavras[n]}
                  </Text>
                </Pressable>
              ))}
            </View>
          </Secao>

          <Secao titulo="Prévia">
            {!caca ? (
              <Text className="font-corpo text-sm text-texto-2">
                {origem === 'material'
                  ? 'Escolha um material para ver o caça-palavras.'
                  : 'Escolha pelo menos 2 palavras para ver o caça-palavras.'}
              </Text>
            ) : (
              <View className="gap-3">
                {caca.deFora.length > 0 && (
                  <View className="flex-row gap-2 rounded-xl bg-superficie-2 p-3">
                    <Ionicons name="alert-circle" size={18} color={cores.coral} />
                    <Text className="flex-1 font-corpo text-sm text-texto">
                      Não coube: {caca.deFora.join(', ')}. Tente outra arrumação ou use menos
                      palavras.
                    </Text>
                  </View>
                )}
                <View className="items-center rounded-2xl bg-white p-4">
                  {caca.grade.map((linha, l) => (
                    <View key={l} className="flex-row">
                      {linha.map((letra, c) => (
                        <View
                          key={c}
                          style={{ width: celula, height: celula }}
                          className="items-center justify-center"
                        >
                          <Text
                            style={{ fontSize: celula * 0.5, color: '#1A1A1F' }}
                            className="font-corpo-forte"
                          >
                            {letra}
                          </Text>
                        </View>
                      ))}
                    </View>
                  ))}
                </View>
                <Text className="font-corpo text-xs text-texto-2">
                  {caca.tamanho} × {caca.tamanho} letras · {caca.escondidas.length} palavras
                  escondidas
                </Text>
              </View>
            )}
          </Secao>

          <View className="flex-row flex-wrap gap-3">
            <Pressable
              onPress={() => setSemente((s) => s + 1)}
              disabled={!caca}
              className={`h-12 flex-1 flex-row items-center justify-center gap-2 rounded-xl bg-superficie ${
                caca ? '' : 'opacity-40'
              }`}
            >
              <Ionicons name={doMaterial ? 'sparkles' : 'shuffle'} size={18} color={cores.texto} />
              <Text className="font-corpo-forte text-base text-texto">
                {doMaterial ? 'Nova versão' : 'Outra arrumação'}
              </Text>
            </Pressable>
          </View>
        </>
      )}

      {etapa === 2 && (
        <>
          <Secao titulo="Folha">
            <TextInput
              value={titulo}
              onChangeText={setTitulo}
              placeholder={doMaterial ? tituloPadrao : 'Título (ex.: Caça-palavras das frutas)'}
              placeholderTextColor={cores.texto2}
              maxLength={60}
              className="h-11 rounded-xl bg-superficie px-3 font-corpo text-base text-texto"
            />
            <View className="flex-row items-center justify-between rounded-xl bg-superficie px-4 py-2">
              <Text className="font-corpo text-sm text-texto">Incluir página de gabarito</Text>
              <Switch value={gabarito} onValueChange={setGabarito} />
            </View>
          </Secao>

          <CamposDoCabecalho cabecalho={cabecalho} aoMudar={setCabecalho} />

          <BotoesDoPdf urlDoPdf={urlDoPdf} habilitado={!!caca} />
        </>
      )}

      <NavegacaoDasEtapas
        atual={etapa}
        nomes={ETAPAS}
        podeAvancar={liberada(etapa + 1)}
        motivo={
          origem === 'material' && !material
            ? 'Escolha um material para seguir.'
            : 'Escolha pelo menos 2 palavras para seguir.'
        }
        aoIr={setEtapa}
      />
    </TelaDaFerramenta>
  );
}
