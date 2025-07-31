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

// Função para inicializar analytics
function initVercelAnalytics() {
    try {
        // Verifica se a biblioteca está disponível
        if (typeof window !== 'undefined' && window.va) {
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
            console.warn('⚠️ Vercel Analytics não encontrado');
        }
    } catch (error) {
        console.error('❌ Erro ao inicializar Vercel Analytics:', error);
    }
}

/**
 * Configurar eventos específicos do ReservaLAB
 */
function trackReservaLabEvents() {
    // Rastrear envio de formulários
    const formReserva = document.getElementById('formReserva');
    if (formReserva) {
        formReserva.addEventListener('submit', function(e) {
            if (window.va) {
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
            if (window.va) {
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
                if (match && window.va) {
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
        if (window.va) {
            window.va.track('admin_access', {
                page: window.location.pathname,
                timestamp: new Date().toISOString()
            });
        }
    }
}

/**
 * Rastrear evento customizado
 */
function trackCustomEvent(eventName, properties = {}) {
    if (window.va) {
        window.va.track(eventName, {
            ...properties,
            timestamp: new Date().toISOString(),
            page: window.location.pathname
        });
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
