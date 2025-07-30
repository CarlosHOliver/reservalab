/**
 * ReservaLAB - Sistema de Reservas de Laboratórios e Equipamentos
 * Dashboard Patrimonial JavaScript
 * 
 * Idealizado e Desenvolvido por Carlos Henrique C. de Oliveira - Tec. Laboratório de Informática FAEN/UFGD - Engenheiro da Computação
 */

// Variáveis globais
let calendarioPatrimonial;
let intervaloClock;
let filtrosAtivos = {
    bloco: '',
    tipoRecurso: '',
    status: ''
};
let reservasOriginais = []; // Cache das reservas originais

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard Patrimonial - Inicializando...');
    
    // Inicializar componentes
    inicializarRelogio();
    inicializarFiltros();
    inicializarCalendario();
    carregarDadosDashboard();
    
    // Configurar auto-refresh a cada 30 segundos
    setInterval(carregarDadosDashboard, 30000);
    
    console.log('Dashboard Patrimonial - Inicializado com sucesso!');
});

/**
 * Inicializar relógio de Cuiabá
 */
function inicializarRelogio() {
    function atualizarRelogio() {
        const agora = new Date();
        const options = {
            timeZone: 'America/Cuiaba',
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        
        const horarioCuiaba = agora.toLocaleTimeString('pt-BR', options);
        const elementoRelogio = document.getElementById('relogioCuiaba');
        
        if (elementoRelogio) {
            elementoRelogio.textContent = horarioCuiaba;
        }
    }
    
    // Atualizar imediatamente e depois a cada segundo
    atualizarRelogio();
    intervaloClock = setInterval(atualizarRelogio, 1000);
}

/**
 * Inicializar sistema de filtros
 */
function inicializarFiltros() {
    console.log('🔧 Inicializando sistema de filtros');
    
    // Carregar opções de blocos
    carregarBlocosNoFiltro();
    
    // Event listeners para os filtros
    document.getElementById('filtro-bloco')?.addEventListener('change', function() {
        console.log('🔍 Filtro bloco alterado para:', this.value);
        filtrosAtivos.bloco = this.value;
        aplicarFiltros();
    });
    
    document.getElementById('filtro-tipo')?.addEventListener('change', function() {
        console.log('🔍 Filtro tipo alterado para:', this.value);
        filtrosAtivos.tipoRecurso = this.value;
        aplicarFiltros();
    });
    
    document.getElementById('filtro-status')?.addEventListener('change', function() {
        console.log('🔍 Filtro status alterado para:', this.value);
        filtrosAtivos.status = this.value;
        aplicarFiltros();
    });
    
    document.getElementById('filtro-visualizacao')?.addEventListener('change', function() {
        console.log('🔍 Filtro visualização alterado para:', this.value);
        filtrosAtivos.visualizacao = this.value;
        mudarVisualizacao(this.value);
        mostrarFiltrosAplicados();
    });
    
    // Botão limpar filtros
    document.getElementById('btn-limpar-filtros')?.addEventListener('click', limparFiltros);
    
    console.log('✅ Sistema de filtros inicializado');
}

/**
 * Carregar blocos disponíveis no filtro
 */
async function carregarBlocosNoFiltro() {
    try {
        console.log('📋 Carregando blocos para o filtro...');
        
        const resultado = await API.buscarLaboratorios();
        
        if (resultado.sucesso && resultado.dados) {
            const selectBloco = document.getElementById('filtro-bloco');
            if (!selectBloco) return;
            
            // Extrair blocos únicos
            const blocosUnicos = [...new Set(resultado.dados.map(lab => lab.bloco))].sort();
            
            // Limpar opções existentes (exceto "Todos")
            selectBloco.innerHTML = '<option value="todos">Todos os Blocos</option>';
            
            // Adicionar opções de blocos
            blocosUnicos.forEach(bloco => {
                if (bloco) {
                    const option = document.createElement('option');
                    option.value = bloco;
                    option.textContent = `Bloco ${bloco}`;
                    selectBloco.appendChild(option);
                }
            });
            
            console.log(`✅ ${blocosUnicos.length} blocos carregados no filtro`);
        }
    } catch (error) {
        console.error('❌ Erro ao carregar blocos para filtro:', error);
    }
}

/**
 * Aplicar filtros no calendário
 */
// Função para aplicar filtros ativos às reservas
function aplicarFiltros() {
    console.log('🔍 Aplicando filtros:', filtrosAtivos);
    
    // Atualizar eventos do calendário
    if (calendarioPatrimonial) {
        calendarioPatrimonial.refetchEvents();
    }
    
    // Mostrar filtros aplicados
    mostrarFiltrosAplicados();
    
    // Atualizar contador
    atualizarContadorFiltrados();
}

// Função para atualizar contador de reservas filtradas
function atualizarContadorFiltrados() {
    if (reservasOriginais.length > 0) {
        const reservasFiltradas = filtrarReservas(reservasOriginais);
        const elementoContador = document.getElementById('totalReservasVisivel');
        if (elementoContador) {
            elementoContador.textContent = reservasFiltradas.length;
        }
        
        // Mostrar informação adicional se houver filtros ativos
        const temFiltrosAtivos = filtrosAtivos.bloco !== 'todos' || 
                                filtrosAtivos.tipoRecurso !== 'todos' || 
                                filtrosAtivos.status !== 'todos';
        
        if (temFiltrosAtivos) {
            const elementoContadorContainer = document.getElementById('contadorFiltrados');
            if (elementoContadorContainer) {
                elementoContadorContainer.innerHTML = `
                    Mostrando: <strong id="totalReservasVisivel">${reservasFiltradas.length}</strong> de ${reservasOriginais.length} reservas
                `;
            }
        } else {
            const elementoContadorContainer = document.getElementById('contadorFiltrados');
            if (elementoContadorContainer) {
                elementoContadorContainer.innerHTML = `
                    Total: <strong id="totalReservasVisivel">${reservasFiltradas.length}</strong> reservas
                `;
            }
        }
    }
}

// Função para mostrar quais filtros estão ativos
function mostrarFiltrosAplicados() {
    const filtrosContainer = document.getElementById('filtros-aplicados');
    if (!filtrosContainer) return;
    
    const filtrosAtivosArray = [];
    
    if (filtrosAtivos.bloco !== 'todos') {
        const selectBloco = document.getElementById('filtro-bloco');
        const textoBloco = selectBloco?.options[selectBloco.selectedIndex]?.text || filtrosAtivos.bloco;
        filtrosAtivosArray.push(`Bloco: ${textoBloco}`);
    }
    
    if (filtrosAtivos.tipoRecurso !== 'todos') {
        const selectTipo = document.getElementById('filtro-tipo');
        const textoTipo = selectTipo?.options[selectTipo.selectedIndex]?.text || filtrosAtivos.tipoRecurso;
        filtrosAtivosArray.push(`Tipo: ${textoTipo}`);
    }
    
    if (filtrosAtivos.status !== 'todos') {
        const selectStatus = document.getElementById('filtro-status');
        const textoStatus = selectStatus?.options[selectStatus.selectedIndex]?.text || filtrosAtivos.status;
        filtrosAtivosArray.push(`Status: ${textoStatus}`);
    }
    
    if (filtrosAtivos.visualizacao !== 'semana') {
        const selectVis = document.getElementById('filtro-visualizacao');
        const textoVis = selectVis?.options[selectVis.selectedIndex]?.text || filtrosAtivos.visualizacao;
        filtrosAtivosArray.push(`Visualização: ${textoVis}`);
    }
    
    if (filtrosAtivosArray.length > 0) {
        filtrosContainer.innerHTML = `
            <small class="text-muted">
                <i class="fas fa-filter me-1"></i>
                Filtros ativos: ${filtrosAtivosArray.join(' | ')}
            </small>
        `;
    } else {
        filtrosContainer.innerHTML = '';
    }
}

/**
 * Limpar todos os filtros
 */
function limparFiltros() {
    // Resetar selects com IDs corretos
    const selectBloco = document.getElementById('filtro-bloco');
    const selectTipo = document.getElementById('filtro-tipo');
    const selectStatus = document.getElementById('filtro-status');
    const selectVis = document.getElementById('filtro-visualizacao');
    
    if (selectBloco) selectBloco.value = 'todos';
    if (selectTipo) selectTipo.value = 'todos';
    if (selectStatus) selectStatus.value = 'todos';
    if (selectVis) selectVis.value = 'semana';
    
    // Resetar filtros para valores padrão
    filtrosAtivos = {
        bloco: 'todos',
        tipoRecurso: 'todos',
        status: 'todos',
        visualizacao: 'semana'
    };
    
    console.log('🗑️ Filtros limpos');
    
    // Mudar visualização do calendário para padrão
    if (calendarioPatrimonial) {
        calendarioPatrimonial.changeView('timeGridWeek');
        calendarioPatrimonial.refetchEvents();
    }
    
    // Atualizar indicador de filtros
    mostrarFiltrosAplicados();
    atualizarContadorFiltrados();
}

/**
 * Mudar visualização do calendário
 */
function mudarVisualizacao(novaView) {
    if (!calendarioPatrimonial) return;
    
    let viewFullCalendar;
    switch(novaView) {
        case 'dia':
            viewFullCalendar = 'timeGridDay';
            break;
        case 'mes':
            viewFullCalendar = 'dayGridMonth';
            break;
        case 'semana':
        default:
            viewFullCalendar = 'timeGridWeek';
            break;
    }
    
    console.log(`📅 Mudando visualização para: ${novaView} (${viewFullCalendar})`);
    calendarioPatrimonial.changeView(viewFullCalendar);
}

/**
 * Filtrar reservas baseado nos filtros ativos
 */
function filtrarReservas(reservas) {
    let reservasFiltradas = [...reservas];
    
    console.log('🔍 Aplicando filtros:', filtrosAtivos);
    console.log('📊 Reservas originais:', reservas.length);
    
    // Filtro por bloco
    if (filtrosAtivos.bloco && filtrosAtivos.bloco !== 'todos') {
        reservasFiltradas = reservasFiltradas.filter(reserva => {
            const blocoReserva = reserva.laboratorios?.bloco || 
                                reserva.equipamentos?.[0]?.laboratorio?.bloco ||
                                reserva.laboratorio?.bloco;
            return blocoReserva === filtrosAtivos.bloco;
        });
        console.log(`📋 Após filtro bloco "${filtrosAtivos.bloco}":`, reservasFiltradas.length);
    }
    
    // Filtro por tipo de recurso
    if (filtrosAtivos.tipoRecurso && filtrosAtivos.tipoRecurso !== 'todos') {
        reservasFiltradas = reservasFiltradas.filter(reserva => {
            if (filtrosAtivos.tipoRecurso === 'laboratorio') {
                return reserva.laboratorios || reserva.laboratorio;
            } else if (filtrosAtivos.tipoRecurso === 'equipamento') {
                return reserva.equipamentos && reserva.equipamentos.length > 0;
            }
            return true;
        });
        console.log(`🔧 Após filtro tipo "${filtrosAtivos.tipoRecurso}":`, reservasFiltradas.length);
    }
    
    // Filtro por status
    if (filtrosAtivos.status && filtrosAtivos.status !== 'todos') {
        reservasFiltradas = reservasFiltradas.filter(reserva => {
            return reserva.status === filtrosAtivos.status;
        });
        console.log(`📊 Após filtro status "${filtrosAtivos.status}":`, reservasFiltradas.length);
    }
    
    console.log('✅ Reservas filtradas final:', reservasFiltradas.length);
    return reservasFiltradas;
}

/**
 * Inicializar calendário FullCalendar
 */
function inicializarCalendario() {
    const calendarEl = document.getElementById('calendarioPatrimonial');
    
    if (!calendarEl) {
        console.error('Elemento calendarioPatrimonial não encontrado');
        return;
    }
    
    calendarioPatrimonial = new FullCalendar.Calendar(calendarEl, {
        locale: 'pt-br',
        initialView: 'timeGridWeek',
        timeZone: 'America/Cuiaba',
        height: 600,
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: '' // Removido botões redundantes - usando filtros no cabeçalho
        },
        buttonText: {
            today: 'Hoje'
        },
        slotMinTime: '06:00:00',
        slotMaxTime: '22:00:00',
        slotDuration: '00:30:00',
        slotLabelInterval: '01:00:00',
        businessHours: {
            daysOfWeek: [1, 2, 3, 4, 5],
            startTime: '07:00',
            endTime: '17:00'
        },
        nowIndicator: true,
        eventClick: function(info) {
            mostrarDetalhesReserva(info.event);
        },
        events: async function(fetchInfo, successCallback, failureCallback) {
            try {
                const resultado = await API.buscarReservasCalendario(
                    fetchInfo.startStr.split('T')[0],
                    fetchInfo.endStr.split('T')[0]
                );
                
                if (resultado.sucesso) {
                    // Armazenar reservas originais para filtragem
                    reservasOriginais = resultado.dados;
                    
                    // Aplicar filtros antes de processar eventos
                    const reservasFiltradas = filtrarReservas(resultado.dados);
                    
                    const eventos = reservasFiltradas.map(reserva => {
                        // Determinar recurso (laboratório ou equipamento)
                        const recurso = reserva.laboratorios ? 
                            reserva.laboratorios.nome : 
                            reserva.equipamentos?.map(eq => eq.nome).join(', ') || 'Equipamento';
                            
                        // Cores baseadas no status
                        let backgroundColor, borderColor;
                        switch(reserva.status) {
                            case 'aprovada':
                                backgroundColor = isReservaEmAndamento(reserva) ? '#28a745' : '#007bff';
                                borderColor = isReservaEmAndamento(reserva) ? '#1e7e34' : '#0056b3';
                                break;
                            case 'pendente':
                                backgroundColor = '#ffc107';
                                borderColor = '#d39e00';
                                break;
                            case 'rejeitada':
                                backgroundColor = '#dc3545';
                                borderColor = '#bd2130';
                                break;
                            case 'cancelada':
                                backgroundColor = '#6c757d';
                                borderColor = '#545b62';
                                break;
                            default:
                                backgroundColor = '#007bff';
                                borderColor = '#0056b3';
                        }
                        
                        return {
                            id: reserva.id,
                            title: `${recurso} - ${reserva.nome_completo}`,
                            start: `${reserva.data_reserva}T${reserva.hora_inicio}`,
                            end: `${reserva.data_reserva}T${reserva.hora_fim}`,
                            backgroundColor: backgroundColor,
                            borderColor: borderColor,
                            className: isReservaEmAndamento(reserva) ? 'fc-event-em-andamento' : '',
                            extendedProps: {
                                reserva: reserva,
                                bloco: reserva.laboratorios?.bloco || reserva.equipamentos?.[0]?.laboratorio?.bloco || 'N/A',
                                tipo: reserva.laboratorios ? 'laboratorio' : 'equipamento',
                                status: reserva.status
                            }
                        };
                    });
                    
                    successCallback(eventos);
                    
                    // Atualizar contador após carregar eventos
                    setTimeout(() => {
                        atualizarContadorFiltrados();
                    }, 100);
                } else {
                    console.error('Erro ao carregar eventos do calendário:', resultado.erro);
                    failureCallback(resultado.erro);
                }
            } catch (error) {
                console.error('Erro ao buscar eventos:', error);
                failureCallback(error);
            }
        }
    });
    
    calendarioPatrimonial.render();
}

