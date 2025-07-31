/**
 * ReservaLAB - Sistema de Reservas de Laboratórios e Equipamentos
 * Configurações do Supabase e constantes do sistema
 * 
 * Idealizado e Desenvolvido por Carlos Henrique C. de Oliveira - Tec. Laboratório de Informática FAEN/UFGD - Engenheiro da Computação
 */

// Configurações do Supabase
var CONFIG = {
    SUPABASE_URL: 'https://ptyzutlqliekgxktcyru.supabase.co',
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0eXp1dGxxbGlla2d4a3RjeXJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMDgwNTIsImV4cCI6MjA2ODg4NDA1Mn0.xErQ_zcI6yqUbCnCqSUL6gkwmu4eyjSNMDyXAn0m7dk'
};

// Compatibilidade com código antigo
var SUPABASE_CONFIG = {
    url: CONFIG.SUPABASE_URL,
    anonKey: CONFIG.SUPABASE_ANON_KEY
};

// Inicializar cliente Supabase
var supabase;
try {
    if (typeof window !== 'undefined' && window.supabase && typeof window.supabase.createClient === 'function') {
        supabase = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
        console.log('✅ Cliente Supabase inicializado com sucesso');
    } else {
        console.error('❌ Biblioteca Supabase não carregada ou createClient não disponível');
    }
} catch (error) {
    console.error('❌ Erro ao inicializar cliente Supabase:', error);
}

// Constantes do sistema
var SISTEMA_CONFIG = {
    nome: 'ReservaLAB',
    versao: '1.0.0',
    desenvolvedor: 'Carlos Henrique C. de Oliveira - Laboratórios de Informática - FAEN/UFGD',
    ano: '2025',
    
    // Validações
    emailsPermitidos: ['@ufgd.edu.br', '@academico.ufgd.edu.br'],
    
    // Horários
    horarioMinimo: '06:00',
    horarioMaximo: '22:00',
    intervaloMinimo: 30, // minutos
    
    // Fuso horário
    fusoHorario: 'America/Cuiaba',
    
    // Expediente
    expediente: {
        inicio: '07:00',
        fim: '17:00',
        diasSemana: [1, 2, 3, 4, 5] // Segunda a sexta
    },
    
    // Status
    statusReserva: {
        PENDENTE: 'pendente',
        APROVADA: 'aprovada',
        REJEITADA: 'rejeitada'
    },
    
    // Tipos de usuário
    tiposUsuario: {
        PROFESSOR: 'professor',
        TECNICO: 'tecnico',
        ALUNO: 'aluno',
        SERVIDOR: 'servidor'
    },
    
    // Configurações de interface
    ui: {
        toastDuracao: 3000,
        modalAnimacao: 300,
        corSucesso: '#198754',
        corAviso: '#ffc107',
        corErro: '#dc3545'
    },
    
    // Limites
    limites: {
        maxReservasPorUsuario: 10,
        maxDiasAntecedencia: 60,
        minMinutosReserva: 30,
        maxHorasReserva: 8
    },
    
    // Configurações de email
    email: {
        assuntoNovaReserva: '[ReservaLAB] Nova Reserva Cadastrada',
        assuntoAprovacao: '[ReservaLAB] Reserva Aprovada',
        assuntoRejeicao: '[ReservaLAB] Reserva Rejeitada',
        assinatura: 'Sistema ReservaLAB - FAEN/UFGD'
    },
    
    // Mensagens do sistema
    mensagens: {
        erro: {
            emailInvalido: 'Por favor, use um e-mail institucional (@ufgd.edu.br ou @academico.ufgd.edu.br)',
            camposObrigatorios: 'Por favor, preencha todos os campos obrigatórios',
            conflitosDetectados: 'Há conflitos de horário. Escolha um horário diferente.',
            semRecursosSelecionados: 'Selecione pelo menos um laboratório ou equipamento',
            antecedenciaMinima: 'A data da reserva deve ter antecedência mínima de 2 dias'
        },
        sucesso: {
            reservaCriada: 'Reserva criada com sucesso!',
            reservaAprovada: 'Reserva aprovada com sucesso!',
            reservaRejeitada: 'Reserva rejeitada com sucesso!'
        }
    },
    
    // URLs e endpoints
    urls: {
        sistema: 'https://reservalab.vercel.app',
        suporte: 'suporte@ufgd.edu.br',
        documentacao: '/docs'
    },
    
    // Configurações de debug
    debug: {
        ativo: false,
        nivel: 'info'
    },
    
    // Configurações de cache
    cache: {
        tempoVidaMinutos: 5,
        chaveVersao: 'v1.0.0'
    }
};

// Validadores
var Validadores = {
    /**
     * Validar e-mail institucional
     */
    emailInstitucional(email) {
        // Remove espaços e força minúsculo
        const emailLimpo = email.trim().toLowerCase();
        // Regex: termina exatamente com @ufgd.edu.br ou @academico.ufgd.edu.br
        return /^([a-z0-9_.+-]+)@(ufgd\.edu\.br|academico\.ufgd\.edu\.br)$/.test(emailLimpo);
    },
    
    /**
     * Validar horário
     */
    horario(horaInicio, horaFim) {
        const inicio = new Date(`2000-01-01T${horaInicio}`);
        const fim = new Date(`2000-01-01T${horaFim}`);
        
        return fim > inicio;
    },
    
    /**
     * Validar SIAPE/RGA
     */
    siapeRga(valor) {
        return valor && valor.trim().length >= 3;
    },
    
    /**
     * Validar protocolo
     */
    protocolo(protocolo) {
        return /^\d{12}$/.test(protocolo);
    }
};

// Exportar para uso global
window.CONFIG = CONFIG;
window.SUPABASE_CONFIG = SUPABASE_CONFIG;
window.SISTEMA_CONFIG = SISTEMA_CONFIG;
window.Validadores = Validadores;
window.supabase = supabase;
