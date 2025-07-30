/**
 * ReservaLAB - Sistema de Reservas de Laboratórios e Equipamentos
 * JavaScript da Página de Laboratórios
 * 
 * Idealizado e Desenvolvido por Carlos Henrique C. de Oliveira - Tec. Laboratório de Informática FAEN/UFGD - Engenheiro da Computação
 */

// Estado global da página
let estadoLaboratorios = {
    laboratorios: [],
    laboratoriosFiltrados: [],
    visualizacaoAtual: 'cards',
    filtros: {
        busca: '',
        bloco: '',
        status: '',
        compartilhado: ''
    },
    laboratorioSelecionado: null
};

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    inicializarPagina();
});

/**
 * Inicializar página de laboratórios
 */
async function inicializarPagina() {
    try {
        // Configurar eventos
        configurarEventos();
        
        // Configurar visualização inicial
        configurarVisualizacaoInicial();
        
        // Carregar filtros
        await carregarFiltros();
        
        // Carregar laboratórios
        await carregarLaboratorios();
        
    } catch (error) {
        console.error('Erro ao inicializar página:', error);
        Utils.showToast('Erro ao carregar página de laboratórios', 'danger');
    }
}

/**
 * Configurar visualização inicial
 */
function configurarVisualizacaoInicial() {
    // Garantir que apenas a visualização cards esteja visível inicialmente
    document.getElementById('viewCards').style.display = 'block';
    document.getElementById('viewLista').style.display = 'none';
    document.getElementById('viewTabela').style.display = 'none';
    
    // Garantir que o botão cards esteja ativo
    document.getElementById('btnViewCards').classList.add('active');
    document.getElementById('btnViewLista').classList.remove('active');
    document.getElementById('btnViewTabela').classList.remove('active');
}

/**
 * Configurar eventos da página
 */
function configurarEventos() {
    // Campo de busca
    const campoBusca = document.getElementById('buscaLaboratorio');
    if (campoBusca) {
        campoBusca.addEventListener('input', Utils.debounce(buscarLaboratorios, 300));
        campoBusca.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                buscarLaboratorios();
            }
        });
    }

    // Filtros
    const filtros = ['filtroBloco', 'filtroStatus', 'filtroCompartilhado'];
    filtros.forEach(filtroId => {
        const filtro = document.getElementById(filtroId);
        if (filtro) {
            filtro.addEventListener('change', aplicarFiltros);
        }
    });
}

/**
 * Carregar opções dos filtros
 */
async function carregarFiltros() {
    try {
        // Carregar blocos para o filtro
        const resultado = await API.buscarBlocos();
        const selectBloco = document.getElementById('filtroBloco');
        
        if (selectBloco && resultado.sucesso && resultado.dados) {
            selectBloco.innerHTML = '<option value="">Todos</option>';
            resultado.dados.forEach(bloco => {
                selectBloco.innerHTML += `<option value="${bloco.id}">${bloco.nome}</option>`;
            });
        }
        
    } catch (error) {
        console.error('Erro ao carregar filtros:', error);
    }
}

/**
 * Carregar lista de laboratórios
 */
async function carregarLaboratorios() {
    try {
        mostrarLoading(true);
        
        const resultado = await API.buscarLaboratorios();
        
        if (resultado.sucesso && resultado.dados) {
            // Processar dados para incluir nome do bloco
            const laboratorios = resultado.dados.map(lab => ({
                ...lab,
                bloco_nome: lab.blocos?.nome || 'N/A'
            }));
            
            estadoLaboratorios.laboratorios = laboratorios;
            estadoLaboratorios.laboratoriosFiltrados = [...laboratorios];
            
            // Aplicar filtros se houver
            aplicarFiltros();
            
            // Atualizar visualização atual
            atualizarVisualizacao();
            
            // Atualizar contador
            atualizarContador();
        }
        
    } catch (error) {
        console.error('Erro ao carregar laboratórios:', error);
        Utils.showToast('Erro ao carregar laboratórios', 'danger');
        mostrarMensagemVazia();
    } finally {
        mostrarLoading(false);
    }
}

/**
 * Buscar laboratórios por nome
 */
function buscarLaboratorios() {
    const termoBusca = document.getElementById('buscaLaboratorio')?.value?.toLowerCase() || '';
    estadoLaboratorios.filtros.busca = termoBusca;
    aplicarFiltros();
}

/**
 * Aplicar todos os filtros
 */
