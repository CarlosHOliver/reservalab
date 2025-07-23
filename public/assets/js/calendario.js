/**
 * ReservaLAB - Sistema de Reservas de Laboratórios e Equipamentos
 * JavaScript do Calendário
 * 
 * Idealizado e Desenvolvido por Carlos Henrique C. de Oliveira - Tec. Laboratório de Informática FAEN/UFGD - Engenheiro da Computação
 */

// Variáveis globais
let calendario;
let filtrosAtivos = {
    bloco: '',
    tipo: '',
    status: 'aprovada'
};

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    inicializarCalendario();
    carregarFiltros();
});

/**
 * Inicializar calendário FullCalendar
 */
function inicializarCalendario() {
    const calendarEl = document.getElementById('calendario');
    
    calendario = new FullCalendar.Calendar(calendarEl, {
        // Configurações básicas
        locale: 'pt-br',
        timeZone: SISTEMA_CONFIG.fusoHorario,
        initialView: 'dayGridMonth',
        height: 'auto',
        
        // Cabeçalho
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        
        // Botões customizados
        customButtons: {
            filtros: {
                text: 'Filtros',
                click: function() {
                    // Implementar modal de filtros se necessário
                }
            }
        },
        
        // Configurações de visualização
        views: {
            dayGridMonth: {
                titleFormat: { year: 'numeric', month: 'long' }
            },
            timeGridWeek: {
                titleFormat: { year: 'numeric', month: 'short', day: 'numeric' }
            },
            timeGridDay: {
                titleFormat: { year: 'numeric', month: 'long', day: 'numeric' }
            }
        },
        
        // Configurações de horário
        slotMinTime: '06:00:00',
        slotMaxTime: '22:00:00',
        slotDuration: '00:30:00',
        
        // Configurações de eventos
        eventDisplay: 'block',
        eventTimeFormat: {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        },
        
        // Callbacks
        eventClick: function(info) {
            mostrarDetalhesReserva(info.event.extendedProps.reserva);
        },
        
        datesSet: function(info) {
            carregarEventos(info.start, info.end);
        },
        
        eventDidMount: function(info) {
            // Adicionar tooltip
            info.el.setAttribute('title', info.event.title);
            
            // Adicionar classes CSS baseadas no status
            const status = info.event.extendedProps.status;
            info.el.classList.add(`evento-${status}`);
            
            // Verificar se está em andamento
            if (ReservaUtils.isReservaEmAndamento(
                info.event.extendedProps.reserva.data_reserva,
                info.event.extendedProps.reserva.hora_inicio,
                info.event.extendedProps.reserva.hora_fim
            )) {
                info.el.classList.add('status-em-andamento');
            }
        },
        
        // Configurações de loading
        loading: function(isLoading) {
            if (isLoading) {
                Utils.showLoading('calendario', 'Carregando eventos...');
            } else {
                Utils.hideLoading('calendario');
            }
        }
    });
    
    calendario.render();
}

/**
 * Carregar filtros disponíveis
 */
async function carregarFiltros() {
    try {
        // Carregar blocos para filtro
        const resultadoBlocos = await API.buscarBlocos();
        
        if (resultadoBlocos.sucesso) {
            const filtroBloco = document.getElementById('filtroBloco');
            
            resultadoBlocos.dados.forEach(bloco => {
                const option = new Option(bloco.nome, bloco.id);
                filtroBloco.add(option);
            });
        }
        
    } catch (error) {
        console.error('Erro ao carregar filtros:', error);
        Utils.showToast('Erro ao carregar filtros', 'warning');
    }
}

/**
 * Carregar eventos do calendário
 */
async function carregarEventos(dataInicio, dataFim) {
    try {
        const dataInicioFormatada = dataInicio.toISOString().split('T')[0];
        const dataFimFormatada = dataFim.toISOString().split('T')[0];
        
        const resultado = await API.buscarReservasCalendario(
            dataInicioFormatada,
            dataFimFormatada,
            filtrosAtivos.status || undefined
        );
        
        if (!resultado.sucesso) {
            throw new Error(resultado.erro);
        }
        
        // Limpar eventos existentes
        calendario.removeAllEvents();
        
        // Processar e adicionar eventos
        const eventos = processarReservasParaEventos(resultado.dados);
        calendario.addEventSource(eventos);
        
    } catch (error) {
        console.error('Erro ao carregar eventos:', error);
        Utils.showToast('Erro ao carregar reservas do calendário', 'danger');
    }
}

