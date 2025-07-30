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
 * Mostrar resultado da busca - FUNÇÃO GLOBAL
 */
function mostrarResultadoBusca(reservas) {
    console.log('🔍 [BuscaGlobal] Mostrando resultado:', reservas);
    
    const resultadoDiv = document.getElementById('resultadoBusca');
    if (!resultadoDiv) return;
    
    // Processar resultado
    const isArray = Array.isArray(reservas);
    const listaReservas = isArray ? reservas : [reservas];
    const primeiraReserva = listaReservas[0];
    
    if (!primeiraReserva) {
        resultadoDiv.innerHTML = '<div class="alert alert-warning">Dados de reserva inválidos</div>';
        return;
    }

    // Formatação
    const status = formatarStatus(primeiraReserva.status);
    const dataFormatada = formatarData(primeiraReserva.data_reserva);
    const horaInicio = primeiraReserva.hora_inicio ? primeiraReserva.hora_inicio.substring(0, 5) : 'N/A';
    const horaFim = primeiraReserva.hora_fim ? primeiraReserva.hora_fim.substring(0, 5) : 'N/A';
    
    // Recursos
    let recursos = [];
    if (primeiraReserva.laboratorios && primeiraReserva.laboratorios.nome) {
        recursos.push(`Laboratório: ${primeiraReserva.laboratorios.nome}`);
    }
    if (primeiraReserva.reserva_equipamentos && primeiraReserva.reserva_equipamentos.length > 0) {
        const equipamentos = primeiraReserva.reserva_equipamentos
            .map(re => re.equipamentos ? re.equipamentos.nome : 'N/A')
            .join(', ');
        recursos.push(`Equipamentos: ${equipamentos}`);
    }

    resultadoDiv.innerHTML = `
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <h6 class="mb-0">Protocolo: ${primeiraReserva.protocolo}</h6>
                <span class="badge ${status.classe}">${status.texto}</span>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-6">
                        <strong>Solicitante:</strong><br>
                        ${primeiraReserva.nome_completo || 'N/A'}<br>
                        <small class="text-muted">${primeiraReserva.email || 'N/A'}</small>
                    </div>
                    <div class="col-md-6">
                        <strong>Data/Horário:</strong><br>
                        ${dataFormatada}<br>
                        <small class="text-muted">${horaInicio} às ${horaFim}</small>
                    </div>
                </div>
                <div class="mt-3">
                    <strong>Recursos:</strong><br>
                    ${recursos.length > 0 ? recursos.join('<br>') : 'N/A'}
                </div>
                <div class="mt-3">
                    <strong>Finalidade:</strong><br>
                    ${primeiraReserva.finalidade || 'N/A'}
                </div>
                ${primeiraReserva.motivo_rejeicao ? `
                    <div class="mt-3">
                        <strong>Motivo da Rejeição:</strong><br>
                        <span class="text-danger">${primeiraReserva.motivo_rejeicao}</span>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
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

// EXPORTAR FUNÇÕES GLOBALMENTE - IMEDIATAMENTE
window.abrirBuscaReserva = abrirBuscaReserva;
window.buscarReserva = buscarReserva;
window.mostrarResultadoBusca = mostrarResultadoBusca;

console.log('🔍 [BuscaGlobal] Funções exportadas globalmente:', {
    abrirBuscaReserva: typeof window.abrirBuscaReserva,
    buscarReserva: typeof window.buscarReserva,
    mostrarResultadoBusca: typeof window.mostrarResultadoBusca
});

console.log('🔍 [BuscaGlobal] Módulo carregado completamente');
