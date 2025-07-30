-- Migração para adicionar suporte a reservas criadas por admin/gestor
-- Data: 30/07/2025
-- Descrição: Adiciona coluna para identificar reservas criadas internamente

-- Adicionar coluna criado_por_admin na tabela reservas
ALTER TABLE reservas 
ADD COLUMN IF NOT EXISTS criado_por_admin BOOLEAN DEFAULT FALSE;

-- Comentário explicativo
COMMENT ON COLUMN reservas.criado_por_admin IS 'Indica se a reserva foi criada diretamente por um administrador ou gestor (true) ou pelo sistema público (false)';

-- Criar índice para performance em consultas
CREATE INDEX IF NOT EXISTS idx_reservas_criado_por_admin ON reservas(criado_por_admin);

-- Atualizar reservas existentes para false (foram criadas pelo sistema público)
UPDATE reservas 
SET criado_por_admin = FALSE 
WHERE criado_por_admin IS NULL;

-- Exemplo de consulta para verificar
-- SELECT COUNT(*) as total_publicas FROM reservas WHERE criado_por_admin = FALSE;
-- SELECT COUNT(*) as total_admin FROM reservas WHERE criado_por_admin = TRUE;
