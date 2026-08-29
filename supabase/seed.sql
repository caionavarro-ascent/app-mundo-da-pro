-- =====================================================================
-- Seed do Bloco 1: os 7 produtos reais + o combo Acesso Total, e as
-- habilidades do vocabulário controlado.
-- Pitches marcados com TODO são provisórios: a redação final é das sócias
-- (pendência "quem escreve os pitches" no DECISIONS.md).
-- =====================================================================

insert into produtos
  (slug, nome, autora, preco_centavos, parcelas_texto, cor,
   pitch_para_quem, pitch_para_que, ordem_vitrine, acesso_dias, is_combo)
values
  ('educakits', 'EducaKits', 'MDP', 19700, 'ou 12x de R$ 19', '#E4574E',
   'TODO: Para quem já sabe o que ensinar mas gasta o domingo montando atividade.',
   'TODO: Sequências prontas para imprimir, do infantil ao 2º ano.',
   10, null, false),
  ('colecao-imagine', 'Coleção Imagine', 'Gi', 14700, 'ou 12x de R$ 14', '#7C5CBF',
   'TODO: Para quem quer trabalhar produção de texto sem inventar tudo do zero.',
   'TODO: Propostas ilustradas de escrita criativa para o 2º ao 5º ano.',
   20, null, false),
  ('cadernos-flaeduca', 'Cadernos FlaEduca', 'Flávia', 16700, 'ou 12x de R$ 16', '#1F9E77',
   'TODO: Para quem precisa de rotina estruturada de alfabetização.',
   'TODO: Cadernos completos por nível de escrita, prontos para o xerox.',
   30, null, false),
  ('materiais-avulsos', 'Materiais Avulsos', 'MDP', 4700, 'ou 6x de R$ 8', '#3A57C4',
   'TODO: Para quem precisa de uma atividade certeira para amanhã.',
   'TODO: Jogos, cartazes e avaliações vendidos um a um.',
   40, null, false),
  ('bncc-de-bolso', 'BNCC de Bolso', 'MDP', 9700, 'ou 12x de R$ 9', '#B8862D',
   'TODO: Para quem trava na hora de preencher o planejamento.',
   'TODO: As habilidades da BNCC traduzidas em linguagem de sala de aula.',
   50, null, false),
  ('fda', 'Formação Destrava Aluno', 'Gi', 69700, 'ou 12x de R$ 69', '#C2483F',
   'TODO: Para quem tem aluno que não avança e já tentou de tudo.',
   'TODO: Formação completa em alfabetização, com acesso por 1 ano.',
   90, 365, false),
  ('fpt', 'Formação Produção de Texto', 'Flávia', 49700, 'ou 12x de R$ 49', '#2F6FAD',
   'TODO: Para quem sofre para tirar texto de criança do 3º ao 5º ano.',
   'TODO: Método passo a passo para destravar a escrita da turma.',
   91, null, false),
  ('acesso-total', 'Acesso Total Mundo da Prô', 'MDP', 99700, 'ou 12x de R$ 97', '#FFD84D',
   'TODO: Para quem quer o acervo inteiro sem escolher.',
   'TODO: Todos os materiais, atuais e futuros, num acesso só.',
   999, null, true)
on conflict (slug) do nothing;

insert into habilidades (slug, nome) values
  ('consciencia-fonologica', 'Consciência fonológica'),
  ('principio-alfabetico',   'Princípio alfabético'),
  ('leitura',                'Leitura'),
  ('fluencia-leitora',       'Fluência leitora'),
  ('producao-textual',       'Produção textual'),
  ('ortografia',             'Ortografia'),
  ('escrita-espontanea',     'Escrita espontânea'),
  ('avaliacao-diagnostica',  'Avaliação diagnóstica'),
  ('rotina-e-planejamento',  'Rotina e planejamento'),
  ('vocabulario',            'Vocabulário')
on conflict (slug) do nothing;
