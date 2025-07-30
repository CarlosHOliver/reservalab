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
    console.log('📅 DOM carregado, verificando dependências...');
    
    // Verificar se as dependências estão carregadas
    if (typeof FullCalendar === 'undefined') {
        console.error('📅 FullCalendar não carregado!');
        alert('Erro: FullCalendar não carregado');
        return;
    }
    
    if (typeof SISTEMA_CONFIG === 'undefined') {
        console.error('📅 SISTEMA_CONFIG não carregado!');
        alert('Erro: Configurações não carregadas');
        return;
    }
    
    if (typeof API === 'undefined') {
        console.error('📅 API não carregada!');
        alert('Erro: API não carregada');
        return;
    }
    
    if (typeof Utils === 'undefined') {
        console.error('📅 Utils não carregado!');
        alert('Erro: Utilitários não carregados');
        return;
    }
    
    console.log('📅 Todas as dependências carregadas, iniciando calendário...');
    
    // Pequeno delay para garantir que tudo esteja renderizado
    setTimeout(() => {
        try {
            inicializarCalendario();
            carregarFiltros();
        } catch (error) {
            console.error('📅 Erro na inicialização:', error);
            Utils.showToast('Erro ao inicializar calendário', 'danger');
        }
    }, 100);
});

/**
 * Inicializar calendário FullCalendar
 */
function inicializarCalendario() {
    const calendarEl = document.getElementById('calendario');
    
    if (!calendarEl) {
        console.error('📅 Elemento #calendario não encontrado!');
        return;
    }
    
    console.log('📅 Inicializando calendário...');
    
    calendario = new FullCalendar.Calendar(calendarEl, {
        // Configurações básicas
        locale: 'pt-br',
        timeZone: SISTEMA_CONFIG.fusoHorario,
        initialView: 'dayGridMonth',
        height: 'auto',
        
        // Cabeçalho
        headerToolbar: {
            left: 'prev,next',
            center: 'title',
            right: ''
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
            console.log('📅 Data range changed:', {
                start: info.start,
                end: info.end
            });
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
            const container = document.getElementById('calendario');
            if (isLoading) {
                Utils.showLoading(container, 'Carregando eventos...');
            } else {
                Utils.hideLoading(container);
            }
        }
    });
    
    console.log('📅 Renderizando calendário...');
    calendario.render();
    console.log('📅 Calendário inicializado com sucesso!');
    
    // Teste adicional para verificar se o calendário foi criado corretamente
    setTimeout(() => {
        if (calendario && typeof calendario.today === 'function') {
            console.log('📅 Função today disponível');
        } else {
            console.error('📅 Função today não disponível');
        }
    }, 500);
}

/**
 * Carregar filtros disponíveis
 */
async function carregarFiltros() {
    try {
        console.log('📋 Carregando filtros...');
        
        // Carregar blocos para filtro
        const resultadoBlocos = await API.buscarBlocos();
        console.log('📋 Resultado blocos:', resultadoBlocos);
        
        if (resultadoBlocos.sucesso && resultadoBlocos.dados) {
            const filtroBloco = document.getElementById('filtroBloco');
            
            resultadoBlocos.dados.forEach(bloco => {
                const option = new Option(bloco.nome, bloco.id);
                filtroBloco.add(option);
            });
            
            console.log('📋 Filtros carregados com sucesso');
        } else {
            console.warn('📋 Nenhum bloco encontrado ou erro na resposta');
        }
        
    } catch (error) {
        console.error('📋 Erro ao carregar filtros:', error);
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
        
        console.log('📅 Carregando eventos:', {
            dataInicio: dataInicioFormatada,
            dataFim: dataFimFormatada,
            filtros: filtrosAtivos
        });
        
        const resultado = await API.buscarReservasCalendario(
            dataInicioFormatada,
            dataFimFormatada,
            filtrosAtivos.status || null
        );
        
        console.log('📅 Resultado API:', resultado);
        
        if (!resultado.sucesso) {
            throw new Error(resultado.erro);
        }
        
        // Limpar eventos existentes
        calendario.removeAllEvents();
        
        // Processar e adicionar eventos
        const eventos = processarReservasParaEventos(resultado.dados);
        console.log('📅 Eventos processados:', eventos.length);
        
        calendario.addEventSource(eventos);
        
    } catch (error) {
        console.error('📅 Erro ao carregar eventos:', error);
        Utils.showToast('Erro ao carregar reservas do calendário', 'danger');
    }
}

