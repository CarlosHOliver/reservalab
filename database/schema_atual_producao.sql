-- ReservaLAB - Sistema de Reservas de Laboratórios e Equipamentos
-- Schema Atual do Banco de Dados - Supabase PostgreSQL
-- Data: 31/07/2025
-- Status: PRODUÇÃO - SISTEMA FUNCIONANDO
-- 
-- Idealizado e Desenvolvido por Carlos Henrique C. de Oliveira
-- Técnico em Laboratório de Informática FAEN/UFGD - Engenheiro da Computação

-- ========================================
-- SCHEMA ATUAL - SISTEMA EM PRODUÇÃO
-- ========================================

-- Tabela de Blocos da FAEN
CREATE TABLE public.blocos (
  id integer NOT NULL DEFAULT nextval('blocos_id_seq'::regclass),
  nome character varying NOT NULL UNIQUE,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT blocos_pkey PRIMARY KEY (id)
);

-- Tabela de Laboratórios
CREATE TABLE public.laboratorios (
  id integer NOT NULL DEFAULT nextval('laboratorios_id_seq'::regclass),
  nome character varying NOT NULL,
  bloco_id integer NOT NULL,
  descricao text,
  capacidade integer DEFAULT 1,
  foto_url text,
  ativo boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  permitir_uso_compartilhado boolean DEFAULT false,
  quantidade_maxima_ocupantes_simultaneos integer DEFAULT 1,
  necessita_acompanhamento boolean DEFAULT false,
  CONSTRAINT laboratorios_pkey PRIMARY KEY (id),
  CONSTRAINT laboratorios_bloco_id_fkey FOREIGN KEY (bloco_id) REFERENCES public.blocos(id)
);

-- Tabela de Equipamentos
CREATE TABLE public.equipamentos (
  id integer NOT NULL DEFAULT nextval('equipamentos_id_seq'::regclass),
  nome character varying NOT NULL,
  patrimonio character varying NOT NULL UNIQUE,
  bloco_id integer NOT NULL,
  local character varying NOT NULL,
  descricao text,
  permitir_uso_compartilhado boolean DEFAULT false,
  necessita_acompanhamento boolean DEFAULT false,
  quantidade_maxima_ocupantes integer DEFAULT 1,
  status character varying DEFAULT 'disponivel'::character varying,
  foto_url text,
  ativo boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT equipamentos_pkey PRIMARY KEY (id),
  CONSTRAINT equipamentos_bloco_id_fkey FOREIGN KEY (bloco_id) REFERENCES public.blocos(id)
);

-- Tabela de Usuários (Gestores e Administradores)
CREATE TABLE public.usuarios (
  id integer NOT NULL DEFAULT nextval('usuarios_id_seq'::regclass),
  nome character varying NOT NULL,
  login character varying NOT NULL UNIQUE,
  email character varying NOT NULL UNIQUE,
  senha_hash character varying NOT NULL,
  perfil character varying NOT NULL DEFAULT 'gestor'::character varying,
  bloco_id integer,
  ativo boolean DEFAULT true,
  ultimo_acesso timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT usuarios_pkey PRIMARY KEY (id),
  CONSTRAINT usuarios_bloco_id_fkey FOREIGN KEY (bloco_id) REFERENCES public.blocos(id)
);

-- Tabela de Reservas (Principal)
CREATE TABLE public.reservas (
  id integer NOT NULL DEFAULT nextval('reservas_id_seq'::regclass),
  protocolo character varying NOT NULL UNIQUE,
  nome_completo character varying NOT NULL,
  siape_rga character varying NOT NULL,
  email character varying NOT NULL,
  telefone character varying,
  data_reserva date NOT NULL,
  hora_inicio time without time zone NOT NULL, -- TIMEZONE SIMPLIFICADO
  hora_fim time without time zone NOT NULL,    -- TIMEZONE SIMPLIFICADO
  finalidade text NOT NULL,
  laboratorio_id integer,
  professor_acompanhante character varying,
  status character varying DEFAULT 'pendente'::character varying,
  motivo_rejeicao text,
  aprovado_por integer,
  data_aprovacao timestamp with time zone,
  recorrencia_tipo character varying DEFAULT 'nenhuma'::character varying,
  recorrencia_fim date,
  reserva_pai_id integer,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  criado_por_admin boolean DEFAULT false,
  CONSTRAINT reservas_pkey PRIMARY KEY (id),
  CONSTRAINT reservas_laboratorio_id_fkey FOREIGN KEY (laboratorio_id) REFERENCES public.laboratorios(id),
  CONSTRAINT reservas_aprovado_por_fkey FOREIGN KEY (aprovado_por) REFERENCES public.usuarios(id),
  CONSTRAINT reservas_reserva_pai_id_fkey FOREIGN KEY (reserva_pai_id) REFERENCES public.reservas(id)
);

