-- =====================================================================
-- App Mundo da Prô — schema inicial
-- Rodar no SQL Editor do Supabase ou como primeira migration.
-- =====================================================================

create extension if not exists "uuid-ossp";
create extension if not exists pg_trgm;

-- ---------------------------------------------------------------------
-- Tipos
-- ---------------------------------------------------------------------
create type ano_escolar   as enum ('infantil','1ano','2ano','3ano','4ano','5ano');
create type nivel_escrita as enum ('pre','sil','sa','alf');
create type tipo_material as enum ('sequencia','atividade','jogo','avaliacao','cartaz','planner','aula');
create type status_material as enum ('rascunho','agendado','publicado','arquivado');
create type papel_usuario as enum ('professora','editor','admin');
create type origem_acesso as enum ('compra','cortesia','migracao','manual');

-- ---------------------------------------------------------------------
-- Perfis (espelha auth.users)
-- ---------------------------------------------------------------------
create table perfis (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null unique,
  nome        text,
  whatsapp    text,
  papel       papel_usuario not null default 'professora',
  criado_em   timestamptz not null default now(),
  visto_em    timestamptz,
  -- exclusão de conta exigida pelas lojas: anonimiza, não apaga a linha
  excluido_em timestamptz,
  anonimizado boolean not null default false
);
create index on perfis (lower(email));

-- Perfil criado automaticamente no primeiro login
create or replace function public.criar_perfil()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into perfis (id, email, nome)
  values (new.id, lower(new.email), new.raw_user_meta_data->>'nome')
  on conflict (id) do nothing;
  return new;
end $$;

create trigger ao_criar_usuario
  after insert on auth.users
  for each row execute function public.criar_perfil();

-- ---------------------------------------------------------------------
-- Produtos
-- ---------------------------------------------------------------------
create table produtos (
  id               uuid primary key default uuid_generate_v4(),
  slug             text not null unique,
  nome             text not null,
  autora           text,                       -- 'Gi' | 'Flávia' | 'MDP'
  preco_centavos   integer not null default 0,
  parcelas_texto   text,                       -- 'ou 12x de R$ 39'
  checkout_url     text,
  cor              text default '#16265C',
  pitch_para_quem  text,                       -- uma linha
  pitch_para_que   text,                       -- uma linha
  beneficios       text[] default '{}',        -- 3 bullets do paywall
  ordem_vitrine    integer not null default 100,
  sugerido_apos    uuid[] default '{}',        -- ids de produtos que puxam este
  acesso_dias      integer,                    -- null = vitalício; 365 no FDA
  is_combo         boolean not null default false,
  ativo            boolean not null default true,
  -- identificadores nas plataformas de venda, usados pelo webhook
  externo_themembers text[] default '{}',
  externo_woo        text[] default '{}',
  criado_em        timestamptz not null default now()
);
create index on produtos using gin (externo_themembers);
create index on produtos using gin (externo_woo);

-- ---------------------------------------------------------------------
-- Habilidades (vocabulário controlado)
-- ---------------------------------------------------------------------
create table habilidades (
  id    uuid primary key default uuid_generate_v4(),
  slug  text not null unique,
  nome  text not null
);

-- ---------------------------------------------------------------------
-- Materiais
-- ---------------------------------------------------------------------
create table materiais (
  id             uuid primary key default uuid_generate_v4(),
  slug           text not null unique,
  titulo         text not null,
  descricao      text,
  tipo           tipo_material,
  anos           ano_escolar[]   not null default '{}',
  niveis         nivel_escrita[] not null default '{}',
  habilidade_id  uuid references habilidades(id),
  paginas        integer default 0,
  gratuito       boolean not null default false,
  -- arquivos
  arquivo_path   text,             -- bucket privado 'materiais'
  capa_path      text,             -- bucket público 'previews' — cartaz 2:3
  arte_destaque_path text,         -- bucket público 'previews' — arte vertical 4:5 do bloco de destaque
  preview_paths  text[] default '{}',
  -- como usar
  passos         text[] default '{}',
  video_url      text,
  -- aulas que vivem fora (FDA/FPT)
  url_externa    text,
  -- publicação
  status         status_material not null default 'rascunho',
  publicar_em    timestamptz,
  publicado_em   timestamptz,
  -- apoio à curadoria
  texto_extraido text,
  sugestao_ia    jsonb,
  criado_em      timestamptz not null default now(),
  atualizado_em  timestamptz not null default now()
);
create index on materiais using gin (anos);
create index on materiais using gin (niveis);
create index on materiais (status, publicado_em desc);
create index on materiais using gin (titulo gin_trgm_ops);

