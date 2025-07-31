-- Debug para verificar os status dos equipamentos no banco de dados
SELECT 
    id,
    nome,
    patrimonio,
    status,
    length(status) as status_length,
    ascii(status) as primeiro_char_ascii,
    CASE 
        WHEN status = 'disponivel' THEN 'MATCH: disponivel'
        WHEN status = 'em_manutencao' THEN 'MATCH: em_manutencao'
        WHEN status = 'inativo' THEN 'MATCH: inativo'
        WHEN status = 'ocupado' THEN 'MATCH: ocupado'
        WHEN status = 'reservado' THEN 'MATCH: reservado'
        ELSE 'NO MATCH: ' || status
    END as status_match
FROM equipamentos
ORDER BY nome;

-- Verificar status únicos
SELECT DISTINCT 
    status,
    length(status) as comprimento,
    COUNT(*) as quantidade
FROM equipamentos
GROUP BY status, length(status)
ORDER BY status;
