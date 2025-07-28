-- Correção completa para resolver erros de tipo, ambiguidade e RLS
-- Execute este script no seu banco Supabase para corrigir os erros

-- 1. Políticas RLS para permitir inserções nas tabelas relacionais
DROP POLICY IF EXISTS "Permitir inserção de equipamentos em reservas" ON reserva_equipamentos;
CREATE POLICY "Permitir inserção de equipamentos em reservas" ON reserva_equipamentos FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir leitura de equipamentos em reservas" ON reserva_equipamentos;
CREATE POLICY "Permitir leitura de equipamentos em reservas" ON reserva_equipamentos FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir inserção de formulários em reservas" ON reserva_formularios;
CREATE POLICY "Permitir inserção de formulários em reservas" ON reserva_formularios FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir leitura de formulários em reservas" ON reserva_formularios;
CREATE POLICY "Permitir leitura de formulários em reservas" ON reserva_formularios FOR SELECT USING (true);

-- 2. Corrigir tipos de dados incompatíveis (se necessário)
-- Alterar a tabela usuarios para usar INTEGER em vez de UUID (apenas se ainda estiver como UUID)
-- ALTER TABLE usuarios ALTER COLUMN id DROP DEFAULT;
-- ALTER TABLE usuarios ALTER COLUMN id TYPE INTEGER USING id::INTEGER;
-- ALTER TABLE usuarios ALTER COLUMN id SET DEFAULT nextval('usuarios_id_seq'::regclass);

-- 3. Função corrigida para gerar próximo protocolo
CREATE OR REPLACE FUNCTION gerar_proximo_protocolo()
RETURNS VARCHAR(20) AS $$
DECLARE
    ano_mes VARCHAR(6);
    proximo_numero INTEGER;
    novo_protocolo VARCHAR(20);
BEGIN
    -- Formato: YYYYMM
    ano_mes := TO_CHAR(NOW(), 'YYYYMM');
    
    -- Buscar o maior número do mês atual
    -- Qualificação explícita da coluna para evitar ambiguidade
    SELECT COALESCE(MAX(CAST(SUBSTRING(reservas.protocolo FROM 7) AS INTEGER)), 0) + 1
    INTO proximo_numero
    FROM reservas
    WHERE reservas.protocolo LIKE ano_mes || '%';
    
    -- Formatar protocolo: YYYYMM + 6 dígitos
    novo_protocolo := ano_mes || LPAD(proximo_numero::TEXT, 6, '0');
    
    RETURN novo_protocolo;
END;
$$ LANGUAGE plpgsql;

-- 4. Recriar o trigger para protocolo
DROP TRIGGER IF EXISTS reservas_protocolo_trigger ON reservas;
CREATE TRIGGER reservas_protocolo_trigger
    BEFORE INSERT ON reservas
    FOR EACH ROW
    EXECUTE FUNCTION trigger_gerar_protocolo();

-- 5. Inserir usuários padrão para administração (com senhas em hash bcrypt)
INSERT INTO usuarios (nome, login, email, senha_hash, perfil, ativo) VALUES 
    ('Administrador do Sistema', 'admin', 'admin@faen.ufgd.edu.br', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'administrador', true),
    ('Gestor FAEN', 'gestor', 'gestor@faen.ufgd.edu.br', '$2b$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUzTOmCESa', 'gestor', true),
    ('Carlos Henrique', 'carlos', 'carlos.oliveira@ufgd.edu.br', '$2b$10$N9qo8uLOickgx2ZMRZoMye.fgsuzUzpPUcE.FXr/i5Gm6UhE3sNAq', 'administrador', true)
ON CONFLICT (login) DO NOTHING;
