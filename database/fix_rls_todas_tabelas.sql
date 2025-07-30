-- Script para corrigir políticas de RLS (Row Level Security) para TODAS as tabelas
-- Execute este script no Supabase SQL Editor para resolver todos os problemas de RLS

-- ==========================================
-- VERIFICAR STATUS ATUAL DE TODAS AS TABELAS
-- ==========================================
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('blocos', 'laboratorios', 'equipamentos', 'usuarios', 'reservas', 'reports');

-- ==========================================
-- OPÇÃO 1: DESABILITAR RLS EM TODAS AS TABELAS (MAIS SIMPLES)
-- ==========================================

-- Desabilitar RLS para blocos
ALTER TABLE blocos DISABLE ROW LEVEL SECURITY;

-- Desabilitar RLS para laboratórios
ALTER TABLE laboratorios DISABLE ROW LEVEL SECURITY;

-- Desabilitar RLS para equipamentos
ALTER TABLE equipamentos DISABLE ROW LEVEL SECURITY;

-- Desabilitar RLS para usuários
ALTER TABLE usuarios DISABLE ROW LEVEL SECURITY;

-- Desabilitar RLS para reservas
ALTER TABLE reservas DISABLE ROW LEVEL SECURITY;

-- Desabilitar RLS para reports (se existir)
ALTER TABLE reports DISABLE ROW LEVEL SECURITY;

-- ==========================================
-- VERIFICAR SE FOI APLICADO
-- ==========================================
SELECT 
    tablename,
    CASE 
        WHEN rowsecurity = true THEN '🔒 RLS ATIVADO'
        ELSE '🔓 RLS DESATIVADO'
    END as status_rls
FROM pg_tables 
WHERE tablename IN ('blocos', 'laboratorios', 'equipamentos', 'usuarios', 'reservas', 'reports')
ORDER BY tablename;

-- ==========================================
-- TESTES DE INSERÇÃO PARA VERIFICAR SE FUNCIONOU
-- ==========================================

-- Teste 1: Inserir bloco
-- INSERT INTO blocos (nome) VALUES ('Bloco Teste RLS');

-- Teste 2: Inserir laboratório
-- INSERT INTO laboratorios (nome, bloco_id, descricao, capacidade, ativo) 
-- VALUES ('Lab Teste RLS', 1, 'Teste de RLS', 25, true);

-- Teste 3: Inserir equipamento
-- INSERT INTO equipamentos (nome, patrimonio, bloco_id, local, status, ativo) 
-- VALUES ('Equip Teste RLS', 'RLS-001', 1, 'Teste', 'disponivel', true);

-- ==========================================
-- ALTERNATIVA: OPÇÃO 2 - CRIAR POLÍTICAS PERMISSIVAS (MAIS SEGURA)
-- ==========================================
-- Execute apenas se quiser manter RLS ativo com políticas permissivas

/*
-- Reabilitar RLS
ALTER TABLE blocos ENABLE ROW LEVEL SECURITY;
ALTER TABLE laboratorios ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservas ENABLE ROW LEVEL SECURITY;

-- Criar políticas permissivas para blocos
CREATE POLICY "Permitir todas operações blocos" ON blocos
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Criar políticas permissivas para laboratórios
CREATE POLICY "Permitir todas operações laboratórios" ON laboratorios
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Criar políticas permissivas para equipamentos
CREATE POLICY "Permitir todas operações equipamentos" ON equipamentos
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Criar políticas permissivas para usuários
CREATE POLICY "Permitir todas operações usuários" ON usuarios
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Criar políticas permissivas para reservas
CREATE POLICY "Permitir todas operações reservas" ON reservas
    FOR ALL TO authenticated USING (true) WITH CHECK (true);
*/

-- ==========================================
-- LIMPEZA DE POLÍTICAS EXISTENTES (se necessário)
-- ==========================================
-- Execute apenas se houver políticas conflitantes

/*
-- Remover políticas existentes de blocos
DROP POLICY IF EXISTS "Permitir todas operações blocos" ON blocos;
DROP POLICY IF EXISTS "Permitir inserção de blocos" ON blocos;
DROP POLICY IF EXISTS "Permitir leitura de blocos" ON blocos;

-- Remover políticas existentes de laboratórios
DROP POLICY IF EXISTS "Permitir todas operações laboratórios" ON laboratorios;
DROP POLICY IF EXISTS "Permitir inserção de laboratórios" ON laboratorios;
DROP POLICY IF EXISTS "Permitir leitura de laboratórios" ON laboratorios;

-- Remover políticas existentes de equipamentos
DROP POLICY IF EXISTS "Permitir todas operações equipamentos" ON equipamentos;
DROP POLICY IF EXISTS "Permitir inserção de equipamentos" ON equipamentos;
DROP POLICY IF EXISTS "Permitir leitura de equipamentos" ON equipamentos;
*/

-- ==========================================
-- RESULTADO FINAL
-- ==========================================
SELECT 
    '✅ Script executado com sucesso!' as resultado,
    'Todas as tabelas agora permitem inserções sem restrições de RLS' as descricao;
