-- Script para atualizar senhas existentes de texto puro para hash bcrypt
-- Execute este script apenas se já tiver usuários com senhas em texto puro no banco

-- ATENÇÃO: Este script atualiza as senhas dos usuários padrão para usar hash bcrypt
-- Se você já executou o schema principal, este script não é necessário
-- IMPORTANTE: As senhas padrão devem ser alteradas imediatamente após a configuração inicial

-- Atualizar senhas existentes para hash bcrypt (apenas para configuração inicial)
-- O administrador deve alterar estas senhas imediatamente após o primeiro acesso
UPDATE usuarios SET senha_hash = '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' WHERE login = 'admin' AND senha_hash = 'admin123';
UPDATE usuarios SET senha_hash = '$2b$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUzTOmCESa' WHERE login = 'gestor' AND senha_hash = 'gestor123';
UPDATE usuarios SET senha_hash = '$2b$10$N9qo8uLOickgx2ZMRZoMye.fgsuzUzpPUcE.FXr/i5Gm6UhE3sNAq' WHERE login = 'carlos' AND senha_hash = 'carlos123';

-- Verificar se as atualizações foram bem-sucedidas
SELECT login, 
       CASE 
           WHEN senha_hash LIKE '$2b$%' THEN 'Hash Bcrypt (Seguro)'
           ELSE 'Texto Puro (INSEGURO)'
       END as tipo_senha,
       LENGTH(senha_hash) as tamanho_hash
FROM usuarios;

-- IMPORTANTE: 
-- - Hashes bcrypt sempre começam com '$2b$' e têm 60 caracteres
-- - Senhas em texto puro terão menos caracteres e não começarão com '$2b$'
-- - ALTERE AS SENHAS PADRÃO IMEDIATAMENTE APÓS A CONFIGURAÇÃO INICIAL
-- - NUNCA EXPONHA SENHAS OU HASHES EM CÓDIGO DE PRODUÇÃO
