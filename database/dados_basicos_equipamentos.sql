-- Dados de teste para equipamentos
-- ReservaLAB - FAEN/UFGD

-- Inserir equipamentos de exemplo
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
    'Projetor Multimídia Epson',
    'PROJ-001',
    (SELECT id FROM blocos WHERE nome = 'Bloco C - Laboratórios' LIMIT 1),
    'Lab. Informática 1',
    'Projetor de alta resolução, ideal para apresentações e aulas. Inclui cabo HDMI e VGA.',
    'disponivel',
    false,
    false,
    1,
    true,
    NOW(),
    NOW()
),
(
    'Microscópio Digital Zeiss',
    'MICR-001',
    (SELECT id FROM blocos WHERE nome = 'Bloco C - Laboratórios' LIMIT 1),
    'Lab. Química',
    'Microscópio digital com câmera integrada, zoom de até 1000x. Ideal para análises laboratoriais.',
    'disponivel',
    true,
    true,
    2,
    true,
    NOW(),
    NOW()
),
(
    'Notebook Dell Inspiron',
    'NOTE-001',
    (SELECT id FROM blocos WHERE nome = 'Bloco A - Administrativo' LIMIT 1),
    'Sala de Reuniões',
    'Notebook para apresentações e demonstrações. Intel Core i5, 8GB RAM, SSD 256GB.',
    'disponivel',
    false,
    false,
    1,
    true,
    NOW(),
    NOW()
),
(
    'Equipamento de Som Portátil',
    'SOM-001',
    (SELECT id FROM blocos WHERE nome = 'Bloco B - Salas de Aula' LIMIT 1),
    'Auditório',
    'Sistema de som portátil com microfone sem fio, ideal para eventos e palestras.',
    'disponivel',
    false,
    true,
    1,
    true,
    NOW(),
    NOW()
),
(
    'Câmera Fotográfica Canon',
    'CAM-001',
    (SELECT id FROM blocos WHERE nome = 'Bloco A - Administrativo' LIMIT 1),
    'Secretaria',
    'Câmera DSLR para documentação de eventos e atividades acadêmicas.',
    'em_manutencao',
    false,
    true,
    1,
    true,
    NOW(),
    NOW()
),
(
    'Balança de Precisão',
    'BAL-001',
    (SELECT id FROM blocos WHERE nome = 'Bloco C - Laboratórios' LIMIT 1),
    'Lab. Química',
    'Balança analítica de alta precisão para experimentos químicos.',
    'disponivel',
    true,
    true,
    2,
    true,
    NOW(),
    NOW()
),
(
    'Impressora 3D Ender',
    'IMP3D-001',
    (SELECT id FROM blocos WHERE nome = 'Bloco C - Laboratórios' LIMIT 1),
    'Lab. Informática 2',
    'Impressora 3D para prototipagem e projetos educacionais.',
    'inativo',
    false,
    true,
    1,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (patrimonio) DO NOTHING;
