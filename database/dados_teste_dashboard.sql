-- Inserir reservas para hoje e amanhã para testar a dashboard patrimonial
INSERT INTO reservas (
    protocolo, 
    nome_completo, 
    email, 
    telefone,
    siape_rga, 
    data_reserva, 
    hora_inicio, 
    hora_fim, 
    finalidade, 
    laboratorio_id,
    status
) VALUES 
-- Reservas para hoje
(
    '202507300001',
    'Ana Paula Silva',
    'ana.silva@ufgd.edu.br',
    '(67) 99888-7777',
    '987654',
    CURRENT_DATE,
    '08:00:00',
    '10:00:00',
    'Aula Prática de Algoritmos',
    (SELECT id FROM laboratorios WHERE nome = 'Lab. Informática 1'),
    'aprovada'
),
(
    '202507300002',
    'Roberto Santos',
    'roberto.santos@ufgd.edu.br',
    '(67) 98777-6666',
    '456789',
    CURRENT_DATE,
    '10:30:00',
    '12:00:00',
    'Oficina de Excel Avançado',
    (SELECT id FROM laboratorios WHERE nome = 'Lab. Informática 2'),
    'aprovada'
),
(
    '202507300003',
    'Carla Fernandes',
    'carla.fernandes@ufgd.edu.br',
    '(67) 97666-5555',
    '321654',
    CURRENT_DATE,
    '14:00:00',
    '16:00:00',
    'Reunião de Colegiado',
    (SELECT id FROM laboratorios WHERE nome = 'Sala de Reuniões'),
    'aprovada'
),
(
    '202507300004',
    'Diego Marques',
    'diego.marques@ufgd.edu.br',
    '(67) 96555-4444',
    '789123',
    CURRENT_DATE,
    '16:30:00',
    '18:00:00',
    'Aula de Banco de Dados',
    (SELECT id FROM laboratorios WHERE nome = 'Lab. Informática 1'),
    'aprovada'
),
-- Reservas para amanhã
(
    '202507310001',
    'Patrícia Costa',
    'patricia.costa@ufgd.edu.br',
    '(67) 95444-3333',
    '159753',
    CURRENT_DATE + INTERVAL '1 day',
    '07:30:00',
    '09:30:00',
    'Workshop de Python',
    (SELECT id FROM laboratorios WHERE nome = 'Lab. Informática 2'),
    'aprovada'
),
(
    '202507310002',
    'Fernando Lima',
    'fernando.lima@ufgd.edu.br',
    '(67) 94333-2222',
    '357159',
    CURRENT_DATE + INTERVAL '1 day',
    '10:00:00',
    '12:00:00',
    'Defesa de TCC',
    (SELECT id FROM laboratorios WHERE nome = 'Sala de Reuniões'),
    'aprovada'
),
(
    '202507310003',
    'Luciana Oliveira',
    'luciana.oliveira@ufgd.edu.br',
    '(67) 93222-1111',
    '753951',
    CURRENT_DATE + INTERVAL '1 day',
    '14:30:00',
    '17:00:00',
    'Curso de Redes de Computadores',
    (SELECT id FROM laboratorios WHERE nome = 'Lab. Informática 1'),
    'aprovada'
)
ON CONFLICT (protocolo) DO NOTHING;

-- Inserir equipamentos para algumas reservas
INSERT INTO reserva_equipamentos (reserva_id, equipamento_id) VALUES
-- Reservas de hoje
(
    (SELECT id FROM reservas WHERE protocolo = '202507300001'),
    (SELECT id FROM equipamentos WHERE patrimonio = 'PROJ001')
),
(
    (SELECT id FROM reservas WHERE protocolo = '202507300003'),
    (SELECT id FROM equipamentos WHERE patrimonio = 'CAM001')
),
-- Reservas de amanhã
(
    (SELECT id FROM reservas WHERE protocolo = '202507310001'),
    (SELECT id FROM equipamentos WHERE patrimonio = 'NOTE001')
),
(
    (SELECT id FROM reservas WHERE protocolo = '202507310003'),
    (SELECT id FROM equipamentos WHERE patrimonio = 'PROJ001')
)
ON CONFLICT (reserva_id, equipamento_id) DO NOTHING;