/**
 * Verificar se a reserva está em andamento
 */
function isReservaEmAndamento(reserva) {
    const agora = new Date();
    const inicioReserva = new Date(`${reserva.data_reserva}T${reserva.hora_inicio}`);
    const fimReserva = new Date(`${reserva.data_reserva}T${reserva.hora_fim}`);
    
    return agora >= inicioReserva && agora <= fimReserva;
}

/**
 * Carregar dados do dashboard
 */
async function carregarDadosDashboard() {
    try {
        const hoje = new Date().toISOString().split('T')[0];
        const amanha = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        
        console.log('📊 Dashboard: Carregando dados para:', { hoje, amanha });
        
        // Buscar reservas de hoje e amanhã
        const [resultadoHoje, resultadoAmanha] = await Promise.all([
            API.buscarReservasDia(hoje),
            API.buscarReservasDia(amanha)
        ]);
        
        console.log('📊 Dashboard: Resultados obtidos:', { resultadoHoje, resultadoAmanha });
        
        if (resultadoHoje.sucesso) {
            preencherTabelaReservas('tabelaReservasHoje', resultadoHoje.dados, 'contadorHoje');
            atualizarEstatisticas(resultadoHoje.dados);
        } else {
            console.error('Erro ao carregar reservas de hoje:', resultadoHoje.erro);
            mostrarErroTabela('tabelaReservasHoje', 'Erro ao carregar reservas de hoje');
        }
        
        if (resultadoAmanha.sucesso) {
            preencherTabelaReservas('tabelaReservasAmanha', resultadoAmanha.dados, 'contadorAmanha');
            document.getElementById('totalReservasAmanha').textContent = resultadoAmanha.dados.length;
        } else {
            console.error('Erro ao carregar reservas de amanhã:', resultadoAmanha.erro);
            mostrarErroTabela('tabelaReservasAmanha', 'Erro ao carregar reservas de amanhã');
        }
        
    } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
        Utils.showToast('Erro ao carregar dados do dashboard', 'danger');
    }
}

