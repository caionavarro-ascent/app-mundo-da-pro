-- Produto novo "Cube Mundo da Prô" (pedido do cliente, 24/09/2026).
-- Preço e pitches provisórios marcados como TODO — cliente confirma depois.
insert into produtos (slug, nome, preco_centavos, parcelas_texto, cor,
                      pitch_para_quem, pitch_para_que, ordem_vitrine)
values ('cube', 'Cube Mundo da Prô', 19700, 'ou 12x de R$ 19', '#2A9D8F',
        'TODO: para quem é o Cube.', 'TODO: o que o Cube entrega.', 55)
on conflict (slug) do nothing;
