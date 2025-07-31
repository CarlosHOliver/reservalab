-- Atualizar alguns equipamentos com status diferentes para testar o dashboard
-- Execute este script no Supabase SQL Editor

-- Equipamentos em manutenção
UPDATE equipamentos 
SET status = 'em_manutencao', updated_at = NOW()
WHERE patrimonio IN ('32897', '42044', '32807');

-- Equipamentos inativos
UPDATE equipamentos 
SET status = 'inativo', updated_at = NOW()
WHERE patrimonio IN ('123456', '21622');

-- Equipamentos ocupados
UPDATE equipamentos 
SET status = 'ocupado', updated_at = NOW()
WHERE patrimonio IN ('PAT001', 'U2FAENPC');

-- Equipamentos reservados
UPDATE equipamentos 
SET status = 'reservado', updated_at = NOW()
WHERE patrimonio IN ('29238', '37743');

-- Verificar os status atualizados
SELECT 
    nome,
    patrimonio,
    status,
    local
FROM equipamentos
WHERE status != 'disponivel'
ORDER BY status, nome;
