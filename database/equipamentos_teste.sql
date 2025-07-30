-- Dados adicionais de equipamentos para teste da página de equipamentos
-- Execute este script no Supabase para ter mais equipamentos para testar

-- Inserir mais equipamentos variados
INSERT INTO equipamentos (nome, patrimonio, bloco_id, local, descricao, permitir_uso_compartilhado, necessita_acompanhamento, status) VALUES 
-- Bloco C - Laboratórios
('Projetor BenQ', 'PROJ002', (SELECT id FROM blocos WHERE nome = 'Bloco C - Laboratórios'), 'Lab. Informática 2', 'Projetor de alta resolução', true, false, 'disponivel'),
('Notebook Lenovo', 'NOTE002', (SELECT id FROM blocos WHERE nome = 'Bloco C - Laboratórios'), 'Lab. Informática 1', 'Notebook para demonstrações', true, true, 'disponivel'),
('Impressora HP LaserJet', 'IMP001', (SELECT id FROM blocos WHERE nome = 'Bloco C - Laboratórios'), 'Lab. Informática 1', 'Impressora laser monocromática', false, false, 'disponivel'),
('Scanner Epson', 'SCAN001', (SELECT id FROM blocos WHERE nome = 'Bloco C - Laboratórios'), 'Lab. Informática 2', 'Scanner de documentos A4', true, false, 'disponivel'),
('Tablet Samsung', 'TAB001', (SELECT id FROM blocos WHERE nome = 'Bloco C - Laboratórios'), 'Lab. Informática 1', 'Tablet para apresentações móveis', true, true, 'disponivel'),
('Lousa Digital', 'LOUS001', (SELECT id FROM blocos WHERE nome = 'Bloco C - Laboratórios'), 'Lab. Informática 1', 'Lousa digital interativa', false, true, 'disponivel'),
('Caixa de Som JBL', 'SOM001', (SELECT id FROM blocos WHERE nome = 'Bloco C - Laboratórios'), 'Lab. Informática 2', 'Sistema de áudio portátil', true, false, 'disponivel'),
('Microfone Sem Fio', 'MIC001', (SELECT id FROM blocos WHERE nome = 'Bloco C - Laboratórios'), 'Lab. Informática 1', 'Microfone sem fio para apresentações', true, false, 'disponivel'),

-- Bloco A - Administrativa
('Projetor Sony', 'PROJ003', (SELECT id FROM blocos WHERE nome = 'Bloco A - Administrativa'), 'Sala de Reuniões', 'Projetor para reuniões', true, false, 'disponivel'),
('Notebook HP', 'NOTE003', (SELECT id FROM blocos WHERE nome = 'Bloco A - Administrativa'), 'Sala de Reuniões', 'Notebook para apresentações', true, false, 'disponivel'),
('Televisão 55"', 'TV001', (SELECT id FROM blocos WHERE nome = 'Bloco A - Administrativa'), 'Sala de Reuniões', 'Smart TV para apresentações', false, false, 'disponivel'),
('Webcam Logitech', 'WEB001', (SELECT id FROM blocos WHERE nome = 'Bloco A - Administrativa'), 'Sala de Reuniões', 'Webcam para videoconferências', true, false, 'disponivel'),

-- Bloco B - Salas de Aula  
('Projetor ViewSonic', 'PROJ004', (SELECT id FROM blocos WHERE nome = 'Bloco B - Salas de Aula'), 'Sala 101', 'Projetor para salas de aula', true, false, 'disponivel'),
('Caixa de Som Portátil', 'SOM002', (SELECT id FROM blocos WHERE nome = 'Bloco B - Salas de Aula'), 'Sala 102', 'Sistema de áudio para aulas', true, false, 'disponivel'),
('Notebook Acer', 'NOTE004', (SELECT id FROM blocos WHERE nome = 'Bloco B - Salas de Aula'), 'Sala 103', 'Notebook para uso dos professores', true, true, 'disponivel'),

-- Equipamentos em manutenção
('Impressora Multifuncional', 'IMP002', (SELECT id FROM blocos WHERE nome = 'Bloco C - Laboratórios'), 'Lab. Informática 2', 'Impressora multifuncional colorida', false, false, 'em_manutencao'),
('Projetor Antigo', 'PROJ005', (SELECT id FROM blocos WHERE nome = 'Bloco B - Salas de Aula'), 'Sala 104', 'Projetor em manutenção', true, false, 'em_manutencao'),

-- Equipamentos inativos
('Computador Desktop', 'COMP001', (SELECT id FROM blocos WHERE nome = 'Bloco C - Laboratórios'), 'Depósito', 'Computador desktop obsoleto', false, false, 'inativo')

ON CONFLICT (patrimonio) DO NOTHING;

-- Atualizar alguns equipamentos existentes com mais informações
UPDATE equipamentos SET 
    permitir_uso_compartilhado = true,
    necessita_acompanhamento = false,
    quantidade_maxima_ocupantes = 1
WHERE patrimonio = 'PROJ001';

UPDATE equipamentos SET 
    permitir_uso_compartilhado = true,
    necessita_acompanhamento = true,
    quantidade_maxima_ocupantes = 1
WHERE patrimonio = 'NOTE001';

UPDATE equipamentos SET 
    permitir_uso_compartilhado = false,
    necessita_acompanhamento = true,
    quantidade_maxima_ocupantes = 1
WHERE patrimonio = 'CAM001';
