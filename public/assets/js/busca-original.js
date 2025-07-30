/**
 * Módulo de Busca Global - ReservaLAB
 * Sistema reutilizável de busca de reservas por protocolo
 * 
 * Dependências: Bootstrap 5, API.js
 * Opcionais: Utils.js, FormularioUtils, ReservaUtils, ICalendarUtils
 */

(function() {
    'use strict';

    let tentativasInicializacao = 0;
    const MAX_TENTATIVAS = 10;

    // Verificar se as dependências essenciais estão disponíveis
    function verificarDependencias() {
        const dependenciasEssenciais = {
            'bootstrap': typeof bootstrap !== 'undefined',
            'API': typeof API !== 'undefined'
        };

        let todasDisponiveis = true;
        for (const [nome, disponivel] of Object.entries(dependenciasEssenciais)) {
            if (!disponivel) {
                console.warn(`[BuscaGlobal] Dependência ${nome} ainda não está disponível (tentativa ${tentativasInicializacao + 1}/${MAX_TENTATIVAS})`);
                todasDisponiveis = false;
            }
        }

        return todasDisponiveis;
    }

    // Função para tentar inicializar com retry
    function tentarInicializar() {
        tentativasInicializacao++;
        
        if (verificarDependencias()) {
            console.log('🔍 [BuscaGlobal] Dependências verificadas com sucesso');
            inicializar();
            return;
        }

        if (tentativasInicializacao < MAX_TENTATIVAS) {
            console.log(`🔍 [BuscaGlobal] Reagendando inicialização (tentativa ${tentativasInicializacao}/${MAX_TENTATIVAS})`);
            setTimeout(tentarInicializar, 500);
        } else {
            console.error('🔍 [BuscaGlobal] Não foi possível inicializar após', MAX_TENTATIVAS, 'tentativas');
            console.error('🔍 [BuscaGlobal] Dependências disponíveis:', {
                bootstrap: typeof bootstrap !== 'undefined',
                API: typeof API !== 'undefined'
            });
        }
    }

    /**
     * HTML do Modal de Busca
     * Será injetado dinamicamente na página
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
            return;
        }

        // Injetar o HTML do modal no body
        document.body.insertAdjacentHTML('beforeend', MODAL_HTML);

        // Adicionar evento de Enter no campo de busca
        setTimeout(() => {
            const campoBusca = document.getElementById('protocoloBusca');
            if (campoBusca) {
                campoBusca.addEventListener('keypress', function(event) {
                    if (event.key === 'Enter') {
                        buscarReserva();
                    }
                });
            }
        }, 100);

        console.log('🔍 Modal de busca inicializado');
    }

    /**
     * Abrir modal de busca de reserva
     */
    function abrirBuscaReserva() {
        try {
            // Garantir que o modal existe
            inicializarModalBusca();

            const modal = new bootstrap.Modal(document.getElementById('modalBuscaReserva'));
            modal.show();
            
            // Limpar busca anterior
            const protocoloBusca = document.getElementById('protocoloBusca');
            const resultadoBusca = document.getElementById('resultadoBusca');
            
            if (protocoloBusca) protocoloBusca.value = '';
            if (resultadoBusca) resultadoBusca.innerHTML = '';
            
            console.log('🔍 Modal de busca aberto com sucesso');
        } catch (error) {
            console.error('❌ Erro ao abrir modal de busca:', error);
            alert('Erro ao abrir janela de busca. Recarregue a página e tente novamente.');
        }
    }

    /**
     * Buscar reserva por protocolo
     */
    async function buscarReserva() {
        const protocolo = document.getElementById('protocoloBusca').value.trim();
        const resultadoDiv = document.getElementById('resultadoBusca');
        
        console.log('🔍 BUSCAR RESERVA INICIADA');
        console.log('📋 Protocolo digitado:', protocolo);
        
        if (!protocolo) {
            // Usar Utils.showToast se disponível, senão alert
            if (typeof Utils !== 'undefined' && typeof Utils.showToast === 'function') {
                Utils.showToast('Por favor, informe o protocolo', 'warning');
            } else {
                alert('Por favor, informe o protocolo');
            }
            return;
        }
        
        // Validação básica de protocolo (12 dígitos)
        if (protocolo.length !== 12 || !/^\d{12}$/.test(protocolo)) {
            if (typeof Utils !== 'undefined' && typeof Utils.showToast === 'function') {
                Utils.showToast('Protocolo deve ter 12 dígitos', 'warning');
            } else {
                alert('Protocolo deve ter 12 dígitos');
            }
            return;
        }
        
        // Mostrar loading
        if (typeof Utils !== 'undefined' && typeof Utils.showLoading === 'function') {
            Utils.showLoading(resultadoDiv, 'Buscando reserva...');
        } else {
            resultadoDiv.innerHTML = `
                <div class="d-flex justify-content-center align-items-center py-3">
                    <div class="spinner-border text-primary me-2" role="status">
                        <span class="visually-hidden">Carregando...</span>
                    </div>
                    <span>Buscando reserva...</span>
                </div>
            `;
        }
        
        try {
            console.log('🌐 Iniciando busca por protocolo:', protocolo);
            console.log('🔧 API disponível:', typeof API);
            console.log('🔧 API.buscarReservaPorProtocolo disponível:', typeof API.buscarReservaPorProtocolo);
            
            if (typeof API === 'undefined' || typeof API.buscarReservaPorProtocolo !== 'function') {
                throw new Error('API não está disponível. Certifique-se de incluir o arquivo api.js');
            }
            
            const resultado = await API.buscarReservaPorProtocolo(protocolo);
            
            console.log('📦 Resultado da busca completo:', resultado);
            console.log('✅ Sucesso:', resultado.sucesso);
            console.log('📊 Dados:', resultado.dados);
            
            if (!resultado.sucesso) {
                console.log('❌ Erro retornado pela API:', resultado.erro);
                
                // Se for erro de "não encontrada", mostrar mensagem mais útil
                if (resultado.erro.includes('não encontrada') || resultado.erro.includes('not found')) {
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
                
                throw new Error(resultado.erro);
            }
            
            console.log('🎯 Chamando mostrarResultadoBusca com:', resultado.dados);
            mostrarResultadoBusca(resultado.dados);
            
        } catch (error) {
            console.error('💥 Erro ao buscar reserva:', error);
            console.error('💥 Stack trace:', error.stack);
            resultadoDiv.innerHTML = `
                <div class="alert alert-warning">
                    <i class="bi bi-exclamation-triangle"></i>
                    Reserva não encontrada. Verifique o protocolo informado.
                    <hr>
                    <small class="text-muted">Debug: ${error.message}</small>
                </div>
            `;
        }
    }

    /**
     * Mostrar resultado da busca
     */
    function mostrarResultadoBusca(reservas) {
        const resultadoDiv = document.getElementById('resultadoBusca');
        
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
                                    const dataFormatada = formatarDataSegura(reserva.data_reserva);
                                    const horaInicioFormatada = formatarHoraSegura(reserva.hora_inicio);
                                    const horaFimFormatada = formatarHoraSegura(reserva.hora_fim);
                                    
                                    return `
                                        <div class="col-md-6 mb-2">
                                            <div class="border rounded p-2 small">
                                                <strong>${dataFormatada}</strong><br>
                                                ${horaInicioFormatada} às ${horaFimFormatada}<br>
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
                                ${typeof ICalendarUtils !== 'undefined' ? `
                                <div class="d-flex align-items-center">
                                    <div class="flex-grow-1">
                                        <strong><i class="bi bi-calendar-plus"></i> Adicionar ao Calendário:</strong><br>
                                        <small class="text-muted">Adicione esta reserva à sua agenda pessoal (Google Calendar, Outlook, etc.)</small>
                                    </div>
                                    <div>
                                        ${ICalendarUtils.gerarBotaoDownload(primeiraReserva)}
                                    </div>
                                </div>
                                ` : ''}
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
            
            const dataFormatada = formatarDataSegura(reserva.data_reserva);
            const horaInicioFormatada = formatarHoraSegura(reserva.hora_inicio);
            const horaFimFormatada = formatarHoraSegura(reserva.hora_fim);
            
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
                                <small class="text-muted">${horaInicioFormatada} às ${horaFimFormatada}</small>
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
                                ${typeof ICalendarUtils !== 'undefined' ? `
                                <div class="d-flex align-items-center">
                                    <div class="flex-grow-1">
                                        <strong><i class="bi bi-calendar-plus"></i> Adicionar ao Calendário:</strong><br>
                                        <small class="text-muted">Adicione esta reserva à sua agenda pessoal (Google Calendar, Outlook, etc.)</small>
                                    </div>
                                    <div>
                                        ${ICalendarUtils.gerarBotaoDownload(reserva)}
                                    </div>
                                </div>
                                ` : ''}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }
    }

    /**
     * Funções auxiliares para formatação - com fallbacks
     */
    function formatarStatus(status) {
        // Tentar usar ReservaUtils se disponível
        if (typeof ReservaUtils !== 'undefined' && typeof ReservaUtils.formatarStatus === 'function') {
            try {
                return ReservaUtils.formatarStatus(status);
            } catch (error) {
                console.warn('Erro ao usar ReservaUtils.formatarStatus, usando fallback:', error);
            }
        }
        
        // Fallback interno
        const statusMap = {
            'pendente': { classe: 'bg-warning text-dark', texto: 'Pendente' },
            'aprovada': { classe: 'bg-success', texto: 'Aprovada' },
            'rejeitada': { classe: 'bg-danger', texto: 'Rejeitada' },
            'cancelada': { classe: 'bg-secondary', texto: 'Cancelada' }
        };
        
        return statusMap[status] || { classe: 'bg-secondary', texto: status || 'Indefinido' };
    }

    function formatarDataSegura(data) {
        // Tentar usar FormularioUtils se disponível
        if (typeof FormularioUtils !== 'undefined' && typeof FormularioUtils.formatarDataSegura === 'function') {
            try {
                return FormularioUtils.formatarDataSegura(data);
            } catch (error) {
                console.warn('Erro ao usar FormularioUtils.formatarDataSegura, usando fallback:', error);
            }
        }
        
        // Fallback interno
        if (!data) return 'Data inválida';
        try {
            const date = new Date(data);
            if (isNaN(date.getTime())) {
                return 'Data inválida';
            }
            return date.toLocaleDateString('pt-BR');
        } catch (error) {
            console.warn('Erro ao formatar data:', error);
            return data.toString();
        }
    }

    function formatarHoraSegura(hora) {
        // Tentar usar FormularioUtils se disponível
        if (typeof FormularioUtils !== 'undefined' && typeof FormularioUtils.formatarHoraSegura === 'function') {
            try {
                return FormularioUtils.formatarHoraSegura(hora);
            } catch (error) {
                console.warn('Erro ao usar FormularioUtils.formatarHoraSegura, usando fallback:', error);
            }
        }
        
        // Fallback interno
        if (!hora) return 'Hora inválida';
        try {
            // Assumir formato HH:MM:SS e retornar apenas HH:MM
            if (typeof hora === 'string' && hora.length >= 5) {
                return hora.substring(0, 5);
            }
            return hora.toString();
        } catch (error) {
            console.warn('Erro ao formatar hora:', error);
            return hora.toString();
        }
    }

    /**
     * Exportar funções para uso global IMEDIATAMENTE
     */
    window.abrirBuscaReserva = abrirBuscaReserva;
    window.buscarReserva = buscarReserva;
    window.mostrarResultadoBusca = mostrarResultadoBusca;

    // Função de inicialização principal
    function inicializar() {
        if (typeof bootstrap === 'undefined') {
            console.error('🔍 [BuscaGlobal] Bootstrap não está disponível na inicialização');
            return;
        }
        
        inicializarModalBusca();
        console.log('🔍 [BuscaGlobal] Módulo inicializado com sucesso');
    }

    // Inicializar baseado no estado do documento
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            console.log('🔍 [BuscaGlobal] DOM carregado, iniciando...');
            setTimeout(tentarInicializar, 100);
        });
    } else {
        // DOM já está pronto
        console.log('🔍 [BuscaGlobal] DOM já pronto, iniciando...');
        setTimeout(tentarInicializar, 100);
    }

    console.log('🔍 [BuscaGlobal] Módulo carregado, funções exportadas');

})();