create table material_produto (
  material_id uuid references materiais(id) on delete cascade,
  produto_id  uuid references produtos(id)  on delete cascade,
  primary key (material_id, produto_id)
);

-- ---------------------------------------------------------------------
-- Posse — fonte única da verdade sobre acesso
-- ---------------------------------------------------------------------
create table entitlements (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references perfis(id) on delete cascade,
  produto_id    uuid not null references produtos(id) on delete cascade,
  origem        origem_acesso not null default 'compra',
  pedido_externo text,
  concedido_em  timestamptz not null default now(),
  expira_em     timestamptz,
  revogado_em   timestamptz,
  motivo_revogacao text,
  unique (user_id, produto_id, pedido_externo)
);
create index on entitlements (user_id) where revogado_em is null;
-- Concessão manual/cortesia não tem pedido_externo, e NULL não conta no unique
-- acima: este índice impede a duplicata (revogado fica fora para permitir reconceder)
create unique index entitlements_sem_pedido_unico
  on entitlements (user_id, produto_id)
  where pedido_externo is null and revogado_em is null;

-- Acesso: gratuito, entitlement de produto vinculado, ou combo Acesso Total.
-- O combo (is_combo) libera todo o acervo pela regra, sem vínculo por material (D22).
create or replace function public.tem_acesso(p_user uuid, p_material uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from materiais m where m.id = p_material and m.gratuito)
      or exists (
        select 1
          from material_produto mp
          join entitlements e on e.produto_id = mp.produto_id
         where mp.material_id = p_material
           and e.user_id = p_user
           and e.revogado_em is null
           and (e.expira_em is null or e.expira_em > now())
      )
      or exists (
        select 1
          from entitlements e
          join produtos p on p.id = e.produto_id
         where e.user_id = p_user
           and p.is_combo
           and e.revogado_em is null
           and (e.expira_em is null or e.expira_em > now())
      );
$$;

-- ---------------------------------------------------------------------
-- Interação
-- ---------------------------------------------------------------------
create table favoritos (
  user_id     uuid references perfis(id) on delete cascade,
  material_id uuid references materiais(id) on delete cascade,
  criado_em   timestamptz not null default now(),
  primary key (user_id, material_id)
);

create table downloads (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references perfis(id) on delete cascade,
  material_id  uuid not null references materiais(id) on delete cascade,
  marca_dagua  text not null,   -- exatamente o que foi carimbado
  plataforma   text,            -- 'ios' | 'android' | 'web'
  ip           inet,
  criado_em    timestamptz not null default now()
);
create index on downloads (user_id, criado_em desc);

create table eventos (
  id          bigserial primary key,
  user_id     uuid references perfis(id) on delete set null,
  tipo        text not null,   -- material_visto | preview_pagina | cadeado_clicado
                               -- paywall_aberto | checkout_clicado | download | favorito
  material_id uuid references materiais(id) on delete set null,
  produto_id  uuid references produtos(id)  on delete set null,
  plataforma  text,   -- 'ios' | 'android' | 'web'
  versao_app  text,
  dados       jsonb,
  criado_em   timestamptz not null default now()
);
create index on eventos (tipo, criado_em desc);
create index on eventos (produto_id, tipo);

-- ---------------------------------------------------------------------
-- Webhooks
-- ---------------------------------------------------------------------
create table webhook_eventos (
  id            uuid primary key default uuid_generate_v4(),
  origem        text not null default 'themembers',
  evento        text,
  id_externo    text,
  payload       jsonb not null,
  processado_em timestamptz,
  erro          text,
  recebido_em   timestamptz not null default now(),
  unique (origem, id_externo, evento)
);

-- ---------------------------------------------------------------------
-- Configuração da vitrine (sem deploy)
-- ---------------------------------------------------------------------
create table configuracoes (
  chave     text primary key,
  valor     jsonb not null,
  descricao text
);

