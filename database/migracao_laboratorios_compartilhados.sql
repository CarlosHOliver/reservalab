-- Migração para adicionar campos de uso compartilhado nos laboratórios
-- Execute este script no Supabase SQL Editor

-- Adicionar campos para laboratórios compartilhados
ALTER TABLE laboratorios 
ADD COLUMN IF NOT EXISTS permitir_uso_compartilhado BOOLEAN DEFAULT FALSE;

ALTER TABLE laboratorios 
ADD COLUMN IF NOT EXISTS quantidade_maxima_ocupantes_simultaneos INTEGER DEFAULT 1;

ALTER TABLE laboratorios 
ADD COLUMN IF NOT EXISTS necessita_acompanhamento BOOLEAN DEFAULT FALSE;

-- Comentários para documentar os novos campos
COMMENT ON COLUMN laboratorios.permitir_uso_compartilhado IS 'Se o laboratório permite múltiplas reservas simultâneas';
COMMENT ON COLUMN laboratorios.quantidade_maxima_ocupantes_simultaneos IS 'Número máximo de grupos que podem usar o laboratório simultaneamente';
COMMENT ON COLUMN laboratorios.necessita_acompanhamento IS 'Se o laboratório necessita de acompanhamento de técnico/professor';

-- Atualizar alguns laboratórios de exemplo com uso compartilhado
UPDATE laboratorios 
SET 
    permitir_uso_compartilhado = TRUE,
    quantidade_maxima_ocupantes_simultaneos = 3,
    necessita_acompanhamento = FALSE
WHERE nome LIKE '%Informática%';

-- Exemplo: Laboratório de Engenharia de Fabrica (caso seja adicionado futuramente)
INSERT INTO laboratorios (nome, bloco_id, descricao, capacidade, permitir_uso_compartilhado, quantidade_maxima_ocupantes_simultaneos, necessita_acompanhamento) VALUES 
('Lab. Engenharia de Fábrica', 
 (SELECT id FROM blocos WHERE nome = 'Bloco C - Laboratórios' LIMIT 1), 
 'Laboratório de Engenharia de Fábrica com equipamentos para múltiplos grupos', 
 15, 
 TRUE, 
 3, 
 TRUE)
ON CONFLICT DO NOTHING;
