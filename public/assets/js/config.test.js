/**
 * ReservaLAB - Sistema de Reservas de Laboratórios e Equipamentos
 * Configurações do Supabase e constantes do sistema
 * 
 * Idealizado e Desenvolvido por Carlos Henrique C. de Oliveira - Tec. Laboratório de Informática FAEN/UFGD - Engenheiro da Computação
 */

// Configurações do Supabase
// IMPORTANTE: Configure com suas credenciais reais
const SUPABASE_CONFIG = {
    url: 'https://SEU_PROJETO.supabase.co', // Substitua SEU_PROJETO pelo ID do seu projeto
    anonKey: 'SUA_CHAVE_ANONIMA_REAL_AQUI' // Substitua pela sua chave anônima real
};

// Verificar se as configurações foram definidas
if (SUPABASE_CONFIG.url === 'https://SEU_PROJETO.supabase.co' || 
    SUPABASE_CONFIG.anonKey === 'SUA_CHAVE_ANONIMA_REAL_AQUI') {
    console.error('❌ ERRO: Configure suas credenciais reais do Supabase no arquivo config.js');
    alert('Erro de Configuração: Configure suas credenciais do Supabase no arquivo config.js');
}

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
    
    // Perfis de usuário
    perfisUsuario: {
        ADMINISTRADOR: 'administrador',
        GESTOR: 'gestor'
    },
    
    // Cores da UFGD
    cores: {
        primario: '#749719',
        secundario: '#C8D400',
        sucesso: '#198754',
        perigo: '#dc3545',
        aviso: '#ffc107',
        info: '#0dcaf0'
    }
};

// Utilitários do sistema
const UTILS_CONFIG = {
    formatarData: (data) => {
        return new Date(data).toLocaleDateString('pt-BR', {
            timeZone: SISTEMA_CONFIG.fusoHorario
        });
    },
    
    formatarDataHora: (data) => {
        return new Date(data).toLocaleString('pt-BR', {
            timeZone: SISTEMA_CONFIG.fusoHorario
        });
    },
    
    validarEmail: (email) => {
        return SISTEMA_CONFIG.emailsPermitidos.some(dominio => 
            email.toLowerCase().endsWith(dominio.toLowerCase())
        );
    },
    
    gerarId: () => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
};

// Verificar se o Supabase foi carregado corretamente
if (typeof window.supabase === 'undefined') {
    console.error('❌ ERRO: Biblioteca Supabase não foi carregada');
    alert('Erro: Biblioteca Supabase não foi carregada. Verifique sua conexão com a internet.');
}

// Log de inicialização (apenas em desenvolvimento)
console.log('✅ ReservaLAB - Configurações carregadas:', {
    sistema: SISTEMA_CONFIG.nome,
    versao: SISTEMA_CONFIG.versao,
    supabaseUrl: SUPABASE_CONFIG.url.substring(0, 20) + '...',
    desenvolvedor: SISTEMA_CONFIG.desenvolvedor
});
