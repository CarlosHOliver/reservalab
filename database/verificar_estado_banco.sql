-- SCRIPT DE VERIFICAÇÃO - Execute no Supabase SQL Editor
-- Este script verifica se você precisa executar os schemas

-- 1. Verificar se as tabelas existem
SELECT 
    table_name,
    CASE 
        WHEN table_name IS NOT NULL THEN '✅ Existe'
        ELSE '❌ Não existe'
    END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('reservas', 'usuarios', 'equipamentos', 'laboratorios', 'blocos')
ORDER BY table_name;

-- 2. Verificar se os usuários administrativos existem
SELECT 
    login,
    perfil,
    CASE 
        WHEN senha_hash LIKE '$2b$%' THEN '✅ Hash Bcrypt'
        ELSE '⚠️ Texto Puro - PRECISA ATUALIZAR'
    END as status_senha
FROM usuarios 
WHERE login IN ('admin', 'gestor', 'carlos')
ORDER BY login;

-- 3. Verificar se a função de protocolo existe
SELECT 
    routine_name,
    '✅ Função existe' as status
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name = 'gerar_proximo_protocolo';

-- INTERPRETAÇÃO DOS RESULTADOS:
-- - Se as tabelas NÃO existem: Execute supabase_schema.sql
-- - Se as tabelas existem MAS há erros: Execute fix_protocolo_ambiguity.sql  
-- - Se senhas estão em texto puro: Execute update_password_hashes.sql
