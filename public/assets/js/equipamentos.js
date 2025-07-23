/**
 * ReservaLAB - Sistema de Reservas de Laboratórios e Equipamentos
 * JavaScript da Página de Equipamentos
 * 
 * Idealizado e Desenvolvido por Carlos Henrique C. de Oliveira - Tec. Laboratório de Informática FAEN/UFGD - Engenheiro da Computação
 */

// Estado global da página
let estadoEquipamentos = {
    equipamentos: [],
    equipamentosFiltrados: [],
    visualizacaoAtual: 'cards',
    filtros: {
        busca: '',
        bloco: '',
        status: '',
        compartilhado: ''
    },
    equipamentoSelecionado: null
};

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    inicializarPagina();
});

/**
 * Inicializar página de equipamentos
 */
async function inicializarPagina() {
    try {
        // Configurar eventos
        configurarEventos();
        
        // Carregar filtros
        await carregarFiltros();
        
        // Carregar equipamentos
        await carregarEquipamentos();
        
        console.log('Página de equipamentos inicializada');
    } catch (error) {
        console.error('Erro ao inicializar página:', error);
        Utils.showToast('Erro ao carregar página de equipamentos', 'danger');
    }
}

/**
 * Configurar eventos da página
 */
function configurarEventos() {
    // Evento de busca com debounce
    const buscaInput = document.getElementById('buscaEquipamento');
    buscaInput.addEventListener('input', Utils.debounce(buscarEquipamentos, 300));
    
    // Evento de Enter na busca
    buscaInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            buscarEquipamentos();
        }
    });
    
    // Eventos de filtros
    document.getElementById('filtroBloco').addEventListener('change', aplicarFiltros);
    document.getElementById('filtroStatus').addEventListener('change', aplicarFiltros);
    document.getElementById('filtroCompartilhado').addEventListener('change', aplicarFiltros);
}

/**
 * Carregar filtros disponíveis
 */
async function carregarFiltros() {
    try {
        // Carregar blocos
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
    }
}

/**
 * Carregar todos os equipamentos
 */
async function carregarEquipamentos() {
    try {
        mostrarLoading(true);
        
        const resultado = await API.buscarEquipamentos();
        
        if (!resultado.sucesso) {
            throw new Error(resultado.erro);
        }
        
        estadoEquipamentos.equipamentos = resultado.dados;
        estadoEquipamentos.equipamentosFiltrados = resultado.dados;
        
        atualizarVisualizacao();
        atualizarContador();
        
    } catch (error) {
        console.error('Erro ao carregar equipamentos:', error);
        mostrarMensagemErro('Erro ao carregar equipamentos');
    } finally {
        mostrarLoading(false);
    }
}

/**
 * Buscar equipamentos por nome
 */
function buscarEquipamentos() {
    const termo = document.getElementById('buscaEquipamento').value.toLowerCase().trim();
    estadoEquipamentos.filtros.busca = termo;
    aplicarTodosFiltros();
}

/**
 * Aplicar filtros selecionados
 */
function aplicarFiltros() {
    // Coletar valores dos filtros
    estadoEquipamentos.filtros.bloco = document.getElementById('filtroBloco').value;
    estadoEquipamentos.filtros.status = document.getElementById('filtroStatus').value;
    estadoEquipamentos.filtros.compartilhado = document.getElementById('filtroCompartilhado').value;
    
    aplicarTodosFiltros();
}

/**
 * Aplicar todos os filtros
 */
function aplicarTodosFiltros() {
    let equipamentosFiltrados = [...estadoEquipamentos.equipamentos];
    
    // Filtro por busca
    if (estadoEquipamentos.filtros.busca) {
        equipamentosFiltrados = equipamentosFiltrados.filter(eq => 
            eq.nome.toLowerCase().includes(estadoEquipamentos.filtros.busca) ||
            eq.local.toLowerCase().includes(estadoEquipamentos.filtros.busca) ||
            eq.patrimonio.toLowerCase().includes(estadoEquipamentos.filtros.busca)
        );
    }
    
    // Filtro por bloco
    if (estadoEquipamentos.filtros.bloco) {
        equipamentosFiltrados = equipamentosFiltrados.filter(eq => 
            eq.bloco_id == estadoEquipamentos.filtros.bloco
        );
    }
    
    // Filtro por status
    if (estadoEquipamentos.filtros.status) {
        equipamentosFiltrados = equipamentosFiltrados.filter(eq => 
            eq.status === estadoEquipamentos.filtros.status
        );
    }
    
    // Filtro por compartilhamento
    if (estadoEquipamentos.filtros.compartilhado) {
        const compartilhado = estadoEquipamentos.filtros.compartilhado === 'true';
        equipamentosFiltrados = equipamentosFiltrados.filter(eq => 
            eq.uso_compartilhado === compartilhado
        );
    }
    
    estadoEquipamentos.equipamentosFiltrados = equipamentosFiltrados;
    atualizarVisualizacao();
    atualizarContador();
}

