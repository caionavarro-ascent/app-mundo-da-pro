import { Ionicons } from '@expo/vector-icons';
import { gerarCruzadinha, sortearDoRepertorio, type PalavraDaAtividade } from '@mdp/core';
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
const MAXIMO = 15;

/**
 * Gerador de cruzadinha (D44): ela escolhe as palavras (com ou sem dica), vê a
 * cruzadinha montada e baixa o PDF com cabeçalho e gabarito. Todas com dica →
 * folha de dicas; alguma sem → folha com banco de palavras.
 */
export default function Cruzadinha() {
  const cores = useCores();
  const desktop = useDesktopWeb();
  const { width } = useWindowDimensions();
  const [cabecalho, setCabecalho] = useCabecalhoDaFolha();
  const [origem, setOrigem] = useState<OrigemDasPalavras>('temas');
  const [minhas, setMinhas] = useState<PalavraDaAtividade[]>([]);
  const [material, setMaterial] = useState<MaterialDemo | null>(null);
  const [repertorio, setRepertorio] = useState<PalavraDaAtividade[]>([]);
  const [quantidade, setQuantidade] = useState(8);
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
          ? sortearDoRepertorio(repertorio, quantidade, semente, true)
          : []
        : minhas,
    [origem, material, repertorio, quantidade, semente, minhas],
  );
  // com 5+ dicas o sorteio usa só as palavras com dica (folha de dicas): o limite é esse
  const comDicaNoMaterial = repertorio.filter((p) => p.dica).length;
  const maximoDoMaterial = Math.min(
    MAXIMO,
    comDicaNoMaterial >= 5 ? comDicaNoMaterial : repertorio.length,
  );
  const tituloPadrao = doMaterial
    ? `Cruzadinha: ${material.titulo.split(' — ')[0]}`.slice(0, 60)
    : 'Cruzadinha';

  const cruzadinha = useMemo(
    () => (palavras.length >= 2 ? gerarCruzadinha(palavras, semente) : null),
    [palavras, semente],
  );
  // Montar e Folha só com a atividade de pé (2+ palavras)
  const liberada = (i: number) => i === 0 || !!cruzadinha;
  const semDica = palavras.filter((p) => !p.dica?.trim()).length;
  const larguraPrevia = Math.min(width - (desktop ? 232 : 0) - 64, 560);
  // pixel inteiro: casa fracionada arredonda diferente em cada coluna e desalinha a grade
  const celula = cruzadinha
    ? Math.floor(Math.max(14, Math.min(30, larguraPrevia / Math.max(cruzadinha.colunas, 1))))
    : 0;

  const urlDoPdf = (baixar: boolean) =>
    urlDoPdfDaFerramenta(
      {
        tipo: 'cruzadinha',
        titulo: titulo.trim() || tituloPadrao,
        cabecalho,
        palavras,
        semente,
        gabarito,
      },
      baixar,
    );

  return (
    <TelaDaFerramenta
      etapa={etapa}
      titulo="Cruzadinha"
      descricao="Escolha as palavras e a cruzadinha se monta sozinha. Baixe o PDF pronto para imprimir, com cabeçalho e gabarito."
    >
      <Etapas nomes={ETAPAS} atual={etapa} liberada={liberada} aoIr={setEtapa} />

      {etapa === 0 && (
        <>
          <SeletorDeOrigem origem={origem} aoMudar={setOrigem} />

          {origem === 'temas' ? (
            <EscolherPalavras selecionadas={minhas} aoMudar={setMinhas} comDica maximo={MAXIMO} />
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
                  maximo={maximoDoMaterial}
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
          <Secao titulo="Prévia">
            {!cruzadinha ? (
              <Text className="font-corpo text-sm text-texto-2">
                {origem === 'material'
                  ? 'Escolha um material para ver a cruzadinha.'
                  : 'Escolha pelo menos 2 palavras para ver a cruzadinha.'}
              </Text>
            ) : (
              <View className="gap-3">
                <Text className="font-corpo text-sm text-texto-2">
                  {semDica === 0
                    ? 'Todas as palavras têm dica: a folha sai com as dicas numeradas.'
                    : `${semDica} ${semDica === 1 ? 'palavra está' : 'palavras estão'} sem dica: a folha sai com o quadro de palavras para encaixar. Escreva todas as dicas para sair com dicas.`}
                </Text>
                {cruzadinha.deFora.length > 0 && (
                  <View className="flex-row gap-2 rounded-xl bg-superficie-2 p-3">
                    <Ionicons name="alert-circle" size={18} color={cores.coral} />
                    <Text className="flex-1 font-corpo text-sm text-texto">
                      Não coube: {cruzadinha.deFora.join(', ')}. Ela não tem letra em comum com as
                      outras. Tente outra arrumação ou troque a palavra.
                    </Text>
                  </View>
                )}
                <View className="items-center rounded-2xl bg-white p-4">
                  {/* cada casa na posição exata (linha × casa, coluna × casa), como no PDF;
                    tamanho casa + 1 para a borda de uma sobrepor a da vizinha, sem linha dupla */}
                  <View
                    style={{
                      width: cruzadinha.colunas * celula + 1,
                      height: cruzadinha.linhas * celula + 1,
                    }}
                  >
                    {cruzadinha.grade.flatMap((linha, l) =>
                      linha.map((letra, c) => {
                        if (!letra) return null;
                        const numero = cruzadinha.numeros[l][c];
                        return (
                          <View
                            key={`${l}-${c}`}
                            style={{
                              position: 'absolute',
                              left: c * celula,
                              top: l * celula,
                              width: celula + 1,
                              height: celula + 1,
                              borderWidth: 1,
                              borderColor: '#1A1A1F',
                              backgroundColor: '#FFFFFF',
                            }}
                          >
                            {numero != null && (
                              <Text
                                style={{
                                  fontSize: Math.max(7, Math.round(celula * 0.3)),
                                  lineHeight: Math.max(8, Math.round(celula * 0.36)),
                                  color: '#6B7280',
                                }}
                                className="pl-0.5 font-corpo-forte"
                              >
                                {numero}
                              </Text>
                            )}
                          </View>
                        );
                      }),
                    )}
                  </View>
                </View>
              </View>
            )}
          </Secao>

          <View className="flex-row flex-wrap gap-3">
            <Pressable
              onPress={() => setSemente((s) => s + 1)}
              disabled={!cruzadinha}
              className={`h-12 flex-1 flex-row items-center justify-center gap-2 rounded-xl bg-superficie ${
                cruzadinha ? '' : 'opacity-40'
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
              placeholder={doMaterial ? tituloPadrao : 'Título (ex.: Cruzadinha dos animais)'}
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

          <BotoesDoPdf urlDoPdf={urlDoPdf} habilitado={!!cruzadinha} />
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
