-- Script para criar usuário portaria para testes
-- Execute este script no Supabase SQL Editor

-- Primeiro, verificar se o usuário já existe
DO $$
BEGIN
    -- Inserir usuário portaria se não existir
    IF NOT EXISTS (SELECT 1 FROM usuarios WHERE login = 'portaria') THEN
        INSERT INTO usuarios (
            nome,
            login,
            email,
            senha_hash,
            perfil,
            ativo
        ) VALUES (
            'Divisão de Proteção Patrimonial',
            'portaria',
            'patrimonio@faen.ufgd.edu.br',
            '$2b$10$rIQklMoKHhS2K3/tEr7bHOQ7.Rz5hW1Y1LZmZQE/n8y2V5sEf.O6G', -- Hash para "patrimonio123"
            'gestor',
            true
        );
        
        RAISE NOTICE 'Usuário portaria criado com sucesso!';
    ELSE
        RAISE NOTICE 'Usuário portaria já existe.';
    END IF;
END
$$;