/**
 * Alterar tipo de visualização
 */
function alterarVisualizacao(tipo) {
    // Atualizar botões
    document.querySelectorAll('[id^="btnView"]').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`btnView${Utils.capitalize(tipo)}`).classList.add('active');
    
    // Esconder todas as visualizações
    document.getElementById('viewCards').style.display = 'none';
    document.getElementById('viewLista').style.display = 'none';
    document.getElementById('viewTabela').style.display = 'none';
    
    // Mostrar visualização selecionada
    document.getElementById(`view${Utils.capitalize(tipo)}`).style.display = 'block';
    
    estadoEquipamentos.visualizacaoAtual = tipo;
    atualizarVisualizacao();
}

/**
 * Atualizar visualização atual
 */
function atualizarVisualizacao() {
    const equipamentos = estadoEquipamentos.equipamentosFiltrados;
    
    if (equipamentos.length === 0) {
        mostrarSemEquipamentos();
        return;
    }
    
    esconderSemEquipamentos();
    
    switch (estadoEquipamentos.visualizacaoAtual) {
        case 'cards':
            renderizarCards(equipamentos);
            break;
        case 'lista':
            renderizarLista(equipamentos);
            break;
        case 'tabela':
            renderizarTabela(equipamentos);
            break;
    }
}

/**
 * Renderizar equipamentos em cards
 */