/**
 * Processar reservas para formato de eventos do FullCalendar
 */
function processarReservasParaEventos(reservas) {
    const eventos = [];
    
    if (!reservas || !Array.isArray(reservas)) {
        console.warn('📅 Nenhuma reserva para processar');
        return eventos;
    }
    
    console.log('📅 Processando', reservas.length, 'reservas');
    
    reservas.forEach((reserva, index) => {
        try {
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
                const equipamentos = reserva.reserva_equipamentos.map(re => re.equipamentos?.nome || 'Equipamento').filter(Boolean);
                recursos.push(...equipamentos);
            }
            
            titulo = recursos.join(', ');
            if (titulo.length > 30) {
                titulo = titulo.substring(0, 27) + '...';
            }
            
            if (!titulo) {
                titulo = `Reserva ${reserva.protocolo || reserva.id}`;
            }
            
            // Determinar cor baseada no status
            let cor = getCorPorStatus(reserva.status);
            
            // Verificar se está em andamento
            if (ReservaUtils && typeof ReservaUtils.isReservaEmAndamento === 'function') {
                if (ReservaUtils.isReservaEmAndamento(
                    reserva.data_reserva,
                    reserva.hora_inicio,
                    reserva.hora_fim
                )) {
                    cor = '#0d6efd'; // Primary (azul) para em andamento
                }
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
            
        } catch (error) {
            console.error(`📅 Erro ao processar reserva ${index}:`, error, reserva);
        }
    });
    
    console.log('📅 Eventos criados:', eventos.length);
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
        'pendente': '#ffc107',   // Warning (amarelo)
        'aprovada': '#198754',   // Success (verde)
        'rejeitada': '#dc3545'   // Danger (vermelho)
    };
    
    return cores[status] || '#6c757d'; // Secondary (cinza) como padrão
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
    try {
        const modal = new bootstrap.Modal(document.getElementById('modalDetalhesReserva'));
        const content = document.getElementById('detalhesReservaContent');
        
        if (!reserva) {
            console.error('📅 Dados da reserva não disponíveis');
            Utils.showToast('Erro: dados da reserva não disponíveis', 'danger');
            return;
        }
        
        // Montar lista de recursos
        let recursos = [];
        if (reserva.laboratorios) {
            recursos.push(`<strong>Laboratório:</strong> ${reserva.laboratorios.nome}`);
        }
        if (reserva.reserva_equipamentos && reserva.reserva_equipamentos.length > 0) {
            const equipamentos = reserva.reserva_equipamentos
                .map(re => re.equipamentos?.nome || 'Equipamento')
                .filter(Boolean)
                .join(', ');
            if (equipamentos) {
                recursos.push(`<strong>Equipamentos:</strong> ${equipamentos}`);
            }
        }
        
        // Determinar status
        const statusInfo = ReservaUtils && typeof ReservaUtils.formatarStatus === 'function' 
            ? ReservaUtils.formatarStatus(reserva.status)
            : { texto: reserva.status || 'Desconhecido', classe: 'bg-secondary' };
        
        // Verificar se está em andamento
        const emAndamento = ReservaUtils && typeof ReservaUtils.isReservaEmAndamento === 'function'
            ? ReservaUtils.isReservaEmAndamento(
                reserva.data_reserva,
                reserva.hora_inicio,
                reserva.hora_fim
            )
            : false;
        
        // Formatar datas
        const dataFormatada = DateUtils && typeof DateUtils.formatarData === 'function'
            ? DateUtils.formatarData(reserva.data_reserva)
            : reserva.data_reserva;
            
        const horaInicioFormatada = DateUtils && typeof DateUtils.formatarHora === 'function'
            ? DateUtils.formatarHora(reserva.hora_inicio)
            : reserva.hora_inicio;
            
        const horaFimFormatada = DateUtils && typeof DateUtils.formatarHora === 'function'
            ? DateUtils.formatarHora(reserva.hora_fim)
            : reserva.hora_fim;
            
        const criadoEm = DateUtils && typeof DateUtils.formatarDataHora === 'function'
            ? DateUtils.formatarDataHora(reserva.created_at)
            : reserva.created_at;
        
        content.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <h6 class="text-primary">Informações da Reserva</h6>
                    <p><strong>Protocolo:</strong> ${reserva.protocolo || 'N/A'}</p>
                    <p><strong>Data:</strong> ${dataFormatada}</p>
                    <p><strong>Horário:</strong> ${horaInicioFormatada} às ${horaFimFormatada}</p>
                    <p><strong>Status:</strong> 
                        <span class="badge ${statusInfo.classe}">${statusInfo.texto}</span>
                        ${emAndamento ? '<span class="badge bg-warning ms-1">EM ANDAMENTO</span>' : ''}
                    </p>
                </div>
                <div class="col-md-6">
                    <h6 class="text-primary">Solicitante</h6>
                    <p><strong>Nome:</strong> ${reserva.nome_completo || 'N/A'}</p>
                    <p><strong>SIAPE/RGA:</strong> ${reserva.siape_rga || 'N/A'}</p>
                    <p><strong>E-mail:</strong> ${reserva.email || 'N/A'}</p>
                    ${reserva.telefone ? `<p><strong>Telefone:</strong> ${reserva.telefone}</p>` : ''}
                </div>
            </div>
            
            ${recursos.length > 0 ? `
                <div class="row mt-3">
                    <div class="col-12">
                        <h6 class="text-primary">Recursos Reservados</h6>
                        ${recursos.join('<br>')}
                    </div>
                </div>
            ` : ''}
            
            <div class="row mt-3">
                <div class="col-12">
                    <h6 class="text-primary">Finalidade</h6>
                    <p>${reserva.finalidade || 'Não informado'}</p>
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
            
            ${reserva.created_at ? `
                <div class="row mt-3">
                    <div class="col-12">
                        <small class="text-muted">
                            Solicitação feita em: ${criadoEm}
                        </small>
                    </div>
                </div>
            ` : ''}
        `;
        
        modal.show();
        
    } catch (error) {
        console.error('📅 Erro ao mostrar detalhes da reserva:', error);
        Utils.showToast('Erro ao exibir detalhes da reserva', 'danger');
    }
}

/**
 * Navegar para hoje
 */
function irParaHoje() {
    console.log('📅 Tentando navegar para hoje...');
    if (calendario && typeof calendario.today === 'function') {
        try {
            calendario.today();
            console.log('📅 Navegado para hoje com sucesso');
            Utils.showToast('Navegado para hoje', 'success');
        } catch (error) {
            console.error('📅 Erro ao navegar para hoje:', error);
            Utils.showToast('Erro ao navegar para hoje', 'danger');
        }
    } else {
        console.error('📅 Calendário não inicializado ou método today não disponível');
        Utils.showToast('Erro: calendário não inicializado', 'danger');
    }
}

/**
 * Atualizar calendário
 */
function atualizarCalendario() {
    if (calendario) {
        const view = calendario.view;
        carregarEventos(view.activeStart, view.activeEnd);
        Utils.showToast('Calendário atualizado', 'success');
    } else {
        console.error('📅 Calendário não inicializado');
        Utils.showToast('Erro: calendário não inicializado', 'danger');
    }
}

/**
 * Mudar visualização do calendário
 */
function mudarVisao(visao) {
    if (calendario) {
        calendario.changeView(visao);
        Utils.showToast(`Visualização alterada para ${visao === 'dayGridMonth' ? 'Mês' : visao === 'timeGridWeek' ? 'Semana' : 'Dia'}`, 'info');
    } else {
        console.error('📅 Calendário não inicializado');
        Utils.showToast('Erro: calendário não inicializado', 'danger');
    }
}

// Exportar funções para uso global
window.aplicarFiltros = aplicarFiltros;
window.irParaHoje = irParaHoje;
window.atualizarCalendario = atualizarCalendario;
window.mudarVisao = mudarVisao;

