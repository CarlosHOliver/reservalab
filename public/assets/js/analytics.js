/**
 * ReservaLAB - Sistema de Reservas de Laboratórios e Equipamentos
 * Configuração do Vercel Analytics para JavaScript Vanilla
 * 
 * Idealizado e Desenvolvido por Carlos Henrique C. de Oliveira - Tec. Laboratório de Informática FAEN/UFGD - Engenheiro da Computação
 */

/**
 * Inicializa o Vercel Analytics para JavaScript vanilla
 * Para usar: incluir este script após carregar a biblioteca @vercel/analytics
 */

// Função para inicializar analytics (corrigida)
function initVercelAnalytics() {
    try {
        // Verifica se a biblioteca está disponível e tem o método track
        if (typeof window !== 'undefined' && window.va && typeof window.va.track === 'function') {
            // Inicializa o analytics
            window.va.track('page_view', {
                page: window.location.pathname,
                title: document.title,
                timestamp: new Date().toISOString()
            });
            
            console.log('✅ Vercel Analytics inicializado com sucesso');
            
            // Rastrear eventos específicos do sistema
            trackReservaLabEvents();
            
        } else {
            console.warn('⚠️ Vercel Analytics não disponível - criando implementação stub');
            
            // Criar implementação stub para desenvolvimento
            window.va = window.va || {};
            window.va.track = function(event, data) {
                console.log(`📊 Analytics Stub - Evento: ${event}`, data);
            };
            
            // Inicializar eventos com stub
            trackReservaLabEvents();
        }
    } catch (error) {
        console.error('❌ Erro ao inicializar Vercel Analytics:', error);
        
        // Fallback: criar stub em caso de erro
        window.va = window.va || {};
        window.va.track = function(event, data) {
            console.log(`📊 Analytics Fallback - Evento: ${event}`, data);
        };
    }
}

/**
 * Configurar eventos específicos do ReservaLAB (corrigido)
 */
function trackReservaLabEvents() {
    // Rastrear envio de formulários
    const formReserva = document.getElementById('formReserva');
    if (formReserva) {
        formReserva.addEventListener('submit', function(e) {
            if (window.va && typeof window.va.track === 'function') {
                window.va.track('reserva_enviada', {
                    page: 'nova_reserva',
                    timestamp: new Date().toISOString()
                });
            }
        });
    }
    
    // Rastrear busca de reservas
    const btnBuscar = document.querySelector('[onclick="buscarReserva()"]');
    if (btnBuscar) {
        btnBuscar.addEventListener('click', function() {
            if (window.va && typeof window.va.track === 'function') {
                window.va.track('busca_reserva', {
                    page: window.location.pathname,
                    timestamp: new Date().toISOString()
                });
            }
        });
    }
    
    // Rastrear navegação entre páginas
    const navButtons = document.querySelectorAll('[onclick*="window.location"]');
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const onclick = this.getAttribute('onclick');
            if (onclick && onclick.includes('window.location.href')) {
                const match = onclick.match(/window\.location\.href='([^']+)'/);
                if (match && window.va && typeof window.va.track === 'function') {
                    window.va.track('navegacao', {
                        from: window.location.pathname,
                        to: match[1],
                        timestamp: new Date().toISOString()
                    });
                }
            }
        });
    });
    
    // Rastrear uso do dashboard admin
    if (window.location.pathname.includes('admin')) {
        if (window.va && typeof window.va.track === 'function') {
            window.va.track('admin_access', {
                page: window.location.pathname,
                timestamp: new Date().toISOString()
            });
        }
    }
}

/**
 * Rastrear evento customizado (corrigido)
 */
function trackCustomEvent(eventName, properties = {}) {
    try {
        if (window.va && typeof window.va.track === 'function') {
            window.va.track(eventName, {
                ...properties,
                timestamp: new Date().toISOString(),
                page: window.location.pathname
            });
        } else {
            console.log(`📊 Analytics Stub - Custom Event: ${eventName}`, properties);
        }
    } catch (error) {
        console.warn('Erro ao rastrear evento customizado:', error);
    }
}

// Expor função global para uso em outros scripts
window.trackCustomEvent = trackCustomEvent;

// Inicializar quando a página carregar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVercelAnalytics);
} else {
    initVercelAnalytics();
}

console.log('📊 Script Vercel Analytics para ReservaLAB carregado');
