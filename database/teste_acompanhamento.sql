-- Teste da funcionalidade de acompanhamento
-- ReservaLAB - FAEN/UFGD

-- 1. Verificar se há equipamentos que necessitam acompanhamento
SELECT 
    nome,
    patrimonio,
    necessita_acompanhamento,
    local,
    status
FROM equipamentos 
WHERE necessita_acompanhamento = true 
AND ativo = true 
AND status = 'disponivel';

-- 2. Verificar se há laboratórios que necessitam acompanhamento  
SELECT 
    nome,
    necessita_acompanhamento,
    descricao
FROM laboratorios 
WHERE necessita_acompanhamento = true 
AND ativo = true;

-- 3. Se não houver equipamentos, inserir dados de teste
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
) 
SELECT 
    'Serra de Corte Industrial (TESTE)',
    'SERRA-TEST-001',
    id,
    'Laboratório de Testes',
    'EQUIPAMENTO DE TESTE - Serra de corte que necessita acompanhamento obrigatório.',
    'disponivel',
    false,
    true, -- NECESSITA ACOMPANHAMENTO
    1,
    true,
    NOW(),
    NOW()
FROM blocos 
WHERE nome ILIKE '%bloco%' 
LIMIT 1
ON CONFLICT (patrimonio) DO NOTHING;