/**
 * Preencher tabela de reservas
 */
function preencherTabelaReservas(tabelaId, reservas, contadorId) {
    const tbody = document.getElementById(tabelaId);
    const contador = document.getElementById(contadorId);
    
    if (!tbody) {
        console.error(`Tabela ${tabelaId} não encontrada`);
        return;
    }
    
    if (!reservas || reservas.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center text-muted py-4">
                    <i class="bi bi-calendar-x"></i><br>
                    Nenhuma reserva encontrada
                </td>
            </tr>
        `;
        if (contador) contador.textContent = '0';
        return;
    }
    
    let html = '';
    reservas.forEach(reserva => {
        const emAndamento = isReservaEmAndamento(reserva);
        const recurso = reserva.laboratorios ? reserva.laboratorios.nome : 
                       reserva.reserva_equipamentos?.[0]?.equipamentos?.nome || 'N/A';
        
        const statusClass = emAndamento ? 'reserva-em-andamento' : '';
        const statusTexto = emAndamento ? 
            '<span class="badge bg-success"><i class="bi bi-play-circle"></i> Em Andamento</span>' :
            `<span class="badge bg-secondary">${reserva.hora_inicio} - ${reserva.hora_fim}</span>`;
        
        html += `
            <tr class="${statusClass}" onclick="buscarDetalhesReserva('${reserva.protocolo}')" style="cursor: pointer;">
                <td>
                    <strong>${reserva.hora_inicio}</strong><br>
                    <small class="text-muted">${reserva.hora_fim}</small>
                </td>
                <td>
                    <strong>${recurso}</strong><br>
                    <small class="text-muted">Protocolo: ${reserva.protocolo}</small>
                </td>
                <td>
                    <strong>${reserva.nome_completo}</strong><br>
                    <small class="text-muted">${reserva.email}</small>
                </td>
                <td class="text-center">
                    ${statusTexto}
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
    if (contador) contador.textContent = reservas.length;
}

/**
 * Mostrar erro na tabela
 */
function mostrarErroTabela(tabelaId, mensagem) {
    const tbody = document.getElementById(tabelaId);
    if (tbody) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center text-danger py-4">
                    <i class="bi bi-exclamation-triangle"></i><br>
                    ${mensagem}
                </td>
            </tr>
        `;
    }
}

/**
 * Atualizar estatísticas do dashboard
 */
function atualizarEstatisticas(reservasHoje) {
    if (!reservasHoje) return;
    
    let emAndamento = 0;
    let proximasReservas = 0;
    const agora = new Date();
    const duasHoras = new Date(agora.getTime() + 2 * 60 * 60 * 1000);
    
    reservasHoje.forEach(reserva => {
        if (isReservaEmAndamento(reserva)) {
            emAndamento++;
        }
        
        const inicioReserva = new Date(`${reserva.data_reserva}T${reserva.hora_inicio}`);
        if (inicioReserva > agora && inicioReserva <= duasHoras) {
            proximasReservas++;
        }
    });
    
    document.getElementById('totalReservasHoje').textContent = reservasHoje.length;
    document.getElementById('reservasEmAndamento').textContent = emAndamento;
    document.getElementById('proximasReservas').textContent = proximasReservas;
}

/**
 * Buscar detalhes de uma reserva pelo protocolo
 */
async function buscarDetalhesReserva(protocolo) {
    try {
        const resultado = await API.buscarReservaPorProtocolo(protocolo);
        
        if (resultado.sucesso && resultado.dados.length > 0) {
            mostrarDetalhesReservaModal(resultado.dados[0]);
        } else {
            Utils.showToast('Reserva não encontrada', 'warning');
        }
    } catch (error) {
        console.error('Erro ao buscar detalhes da reserva:', error);
        Utils.showToast('Erro ao carregar detalhes da reserva', 'danger');
    }
}

/**
 * Mostrar detalhes da reserva em modal
 */
function mostrarDetalhesReservaModal(reserva) {
    const modal = document.getElementById('modalDetalhesReserva');
    const content = document.getElementById('detalhesReservaContent');
    
    if (!modal || !content) return;
    
    const recurso = reserva.laboratorios ? 
        `${reserva.laboratorios.nome} (${reserva.laboratorios.blocos?.nome || 'N/A'})` :
        reserva.reserva_equipamentos?.[0]?.equipamentos?.nome || 'N/A';
    
    const emAndamento = isReservaEmAndamento(reserva);
    
    content.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <h6><i class="bi bi-bookmark"></i> Informações da Reserva</h6>
                <table class="table table-sm">
                    <tr>
                        <td><strong>Protocolo:</strong></td>
                        <td>${reserva.protocolo}</td>
                    </tr>
                    <tr>
                        <td><strong>Data:</strong></td>
                        <td>${new Date(reserva.data_reserva + 'T00:00:00').toLocaleDateString('pt-BR')}</td>
                    </tr>
                    <tr>
                        <td><strong>Horário:</strong></td>
                        <td>${reserva.hora_inicio} - ${reserva.hora_fim}</td>
                    </tr>
                    <tr>
                        <td><strong>Recurso:</strong></td>
                        <td>${recurso}</td>
                    </tr>
                    <tr>
                        <td><strong>Status:</strong></td>
                        <td>
                            ${emAndamento ? 
                                '<span class="badge bg-success"><i class="bi bi-play-circle"></i> Em Andamento</span>' :
                                '<span class="badge bg-primary">Agendado</span>'
                            }
                        </td>
                    </tr>
                </table>
            </div>
            <div class="col-md-6">
                <h6><i class="bi bi-person"></i> Solicitante</h6>
                <table class="table table-sm">
                    <tr>
                        <td><strong>Nome:</strong></td>
                        <td>${reserva.nome_completo}</td>
                    </tr>
                    <tr>
                        <td><strong>Email:</strong></td>
                        <td>${reserva.email}</td>
                    </tr>
                    <tr>
                        <td><strong>Telefone:</strong></td>
                        <td>${reserva.telefone || 'N/A'}</td>
                    </tr>
                </table>
                
                ${reserva.finalidade ? `
                    <h6><i class="bi bi-chat-text"></i> Finalidade</h6>
                    <div class="alert alert-info">
                        ${reserva.finalidade}
                    </div>
                ` : ''}
            </div>
        </div>
    `;
    
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();
}

/**
 * Mostrar detalhes da reserva (usado pelo FullCalendar)
 */
function mostrarDetalhesReserva(event) {
    const reserva = event.extendedProps.reserva;
    mostrarDetalhesReservaModal(reserva);
}

/**
 * Alterar visualização do calendário
 */
function alterarVisualizacaoCalendario(view) {
    if (calendarioPatrimonial) {
        calendarioPatrimonial.changeView(view);
    }
}

/**
 * Mostrar modal de report
 */
function mostrarModalReport() {
    const modal = document.getElementById('modalReport');
    if (modal) {
        const bootstrapModal = new bootstrap.Modal(modal);
        bootstrapModal.show();
    }
}

/**
 * Processar envio do formulário de report
 */
document.addEventListener('DOMContentLoaded', function() {
    const formReport = document.getElementById('formReport');
    
    if (formReport) {
        formReport.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const tipoEventualidade = document.getElementById('tipoEventualidade').value;
            const protocoloRelacionado = document.getElementById('protocoloRelacionado').value.trim();
            const descricaoEventualidade = document.getElementById('descricaoEventualidade').value.trim();
            const senhaReport = document.getElementById('senhaReport').value;
            
            // Validar campos obrigatórios
            if (!tipoEventualidade || !descricaoEventualidade || !senhaReport) {
                Utils.showToast('Preencha todos os campos obrigatórios', 'warning');
                return;
            }
            
            try {
                // Verificar senha do usuário portaria
                const resultadoAuth = await API.verificarCredenciais('portaria', senhaReport);
                if (!resultadoAuth.sucesso) {
                    Utils.showToast('Senha de autorização inválida', 'danger');
                    return;
                }
                
                // Preparar dados do report
                const dadosReport = {
                    tipo_eventualidade: tipoEventualidade,
                    protocolo_relacionado: protocoloRelacionado || null,
                    descricao: descricaoEventualidade,
                    autor_nome: 'Divisão de Proteção Patrimonial',
                    autor_ip: null, // Pode ser capturado no backend se necessário
                    prioridade: tipoEventualidade === 'equipamento_danificado' ? 'alta' : 'normal'
                };
                
                // Enviar report
                const resultado = await API.criarReport(dadosReport);
                
                if (resultado.sucesso) {
                    Utils.showToast('Report enviado com sucesso! Protocolo: #' + resultado.dados.id, 'success');
                    formReport.reset();
                    bootstrap.Modal.getInstance(document.getElementById('modalReport')).hide();
                    
                    // Log para auditoria
                    console.log('Report criado:', resultado.dados);
                } else {
                    Utils.showToast('Erro ao enviar report: ' + resultado.erro, 'danger');
                }
                
            } catch (error) {
                console.error('Erro ao processar report:', error);
                Utils.showToast('Erro interno ao processar report', 'danger');
            }
        });
    }
});