function renderizarCards(equipamentos) {
    const container = document.getElementById('viewCards');
    
    let html = '';
    equipamentos.forEach(equipamento => {
        const statusBadge = getStatusBadge(equipamento.status);
        const compartilhadoBadge = equipamento.uso_compartilhado ? 
            '<span class="badge bg-info">Compartilhado</span>' : 
            '<span class="badge bg-secondary">Exclusivo</span>';
        const acompanhamentoBadge = equipamento.necessita_acompanhamento ? 
            '<span class="badge bg-warning">Necessita Acompanhamento</span>' : '';
        
        html += `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card h-100 shadow-sm">
                    ${equipamento.foto_url ? `
                        <img src="${equipamento.foto_url}" class="card-img-top" alt="${equipamento.nome}" style="height: 200px; object-fit: cover;">
                    ` : `
                        <div class="card-img-top bg-light d-flex align-items-center justify-content-center" style="height: 200px;">
                            <i class="bi bi-tools text-muted" style="font-size: 3rem;"></i>
                        </div>
                    `}
                    <div class="card-body">
                        <h5 class="card-title">${equipamento.nome}</h5>
                        <p class="card-text">
                            <small class="text-muted">
                                <i class="bi bi-building"></i> ${equipamento.blocos?.nome || 'N/A'}<br>
                                <i class="bi bi-geo-alt"></i> ${equipamento.local}<br>
                                <i class="bi bi-tag"></i> ${equipamento.patrimonio}
                            </small>
                        </p>
                        <div class="mb-2">
                            ${statusBadge}
                            ${compartilhadoBadge}
                        </div>
                        ${acompanhamentoBadge ? `<div class="mb-2">${acompanhamentoBadge}</div>` : ''}
                    </div>
                    <div class="card-footer bg-transparent">
                        <div class="d-grid gap-2">
                            <button class="btn btn-primary btn-sm" onclick="mostrarDetalhesEquipamento(${equipamento.id})">
                                <i class="bi bi-info-circle"></i> Ver Detalhes
                            </button>
                            ${equipamento.status === 'disponivel' ? `
                                <button class="btn btn-success btn-sm" onclick="reservarEquipamento(${equipamento.id})">
                                    <i class="bi bi-calendar-plus"></i> Reservar
                                </button>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

/**
 * Renderizar equipamentos em lista
 */
function renderizarLista(equipamentos) {
    const container = document.getElementById('listaEquipamentos');
    
    let html = '';
    equipamentos.forEach(equipamento => {
        const statusBadge = getStatusBadge(equipamento.status);
        const compartilhadoBadge = equipamento.uso_compartilhado ? 
            '<span class="badge bg-info">Compartilhado</span>' : 
            '<span class="badge bg-secondary">Exclusivo</span>';
        
        html += `
            <div class="list-group-item">
                <div class="d-flex w-100 justify-content-between align-items-start">
                    <div class="flex-grow-1">
                        <h6 class="mb-1">${equipamento.nome}</h6>
                        <p class="mb-1">
                            <small class="text-muted">
                                <i class="bi bi-building"></i> ${equipamento.blocos?.nome || 'N/A'} | 
                                <i class="bi bi-geo-alt"></i> ${equipamento.local} | 
                                <i class="bi bi-tag"></i> ${equipamento.patrimonio}
                            </small>
                        </p>
                        <div>
                            ${statusBadge}
                            ${compartilhadoBadge}
                            ${equipamento.necessita_acompanhamento ? '<span class="badge bg-warning">Necessita Acompanhamento</span>' : ''}
                        </div>
                    </div>
                    <div class="ms-3">
                        <div class="btn-group-vertical" role="group">
                            <button class="btn btn-outline-primary btn-sm" onclick="mostrarDetalhesEquipamento(${equipamento.id})">
                                <i class="bi bi-info-circle"></i> Detalhes
                            </button>
                            ${equipamento.status === 'disponivel' ? `
                                <button class="btn btn-outline-success btn-sm" onclick="reservarEquipamento(${equipamento.id})">
                                    <i class="bi bi-calendar-plus"></i> Reservar
                                </button>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

/**
 * Renderizar equipamentos em tabela
 */
function renderizarTabela(equipamentos) {
    const tbody = document.getElementById('tabelaEquipamentos');
    
    let html = '';
    equipamentos.forEach(equipamento => {
        const statusBadge = getStatusBadge(equipamento.status);
        const compartilhado = equipamento.uso_compartilhado ? 
            '<i class="bi bi-check-circle text-success"></i> Sim' : 
            '<i class="bi bi-x-circle text-danger"></i> Não';
        const acompanhamento = equipamento.necessita_acompanhamento ? 
            '<i class="bi bi-check-circle text-warning"></i> Sim' : 
            '<i class="bi bi-x-circle text-success"></i> Não';
        
        html += `
            <tr>
                <td>
                    <strong>${equipamento.nome}</strong><br>
                    <small class="text-muted">${equipamento.patrimonio}</small>
                </td>
                <td>${equipamento.blocos?.nome || 'N/A'}</td>
                <td>${equipamento.local}</td>
                <td>${statusBadge}</td>
                <td>${compartilhado}</td>
                <td>${acompanhamento}</td>
                <td>
                    <div class="btn-group" role="group">
                        <button class="btn btn-outline-primary btn-sm" onclick="mostrarDetalhesEquipamento(${equipamento.id})" title="Ver detalhes">
                            <i class="bi bi-info-circle"></i>
                        </button>
                        ${equipamento.status === 'disponivel' ? `
                            <button class="btn btn-outline-success btn-sm" onclick="reservarEquipamento(${equipamento.id})" title="Reservar">
                                <i class="bi bi-calendar-plus"></i>
                            </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
}

/**
 * Obter badge de status
 */
function getStatusBadge(status) {
    const badges = {
        'disponivel': '<span class="badge bg-success">Disponível</span>',
        'em_manutencao': '<span class="badge bg-warning">Em Manutenção</span>',
        'inativo': '<span class="badge bg-danger">Inativo</span>'
    };
    
    return badges[status] || '<span class="badge bg-secondary">Desconhecido</span>';
}

/**
 * Mostrar detalhes do equipamento
 */
function mostrarDetalhesEquipamento(equipamentoId) {
    const equipamento = estadoEquipamentos.equipamentos.find(eq => eq.id === equipamentoId);
    
    if (!equipamento) {
        Utils.showToast('Equipamento não encontrado', 'warning');
        return;
    }
    
    estadoEquipamentos.equipamentoSelecionado = equipamento;
    
    const modal = new bootstrap.Modal(document.getElementById('modalDetalhesEquipamento'));
    const content = document.getElementById('detalhesEquipamentoContent');
    
    const statusBadge = getStatusBadge(equipamento.status);
    
    content.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                ${equipamento.foto_url ? `
                    <img src="${equipamento.foto_url}" class="img-fluid rounded mb-3" alt="${equipamento.nome}">
                ` : `
                    <div class="bg-light rounded d-flex align-items-center justify-content-center mb-3" style="height: 200px;">
                        <i class="bi bi-tools text-muted" style="font-size: 4rem;"></i>
                    </div>
                `}
            </div>
            <div class="col-md-6">
                <h5 class="text-primary">${equipamento.nome}</h5>
                <p><strong>Patrimônio:</strong> ${equipamento.patrimonio}</p>
                <p><strong>Bloco:</strong> ${equipamento.blocos?.nome || 'N/A'}</p>
                <p><strong>Local:</strong> ${equipamento.local}</p>
                <p><strong>Status:</strong> ${statusBadge}</p>
                <p><strong>Uso Compartilhado:</strong> 
                    ${equipamento.uso_compartilhado ? 
                        '<i class="bi bi-check-circle text-success"></i> Sim' : 
                        '<i class="bi bi-x-circle text-danger"></i> Não'}
                </p>
                <p><strong>Necessita Acompanhamento:</strong> 
                    ${equipamento.necessita_acompanhamento ? 
                        '<i class="bi bi-check-circle text-warning"></i> Sim' : 
                        '<i class="bi bi-x-circle text-success"></i> Não'}
                </p>
            </div>
        </div>
        
        ${equipamento.descricao ? `
            <div class="row mt-3">
                <div class="col-12">
                    <h6 class="text-primary">Descrição</h6>
                    <p>${equipamento.descricao}</p>
                </div>
            </div>
        ` : ''}
        
        ${equipamento.observacoes ? `
            <div class="row mt-3">
                <div class="col-12">
                    <h6 class="text-primary">Observações</h6>
                    <p class="text-muted">${equipamento.observacoes}</p>
                </div>
            </div>
        ` : ''}
        
        <div class="row mt-3">
            <div class="col-12">
                <small class="text-muted">
                    Cadastrado em: ${DateUtils.formatarDataHora(equipamento.created_at)}
                </small>
            </div>
        </div>
    `;
    
    modal.show();
}

/**
 * Reservar equipamento
 */
function reservarEquipamento(equipamentoId = null) {
    if (equipamentoId) {
        // Redirecionar para página principal com equipamento pré-selecionado
        const url = new URL(window.location.origin + '/index.html');
        url.searchParams.set('equipamento', equipamentoId);
        window.location.href = url.toString();
    } else if (estadoEquipamentos.equipamentoSelecionado) {
        // Usar equipamento do modal
        const url = new URL(window.location.origin + '/index.html');
        url.searchParams.set('equipamento', estadoEquipamentos.equipamentoSelecionado.id);
        window.location.href = url.toString();
    } else {
        // Redirecionar para página principal
        window.location.href = 'index.html';
    }
}

/**
 * Mostrar loading
 */
function mostrarLoading(mostrar) {
    const loading = document.getElementById('loadingEquipamentos');
    
    if (mostrar) {
        loading.style.display = 'block';
        esconderVisualizacoes();
        esconderSemEquipamentos();
    } else {
        loading.style.display = 'none';
    }
}

/**
 * Esconder todas as visualizações
 */
function esconderVisualizacoes() {
    document.getElementById('viewCards').style.display = 'none';
    document.getElementById('viewLista').style.display = 'none';
    document.getElementById('viewTabela').style.display = 'none';
}

/**
 * Mostrar mensagem de sem equipamentos
 */
function mostrarSemEquipamentos() {
    document.getElementById('semEquipamentos').style.display = 'block';
    esconderVisualizacoes();
}

/**
 * Esconder mensagem de sem equipamentos
 */
function esconderSemEquipamentos() {
    document.getElementById('semEquipamentos').style.display = 'none';
}

/**
 * Mostrar mensagem de erro
 */
function mostrarMensagemErro(mensagem) {
    const container = document.getElementById('viewCards');
    container.innerHTML = `
        <div class="col-12">
            <div class="alert alert-danger text-center">
                <i class="bi bi-exclamation-triangle"></i>
                <h5>Erro ao carregar equipamentos</h5>
                <p>${mensagem}</p>
                <button class="btn btn-outline-danger" onclick="carregarEquipamentos()">
                    <i class="bi bi-arrow-clockwise"></i> Tentar Novamente
                </button>
            </div>
        </div>
    `;
}

/**
 * Atualizar contador de equipamentos
 */
function atualizarContador() {
    const total = estadoEquipamentos.equipamentosFiltrados.length;
    const totalGeral = estadoEquipamentos.equipamentos.length;
    
    let texto = `${total} equipamento${total !== 1 ? 's' : ''}`;
    if (total !== totalGeral) {
        texto += ` de ${totalGeral} total`;
    }
    
    document.getElementById('totalEquipamentos').textContent = texto;
}

// Exportar funções para uso global
window.alterarVisualizacao = alterarVisualizacao;
window.aplicarFiltros = aplicarFiltros;
window.buscarEquipamentos = buscarEquipamentos;
window.mostrarDetalhesEquipamento = mostrarDetalhesEquipamento;
window.reservarEquipamento = reservarEquipamento;

