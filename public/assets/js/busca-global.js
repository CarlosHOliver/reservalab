/**
 * Módulo de Busca Global - ReservaLAB (Versão Deploy Corrigida)
 * Sistema reutilizável de busca de reservas por protocolo
 * Versão simplificada para melhor compatibilidade
 */

console.log('🔍 [BuscaGlobal] Carregando módulo...');

/**
 * Abrir modal de busca de reservas - FUNÇÃO GLOBAL
 */
function abrirBuscaReserva() {
    console.log('🔍 [BuscaGlobal] abrirBuscaReserva chamada');
    
    try {
        // Verificar se Bootstrap está disponível
        if (typeof bootstrap === 'undefined') {
            console.error('🔍 [BuscaGlobal] Bootstrap não carregado');
            alert('Erro: Bootstrap não carregado. Recarregue a página.');
            return;
        }
        
        // Criar modal se não existir
        let modalElement = document.getElementById('modalBuscaReserva');
        if (!modalElement) {
            console.log('🔍 [BuscaGlobal] Criando modal...');
            criarModalBusca();
            modalElement = document.getElementById('modalBuscaReserva');
        }
        
        if (!modalElement) {
            throw new Error('Não foi possível criar o modal');
        }
        
        // Abrir modal
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
        
        // Limpar campos
        const protocoloBusca = document.getElementById('protocoloBusca');
        const resultadoBusca = document.getElementById('resultadoBusca');
        
        if (protocoloBusca) protocoloBusca.value = '';
        if (resultadoBusca) resultadoBusca.innerHTML = '';
        
        console.log('🔍 [BuscaGlobal] Modal aberto com sucesso');
        
    } catch (error) {
        console.error('🔍 [BuscaGlobal] Erro ao abrir modal:', error);
        alert('Erro ao abrir janela de busca: ' + error.message);
    }
}

/**
 * Criar modal de busca
 */