/**
 * Função de teste para validar sistema de filtros
 */
function testarSistemaFiltros() {
    console.log('🧪 Testando sistema de filtros...');
    console.log('Filtros ativos atuais:', filtrosAtivos);
    
    // Testar se elementos existem
    const elementos = {
        'filtro-bloco': document.getElementById('filtro-bloco'),
        'filtro-tipo': document.getElementById('filtro-tipo'),
        'filtro-status': document.getElementById('filtro-status'),
        'filtro-visualizacao': document.getElementById('filtro-visualizacao'),
        'btn-limpar-filtros': document.getElementById('btn-limpar-filtros'),
        'filtros-aplicados': document.getElementById('filtros-aplicados')
    };
    
    let todosExistem = true;
    for (const [id, elemento] of Object.entries(elementos)) {
        if (!elemento) {
            console.error(`❌ Elemento ${id} não encontrado`);
            todosExistem = false;
        } else {
            console.log(`✅ Elemento ${id} encontrado`);
        }
    }
    
    if (todosExistem) {
        console.log('✅ Todos os elementos do sistema de filtros estão presentes');
        
        // Testar uma mudança de filtro
        if (reservasOriginais.length > 0) {
            console.log(`📊 Testando filtragem com ${reservasOriginais.length} reservas`);
            const reservasFiltradas = filtrarReservas(reservasOriginais);
            console.log(`📊 Resultado da filtragem: ${reservasFiltradas.length} reservas`);
        }
    } else {
        console.error('❌ Sistema de filtros não está completamente configurado');
    }
    
    return todosExistem;
}

// Adicionar função ao escopo global para testes
window.testarSistemaFiltros = testarSistemaFiltros;

// Cleanup ao sair da página
window.addEventListener('beforeunload', function() {
    if (intervaloClock) {
        clearInterval(intervaloClock);
    }
});

// Cleanup ao sair da página
window.addEventListener('beforeunload', function() {
    if (intervaloClock) {
        clearInterval(intervaloClock);
    }
});