/**
 * Processar reservas para formato de eventos do FullCalendar
 */
function processarReservasParaEventos(reservas) {
    const eventos = [];
    
    reservas.forEach(reserva => {
        // Aplicar filtros
        if (!passaNosFiltros(reserva)) {
            return;
        }
        
        // Determinar título do evento
        let titulo = '';
        let recursos = [];
        
        if (reserva.laboratorios) {
            recursos.push(reserva.laboratorios.nome);
        }
        
        if (reserva.reserva_equipamentos && reserva.reserva_equipamentos.length > 0) {
            const equipamentos = reserva.reserva_equipamentos.map(re => re.equipamentos.nome);
            recursos.push(...equipamentos);
        }
        
        titulo = recursos.join(', ');
        if (titulo.length > 30) {
            titulo = titulo.substring(0, 27) + '...';
        }
        
        // Determinar cor baseada no status
        let cor = getCorPorStatus(reserva.status);
        
        // Verificar se está em andamento
        if (ReservaUtils.isReservaEmAndamento(
            reserva.data_reserva,
            reserva.hora_inicio,
            reserva.hora_fim
        )) {
            cor = '#FF6600'; // Laranja UFGD para em andamento
        }
        
        // Criar evento
        const evento = {
            id: reserva.id,
            title: titulo,
            start: `${reserva.data_reserva}T${reserva.hora_inicio}`,
            end: `${reserva.data_reserva}T${reserva.hora_fim}`,
            backgroundColor: cor,
            borderColor: cor,
            textColor: '#FFFFFF',
            extendedProps: {
                reserva: reserva,
                status: reserva.status,
                solicitante: reserva.nome_completo,
                recursos: recursos
            }
        };
        
        eventos.push(evento);
    });
    
    return eventos;
}

/**
 * Verificar se reserva passa nos filtros ativos
 */
function passaNosFiltros(reserva) {
    // Filtro por bloco
    if (filtrosAtivos.bloco) {
        let passouBloco = false;
        
        // Verificar bloco do laboratório
        if (reserva.laboratorios && reserva.laboratorios.blocos) {
            if (reserva.laboratorios.blocos.id == filtrosAtivos.bloco) {
                passouBloco = true;
            }
        }
        
        // Verificar bloco dos equipamentos
        if (reserva.reserva_equipamentos) {
            for (const re of reserva.reserva_equipamentos) {
                if (re.equipamentos.blocos && re.equipamentos.blocos.id == filtrosAtivos.bloco) {
                    passouBloco = true;
                    break;
                }
            }
        }
        
        if (!passouBloco) return false;
    }
    
    // Filtro por tipo
    if (filtrosAtivos.tipo) {
        if (filtrosAtivos.tipo === 'laboratorio' && !reserva.laboratorios) {
            return false;
        }
        if (filtrosAtivos.tipo === 'equipamento' && (!reserva.reserva_equipamentos || reserva.reserva_equipamentos.length === 0)) {
            return false;
        }
    }
    
    return true;
}

/**
 * Obter cor baseada no status
 */
function getCorPorStatus(status) {
    const cores = {
        'pendente': '#FF6600', // Laranja UFGD
        'aprovada': '#009933', // Verde UFGD
        'rejeitada': '#dc3545'  // Vermelho Bootstrap
    };
    
    return cores[status] || '#6c757d';
}

/**
 * Aplicar filtros
 */
function aplicarFiltros() {
    // Coletar valores dos filtros
    filtrosAtivos.bloco = document.getElementById('filtroBloco').value;
    filtrosAtivos.tipo = document.getElementById('filtroTipo').value;
    filtrosAtivos.status = document.getElementById('filtroStatus').value;
    
    // Recarregar eventos
    const view = calendario.view;
    carregarEventos(view.activeStart, view.activeEnd);
    
    Utils.showToast('Filtros aplicados com sucesso', 'success');
}