insert into configuracoes (chave, valor, descricao) values
  ('paginas_amostra',      '2',      'Páginas liberadas no preview de material trancado'),
  ('acesso_total_ativo',   'true',   'Mostra a faixa de Acesso Total na home'),
  ('acesso_total_titulo',  '"Acesso Total Mundo da Prô"', 'Título da faixa'),
  ('acesso_total_selo',    '"Happy Friday"', 'Selo da campanha; string vazia esconde'),
  ('dias_novidade',        '30',     'Janela da prateleira Novidades'),
  ('dias_continuar',       '30',     'Janela do trilho Continuar'),
  ('versao_minima_ios',     '"1.0.0"', 'Abaixo disso o app pede atualização obrigatória'),
  ('versao_minima_android', '"1.0.0"', 'Abaixo disso o app pede atualização obrigatória'),
  ('url_loja_ios',          '""',      'Link da App Store, usado na tela de atualização'),
  ('url_loja_android',      '""',      'Link do Google Play, usado na tela de atualização');

-- ---------------------------------------------------------------------
-- Destaques — alimenta o bloco grande da dobra (A2 do PRD)
-- ---------------------------------------------------------------------
create type regra_destaque as enum ('todos','sem_produto','com_produto');

create table destaques (
  id             uuid primary key default uuid_generate_v4(),
  titulo         text not null,
  apoio          text,                      -- 'Sequência completa, 28 páginas'
  arte_path      text,                      -- vertical 4:5; sem isso, fallback pela capa
  material_id    uuid references materiais(id) on delete cascade,
  produto_id     uuid references produtos(id) on delete cascade,
  cta_primario   text not null default 'Ver material',
  regra          regra_destaque not null default 'todos',
  regra_produto  uuid references produtos(id) on delete cascade,
  prioridade     integer not null default 100,   -- menor aparece primeiro
  inicia_em      timestamptz,
  termina_em     timestamptz,
  ativo          boolean not null default true,
  criado_em      timestamptz not null default now(),
  check (material_id is not null or produto_id is not null)
);
create index on destaques (ativo, prioridade);

-- Prateleira "Mais baixados da semana" (A4 do PRD)
create or replace view vw_mais_baixados as
select d.material_id,
       count(*)                                   as downloads_7d,
       row_number() over (order by count(*) desc) as posicao
  from downloads d
  join materiais m on m.id = d.material_id
 where d.criado_em > now() - interval '7 days'
   and m.status = 'publicado'
 group by d.material_id
 order by downloads_7d desc
 limit 10;

-- ---------------------------------------------------------------------
-- Aparelhos e notificações (app nativo)
-- ---------------------------------------------------------------------
create table dispositivos (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references perfis(id) on delete cascade,
  push_token    text not null,
  plataforma    text not null check (plataforma in ('ios','android')),
  modelo        text,
  versao_app    text,
  ativo         boolean not null default true,
  visto_em      timestamptz not null default now(),
  criado_em     timestamptz not null default now(),
  unique (push_token)
);
create index on dispositivos (user_id) where ativo;

create table preferencias_push (
  user_id        uuid primary key references perfis(id) on delete cascade,
  material_novo  boolean not null default true,   -- em produto que ela possui
  novidade_geral boolean not null default true,
  campanha       boolean not null default true,
  acesso_vencendo boolean not null default true
);

