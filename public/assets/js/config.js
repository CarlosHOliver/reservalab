/**
 * ReservaLAB - Sistema de Reservas de Laboratórios e Equipamentos
 * Configurações do Supabase e constantes do sistema
 * 
 * Idealizado e Desenvolvido por Carlos Henrique C. de Oliveira - Tec. Laboratório de Informática FAEN/UFGD - Engenheiro da Computação
 */

// Configurações do Supabase
const SUPABASE_CONFIG = {
    url: 'https://ptyzutlqliekgxktcyru.supabase.co', // Substitua pela sua URL do Supabase
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0eXp1dGxxbGlla2d4a3RjeXJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMDgwNTIsImV4cCI6MjA2ODg4NDA1Mn0.xErQ_zcI6yqUbCnCqSUL6gkwmu4eyjSNMDyXAn0m7dk' // Substitua pela sua chave anônima do Supabase
};

// Inicializar cliente Supabase
const supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);

// Constantes do sistema
const SISTEMA_CONFIG = {
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
    
    statusEquipamento: {
        DISPONIVEL: 'disponivel',
        EM_MANUTENCAO: 'em_manutencao',
        INATIVO: 'inativo'
    },
    
    perfilUsuario: {
        ADMINISTRADOR: 'administrador',
        GESTOR: 'gestor'
    },
    
    tipoRecorrencia: {
        NENHUMA: 'nenhuma',
        DIARIA: 'diaria',
        SEMANAL: 'semanal',
        MENSAL: 'mensal'
    },
    
    // Blocos da FAEN
    blocos: [
        { id: 1, nome: 'FAEN/Produção' },
        { id: 2, nome: 'FAEN/Civil' },
        { id: 3, nome: 'FAEN/Energia' },
        { id: 4, nome: 'FAEN/Alimentos' },
        { id: 5, nome: 'FAEN/Mecânica' }
    ],
    
    // Mensagens do sistema
    mensagens: {
        sucesso: {
            reservaCriada: 'Solicitação de reserva enviada com sucesso!',
            dadosSalvos: 'Dados salvos com sucesso!',
            operacaoRealizada: 'Operação realizada com sucesso!'
        },
        erro: {
            emailInvalido: 'Por favor, utilize um e-mail institucional (@ufgd.edu.br ou @academico.ufgd.edu.br)',
            horarioInvalido: 'Horário inválido. Verifique se a hora de fim é posterior à hora de início',
            conflitosDetectados: 'Conflitos de horário detectados. Por favor, selecione outro horário',
            camposObrigatorios: 'Por favor, preencha todos os campos obrigatórios',
            erroConexao: 'Erro de conexão. Tente novamente em alguns instantes',
            protocoloNaoEncontrado: 'Protocolo não encontrado',
            semRecursosSelecionados: 'Por favor, selecione pelo menos um laboratório ou equipamento',
            professorObrigatorio: 'Professor/técnico responsável é obrigatório para os recursos selecionados'
        },
        aviso: {
            acompanhamentoNecessario: 'Os recursos selecionados necessitam de acompanhamento de professor ou técnico',
            recorrenciaAtiva: 'Esta reserva será repetida conforme a recorrência selecionada',
            verificandoConflitos: 'Verificando conflitos de horário...'
        }
    },
    
    // Configurações de interface
    interface: {
        itensPorPagina: 10,
        tempoAtualizacao: 30000, // 30 segundos
        tempoDebounce: 500, // 500ms para validações
        animacaoDuracao: 300 // 300ms para animações
    }
};

// Utilitários de data/hora para fuso horário de Cuiabá


// Validadores
const Validadores = {
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
window.SISTEMA_CONFIG = SISTEMA_CONFIG;
// window.DateUtils = DateUtils; // Removido: agora definido apenas em utils.js
window.Validadores = Validadores;
window.supabase = supabase;

