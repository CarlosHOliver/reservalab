-- Criar usuário administrativo simples para testes
-- Senha: admin123

INSERT INTO usuarios (nome, login, email, senha_hash, perfil, ativo, created_at, updated_at) VALUES 
('Administrador Teste', 'admin', 'admin@teste.local', '$2b$10$CwTycUXWue0Thq9StjUM0uJ4/jMNF84uGGxZ7fHIpHBuGkRdz.i.2', 'administrador', true, NOW(), NOW())
ON CONFLICT (login) DO UPDATE SET
    nome = EXCLUDED.nome,
    email = EXCLUDED.email,
    senha_hash = EXCLUDED.senha_hash,
    perfil = EXCLUDED.perfil,
    ativo = EXCLUDED.ativo,
    updated_at = NOW();

-- Verificar se foi criado
SELECT login, nome, perfil, ativo FROM usuarios WHERE login = 'admin';
