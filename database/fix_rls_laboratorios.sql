-- Script para corrigir políticas de RLS (Row Level Security) para laboratórios
-- Execute este script no Supabase SQL Editor

-- Verificar se RLS está ativado na tabela laboratorios
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'laboratorios';

-- Desabilitar RLS temporariamente para permitir inserções (OPÇÃO 1 - Mais simples)
ALTER TABLE laboratorios DISABLE ROW LEVEL SECURITY;

-- OU (OPÇÃO 2 - Mais segura) - Criar políticas específicas
-- Primeiro, habilitar RLS se não estiver
-- ALTER TABLE laboratorios ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção para usuários autenticados
-- CREATE POLICY "Permitir inserção de laboratórios" ON laboratorios
--     FOR INSERT
--     TO authenticated
--     WITH CHECK (true);

-- Política para permitir leitura para usuários autenticados
-- CREATE POLICY "Permitir leitura de laboratórios" ON laboratorios
--     FOR SELECT
--     TO authenticated
--     USING (true);

-- Política para permitir atualização para usuários autenticados
-- CREATE POLICY "Permitir atualização de laboratórios" ON laboratorios
--     FOR UPDATE
--     TO authenticated
--     USING (true)
--     WITH CHECK (true);

-- Política para permitir exclusão para usuários autenticados
-- CREATE POLICY "Permitir exclusão de laboratórios" ON laboratorios
--     FOR DELETE
--     TO authenticated
--     USING (true);

-- Verificar políticas existentes
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'laboratorios';

-- Testar inserção simples após executar o script
-- INSERT INTO laboratorios (nome, bloco_id, descricao, capacidade, ativo) 
-- VALUES ('Laboratório Teste', 1, 'Teste de inserção', 20, true);
