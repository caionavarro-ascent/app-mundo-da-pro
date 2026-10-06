#!/usr/bin/env bash
#
# Repertório de palavras por material (D45): para cada PDF do painel, o vocabulário
# do tema (com dica de lacuna tirada do próprio texto, quando dá) para a Cruzadinha
# e o Caça-palavras gerarem versões sem fim a partir de um material.
# Saída: apps/web/dados/repertorio-palavras.json  { id: [{ palavra, dica? }] }
#
# Como escolhe as palavras:
#   - existe no dicionário do português (descarta lixo da extração de texto);
#   - não é genérica: aparece em até 12% dos materiais (sai "aluno", "atividade"...);
#   - tem cara de substantivo: já apareceu depois de artigo/preposição ("a LAGARTA",
#     "do JARDIM") ou em lista em maiúsculas (vocabulário destacado pelo material);
#   - ordem: frequência no material × raridade no acervo.
# Dica: frase do próprio PDF com a palavra trocada por lacuna, se houver frase boa.
#
# Uso (na raiz do repo):  bash deploy/gerar-repertorio.sh
# Precisa de: pdftotext (poppler-utils) e /usr/share/dict/brazilian (wbrazilian)
#
set -euo pipefail
cd "$(dirname "$0")/../apps/web"
command -v pdftotext >/dev/null || { echo "✗ falta o pdftotext: apt install poppler-utils" >&2; exit 1; }
[[ -f /usr/share/dict/brazilian ]] || { echo "✗ falta o dicionário: apt install wbrazilian" >&2; exit 1; }
nice -n 19 python3 - <<'PY'
import json, math, os, re, subprocess, unicodedata
from collections import Counter, defaultdict

PAGINAS = 30
MINIMO_POR_MATERIAL = 8
MAXIMO_POR_MATERIAL = 40
GENERICA = 0.12  # fração de materiais a partir da qual a palavra é genérica

dicionario = {l.strip().lower() for l in open('/usr/share/dict/brazilian', encoding='utf-8', errors='ignore')}

VAZIAS = set('''
a o as os um uma uns umas de da do das dos em na no nas nos num numa por pelo pela pelos pelas
para pra pro com sem sob sobre entre até após ante e ou mas nem que se como quando onde quem
qual quais cujo cuja isso isto aquilo esse essa este esta aquele aquela seu sua seus suas meu
minha meus minhas teu tua nosso nossa dele dela deles delas ele ela eles elas eu tu você vocês
nós me te lhe lhes nos vos mim ti si já não sim muito muita muitos muitas mais menos bem mal
também só ainda depois antes agora hoje ontem amanhã sempre nunca aqui ali lá então assim
tudo todo toda todos todas nada algo alguém algum alguma alguns algumas outro outra outros outras
mesmo mesma cada qualquer tanto tanta tão ser estar ter haver fazer ir vir ver dar dizer poder
foi era é são está estão tem têm vai vão fez disse pode podem deve devem havia sua seu the and
página folha nome data turma prof professor professora aluno aluna alunos alunas escola
atividade atividades exercício exercícios questão questões resposta respostas leia escreva
complete responda observe pinte circule marque ligue recorte cole desenhe copie
será seria estava estavam tinha tinham foram eram ficou ficar fica pode podia queria quer
volte avance fique jogue jogar jogue passe perde ganha vence mexe falta faltam faltando
encontre separe numere forme junte troque use usar leia escreva pense pensar refletir
dica frase frases linha linhas página versão legenda título texto palavra palavras letra letras
super educa faz ler vez primeira primeiro próprio própria explique descreve descreva conte
ajuda ajudam
'''.split())

# artigos inequívocos: antes deles não vem verbo no infinitivo ("o jantar", "um lugar")
ARTIGOS_FORTES = set('o os um uns uma umas do dos no nos pelo pelos meu seu esse este'.split())

ARTIGOS = set('o a os as um uma uns umas do da dos das no na nos nas ao aos pelo pela meu minha seu sua teu tua esse essa este esta aquele aquela'.split())

def sem_acento(s):
    return ''.join(c for c in unicodedata.normalize('NFD', s) if unicodedata.category(c) != 'Mn')

def texto_do_pdf(caminho):
    try:
        return subprocess.run(['pdftotext', '-l', str(PAGINAS), '-q', caminho, '-'],
                              capture_output=True, timeout=60).stdout.decode('utf-8', 'ignore')
    except subprocess.TimeoutExpired:
        return ''

materiais = [m for m in json.load(open('dados/materiais.json')) if m.get('status') == 'publicado']
textos = {}
for m in materiais:
    caminho = os.path.join('dados/arquivos', m['arquivo'])
    if os.path.exists(caminho):
        textos[m['id']] = texto_do_pdf(caminho)

def pedacos(bruto):
    return [p.strip() for p in re.split(r'(?<=[.!?])\s+|\n{2,}', bruto) if len(p.strip()) > 20]

# frase igual em 15+ materiais é apresentação/rodapé (direitos, "fundadoras"...): sai antes de
# contar. Menos que isso pode ser a mesma história em versões (colorido, PB, individual).
repetidas = Counter()
for bruto in textos.values():
    repetidas.update(set(re.sub(r'\s+', ' ', p) for p in pedacos(bruto)))
for mid in textos:
    textos[mid] = '\n\n'.join(
        p for p in pedacos(textos[mid]) if repetidas[re.sub(r'\s+', ' ', p)] < 15
    )