create table push_envios (
  id           uuid primary key default uuid_generate_v4(),
  titulo       text not null,
  corpo        text not null,
  tipo         text not null,   -- material_novo | novidade | campanha | acesso_vencendo
  material_id  uuid references materiais(id) on delete set null,
  produto_id   uuid references produtos(id)  on delete set null,
  segmento     jsonb,           -- {"possui":"<uuid>"} | {"nao_possui":"<uuid>"} | {}
  agendado_em  timestamptz,
  enviado_em   timestamptz,
  destinatarios integer default 0,
  criado_por   uuid references perfis(id),
  criado_em    timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- FASE 2 — criadas agora, telas não construídas no MVP
-- ---------------------------------------------------------------------
create table turmas (
  id        uuid primary key default uuid_generate_v4(),
  user_id   uuid not null references perfis(id) on delete cascade,
  nome      text not null,
  ano       ano_escolar,
  alunos    integer default 0,
  dist      jsonb default '{"pre":0,"sil":0,"sa":0,"alf":0}',
  criado_em timestamptz not null default now()
);

create table plano_semana (
  id          uuid primary key default uuid_generate_v4(),
  turma_id    uuid not null references turmas(id) on delete cascade,
  dia         text not null check (dia in ('seg','ter','qua','qui','sex')),
  material_id uuid not null references materiais(id) on delete cascade,
  ordem       integer not null default 0
);

-- =====================================================================
-- RLS
-- =====================================================================
alter table perfis          enable row level security;
alter table produtos        enable row level security;
alter table habilidades     enable row level security;
alter table materiais       enable row level security;
alter table material_produto enable row level security;
alter table entitlements    enable row level security;
alter table favoritos       enable row level security;
alter table downloads       enable row level security;
alter table eventos         enable row level security;
alter table configuracoes   enable row level security;
alter table destaques       enable row level security;
alter table dispositivos    enable row level security;
alter table preferencias_push enable row level security;
alter table push_envios     enable row level security;
alter table webhook_eventos enable row level security;
alter table turmas          enable row level security;
alter table plano_semana    enable row level security;

create or replace function public.eh_equipe()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from perfis where id = auth.uid() and papel in ('admin','editor'));
$$;

-- perfis
create policy "leio meu perfil" on perfis for select using (id = auth.uid() or eh_equipe());
create policy "edito meu perfil" on perfis for update using (id = auth.uid());

-- catálogo: metadados de material publicado são públicos para quem está logado.
-- O arquivo em si NÃO é: fica em bucket privado e só sai por URL assinada no servidor.
create policy "catálogo visível" on materiais for select
  using (status = 'publicado' or eh_equipe());
create policy "equipe edita materiais" on materiais for all
  using (eh_equipe()) with check (eh_equipe());

create policy "produtos visíveis" on produtos for select using (ativo or eh_equipe());
create policy "equipe edita produtos" on produtos for all
  using (eh_equipe()) with check (eh_equipe());

create policy "habilidades visíveis" on habilidades for select using (true);
create policy "equipe edita habilidades" on habilidades for all
  using (eh_equipe()) with check (eh_equipe());

create policy "vínculos visíveis" on material_produto for select using (true);
create policy "equipe edita vínculos" on material_produto for all
  using (eh_equipe()) with check (eh_equipe());

-- posse
create policy "vejo minha posse" on entitlements for select
  using (user_id = auth.uid() or eh_equipe());
create policy "equipe gerencia posse" on entitlements for all
  using (eh_equipe()) with check (eh_equipe());

-- interação
create policy "meus favoritos" on favoritos for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "meus downloads" on downloads for select
  using (user_id = auth.uid() or eh_equipe());
create policy "registro evento" on eventos for insert with check (true);
create policy "equipe lê eventos" on eventos for select using (eh_equipe());

-- destaques
create policy "destaques visíveis" on destaques for select
  using ((ativo and (inicia_em is null or inicia_em <= now())
              and (termina_em is null or termina_em > now())) or eh_equipe());
create policy "equipe edita destaques" on destaques for all
  using (eh_equipe()) with check (eh_equipe());

-- aparelhos e push
create policy "meus aparelhos" on dispositivos for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "minhas preferências" on preferencias_push for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "equipe gerencia push" on push_envios for all
  using (eh_equipe()) with check (eh_equipe());

-- config
create policy "config visível" on configuracoes for select using (true);
create policy "equipe edita config" on configuracoes for all
  using (eh_equipe()) with check (eh_equipe());

-- webhooks: nada pelo cliente, só service_role
create policy "webhooks só equipe" on webhook_eventos for select using (eh_equipe());

-- fase 2
create policy "minhas turmas" on turmas for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "meu plano" on plano_semana for all
  using (exists (select 1 from turmas t where t.id = turma_id and t.user_id = auth.uid()))
  with check (exists (select 1 from turmas t where t.id = turma_id and t.user_id = auth.uid()));

-- =====================================================================
-- Buckets (criar pelo painel do Supabase ou pela CLI)
--   materiais  -> privado. PDFs originais. Só service_role.
--   previews   -> público. Capas e miniaturas em baixa resolução, com marca fixa.
-- =====================================================================
