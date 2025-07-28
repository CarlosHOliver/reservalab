-- Script para corrigir definitivamente a senha do admin
-- Execute este script no Supabase SQL Editor

-- Hash correto para a senha "admin123" (gerado com bcryptjs)
UPDATE usuarios 
SET senha_hash = '$2b$10$FSxh898w1PJHdLDGR5Uc2ejRijCbebyhy7VGDZOONL6o79sOa5VX6',
    updated_at = NOW()
WHERE login = 'admin';

-- Verificar se a atualização foi bem-sucedida
SELECT 
    login,
    nome,
    'Senha atualizada para: admin123' as status,
    updated_at
FROM usuarios 
WHERE login = 'admin';

-- ✅ CREDENCIAIS CORRETAS APÓS ESTA ATUALIZAÇÃO:
-- Login: admin
-- Senha: admin123
