-- Script para criar usuários administrativos
-- Execute no Supabase SQL Editor

-- Primeiro, verificar se a tabela usuarios existe
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'usuarios';

-- Se a tabela não existir, criar a estrutura básica
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    login VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    perfil VARCHAR(50) DEFAULT 'gestor',
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir usuários administrativos com senhas em hash bcrypt
INSERT INTO usuarios (nome, login, email, senha_hash, perfil, ativo) VALUES 
    ('Administrador do Sistema', 'admin', 'admin@faen.ufgd.edu.br', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'administrador', true),
    ('Gestor FAEN', 'gestor', 'gestor@faen.ufgd.edu.br', '$2b$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUzTOmCESa', 'gestor', true),
    ('Carlos Henrique', 'carlos', 'carlos.oliveira@ufgd.edu.br', '$2b$10$N9qo8uLOickgx2ZMRZoMye.fgsuzUzpPUcE.FXr/i5Gm6UhE3sNAq', 'administrador', true)
ON CONFLICT (login) DO UPDATE SET
    senha_hash = EXCLUDED.senha_hash,
    nome = EXCLUDED.nome,
    email = EXCLUDED.email,
    perfil = EXCLUDED.perfil,
    ativo = EXCLUDED.ativo;

-- Verificar se os usuários foram criados
SELECT 
    login,
    nome,
    perfil,
    CASE 
        WHEN senha_hash LIKE '$2b$%' THEN '✅ Hash Bcrypt'
        ELSE '⚠️ Problema'
    END as status_senha,
    ativo
FROM usuarios 
WHERE login IN ('admin', 'gestor', 'carlos')
ORDER BY login;

-- Ativar RLS (Row Level Security) na tabela usuarios
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura de usuários (necessário para login)
DROP POLICY IF EXISTS "Permitir leitura de usuários para autenticação" ON usuarios;
CREATE POLICY "Permitir leitura de usuários para autenticação" 
ON usuarios FOR SELECT USING (true);

-- Política para permitir inserção de usuários
DROP POLICY IF EXISTS "Permitir inserção de usuários" ON usuarios;
CREATE POLICY "Permitir inserção de usuários" 
ON usuarios FOR INSERT WITH CHECK (true);

-- Política para permitir atualização de usuários
DROP POLICY IF EXISTS "Permitir atualização de usuários" ON usuarios;
CREATE POLICY "Permitir atualização de usuários" 
ON usuarios FOR UPDATE USING (true);

-- Mostrar status final
SELECT 'Usuários administrativos criados com sucesso!' as status;