/**
 * Mostrar detalhes da reserva
 */
function mostrarDetalhesReserva(reserva) {
    const modal = new bootstrap.Modal(document.getElementById('modalDetalhesReserva'));
    const content = document.getElementById('detalhesReservaContent');
    
    // Montar lista de recursos
    let recursos = [];
    if (reserva.laboratorios) {
        recursos.push(`<strong>Laboratório:</strong> ${reserva.laboratorios.nome}`);
    }
    if (reserva.reserva_equipamentos && reserva.reserva_equipamentos.length > 0) {
        const equipamentos = reserva.reserva_equipamentos.map(re => re.equipamentos.nome).join(', ');
        recursos.push(`<strong>Equipamentos:</strong> ${equipamentos}`);
    }
    
    // Determinar status
    const statusInfo = ReservaUtils.formatarStatus(reserva.status);
    
    // Verificar se está em andamento
    const emAndamento = ReservaUtils.isReservaEmAndamento(
        reserva.data_reserva,
        reserva.hora_inicio,
        reserva.hora_fim
    );
    
    content.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <h6 class="text-primary">Informações da Reserva</h6>
                <p><strong>Protocolo:</strong> ${reserva.protocolo}</p>
                <p><strong>Data:</strong> ${DateUtils.formatarData(reserva.data_reserva)}</p>
                <p><strong>Horário:</strong> ${DateUtils.formatarHora(reserva.hora_inicio)} às ${DateUtils.formatarHora(reserva.hora_fim)}</p>
                <p><strong>Status:</strong> 
                    <span class="badge ${statusInfo.classe}">${statusInfo.texto}</span>
                    ${emAndamento ? '<span class="badge bg-warning ms-1">EM ANDAMENTO</span>' : ''}
                </p>
            </div>
            <div class="col-md-6">
                <h6 class="text-primary">Solicitante</h6>
                <p><strong>Nome:</strong> ${reserva.nome_completo}</p>
                <p><strong>SIAPE/RGA:</strong> ${reserva.siape_rga}</p>
                <p><strong>E-mail:</strong> ${reserva.email}</p>
                ${reserva.telefone ? `<p><strong>Telefone:</strong> ${reserva.telefone}</p>` : ''}
            </div>
        </div>
        
        <div class="row mt-3">
            <div class="col-12">
                <h6 class="text-primary">Recursos Reservados</h6>
                ${recursos.join('<br>')}
            </div>
        </div>
        
        <div class="row mt-3">
            <div class="col-12">
                <h6 class="text-primary">Finalidade</h6>
                <p>${reserva.finalidade}</p>
            </div>
        </div>
        
        ${reserva.professor_acompanhante ? `
            <div class="row mt-3">
                <div class="col-12">
                    <h6 class="text-primary">Professor/Técnico Responsável</h6>
                    <p>${reserva.professor_acompanhante}</p>
                </div>
            </div>
        ` : ''}
        
        ${reserva.motivo_rejeicao ? `
            <div class="row mt-3">
                <div class="col-12">
                    <h6 class="text-danger">Motivo da Rejeição</h6>
                    <p class="text-danger">${reserva.motivo_rejeicao}</p>
                </div>
            </div>
        ` : ''}
        
        <div class="row mt-3">
            <div class="col-12">
                <small class="text-muted">
                    Solicitação feita em: ${DateUtils.formatarDataHora(reserva.created_at)}
                </small>
            </div>
        </div>
    `;
    
    modal.show();
}

/**
 * Navegar para hoje
 */
function irParaHoje() {
    calendario.today();
}

/**
 * Atualizar calendário
 */
function atualizarCalendario() {
    const view = calendario.view;
    carregarEventos(view.activeStart, view.activeEnd);
    Utils.showToast('Calendário atualizado', 'success');
}

// Exportar funções para uso global
window.aplicarFiltros = aplicarFiltros;
window.irParaHoje = irParaHoje;
window.atualizarCalendario = atualizarCalendario;

