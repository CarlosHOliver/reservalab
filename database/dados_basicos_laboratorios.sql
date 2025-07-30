-- Dados básicos para testar o sistema de laboratórios
-- ReservaLAB - FAEN/UFGD

-- Inserir blocos básicos se não existirem
INSERT INTO blocos (nome, created_at, updated_at) VALUES 
('Bloco A - Administrativo', NOW(), NOW()),
('Bloco B - Salas de Aula', NOW(), NOW()),
('Bloco C - Laboratórios', NOW(), NOW()),
('Bloco D - Biblioteca', NOW(), NOW())
ON CONFLICT (nome) DO NOTHING;

-- Inserir laboratórios de exemplo
INSERT INTO laboratorios (
    nome, 
    bloco_id, 
    descricao, 
    capacidade, 
    permitir_uso_compartilhado, 
    necessita_acompanhamento,
    quantidade_maxima_ocupantes_simultaneos,
    ativo,
    created_at, 
    updated_at
) VALUES 
(
    'Laboratório de Informática 1',
    (SELECT id FROM blocos WHERE nome = 'Bloco C - Laboratórios' LIMIT 1),
    'Laboratório equipado com 30 computadores, projetor e ar condicionado. Ideal para aulas de programação e informática.',
    30,
    true,
    false,
    2,
    true,
    NOW(),
    NOW()
),
(
    'Laboratório de Informática 2',
    (SELECT id FROM blocos WHERE nome = 'Bloco C - Laboratórios' LIMIT 1),
    'Laboratório com 25 computadores de última geração, equipado com software especializado.',
    25,
    true,
    false,
    2,
    true,
    NOW(),
    NOW()
),
(
    'Sala de Reuniões Executiva',
    (SELECT id FROM blocos WHERE nome = 'Bloco A - Administrativo' LIMIT 1),
    'Sala de reuniões com mesa para 12 pessoas, projetor, sistema de videoconferência e ar condicionado.',
    12,
    false,
    false,
    1,
    true,
    NOW(),
    NOW()
),
(
    'Laboratório de Química',
    (SELECT id FROM blocos WHERE nome = 'Bloco C - Laboratórios' LIMIT 1),
    'Laboratório equipado com bancadas, capelas, equipamentos de segurança e materiais para experimentos químicos.',
    20,
    true,
    true,
    3,
    true,
    NOW(),
    NOW()
),
(
    'Auditório Pequeno',
    (SELECT id FROM blocos WHERE nome = 'Bloco B - Salas de Aula' LIMIT 1),
    'Auditório com capacidade para 50 pessoas, equipado com sistema de som, projetor e ar condicionado.',
    50,
    false,
    false,
    1,
    true,
    NOW(),
    NOW()
)
ON CONFLICT DO NOTHING;
