-- Adição de tabela de Reports/Ocorrências ao Schema
-- Para ser executado no Supabase

-- Tabela de Reports/Ocorrências
CREATE TABLE IF NOT EXISTS reports_ocorrencias (
    id SERIAL PRIMARY KEY,
    tipo_eventualidade VARCHAR(100) NOT NULL, -- nao_compareceu, problema_acesso, equipamento_danificado, uso_inadequado, outros
    protocolo_relacionado VARCHAR(20), -- Protocolo da reserva se relacionado
    descricao TEXT NOT NULL,
    autor_nome VARCHAR(255) NOT NULL DEFAULT 'Divisão de Proteção Patrimonial',
    autor_ip INET,
    ciente BOOLEAN DEFAULT FALSE,
    ciente_por INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    ciente_em TIMESTAMP WITH TIME ZONE,
    observacoes_gestao TEXT,
    prioridade VARCHAR(20) DEFAULT 'normal', -- baixa, normal, alta, urgente
    status VARCHAR(20) DEFAULT 'aberto', -- aberto, em_analise, resolvido, arquivado
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports_ocorrencias(status);
CREATE INDEX IF NOT EXISTS idx_reports_ciente ON reports_ocorrencias(ciente);
CREATE INDEX IF NOT EXISTS idx_reports_protocolo ON reports_ocorrencias(protocolo_relacionado);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports_ocorrencias(created_at);

-- Comentários para documentação
COMMENT ON TABLE reports_ocorrencias IS 'Tabela para armazenar reports/ocorrências enviados pela Divisão de Proteção Patrimonial';
COMMENT ON COLUMN reports_ocorrencias.tipo_eventualidade IS 'Tipo da eventualidade: nao_compareceu, problema_acesso, equipamento_danificado, uso_inadequado, outros';
COMMENT ON COLUMN reports_ocorrencias.protocolo_relacionado IS 'Protocolo da reserva relacionada, se aplicável';
COMMENT ON COLUMN reports_ocorrencias.autor_nome IS 'Nome do autor do report (padrão: Divisão de Proteção Patrimonial)';
COMMENT ON COLUMN reports_ocorrencias.ciente IS 'Se algum gestor já tomou ciência do report';
COMMENT ON COLUMN reports_ocorrencias.ciente_por IS 'ID do usuário que marcou ciência';
COMMENT ON COLUMN reports_ocorrencias.prioridade IS 'Prioridade do report: baixa, normal, alta, urgente';
COMMENT ON COLUMN reports_ocorrencias.status IS 'Status do report: aberto, em_analise, resolvido, arquivado';