function aplicarFiltros() {
    let laboratoriosFiltrados = [...estadoLaboratorios.laboratorios];
    
    // Filtro por busca
    if (estadoLaboratorios.filtros.busca) {
        laboratoriosFiltrados = laboratoriosFiltrados.filter(lab => 
            lab.nome.toLowerCase().includes(estadoLaboratorios.filtros.busca) ||
            lab.bloco_nome?.toLowerCase().includes(estadoLaboratorios.filtros.busca)
        );
    }
    
    // Filtro por bloco
    const filtroBloco = document.getElementById('filtroBloco')?.value;
    if (filtroBloco) {
        laboratoriosFiltrados = laboratoriosFiltrados.filter(lab => lab.bloco_id === parseInt(filtroBloco));
    }
    
    // Filtro por status
    const filtroStatus = document.getElementById('filtroStatus')?.value;
    if (filtroStatus) {
        laboratoriosFiltrados = laboratoriosFiltrados.filter(lab => lab.ativo === (filtroStatus === 'true'));
    }
    
    // Filtro por uso compartilhado
    const filtroCompartilhado = document.getElementById('filtroCompartilhado')?.value;
    if (filtroCompartilhado !== '') {
        laboratoriosFiltrados = laboratoriosFiltrados.filter(lab => 
            lab.permitir_uso_compartilhado === (filtroCompartilhado === 'true')
        );
    }

    estadoLaboratorios.laboratoriosFiltrados = laboratoriosFiltrados;
    atualizarVisualizacao();
    atualizarContador();
}

/**
 * Alterar tipo de visualização
 */
function alterarVisualizacao(tipo) {
    estadoLaboratorios.visualizacaoAtual = tipo;
    
    // Atualizar botões
    document.querySelectorAll('[id^="btnView"]').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`btnView${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`).classList.add('active');
    
    // Esconder todas as visualizações
    document.getElementById('viewCards').style.display = 'none';
    document.getElementById('viewLista').style.display = 'none';
    document.getElementById('viewTabela').style.display = 'none';
    
    // Mostrar visualização selecionada
    document.getElementById(`view${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`).style.display = 'block';
    
    atualizarVisualizacao();
}

/**
 * Atualizar visualização atual
 */
function atualizarVisualizacao() {
    const laboratorios = estadoLaboratorios.laboratoriosFiltrados;
    
    if (laboratorios.length === 0) {
        mostrarMensagemVazia();
        return;
    }
    
    ocultarMensagemVazia();
    
    switch (estadoLaboratorios.visualizacaoAtual) {
        case 'cards':
            renderizarCards(laboratorios);
            break;
        case 'lista':
            renderizarLista(laboratorios);
            break;
        case 'tabela':
            renderizarTabela(laboratorios);
            break;
    }
}

/**
 * Renderizar laboratórios como cards
 */