-- Tabela de Equipamentos Reservados (Relação N:N)
CREATE TABLE public.reserva_equipamentos (
  id integer NOT NULL DEFAULT nextval('reserva_equipamentos_id_seq'::regclass),
  reserva_id integer NOT NULL,
  equipamento_id integer NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT reserva_equipamentos_pkey PRIMARY KEY (id),
  CONSTRAINT reserva_equipamentos_reserva_id_fkey FOREIGN KEY (reserva_id) REFERENCES public.reservas(id),
  CONSTRAINT reserva_equipamentos_equipamento_id_fkey FOREIGN KEY (equipamento_id) REFERENCES public.equipamentos(id)
);

-- Tabela de Formulários de Acesso
CREATE TABLE public.formularios_acesso (
  id integer NOT NULL DEFAULT nextval('formularios_acesso_id_seq'::regclass),
  titulo character varying NOT NULL,
  url text NOT NULL,
  descricao text,
  ativo boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT formularios_acesso_pkey PRIMARY KEY (id)
);

-- Tabela de Relação Reservas-Formulários
CREATE TABLE public.reserva_formularios (
  id integer NOT NULL DEFAULT nextval('reserva_formularios_id_seq'::regclass),
  reserva_id integer NOT NULL,
  formulario_id integer NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT reserva_formularios_pkey PRIMARY KEY (id),
  CONSTRAINT reserva_formularios_formulario_id_fkey FOREIGN KEY (formulario_id) REFERENCES public.formularios_acesso(id),
  CONSTRAINT reserva_formularios_reserva_id_fkey FOREIGN KEY (reserva_id) REFERENCES public.reservas(id)
);

-- Tabela de Reports Patrimoniais
CREATE TABLE public.reports_patrimoniais (
  id integer NOT NULL DEFAULT nextval('reports_patrimoniais_id_seq'::regclass),
  reserva_id integer,
  tipo_report character varying NOT NULL,
  descricao text NOT NULL,
  reportado_por character varying DEFAULT 'Portaria'::character varying,
  status character varying DEFAULT 'pendente'::character varying,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT reports_patrimoniais_pkey PRIMARY KEY (id),
  CONSTRAINT reports_patrimoniais_reserva_id_fkey FOREIGN KEY (reserva_id) REFERENCES public.reservas(id)
);

-- Tabela de Reports de Ocorrências
CREATE TABLE public.reports_ocorrencias (
  id integer NOT NULL DEFAULT nextval('reports_ocorrencias_id_seq'::regclass),
  tipo_eventualidade character varying NOT NULL,
  protocolo_relacionado character varying,
  descricao text NOT NULL,
  autor_nome character varying NOT NULL DEFAULT 'Divisão de Proteção Patrimonial'::character varying,
  autor_ip inet,
  ciente boolean DEFAULT false,
  ciente_por integer,
  ciente_em timestamp with time zone,
  observacoes_gestao text,
  prioridade character varying DEFAULT 'normal'::character varying,
  status character varying DEFAULT 'aberto'::character varying,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT reports_ocorrencias_pkey PRIMARY KEY (id),
  CONSTRAINT reports_ocorrencias_ciente_por_fkey FOREIGN KEY (ciente_por) REFERENCES public.usuarios(id)
);

-- Tabela de Configurações Patrimoniais
CREATE TABLE public.patrimonial_config (
  id integer NOT NULL DEFAULT nextval('patrimonial_config_id_seq'::regclass),
  chave character varying NOT NULL UNIQUE,
  valor text,
  descricao text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT patrimonial_config_pkey PRIMARY KEY (id)
);

-- ========================================
-- OBSERVAÇÕES IMPORTANTES
-- ========================================

/*
TIMEZONE SIMPLIFICADO (v2.0.0):
- hora_inicio e hora_fim são TIME WITHOUT TIME ZONE
- Sistema grava exatamente o horário digitado pelo usuário
- Não há conversões de timezone (problema corrigido)
- Horário local de Cuiabá (UTC-4) usado diretamente

RLS (Row Level Security):
- Políticas de segurança configuradas no Supabase
- Acesso por bloco para gestores
- Acesso total para administradores

FEATURES IMPLEMENTADAS:
✅ Sistema de reservas completo
✅ Dashboard administrativo
✅ Controle de acesso por perfil
✅ Reports patrimoniais
✅ Sistema de ocorrências
✅ Configurações flexíveis
✅ Auditoria completa
✅ Timezone corrigido
✅ Vercel Analytics integrado

STATUS: SISTEMA EM PRODUÇÃO
URL: https://reservalab-faen-ufgd.vercel.app
DATA: 31/07/2025
DESENVOLVEDOR: Carlos Henrique C. de Oliveira - FAEN/UFGD
*/
