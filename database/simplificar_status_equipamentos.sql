-- Simplificar status dos equipamentos para apenas 3 valores
-- Execute este script no Supabase SQL Editor

-- Resetar todos para disponível primeiro
UPDATE equipamentos SET status = 'disponivel' WHERE id > 0;

-- Alguns em manutenção
UPDATE equipamentos 
SET status = 'em_manutencao', updated_at = NOW()
WHERE patrimonio IN ('32897', '42044', '32807');

-- Alguns inativos
UPDATE equipamentos 
SET status = 'inativo', updated_at = NOW()
WHERE patrimonio IN ('123456', '21622');

-- Verificar resultado final
SELECT 
    status,
    COUNT(*) as quantidade
FROM equipamentos
GROUP BY status
ORDER BY status;