function renderizarCards(laboratorios) {
    const container = document.getElementById('viewCards');
    if (!container) return;
    
    container.innerHTML = laboratorios.map(lab => `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card h-100 shadow-sm border-0">
                <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                    <h6 class="mb-0">
                        <i class="bi bi-building me-2"></i>${lab.nome}
                    </h6>
                    <span class="badge ${getStatusBadgeClass(lab.ativo)}">${getStatusText(lab.ativo)}</span>
                </div>
                <div class="card-body">
                    <div class="row mb-2">
                        <div class="col-6">
                            <small class="text-muted">Bloco:</small><br>
                            <strong>${lab.bloco_nome || 'N/A'}</strong>
                        </div>
                        <div class="col-6">
                            <small class="text-muted">Capacidade:</small><br>
                            <strong>${lab.capacidade || 'N/A'} pessoas</strong>
                        </div>
                    </div>
                    
                    <div class="row mb-2">
                        <div class="col-6">
                            <small class="text-muted">Uso Compartilhado:</small><br>
                            <span class="badge ${lab.permitir_uso_compartilhado ? 'bg-success' : 'bg-warning'}">
                                ${lab.permitir_uso_compartilhado ? 'Permitido' : 'Exclusivo'}
                            </span>
                            ${lab.permitir_uso_compartilhado ? `<br><small class="text-muted">Máx: ${lab.quantidade_maxima_ocupantes_simultaneos || 1} grupos</small>` : ''}
                        </div>
                        <div class="col-6">
                            <small class="text-muted">Acompanhamento:</small><br>
                            <span class="badge ${lab.necessita_acompanhamento ? 'bg-warning' : 'bg-success'}">
                                ${lab.necessita_acompanhamento ? 'Necessário' : 'Não necessário'}
                            </span>
                        </div>
                    </div>
                    
                    ${lab.descricao ? `
                        <div class="mb-2">
                            <small class="text-muted">Descrição:</small><br>
                            <small>${lab.descricao}</small>
                        </div>
                    ` : ''}
                </div>
                <div class="card-footer bg-transparent border-0">
                    <div class="d-grid gap-2">
                        <button class="btn btn-outline-primary btn-sm" onclick="verDetalhesLaboratorio(${lab.id})">
                            <i class="bi bi-eye"></i> Ver Detalhes
                        </button>
                        ${lab.status === 'disponivel' ? `
                            <button class="btn btn-primary btn-sm" onclick="reservarLaboratorio(${lab.id})">
                                <i class="bi bi-calendar-plus"></i> Reservar
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * Renderizar laboratórios como lista
 */
function renderizarLista(laboratorios) {
    const container = document.getElementById('listaLaboratorios');
    if (!container) return;
    
    container.innerHTML = laboratorios.map(lab => `
        <div class="list-group-item list-group-item-action">
            <div class="d-flex w-100 justify-content-between">
                <h6 class="mb-1">
                    <i class="bi bi-building me-2"></i>${lab.nome}
                    <span class="badge ${getStatusBadgeClass(lab.ativo)} ms-2">${getStatusText(lab.ativo)}</span>
                </h6>
                <small class="text-muted">${lab.bloco_nome || 'N/A'}</small>
            </div>
            <div class="row">
                <div class="col-md-8">
                    <p class="mb-1">${lab.descricao || 'Sem descrição'}</p>
                    <small class="text-muted">
                        Capacidade: ${lab.capacidade || 'N/A'} pessoas | 
                        Uso Compartilhado: ${lab.permitir_uso_compartilhado ? `Sim (máx: ${lab.quantidade_maxima_ocupantes_simultaneos || 1} grupos)` : 'Não'} | 
                        Acompanhamento: ${lab.necessita_acompanhamento ? 'Necessário' : 'Não necessário'}
                    </small>
                </div>
                <div class="col-md-4 text-end">
                    <div class="btn-group btn-group-sm" role="group">
                        <button class="btn btn-outline-primary" onclick="verDetalhesLaboratorio(${lab.id})">
                            <i class="bi bi-eye"></i> Detalhes
                        </button>
                        ${lab.ativo ? `
                            <button class="btn btn-primary" onclick="reservarLaboratorio(${lab.id})">
                                <i class="bi bi-calendar-plus"></i> Reservar
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * Renderizar laboratórios como tabela
 */
function renderizarTabela(laboratorios) {
    const tbody = document.getElementById('tabelaLaboratorios');
    if (!tbody) return;
    
    tbody.innerHTML = laboratorios.map(lab => `
        <tr>
            <td>
                <i class="bi bi-building me-2"></i>${lab.nome}
            </td>
            <td>${lab.bloco_nome || 'N/A'}</td>
            <td>${lab.capacidade || 'N/A'} pessoas</td>
            <td>
                <span class="badge ${getStatusBadgeClass(lab.ativo)}">${getStatusText(lab.ativo)}</span>
            </td>
            <td>
                <span class="badge ${lab.permitir_uso_compartilhado ? 'bg-success' : 'bg-warning'}">
                    ${lab.permitir_uso_compartilhado ? `Sim (${lab.quantidade_maxima_ocupantes_simultaneos || 1})` : 'Exclusivo'}
                </span>
            </td>
            <td>
                <span class="badge ${lab.necessita_acompanhamento ? 'bg-warning' : 'bg-success'}">
                    ${lab.necessita_acompanhamento ? 'Necessário' : 'Não necessário'}
                </span>
            </td>
            <td>
                <div class="btn-group btn-group-sm" role="group">
                    <button class="btn btn-outline-primary" onclick="verDetalhesLaboratorio(${lab.id})">
                        <i class="bi bi-eye"></i>
                    </button>
                    ${lab.ativo ? `
                        <button class="btn btn-primary" onclick="reservarLaboratorio(${lab.id})">
                            <i class="bi bi-calendar-plus"></i>
                        </button>
                    ` : ''}
                </div>
            </td>
        </tr>
    `).join('');
}

/**
 * Ver detalhes do laboratório
 */
async function verDetalhesLaboratorio(laboratorioId) {
    try {
        const laboratorio = estadoLaboratorios.laboratorios.find(lab => lab.id === laboratorioId);
        if (!laboratorio) return;
        
        estadoLaboratorios.laboratorioSelecionado = laboratorio;
        
        const modalContent = document.getElementById('detalhesLaboratorioContent');
        if (!modalContent) return;
        
        modalContent.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <h6><i class="bi bi-building me-2"></i>Informações Gerais</h6>
                    <table class="table table-sm">
                        <tr><td><strong>Nome:</strong></td><td>${laboratorio.nome}</td></tr>
                        <tr><td><strong>Bloco:</strong></td><td>${laboratorio.bloco_nome || 'N/A'}</td></tr>
                        <tr><td><strong>Capacidade:</strong></td><td>${laboratorio.capacidade || 'N/A'} pessoas</td></tr>
                        <tr><td><strong>Status:</strong></td><td><span class="badge ${getStatusBadgeClass(laboratorio.ativo)}">${getStatusText(laboratorio.ativo)}</span></td></tr>
                    </table>
                </div>
                <div class="col-md-6">
                    <h6><i class="bi bi-gear me-2"></i>Configurações de Uso</h6>
                    <table class="table table-sm">
                        <tr><td><strong>Uso Compartilhado:</strong></td><td><span class="badge ${laboratorio.permitir_uso_compartilhado ? 'bg-success' : 'bg-warning'}">${laboratorio.permitir_uso_compartilhado ? 'Permitido' : 'Exclusivo'}</span></td></tr>
                        ${laboratorio.permitir_uso_compartilhado ? `<tr><td><strong>Máx. Ocupantes:</strong></td><td>${laboratorio.quantidade_maxima_ocupantes_simultaneos || 1} grupos simultâneos</td></tr>` : ''}
                        <tr><td><strong>Acompanhamento:</strong></td><td><span class="badge ${laboratorio.necessita_acompanhamento ? 'bg-warning' : 'bg-success'}">${laboratorio.necessita_acompanhamento ? 'Necessário' : 'Não necessário'}</span></td></tr>
                        <tr><td><strong>Criado em:</strong></td><td>${Utils.formatDate(laboratorio.created_at)}</td></tr>
                        <tr><td><strong>Atualizado em:</strong></td><td>${Utils.formatDate(laboratorio.updated_at)}</td></tr>
                    </table>
                </div>
            </div>
            ${laboratorio.descricao ? `
                <div class="row mt-3">
                    <div class="col-12">
                        <h6><i class="bi bi-card-text me-2"></i>Descrição</h6>
                        <p class="text-muted">${laboratorio.descricao}</p>
                    </div>
                </div>
            ` : ''}
            ${laboratorio.observacoes ? `
                <div class="row mt-3">
                    <div class="col-12">
                        <h6><i class="bi bi-exclamation-circle me-2"></i>Observações</h6>
                        <p class="text-muted">${laboratorio.observacoes}</p>
                    </div>
                </div>
            ` : ''}
        `;
        
        const modal = new bootstrap.Modal(document.getElementById('modalDetalhesLaboratorio'));
        modal.show();
        
    } catch (error) {
        console.error('Erro ao carregar detalhes do laboratório:', error);
        Utils.showToast('Erro ao carregar detalhes', 'danger');
    }
}

/**
 * Reservar laboratório
 */
function reservarLaboratorio(laboratorioId = null) {
    const id = laboratorioId || estadoLaboratorios.laboratorioSelecionado?.id;
    if (id) {
        // Redirecionar para página de reserva com laboratório pré-selecionado
        window.location.href = `index.html?laboratorio=${id}`;
    }
}

/**
 * Utilitários
 */
function getStatusBadgeClass(ativo) {
    return ativo ? 'bg-success' : 'bg-danger';
}

function getStatusText(ativo) {
    return ativo ? 'Disponível' : 'Inativo';
}

function mostrarLoading(mostrar) {
    const loading = document.getElementById('loadingLaboratorios');
    if (loading) {
        loading.style.display = mostrar ? 'block' : 'none';
    }
}

function mostrarMensagemVazia() {
    const semLaboratorios = document.getElementById('semLaboratorios');
    if (semLaboratorios) {
        semLaboratorios.style.display = 'block';
    }
    
    // Ocultar visualizações
    ['viewCards', 'viewLista', 'viewTabela'].forEach(id => {
        const element = document.getElementById(id);
        if (element) element.style.display = 'none';
    });
}

function ocultarMensagemVazia() {
    const semLaboratorios = document.getElementById('semLaboratorios');
    if (semLaboratorios) {
        semLaboratorios.style.display = 'none';
    }
    
    // Mostrar visualização atual
    const viewAtual = document.getElementById(`view${estadoLaboratorios.visualizacaoAtual.charAt(0).toUpperCase() + estadoLaboratorios.visualizacaoAtual.slice(1)}`);
    if (viewAtual) {
        viewAtual.style.display = 'block';
    }
}

function atualizarContador() {
    const contador = document.getElementById('totalLaboratorios');
    if (contador) {
        const total = estadoLaboratorios.laboratoriosFiltrados.length;
        const totalGeral = estadoLaboratorios.laboratorios.length;
        
        if (total === totalGeral) {
            contador.textContent = `${total} laboratório${total !== 1 ? 's' : ''} encontrado${total !== 1 ? 's' : ''}`;
        } else {
            contador.textContent = `${total} de ${totalGeral} laboratório${totalGeral !== 1 ? 's' : ''}`;
        }
    }
}