TOKEN = re.compile(r"[A-Za-zÀ-ÖØ-öø-ÿ]+")
por_material = {}
df = Counter()
for mid, bruto in textos.items():
    # palavra colada a hífen ("encontrá-lo", "guarda-chuva") fica de fora: sozinha, está errada
    tokens = [t.group() for t in TOKEN.finditer(bruto)
              if bruto[t.end():t.end() + 1] != '-' and bruto[t.start() - 1:t.start()] != '-']
    freq, forma, substantivo, com_artigo_forte = Counter(), defaultdict(Counter), Counter(), Counter()
    for i, t in enumerate(tokens):
        chave = t.lower()
        if not (3 <= len(chave) <= 12) or chave in VAZIAS or chave not in dicionario:
            continue
        freq[chave] += 1
        forma[chave][t] += 1
        anterior = tokens[i - 1].lower() if i > 0 else ''
        if anterior in ARTIGOS:
            substantivo[chave] += 1
            if anterior in ARTIGOS_FORTES:
                com_artigo_forte[chave] += 1
        elif t.isupper() and len(t) >= 4:
            substantivo[chave] += 0.5  # vocabulário destacado em maiúsculas
    # cara de verbo no infinitivo ("voltar", "pensar") só fica com artigo forte ("o jantar")
    for chave in list(freq):
        if len(chave) >= 5 and chave.endswith(('ar', 'er', 'ir')) and com_artigo_forte[chave] == 0:
            del freq[chave]
    por_material[mid] = (freq, forma, substantivo, bruto)
    df.update(freq.keys())

total = max(1, len(por_material))

def frases(bruto):
    corrido = re.sub(r'\s+', ' ', bruto)
    for f in re.split(r'(?<=[.!?])\s+', corrido):
        f = f.strip()
        palavras = f.split()
        if not (5 <= len(palavras) <= 18 and 25 <= len(f) <= 120):
            continue
        if '_' in f or ':' in f or '\\' in f or re.search(r'\d{2,}', f) or not f[0].isupper() or f[-1] not in '.!?':
            continue
        # ordem de atividade ("Ligue...", "Pinte...") não é dica; nem título colado em maiúsculas
        if re.match(r'(Ligue|Pinte|Circule|Escreva|Complete|Leia|Observe|Marque|Recorte|Cole|Desenhe|Copie|Responda|Encontre|Separe|Numere|Forme|Junte|Troque|Use|Agora|Vamos)\b', f, re.I):
            continue
        maiusculas = sum(c.isupper() for c in f) / max(1, sum(c.isalpha() for c in f))
        if maiusculas > 0.6:
            continue
        letras = sum(c.isalpha() or c.isspace() for c in f) / len(f)
        if letras < 0.9:
            continue
        # texto de apresentação/direitos, igual em quase todo PDF, não vira dica
        if re.search(r'material|aprendizado|reproduzi|Mundo da Pr|@', f, re.I):
            continue
        yield f

repertorio = {}
for mid, (freq, forma, substantivo, bruto) in por_material.items():
    candidatas = []
    for chave, n in freq.items():
        if df[chave] / total > GENERICA or substantivo[chave] < 1:
            continue
        nota = n * math.log(total / df[chave]) * (1.3 if substantivo[chave] >= 2 else 1)
        candidatas.append((nota, chave))
    candidatas.sort(reverse=True)
    # singular e plural da mesma palavra (camaleão/camaleões, flor/flores): fica a mais frequente
    def raiz(c):
        c = sem_acento(c)
        for fim, troca in (('oes', 'ao'), ('aes', 'ao'), ('ais', 'al'), ('res', 'r'), ('zes', 'z'), ('s', '')):
            if c.endswith(fim) and len(c) > len(fim) + 2:
                return c[: -len(fim)] + troca
        return c
    vistas, escolhidas = set(), []
    for _, c in candidatas:
        if raiz(c) in vistas:
            continue
        vistas.add(raiz(c))
        escolhidas.append(c)
        if len(escolhidas) == MAXIMO_POR_MATERIAL:
            break
    if len(escolhidas) < MINIMO_POR_MATERIAL:
        continue
    lista_frases = list(frases(bruto))
    itens, usadas = [], set()
    for chave in escolhidas:
        # a forma mais comum no texto, em maiúsculas (com acento)
        exibida = forma[chave].most_common(1)[0][0].upper()
        dica = None
        padrao = re.compile(r'(?<![A-Za-zÀ-ÿ])' + re.escape(chave) + r'(?![A-Za-zÀ-ÿ])', re.I)
        for f in lista_frases:
            if f in usadas or len(padrao.findall(f)) != 1:
                continue
            dica = 'Complete: “' + padrao.sub('________', f) + '”'
            usadas.add(f)
            break
        item = {'palavra': exibida}
        if dica:
            item['dica'] = dica
        itens.append(item)
    repertorio[mid] = itens

tmp = 'dados/repertorio-palavras.json.tmp'
json.dump(repertorio, open(tmp, 'w'), ensure_ascii=False)
os.replace(tmp, 'dados/repertorio-palavras.json')
com_dica = sum(1 for r in repertorio.values() for i in r if 'dica' in i)
palavras = sum(len(r) for r in repertorio.values())
print(f'✓ repertório de {len(repertorio)} de {len(materiais)} materiais, {palavras} palavras ({com_dica} com dica)')
PY