function criarModalBusca() {
    const modalHtml = `
        <!-- Modal de Busca de Reserva -->
        <div class="modal fade" id="modalBuscaReserva" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="bi bi-search"></i> Buscar Reserva
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="protocoloBusca" class="form-label">Protocolo da Reserva</label>
                            <input type="text" class="form-control" id="protocoloBusca" placeholder="Ex: 202510000001" maxlength="12">
                            <small class="text-muted">Informe o protocolo recebido após a solicitação (12 dígitos)</small>
                        </div>
                        <div id="resultadoBusca"></div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                        <button type="button" class="btn btn-primary" onclick="buscarReserva()">
                            <i class="bi bi-search"></i> Buscar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Adicionar evento Enter
    const protocoloInput = document.getElementById('protocoloBusca');
    if (protocoloInput) {
        protocoloInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                buscarReserva();
            }
        });
    }
}

/**
 * Buscar reserva por protocolo - FUNÇÃO GLOBAL
 */
async function buscarReserva() {
    console.log('🔍 [BuscaGlobal] buscarReserva chamada');
    
    const protocoloInput = document.getElementById('protocoloBusca');
    const resultadoDiv = document.getElementById('resultadoBusca');
    
    if (!protocoloInput || !resultadoDiv) {
        console.error('🔍 [BuscaGlobal] Elementos do modal não encontrados');
        alert('Erro: Elementos da interface não encontrados.');
        return;
    }

    const protocolo = protocoloInput.value.trim();
    
    if (!protocolo) {
        alert('Por favor, informe o protocolo');
        return;
    }
    
    // Validação de protocolo
    if (protocolo.length !== 12 || !/^\d{12}$/.test(protocolo)) {
        alert('Protocolo deve ter exatamente 12 dígitos');
        return;
    }
    
    // Mostrar loading
    resultadoDiv.innerHTML = `
        <div class="d-flex justify-content-center align-items-center py-3">
            <div class="spinner-border text-primary me-2" role="status">
                <span class="visually-hidden">Carregando...</span>
            </div>
            <span>Buscando reserva...</span>
        </div>
    `;
    
    try {
        // Verificar API
        if (typeof API === 'undefined') {
            throw new Error('API não está disponível. Recarregue a página.');
        }
        
        if (typeof API.buscarReservaPorProtocolo !== 'function') {
            throw new Error('Função de busca não disponível. Verifique a conexão.');
        }
        
        const resultado = await API.buscarReservaPorProtocolo(protocolo);
        
        if (!resultado.sucesso) {
            // Reserva não encontrada
            resultadoDiv.innerHTML = `
                <div class="alert alert-info">
                    <i class="bi bi-info-circle"></i>
                    <strong>Reserva não encontrada</strong><br>
                    Protocolo <code>${protocolo}</code> não foi encontrado no sistema.<br><br>
                    <small class="text-muted">
                        <strong>💡 Dica:</strong> Verifique se o protocolo foi digitado corretamente.
                    </small>
                </div>
            `;
            return;
        }
        
        // Mostrar resultado
        mostrarResultadoBusca(resultado.dados);
        
    } catch (error) {
        console.error('🔍 [BuscaGlobal] Erro na busca:', error);
        resultadoDiv.innerHTML = `
            <div class="alert alert-warning">
                <i class="bi bi-exclamation-triangle"></i>
                <strong>Erro na busca</strong><br>
                ${error.message}
            </div>
        `;
    }
}

/**
 * Mostrar resultado da busca - FUNÇÃO GLOBAL (Padrão Index Completo)
 */
function mostrarResultadoBusca(reservas) {
    console.log('🔍 [BuscaGlobal] Mostrando resultado:', reservas);
    
    const resultadoDiv = document.getElementById('resultadoBusca');
    if (!resultadoDiv) return;
    
    // Se for um array de reservas (recorrentes), mostrar todas
    if (Array.isArray(reservas)) {
        console.log('Processando array de reservas (recorrente):', reservas.length, 'reservas');
        const primeiraReserva = reservas[0];
        const status = formatarStatus(primeiraReserva.status);
        
        // Montar lista de recursos da primeira reserva (todas têm os mesmos recursos)
        let recursos = [];
        if (primeiraReserva.laboratorios) {
            recursos.push(`Laboratório: ${primeiraReserva.laboratorios.nome}`);
        }
        if (primeiraReserva.reserva_equipamentos && primeiraReserva.reserva_equipamentos.length > 0) {
            const equipamentos = primeiraReserva.reserva_equipamentos.map(re => re.equipamentos.nome).join(', ');
            recursos.push(`Equipamentos: ${equipamentos}`);
        }

        // Determinar se é recorrente
        const isRecorrente = reservas.length > 1;
        const tipoRecorrencia = primeiraReserva.recorrencia_tipo;

        resultadoDiv.innerHTML = `
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h6 class="mb-0">Protocolo: ${primeiraReserva.protocolo}</h6>
                    <div>
                        <span class="badge ${status.classe}">${status.texto}</span>
                        ${isRecorrente ? `<span class="badge bg-info ms-1">Recorrente (${reservas.length}x)</span>` : ''}
                    </div>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <strong>Solicitante:</strong><br>
                            ${primeiraReserva.nome_completo}<br>
                            <small class="text-muted">${primeiraReserva.email}</small>
                        </div>
                        <div class="col-md-6">
                            <strong>Recursos:</strong><br>
                            ${recursos.join('<br>')}
                        </div>
                    </div>
                    <div class="mt-3">
                        <strong>Finalidade:</strong><br>
                        ${primeiraReserva.finalidade}
                    </div>
                    
                    ${isRecorrente ? `
                        <div class="mt-3">
                            <strong>Tipo de Recorrência:</strong> ${tipoRecorrencia === 'diaria' ? 'Diária' : tipoRecorrencia === 'semanal' ? 'Semanal' : 'Mensal'}<br>
                            <strong>Total de Reservas:</strong> ${reservas.length}
                        </div>
                    ` : ''}
                    
                    <div class="mt-3">
                        <strong>${isRecorrente ? 'Datas das Reservas:' : 'Data/Horário:'}</strong><br>
                        <div class="row">
                            ${reservas.map(reserva => {
                                const statusReserva = formatarStatus(reserva.status);
                                const dataFormatada = formatarData(reserva.data_reserva);
                                const horaInicio = reserva.hora_inicio ? reserva.hora_inicio.substring(0, 5) : 'N/A';
                                const horaFim = reserva.hora_fim ? reserva.hora_fim.substring(0, 5) : 'N/A';
                                
                                return `
                                    <div class="col-md-6 mb-2">
                                        <div class="border rounded p-2 small">
                                            <strong>${dataFormatada}</strong><br>
                                            ${horaInicio} às ${horaFim}<br>
                                            <span class="badge ${statusReserva.classe} badge-sm">${statusReserva.texto}</span>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                    
                    ${primeiraReserva.motivo_rejeicao ? `
                        <div class="mt-3">
                            <strong>Motivo da Rejeição:</strong><br>
                            <span class="text-danger">${primeiraReserva.motivo_rejeicao}</span>
                        </div>
                    ` : ''}
                    
                    ${primeiraReserva.status === 'aprovada' ? `
                        <div class="mt-3 alert alert-success">
                            <div class="d-flex align-items-center mb-2">
                                <div class="flex-grow-1">
                                    <strong><i class="bi bi-file-earmark-text"></i> Solicitação de Acesso:</strong><br>
                                    <small class="text-muted">Obrigatório preencher e entregar à portaria do Prédio</small>
                                </div>
                                <div>
                                    <a href="docs/Aut.Acesso.docx" class="btn btn-success btn-sm" download>
                                        <i class="bi bi-download"></i> Download
                                    </a>
                                </div>
                            </div>
                            <div class="d-flex align-items-center">
                                <div class="flex-grow-1">
                                    <strong><i class="bi bi-calendar-plus"></i> Adicionar ao Calendário:</strong><br>
                                    <small class="text-muted">Adicione esta reserva à sua agenda pessoal (Google Calendar, Outlook, etc.)</small>
                                </div>
                                <div>
                                    <button class="btn btn-outline-info btn-sm" onclick="downloadICS('${primeiraReserva.protocolo}')">
                                        <i class="bi bi-calendar-plus"></i> Download .ics
                                    </button>
                                </div>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    } else {
        // Compatibilidade com reservas individuais
        console.log('Processando reserva individual:', reservas);
        const reserva = reservas;
        const status = formatarStatus(reserva.status);
        const dataFormatada = formatarData(reserva.data_reserva);
        const horaInicio = reserva.hora_inicio ? reserva.hora_inicio.substring(0, 5) : 'N/A';
        const horaFim = reserva.hora_fim ? reserva.hora_fim.substring(0, 5) : 'N/A';
        
        // Montar lista de recursos
        let recursos = [];
        if (reserva.laboratorios) {
            recursos.push(`Laboratório: ${reserva.laboratorios.nome}`);
        }
        if (reserva.reserva_equipamentos && reserva.reserva_equipamentos.length > 0) {
            const equipamentos = reserva.reserva_equipamentos.map(re => re.equipamentos.nome).join(', ');
            recursos.push(`Equipamentos: ${equipamentos}`);
        }
        
        resultadoDiv.innerHTML = `
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h6 class="mb-0">Protocolo: ${reserva.protocolo}</h6>
                    <span class="badge ${status.classe}">${status.texto}</span>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <strong>Solicitante:</strong><br>
                            ${reserva.nome_completo}<br>
                            <small class="text-muted">${reserva.email}</small>
                        </div>
                        <div class="col-md-6">
                            <strong>Data/Horário:</strong><br>
                            ${dataFormatada}<br>
                            <small class="text-muted">${horaInicio} às ${horaFim}</small>
                        </div>
                    </div>
                    <div class="mt-3">
                        <strong>Recursos:</strong><br>
                        ${recursos.join('<br>')}
                    </div>
                    <div class="mt-3">
                        <strong>Finalidade:</strong><br>
                        ${reserva.finalidade}
                    </div>
                    ${reserva.motivo_rejeicao ? `
                        <div class="mt-3">
                            <strong>Motivo da Rejeição:</strong><br>
                            <span class="text-danger">${reserva.motivo_rejeicao}</span>
                        </div>
                    ` : ''}
                    
                    ${reserva.status === 'aprovada' ? `
                        <div class="mt-3 alert alert-success">
                            <div class="d-flex align-items-center mb-2">
                                <div class="flex-grow-1">
                                    <strong><i class="bi bi-file-earmark-text"></i> Solicitação de Acesso:</strong><br>
                                    <small class="text-muted">Obrigatório preencher e entregar à portaria do Prédio</small>
                                </div>
                                <div>
                                    <a href="docs/Aut.Acesso.docx" class="btn btn-success btn-sm" download>
                                        <i class="bi bi-download"></i> Download
                                    </a>
                                </div>
                            </div>
                            <div class="d-flex align-items-center">
                                <div class="flex-grow-1">
                                    <strong><i class="bi bi-calendar-plus"></i> Adicionar ao Calendário:</strong><br>
                                    <small class="text-muted">Adicione esta reserva à sua agenda pessoal (Google Calendar, Outlook, etc.)</small>
                                </div>
                                <div>
                                    <button class="btn btn-outline-info btn-sm" onclick="downloadICS('${reserva.protocolo}')">
                                        <i class="bi bi-calendar-plus"></i> Download .ics
                                    </button>
                                </div>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
}

/**
 * Formatação de status
 */
function formatarStatus(status) {
    const statusMap = {
        'pendente': { classe: 'bg-warning text-dark', texto: 'Pendente' },
        'aprovada': { classe: 'bg-success', texto: 'Aprovada' },
        'rejeitada': { classe: 'bg-danger', texto: 'Rejeitada' },
        'cancelada': { classe: 'bg-secondary', texto: 'Cancelada' }
    };
    
    return statusMap[status] || { classe: 'bg-secondary', texto: status || 'Indefinido' };
}

/**
 * Formatação de data
 */
function formatarData(data) {
    if (!data) return 'Data inválida';
    try {
        const date = new Date(data);
        return date.toLocaleDateString('pt-BR');
    } catch (error) {
        return data.toString();
    }
}

/**
 * Download de arquivo iCal (.ics) para reserva aprovada
 */
function downloadICS(protocolo) {
    console.log('🔍 [BuscaGlobal] Download ICS solicitado para protocolo:', protocolo);
    
    try {
        // Verificar se ICalendarUtils está disponível (do arquivo icalendar.js)
        if (typeof ICalendarUtils !== 'undefined' && typeof ICalendarUtils.downloadICS === 'function') {
            ICalendarUtils.downloadICS(protocolo);
        } else {
            // Fallback simples se ICalendarUtils não estiver disponível
            console.warn('🔍 [BuscaGlobal] ICalendarUtils não disponível, usando fallback');
            alert('Funcionalidade de download de calendário temporariamente indisponível. Tente novamente em alguns instantes.');
        }
    } catch (error) {
        console.error('🔍 [BuscaGlobal] Erro ao gerar arquivo iCal:', error);
        alert('Erro ao gerar arquivo de calendário. Tente novamente.');
    }
}

// EXPORTAR FUNÇÕES GLOBALMENTE - IMEDIATAMENTE
window.abrirBuscaReserva = abrirBuscaReserva;
window.buscarReserva = buscarReserva;
window.mostrarResultadoBusca = mostrarResultadoBusca;
window.downloadICS = downloadICS;

console.log('🔍 [BuscaGlobal] Funções exportadas globalmente:', {
    abrirBuscaReserva: typeof window.abrirBuscaReserva,
    buscarReserva: typeof window.buscarReserva,
    mostrarResultadoBusca: typeof window.mostrarResultadoBusca,
    downloadICS: typeof window.downloadICS
});

console.log('🔍 [BuscaGlobal] Módulo carregado completamente');
