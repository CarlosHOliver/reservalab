-- Script de teste para verificar se as tabelas de reports existem
-- Execute no Supabase SQL Editor

-- Verificar se a tabela reports_ocorrencias existe
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'reports_ocorrencias'
ORDER BY ordinal_position;

-- Se a tabela não existe, criar ela
CREATE TABLE IF NOT EXISTS reports_ocorrencias (
    id SERIAL PRIMARY KEY,
    tipo_eventualidade VARCHAR(100) NOT NULL,
    protocolo_relacionado VARCHAR(20),
    descricao TEXT NOT NULL,
    autor_nome VARCHAR(255) NOT NULL DEFAULT 'Divisão de Proteção Patrimonial',
    autor_ip INET,
    ciente BOOLEAN DEFAULT FALSE,
    ciente_por INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    ciente_em TIMESTAMP WITH TIME ZONE,
    observacoes_gestao TEXT,
    prioridade VARCHAR(20) DEFAULT 'normal',
    status VARCHAR(20) DEFAULT 'aberto',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir um report de teste
INSERT INTO reports_ocorrencias (
    tipo_eventualidade,
    protocolo_relacionado,
    descricao,
    prioridade
) VALUES (
    'nao_compareceu',
    'TEST001',
    'Report de teste para verificar funcionamento do sistema',
    'normal'
) ON CONFLICT DO NOTHING;

-- Verificar dados inseridos
SELECT * FROM reports_ocorrencias LIMIT 5;
