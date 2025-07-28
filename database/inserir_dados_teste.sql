-- Dados de teste para ReservaLAB
-- Execute este script no Supabase para ter dados para testar

-- Inserir blocos
INSERT INTO blocos (nome) VALUES 
('Bloco A - Administrativa'),
('Bloco B - Salas de Aula'),
('Bloco C - Laboratórios')
ON CONFLICT (nome) DO NOTHING;

-- Inserir laboratórios
INSERT INTO laboratorios (nome, bloco_id, descricao, capacidade) VALUES 
('Lab. Informática 1', (SELECT id FROM blocos WHERE nome = 'Bloco C - Laboratórios'), 'Laboratório de Informática com 30 computadores', 30),
('Lab. Informática 2', (SELECT id FROM blocos WHERE nome = 'Bloco C - Laboratórios'), 'Laboratório de Informática com 25 computadores', 25),
('Sala de Reuniões', (SELECT id FROM blocos WHERE nome = 'Bloco A - Administrativa'), 'Sala de reuniões com projetor', 20)
ON CONFLICT DO NOTHING;

-- Inserir alguns equipamentos
INSERT INTO equipamentos (nome, patrimonio, bloco_id, local, descricao) VALUES 
('Projetor Epson', 'PROJ001', (SELECT id FROM blocos WHERE nome = 'Bloco C - Laboratórios'), 'Lab. Informática 1', 'Projetor para apresentações'),
('Notebook Dell', 'NOTE001', (SELECT id FROM blocos WHERE nome = 'Bloco C - Laboratórios'), 'Lab. Informática 2', 'Notebook para demonstrações'),
('Câmera Fotográfica', 'CAM001', (SELECT id FROM blocos WHERE nome = 'Bloco A - Administrativa'), 'Sala de Reuniões', 'Câmera para eventos')
ON CONFLICT (patrimonio) DO NOTHING;

-- Inserir reservas de teste
INSERT INTO reservas (
    protocolo, 
    nome_completo, 
    siape_rga, 
    email, 
    telefone,
    data_reserva, 
    hora_inicio, 
    hora_fim, 
    finalidade, 
    laboratorio_id,
    status
) VALUES 
(
    '202507280001',
    'João da Silva Santos',
    '123456',
    'joao.santos@ufgd.edu.br',
    '(67) 99999-9999',
    CURRENT_DATE + INTERVAL '1 day',
    '08:00:00',
    '10:00:00',
    'Aula de Programação Básica para turma do 1º semestre',
    (SELECT id FROM laboratorios WHERE nome = 'Lab. Informática 1'),
    'aprovada'
),
(
    '202507280002',
    'Maria Oliveira Costa',
    '654321',
    'maria.costa@ufgd.edu.br',
    '(67) 88888-8888',
    CURRENT_DATE + INTERVAL '2 days',
    '14:00:00',
    '16:00:00',
    'Workshop de Desenvolvimento Web',
    (SELECT id FROM laboratorios WHERE nome = 'Lab. Informática 2'),
    'pendente'
),
(
    '202507280003',
    'Carlos Henrique Oliveira',
    '789012',
    'carlos.oliveira@ufgd.edu.br',
    '(67) 77777-7777',
    CURRENT_DATE + INTERVAL '3 days',
    '10:00:00',
    '12:00:00',
    'Reunião de Planejamento do Sistema ReservaLAB',
    (SELECT id FROM laboratorios WHERE nome = 'Sala de Reuniões'),
    'aprovada'
)
ON CONFLICT (protocolo) DO NOTHING;

-- Inserir equipamentos nas reservas (relação N:N)
INSERT INTO reserva_equipamentos (reserva_id, equipamento_id) VALUES
(
    (SELECT id FROM reservas WHERE protocolo = '202507280001'),
    (SELECT id FROM equipamentos WHERE patrimonio = 'PROJ001')
),
(
    (SELECT id FROM reservas WHERE protocolo = '202507280002'),
    (SELECT id FROM equipamentos WHERE patrimonio = 'NOTE001')
),
(
    (SELECT id FROM reservas WHERE protocolo = '202507280003'),
    (SELECT id FROM equipamentos WHERE patrimonio = 'CAM001')
)
ON CONFLICT (reserva_id, equipamento_id) DO NOTHING;
