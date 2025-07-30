/**
 * Módulo de Busca Global - ReservaLAB (Versão Deploy)
 * Sistema reutilizável de busca de reservas por protocolo
 * Versão otimizada para deployment em produção
 */

(function() {
    'use strict';

    console.log('🔍 [BuscaGlobal] Iniciando carregamento do módulo...');

    /**
     * HTML do Modal de Busca
     */
    const MODAL_HTML = `
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
                            <input type="text" class="form-control" id="protocoloBusca" placeholder="Ex: 202510000001">
                            <small class="text-muted">Informe o protocolo recebido após a solicitação</small>
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

    /**
     * Inicializar o modal de busca na página
     */
    function inicializarModalBusca() {
        // Verificar se o modal já existe
        if (document.getElementById('modalBuscaReserva')) {
            console.log('🔍 [BuscaGlobal] Modal já existe, pulando criação');
            return;
        }

        try {
            // Injetar o HTML do modal no body
            document.body.insertAdjacentHTML('beforeend', MODAL_HTML);
            console.log('🔍 [BuscaGlobal] Modal injetado com sucesso');

            // Adicionar evento de Enter no campo de busca
            setTimeout(() => {
                const campoBusca = document.getElementById('protocoloBusca');
                if (campoBusca) {
                    campoBusca.addEventListener('keypress', function(event) {
                        if (event.key === 'Enter') {
                            event.preventDefault();
                            buscarReserva();
                        }
                    });
                    console.log('🔍 [BuscaGlobal] Evento Enter adicionado');
                }
            }, 100);

        } catch (error) {
            console.error('🔍 [BuscaGlobal] Erro ao inicializar modal:', error);
        }
    }

    /**
     * Abrir modal de busca de reserva
     */
    function abrirBuscaReserva() {
        console.log('🔍 [BuscaGlobal] abrirBuscaReserva chamada');
        
        try {
            // Garantir que o modal existe
            inicializarModalBusca();

            // Verificar se Bootstrap está disponível
            if (typeof bootstrap === 'undefined') {
                console.error('🔍 [BuscaGlobal] Bootstrap não está disponível');
                alert('Erro: Sistema de interface não carregado. Recarregue a página.');
                return;
            }

            const modalElement = document.getElementById('modalBuscaReserva');
            if (!modalElement) {
                console.error('🔍 [BuscaGlobal] Modal não encontrado');
                alert('Erro: Modal de busca não encontrado.');
                return;
            }

            const modal = new bootstrap.Modal(modalElement);
            modal.show();
            
            // Limpar busca anterior
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
     * Buscar reserva por protocolo
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
        
        console.log('🔍 [BuscaGlobal] Protocolo digitado:', protocolo);
        
        if (!protocolo) {
            alert('Por favor, informe o protocolo');
            return;
        }
        
        // Validação básica de protocolo (12 dígitos)
        if (protocolo.length !== 12 || !/^\d{12}$/.test(protocolo)) {
            alert('Protocolo deve ter 12 dígitos');
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
            console.log('🔍 [BuscaGlobal] Verificando API...');
            
            if (typeof API === 'undefined' || typeof API.buscarReservaPorProtocolo !== 'function') {
                throw new Error('API não está disponível. Certifique-se de que a página foi carregada completamente.');
            }
            
            console.log('🔍 [BuscaGlobal] Chamando API...');
            const resultado = await API.buscarReservaPorProtocolo(protocolo);
            
            console.log('🔍 [BuscaGlobal] Resultado da API:', resultado);
            
            if (!resultado.sucesso) {
                console.log('🔍 [BuscaGlobal] Reserva não encontrada');
                
                resultadoDiv.innerHTML = `
                    <div class="alert alert-info">
                        <i class="bi bi-info-circle"></i>
                        <strong>Reserva não encontrada</strong><br>
                        Protocolo <code>${protocolo}</code> não foi encontrado no sistema.<br><br>
                        <small class="text-muted">
                            <strong>💡 Dica:</strong> Verifique se o protocolo foi digitado corretamente.<br>
                            O protocolo deve ter exatamente 12 dígitos.
                        </small>
                    </div>
                `;
                return;
            }
            
            console.log('🔍 [BuscaGlobal] Exibindo resultado');
            mostrarResultadoBusca(resultado.dados);
            
        } catch (error) {
            console.error('🔍 [BuscaGlobal] Erro na busca:', error);
            resultadoDiv.innerHTML = `
                <div class="alert alert-warning">
                    <i class="bi bi-exclamation-triangle"></i>
                    <strong>Erro na busca</strong><br>
                    ${error.message}
                    <hr>
                    <small class="text-muted">Tente recarregar a página e tente novamente.</small>
                </div>
            `;
        }
    }

    /**
     * Mostrar resultado da busca
     */
    function mostrarResultadoBusca(reservas) {
        console.log('🔍 [BuscaGlobal] Mostrando resultado:', reservas);
        
        const resultadoDiv = document.getElementById('resultadoBusca');
        if (!resultadoDiv) return;
        
        // Processar resultado (pode ser array ou objeto único)
        const isArray = Array.isArray(reservas);
        const listaReservas = isArray ? reservas : [reservas];
        const primeiraReserva = listaReservas[0];
        
        if (!primeiraReserva) {
            resultadoDiv.innerHTML = '<div class="alert alert-warning">Dados de reserva inválidos</div>';
            return;
        }

        // Formatação simples e robusta
        const status = formatarStatusSimples(primeiraReserva.status);
        const dataFormatada = formatarDataSimples(primeiraReserva.data_reserva);
        const horaInicio = primeiraReserva.hora_inicio ? primeiraReserva.hora_inicio.substring(0, 5) : 'N/A';
        const horaFim = primeiraReserva.hora_fim ? primeiraReserva.hora_fim.substring(0, 5) : 'N/A';
        
        // Montar recursos
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
                    <div>
                        <span class="badge ${status.classe}">${status.texto}</span>
                        ${isArray && listaReservas.length > 1 ? `<span class="badge bg-info ms-1">Recorrente (${listaReservas.length}x)</span>` : ''}
                    </div>
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
     * Formatação simples de status
     */
    function formatarStatusSimples(status) {
        const statusMap = {
            'pendente': { classe: 'bg-warning text-dark', texto: 'Pendente' },
            'aprovada': { classe: 'bg-success', texto: 'Aprovada' },
            'rejeitada': { classe: 'bg-danger', texto: 'Rejeitada' },
            'cancelada': { classe: 'bg-secondary', texto: 'Cancelada' }
        };
        
        return statusMap[status] || { classe: 'bg-secondary', texto: status || 'Indefinido' };
    }

    /**
     * Formatação simples de data
     */
    function formatarDataSimples(data) {
        if (!data) return 'Data inválida';
        try {
            const date = new Date(data);
            return date.toLocaleDateString('pt-BR');
        } catch (error) {
            return data.toString();
        }
    }

    /**
     * Exportar funções para uso global IMEDIATAMENTE
     */
    window.abrirBuscaReserva = abrirBuscaReserva;
    window.buscarReserva = buscarReserva;
    window.mostrarResultadoBusca = mostrarResultadoBusca;

    console.log('🔍 [BuscaGlobal] Funções exportadas globalmente');

    /**
     * Inicialização
     */
    function inicializar() {
        console.log('🔍 [BuscaGlobal] Iniciando inicialização...');
        
        // Verificar dependências essenciais
        const dependencias = {
            bootstrap: typeof bootstrap !== 'undefined',
            document: typeof document !== 'undefined'
        };

        console.log('🔍 [BuscaGlobal] Estado das dependências:', dependencias);

        if (dependencias.bootstrap && dependencias.document) {
            inicializarModalBusca();
            console.log('🔍 [BuscaGlobal] Módulo inicializado com sucesso');
        } else {
            console.warn('🔍 [BuscaGlobal] Algumas dependências não estão disponíveis, mas funções foram exportadas');
        }
    }

    // Inicialização robusta
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            console.log('🔍 [BuscaGlobal] DOM carregado');
            setTimeout(inicializar, 500);
        });
    } else {
        console.log('🔍 [BuscaGlobal] DOM já pronto');
        setTimeout(inicializar, 100);
    }

    console.log('🔍 [BuscaGlobal] Módulo carregado completamente');

})();
