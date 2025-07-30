-- ReservaLAB - Sistema de Reservas de Laboratórios e Equipamentos
-- Schema para Supabase (PostgreSQL)
-- 
-- Idealizado e Desenvolvido por Carlos Henrique C. de Oliveira - Tec. Laboratório de Informática FAEN/UFGD - Engenheiro da Computação

-- Tabela de Blocos
CREATE TABLE IF NOT EXISTS blocos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Laboratórios
CREATE TABLE IF NOT EXISTS laboratorios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    bloco_id INTEGER NOT NULL REFERENCES blocos(id) ON DELETE CASCADE,
    descricao TEXT,
    capacidade INTEGER DEFAULT 1,
    permitir_uso_compartilhado BOOLEAN DEFAULT FALSE,
    quantidade_maxima_ocupantes_simultaneos INTEGER DEFAULT 1,
    necessita_acompanhamento BOOLEAN DEFAULT FALSE,
    foto_url TEXT,
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Equipamentos
CREATE TABLE IF NOT EXISTS equipamentos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    patrimonio VARCHAR(100) NOT NULL UNIQUE,
    bloco_id INTEGER NOT NULL REFERENCES blocos(id) ON DELETE CASCADE,
    local VARCHAR(255) NOT NULL,
    descricao TEXT,
    permitir_uso_compartilhado BOOLEAN DEFAULT FALSE,
    necessita_acompanhamento BOOLEAN DEFAULT FALSE,
    quantidade_maxima_ocupantes INTEGER DEFAULT 1,
    status VARCHAR(50) DEFAULT 'disponivel', -- disponivel, em_manutencao, inativo
    foto_url TEXT,
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    login VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    perfil VARCHAR(50) NOT NULL DEFAULT 'gestor', -- gestor, administrador
    bloco_id INTEGER REFERENCES blocos(id) ON DELETE SET NULL,
    ativo BOOLEAN DEFAULT TRUE,
    ultimo_acesso TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Reservas
