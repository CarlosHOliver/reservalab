-- Adicionar Serra de Corte como equipamento que necessita acompanhamento
-- ReservaLAB - FAEN/UFGD

INSERT INTO equipamentos (
    nome, 
    patrimonio,
    bloco_id, 
    local,
    descricao, 
    status,
    permitir_uso_compartilhado, 
    necessita_acompanhamento,
    quantidade_maxima_ocupantes,
    ativo,
    created_at, 
    updated_at
) VALUES 
(
    'Serra de Corte Industrial',
    'SERRA-001',
    (SELECT id FROM blocos WHERE nome ILIKE '%laboratório%' OR nome ILIKE '%oficina%' OR nome ILIKE '%bloco c%' LIMIT 1),
    'Oficina de Marcenaria',
    'Serra de corte industrial para projetos de marcenaria e carpintaria. EQUIPAMENTO PERIGOSO - NECESSITA ACOMPANHAMENTO OBRIGATÓRIO.',
    'disponivel',
    false,
    true, -- NECESSITA ACOMPANHAMENTO
    1,
    true,
    NOW(),
    NOW()
),
(
    'Serra Circular de Bancada',
    'SERRA-002', 
    (SELECT id FROM blocos WHERE nome ILIKE '%laboratório%' OR nome ILIKE '%oficina%' OR nome ILIKE '%bloco c%' LIMIT 1),
    'Oficina de Marcenaria',
    'Serra circular de bancada para cortes precisos em madeira. EQUIPAMENTO PERIGOSO - NECESSITA ACOMPANHAMENTO OBRIGATÓRIO.',
    'disponivel',
    false,
    true, -- NECESSITA ACOMPANHAMENTO
    1,
    true,
    NOW(),
    NOW()
),
(
    'Furadeira de Bancada Industrial',
    'FUR-001',
    (SELECT id FROM blocos WHERE nome ILIKE '%laboratório%' OR nome ILIKE '%oficina%' OR nome ILIKE '%bloco c%' LIMIT 1),
    'Oficina Mecânica',
    'Furadeira de bancada industrial para projetos de metalurgia. EQUIPAMENTO PERIGOSO - NECESSITA ACOMPANHAMENTO OBRIGATÓRIO.',
    'disponivel',
    false,
    true, -- NECESSITA ACOMPANHAMENTO
    1,
    true,
    NOW(),
    NOW()
)
ON CONFLICT (patrimonio) DO NOTHING;
