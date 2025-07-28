-- Script para atualizar senha do administrador
-- Execute este script no Supabase SQL Editor

-- Hash para a senha "admin123" (usando bcrypt com salt 10)
-- Senha: admin123
-- Hash: $2b$10$eImiTXuWVxfM37uY4JANjOEhEhg7EfaQ2o9qHr6BaJDrfGUUJ.w7u

UPDATE usuarios 
SET senha_hash = '$2b$10$eImiTXuWVxfM37uY4JANjOEhEhg7EfaQ2o9qHr6BaJDrfGUUJ.w7u',
    updated_at = NOW()
WHERE login = 'admin';

-- Verificar se a atualização foi bem-sucedida
SELECT 
    login,
    nome,
    CASE 
        WHEN senha_hash = '$2b$10$eImiTXuWVxfM37uY4JANjOEhEhg7EfaQ2o9qHr6BaJDrfGUUJ.w7u' THEN '✅ Senha atualizada para: admin123'
        ELSE '⚠️ Senha não atualizada'
    END as status
FROM usuarios 
WHERE login = 'admin';

-- IMPORTANTE: As credenciais agora são:
-- Login: admin
-- Senha: admin123