CREATE TABLE IF NOT EXISTS reservas (
    id SERIAL PRIMARY KEY,
    protocolo VARCHAR(20) NOT NULL UNIQUE,
    nome_completo VARCHAR(255) NOT NULL,
    siape_rga VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    data_reserva DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fim TIME NOT NULL,
    finalidade TEXT NOT NULL,
    laboratorio_id INTEGER REFERENCES laboratorios(id) ON DELETE SET NULL,
    professor_acompanhante VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pendente', -- pendente, aprovada, rejeitada
    motivo_rejeicao TEXT,
    aprovado_por INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    data_aprovacao TIMESTAMP WITH TIME ZONE,
    recorrencia_tipo VARCHAR(20) DEFAULT 'nenhuma', -- nenhuma, diaria, semanal, mensal
    recorrencia_fim DATE,
    reserva_pai_id INTEGER REFERENCES reservas(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Equipamentos Reservados (relação N:N)
CREATE TABLE IF NOT EXISTS reserva_equipamentos (
    id SERIAL PRIMARY KEY,
    reserva_id INTEGER NOT NULL REFERENCES reservas(id) ON DELETE CASCADE,
    equipamento_id INTEGER NOT NULL REFERENCES equipamentos(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(reserva_id, equipamento_id)
);

-- Tabela de Formulários de Acesso
CREATE TABLE IF NOT EXISTS formularios_acesso (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    descricao TEXT,
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Associação Reserva-Formulário
CREATE TABLE IF NOT EXISTS reserva_formularios (
    id SERIAL PRIMARY KEY,
    reserva_id INTEGER NOT NULL REFERENCES reservas(id) ON DELETE CASCADE,
    formulario_id INTEGER NOT NULL REFERENCES formularios_acesso(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(reserva_id, formulario_id)
);

-- Tabela de Configurações Patrimoniais
CREATE TABLE IF NOT EXISTS patrimonial_config (
    id SERIAL PRIMARY KEY,
    chave VARCHAR(100) NOT NULL UNIQUE,
    valor TEXT,
    descricao TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Reports Patrimoniais
CREATE TABLE IF NOT EXISTS reports_patrimoniais (
    id SERIAL PRIMARY KEY,
    reserva_id INTEGER REFERENCES reservas(id) ON DELETE SET NULL,
    tipo_report VARCHAR(100) NOT NULL,
    descricao TEXT NOT NULL,
    reportado_por VARCHAR(255) DEFAULT 'Portaria',
    status VARCHAR(50) DEFAULT 'pendente', -- pendente, processado
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Função para gerar próximo protocolo
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
    SELECT COALESCE(MAX(CAST(SUBSTRING(reservas.protocolo FROM 7) AS INTEGER)), 0) + 1
    INTO proximo_numero
    FROM reservas
    WHERE reservas.protocolo LIKE ano_mes || '%';
    
    -- Formatar protocolo: YYYYMM + 6 dígitos
    novo_protocolo := ano_mes || LPAD(proximo_numero::TEXT, 6, '0');
    
    RETURN novo_protocolo;
END;
$$ LANGUAGE plpgsql;

-- Trigger para gerar protocolo automaticamente
CREATE OR REPLACE FUNCTION trigger_gerar_protocolo()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.protocolo IS NULL OR NEW.protocolo = '' THEN
        NEW.protocolo := gerar_proximo_protocolo();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS reservas_protocolo_trigger ON reservas;
CREATE TRIGGER reservas_protocolo_trigger
    BEFORE INSERT ON reservas
    FOR EACH ROW
    EXECUTE FUNCTION trigger_gerar_protocolo();

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION trigger_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger de updated_at em todas as tabelas relevantes
DROP TRIGGER IF EXISTS blocos_updated_at ON blocos;
CREATE TRIGGER blocos_updated_at BEFORE UPDATE ON blocos FOR EACH ROW EXECUTE FUNCTION trigger_updated_at();

DROP TRIGGER IF EXISTS laboratorios_updated_at ON laboratorios;
CREATE TRIGGER laboratorios_updated_at BEFORE UPDATE ON laboratorios FOR EACH ROW EXECUTE FUNCTION trigger_updated_at();

DROP TRIGGER IF EXISTS equipamentos_updated_at ON equipamentos;
CREATE TRIGGER equipamentos_updated_at BEFORE UPDATE ON equipamentos FOR EACH ROW EXECUTE FUNCTION trigger_updated_at();

DROP TRIGGER IF EXISTS usuarios_updated_at ON usuarios;
CREATE TRIGGER usuarios_updated_at BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE FUNCTION trigger_updated_at();

DROP TRIGGER IF EXISTS reservas_updated_at ON reservas;
CREATE TRIGGER reservas_updated_at BEFORE UPDATE ON reservas FOR EACH ROW EXECUTE FUNCTION trigger_updated_at();

DROP TRIGGER IF EXISTS formularios_acesso_updated_at ON formularios_acesso;
CREATE TRIGGER formularios_acesso_updated_at BEFORE UPDATE ON formularios_acesso FOR EACH ROW EXECUTE FUNCTION trigger_updated_at();

DROP TRIGGER IF EXISTS patrimonial_config_updated_at ON patrimonial_config;
CREATE TRIGGER patrimonial_config_updated_at BEFORE UPDATE ON patrimonial_config FOR EACH ROW EXECUTE FUNCTION trigger_updated_at();

DROP TRIGGER IF EXISTS reports_patrimoniais_updated_at ON reports_patrimoniais;
CREATE TRIGGER reports_patrimoniais_updated_at BEFORE UPDATE ON reports_patrimoniais FOR EACH ROW EXECUTE FUNCTION trigger_updated_at();

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_reservas_data_reserva ON reservas(data_reserva);
CREATE INDEX IF NOT EXISTS idx_reservas_status ON reservas(status);
CREATE INDEX IF NOT EXISTS idx_reservas_protocolo ON reservas(protocolo);
CREATE INDEX IF NOT EXISTS idx_reservas_email ON reservas(email);
CREATE INDEX IF NOT EXISTS idx_equipamentos_status ON equipamentos(status);
CREATE INDEX IF NOT EXISTS idx_equipamentos_bloco ON equipamentos(bloco_id);
CREATE INDEX IF NOT EXISTS idx_laboratorios_bloco ON laboratorios(bloco_id);
CREATE INDEX IF NOT EXISTS idx_usuarios_perfil ON usuarios(perfil);
CREATE INDEX IF NOT EXISTS idx_usuarios_bloco ON usuarios(bloco_id);

-- Dados iniciais
INSERT INTO blocos (nome) VALUES 
    ('FAEN/Produção'),
    ('FAEN/Civil'),
    ('FAEN/Energia'),
    ('FAEN/Alimentos'),
    ('FAEN/Mecânica')
ON CONFLICT (nome) DO NOTHING;

-- Configurações patrimoniais iniciais
INSERT INTO patrimonial_config (chave, valor, descricao) VALUES 
    ('senha_report', 'patrimonial2025', 'Senha única para envio de reports pela divisão patrimonial'),
    ('fuso_horario', 'America/Cuiaba', 'Fuso horário para exibição de horários'),
    ('horario_expediente_inicio', '07:00', 'Horário de início do expediente'),
    ('horario_expediente_fim', '17:00', 'Horário de fim do expediente'),
    ('dias_expediente', '1,2,3,4,5', 'Dias da semana de expediente (1=segunda, 7=domingo)')
ON CONFLICT (chave) DO NOTHING;

-- Usuários padrão para administração (com senhas em hash bcrypt)
INSERT INTO usuarios (nome, login, email, senha_hash, perfil, ativo) VALUES 
    ('Administrador do Sistema', 'admin', 'admin@faen.ufgd.edu.br', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'administrador', true),
    ('Gestor FAEN', 'gestor', 'gestor@faen.ufgd.edu.br', '$2b$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUzTOmCESa', 'gestor', true),
    ('Carlos Henrique', 'carlos', 'carlos.oliveira@ufgd.edu.br', '$2b$10$N9qo8uLOickgx2ZMRZoMye.fgsuzUzpPUcE.FXr/i5Gm6UhE3sNAq', 'administrador', true)
ON CONFLICT (login) DO NOTHING;

-- RLS (Row Level Security) Policies
ALTER TABLE blocos ENABLE ROW LEVEL SECURITY;
ALTER TABLE laboratorios ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservas ENABLE ROW LEVEL SECURITY;
ALTER TABLE reserva_equipamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE formularios_acesso ENABLE ROW LEVEL SECURITY;
ALTER TABLE reserva_formularios ENABLE ROW LEVEL SECURITY;
ALTER TABLE patrimonial_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports_patrimoniais ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso público para leitura (necessário para o frontend)
DROP POLICY IF EXISTS "Permitir leitura pública de blocos" ON blocos;
CREATE POLICY "Permitir leitura pública de blocos" ON blocos FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir leitura pública de laboratórios ativos" ON laboratorios;
CREATE POLICY "Permitir leitura pública de laboratórios ativos" ON laboratorios FOR SELECT USING (ativo = true);

DROP POLICY IF EXISTS "Permitir leitura pública de equipamentos ativos" ON equipamentos;
CREATE POLICY "Permitir leitura pública de equipamentos ativos" ON equipamentos FOR SELECT USING (ativo = true);

-- Políticas para reserva_equipamentos
DROP POLICY IF EXISTS "Permitir inserção de equipamentos em reservas" ON reserva_equipamentos;
CREATE POLICY "Permitir inserção de equipamentos em reservas" ON reserva_equipamentos FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir leitura de equipamentos em reservas" ON reserva_equipamentos;
CREATE POLICY "Permitir leitura de equipamentos em reservas" ON reserva_equipamentos FOR SELECT USING (true);

-- Políticas para reservas (usuários podem criar, admins/gestores podem gerenciar)
DROP POLICY IF EXISTS "Permitir criação de reservas" ON reservas;
CREATE POLICY "Permitir criação de reservas" ON reservas FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir leitura de próprias reservas" ON reservas;
CREATE POLICY "Permitir leitura de próprias reservas" ON reservas FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir atualização por admins/gestores" ON reservas;
CREATE POLICY "Permitir atualização por admins/gestores" ON reservas FOR UPDATE USING (true);

-- Políticas para usuários autenticados
DROP POLICY IF EXISTS "Usuários podem ver próprio perfil" ON usuarios;
CREATE POLICY "Usuários podem ver próprio perfil" ON usuarios FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins podem gerenciar usuários" ON usuarios;
CREATE POLICY "Admins podem gerenciar usuários" ON usuarios FOR ALL USING (true);

-- Políticas para formulários de acesso
DROP POLICY IF EXISTS "Permitir leitura de formulários ativos" ON formularios_acesso;
CREATE POLICY "Permitir leitura de formulários ativos" ON formularios_acesso FOR SELECT USING (ativo = true);

DROP POLICY IF EXISTS "Admins podem gerenciar formulários" ON formularios_acesso;
CREATE POLICY "Admins podem gerenciar formulários" ON formularios_acesso FOR ALL USING (true);

-- Políticas para reserva_formularios
DROP POLICY IF EXISTS "Permitir inserção de formulários em reservas" ON reserva_formularios;
CREATE POLICY "Permitir inserção de formulários em reservas" ON reserva_formularios FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir leitura de formulários em reservas" ON reserva_formularios;
CREATE POLICY "Permitir leitura de formulários em reservas" ON reserva_formularios FOR SELECT USING (true);

-- Políticas para configurações patrimoniais
DROP POLICY IF EXISTS "Permitir leitura de configurações" ON patrimonial_config;
CREATE POLICY "Permitir leitura de configurações" ON patrimonial_config FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins podem gerenciar configurações" ON patrimonial_config;
CREATE POLICY "Admins podem gerenciar configurações" ON patrimonial_config FOR ALL USING (true);

-- Políticas para reports patrimoniais
DROP POLICY IF EXISTS "Permitir criação de reports" ON reports_patrimoniais;
CREATE POLICY "Permitir criação de reports" ON reports_patrimoniais FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins/gestores podem ver reports" ON reports_patrimoniais;
CREATE POLICY "Admins/gestores podem ver reports" ON reports_patrimoniais FOR SELECT USING (true);

-- Comentários para documentação
COMMENT ON TABLE blocos IS 'Blocos/prédios da FAEN onde ficam os laboratórios e equipamentos';
COMMENT ON TABLE laboratorios IS 'Laboratórios disponíveis para reserva';
COMMENT ON TABLE equipamentos IS 'Equipamentos disponíveis para reserva';
COMMENT ON TABLE usuarios IS 'Usuários do sistema (gestores e administradores)';
COMMENT ON TABLE reservas IS 'Solicitações de reserva de laboratórios e equipamentos';
COMMENT ON TABLE reserva_equipamentos IS 'Relação N:N entre reservas e equipamentos';
COMMENT ON TABLE formularios_acesso IS 'Formulários externos que podem ser associados às reservas';
COMMENT ON TABLE patrimonial_config IS 'Configurações da dashboard patrimonial';
COMMENT ON TABLE reports_patrimoniais IS 'Reports enviados pela divisão de proteção patrimonial';

COMMENT ON FUNCTION gerar_proximo_protocolo() IS 'Gera próximo protocolo no formato YYYYMM000001';
COMMENT ON COLUMN reservas.protocolo IS 'Protocolo único no formato YYYYMM000001';
COMMENT ON COLUMN reservas.recorrencia_tipo IS 'Tipo de recorrência: nenhuma, diaria, semanal, mensal';
COMMENT ON COLUMN equipamentos.status IS 'Status do equipamento: disponivel, em_manutencao, inativo';

