-- Script para corrigir políticas de RLS (Row Level Security) para equipamentos
-- Execute este script no Supabase SQL Editor

-- Verificar se RLS está ativado na tabela equipamentos
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'equipamentos';

-- Desabilitar RLS temporariamente para permitir inserções (OPÇÃO 1 - Mais simples)
ALTER TABLE equipamentos DISABLE ROW LEVEL SECURITY;

-- OU (OPÇÃO 2 - Mais segura) - Criar políticas específicas
-- Primeiro, habilitar RLS se não estiver
-- ALTER TABLE equipamentos ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção para usuários autenticados
-- CREATE POLICY "Permitir inserção de equipamentos" ON equipamentos
--     FOR INSERT
--     TO authenticated
--     WITH CHECK (true);

-- Política para permitir leitura para usuários autenticados
-- CREATE POLICY "Permitir leitura de equipamentos" ON equipamentos
--     FOR SELECT
--     TO authenticated
--     USING (true);

-- Política para permitir atualização para usuários autenticados
-- CREATE POLICY "Permitir atualização de equipamentos" ON equipamentos
--     FOR UPDATE
--     TO authenticated
--     USING (true)
--     WITH CHECK (true);

-- Política para permitir exclusão para usuários autenticados
-- CREATE POLICY "Permitir exclusão de equipamentos" ON equipamentos
--     FOR DELETE
--     TO authenticated
--     USING (true);

-- Verificar políticas existentes
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'equipamentos';

-- Testar inserção simples após executar o script
-- INSERT INTO equipamentos (nome, patrimonio, bloco_id, local, status, ativo) 
-- VALUES ('Teste Manual', 'TEST-001', 1, 'Teste', 'disponivel', true);
