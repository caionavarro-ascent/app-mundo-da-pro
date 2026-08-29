-- =====================================================================
-- Teste do Bloco 1: dois usuários, entitlement de EducaKits só para a
-- primeira, e a função tem_acesso respondendo certo para as duas —
-- inclusive o caso do combo (D22).
-- Rodar no SQL Editor (ou psql) DEPOIS de migration + seed aplicados.
-- Tudo dentro de uma transação com ROLLBACK: não deixa rastro.
-- =====================================================================

begin;

do $$
declare
  ana    uuid := gen_random_uuid();
  bia    uuid := gen_random_uuid();
  educakits uuid;
  combo     uuid;
  material  uuid;
begin
  select id into educakits from produtos where slug = 'educakits';
  select id into combo     from produtos where slug = 'acesso-total';

  -- duas professoras (o trigger cria os perfis)
  insert into auth.users (id, email) values
    (ana, 'ana.teste@exemplo.com'),
    (bia, 'bia.teste@exemplo.com');

  -- um material pago vinculado ao EducaKits
  insert into materiais (slug, titulo, status)
  values ('teste-bingo', 'Bingo de Teste', 'publicado')
  returning id into material;
  insert into material_produto (material_id, produto_id) values (material, educakits);

  -- só a Ana compra o EducaKits
  insert into entitlements (user_id, produto_id, origem, pedido_externo)
  values (ana, educakits, 'compra', 'pedido-teste-1');

  -- 1) Ana acessa, Bia não
  assert tem_acesso(ana, material) = true,  'Ana deveria acessar o material do EducaKits';
  assert tem_acesso(bia, material) = false, 'Bia NÃO deveria acessar sem entitlement';

  -- 2) combo libera tudo (D22)
  insert into entitlements (user_id, produto_id, origem, pedido_externo)
  values (bia, combo, 'compra', 'pedido-teste-2');
  assert tem_acesso(bia, material) = true, 'Bia com Acesso Total deveria acessar';

  -- 3) revogação corta o acesso (regra de ouro 7)
  update entitlements set revogado_em = now() where user_id = ana;
  assert tem_acesso(ana, material) = false, 'Ana revogada NÃO deveria acessar';

  -- 4) expiração corta o acesso (FDA)
  update entitlements set revogado_em = null, expira_em = now() - interval '1 day'
   where user_id = ana;
  assert tem_acesso(ana, material) = false, 'Entitlement expirado NÃO deveria dar acesso';

  -- 5) concessão manual duplicada é barrada (índice parcial)
  insert into entitlements (user_id, produto_id, origem) values (bia, educakits, 'manual');
  begin
    insert into entitlements (user_id, produto_id, origem) values (bia, educakits, 'manual');
    raise exception 'Duplicata manual deveria ter sido barrada';
  exception when unique_violation then
    null; -- esperado
  end;

  raise notice 'TODOS OS TESTES DE ACESSO PASSARAM';
end $$;

rollback;
