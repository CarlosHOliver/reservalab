/**
 * ReservaLAB - Sistema de Reservas de Laboratórios e Equipamentos
 * JavaScript do Formulário Principal
 * 
 * Idealizado e Desenvolvido por Carlos Henrique C. de Oliveira - Tec. Laboratório de Informática FAEN/UFGD - Engenheiro da Computação
 */

// Estado global do formulário
let estadoFormulario = {
    blocosCarregados: false,
    laboratoriosSelecionados: [],
    equipamentosSelecionados: [],
    conflitosDetectados: [],
    validacaoAtiva: false
};

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    inicializarFormulario();
});

/**
 * Inicializar formulário e eventos
 */
async function inicializarFormulario() {
    try {
        // Configurar data mínima e máxima
        configurarDatas();
        
        // Carregar blocos
        await carregarBlocos();
        
        // Configurar eventos
        configurarEventos();
        
        // Configurar validações em tempo real
        configurarValidacoes();
        
        console.log('Formulário inicializado com sucesso');
    } catch (error) {
        console.error('Erro ao inicializar formulário:', error);
        Utils.showToast('Erro ao carregar o formulário. Recarregue a página.', 'danger');
    }
}

/**
 * Configurar datas mínima e máxima
 */
function configurarDatas() {
    const dataReserva = document.getElementById('dataReserva');
    const recorrenciaFim = document.getElementById('recorrenciaFim');
    
    if (dataReserva) {
        dataReserva.min = DateUtils.getDataMinima();
        dataReserva.max = DateUtils.getDataMaxima();
    }
    
    if (recorrenciaFim) {
        recorrenciaFim.min = DateUtils.getDataMinima();
        recorrenciaFim.max = DateUtils.getDataMaxima();
    }
}

/**
 * Carregar blocos do banco de dados
 */
async function carregarBlocos() {
    try {
        const resultado = await API.buscarBlocos();
        
        if (!resultado.sucesso) {
            throw new Error(resultado.erro);
        }
        
        const blocoLaboratorio = document.getElementById('blocoLaboratorio');
        const blocoEquipamento = document.getElementById('blocoEquipamento');
        
        // Limpar opções existentes
        blocoLaboratorio.innerHTML = '<option value="">Selecione o bloco</option>';
        blocoEquipamento.innerHTML = '<option value="">Selecione o bloco</option>';
        
        // Adicionar blocos
        resultado.dados.forEach(bloco => {
            const optionLab = new Option(bloco.nome, bloco.id);
            const optionEq = new Option(bloco.nome, bloco.id);
            
            blocoLaboratorio.add(optionLab);
            blocoEquipamento.add(optionEq);
        });
        
        estadoFormulario.blocosCarregados = true;
        
    } catch (error) {
        console.error('Erro ao carregar blocos:', error);
        Utils.showToast('Erro ao carregar blocos. Tente recarregar a página.', 'danger');
    }
}

/**
 * Configurar todos os eventos do formulário
 */
function configurarEventos() {
    // Eventos de mudança de bloco
    document.getElementById('blocoLaboratorio').addEventListener('change', carregarLaboratorios);
    document.getElementById('blocoEquipamento').addEventListener('change', carregarEquipamentos);
    
    // Eventos de recorrência
    document.getElementById('recorrenciaTipo').addEventListener('change', toggleRecorrencia);
    
    // Eventos de validação de horário
    document.getElementById('dataReserva').addEventListener('change', validarConflitos);
    document.getElementById('horaInicio').addEventListener('change', validarHorarios);
    document.getElementById('horaFim').addEventListener('change', validarHorarios);
    
    // Evento de validação de e-mail
    document.getElementById('email').addEventListener('blur', validarEmail);
    
    // Evento de formatação de telefone
    document.getElementById('telefone').addEventListener('input', formatarTelefone);
    
    // Evento de submissão do formulário
    document.getElementById('formReserva').addEventListener('submit', submeterFormulario);
    
    // Eventos de seleção de recursos
    document.getElementById('laboratorio').addEventListener('change', verificarAcompanhamento);
}

/**
 * Configurar validações em tempo real
 */
function configurarValidacoes() {
    // Debounce para validações que fazem requisições
    const validarConflitosDebounced = Utils.debounce(validarConflitos, 500);
    
    // Aplicar debounce aos eventos que precisam
    document.getElementById('dataReserva').addEventListener('change', validarConflitosDebounced);
    document.getElementById('horaInicio').addEventListener('change', validarConflitosDebounced);
    document.getElementById('horaFim').addEventListener('change', validarConflitosDebounced);
    document.getElementById('laboratorio').addEventListener('change', validarConflitosDebounced);
}

/**
 * Carregar laboratórios do bloco selecionado
 */
async function carregarLaboratorios() {
    const blocoId = document.getElementById('blocoLaboratorio').value;
    const laboratorioSelect = document.getElementById('laboratorio');
    
    // Limpar seleção anterior
    laboratorioSelect.innerHTML = '<option value="">Carregando...</option>';
    laboratorioSelect.disabled = true;
    
    if (!blocoId) {
        laboratorioSelect.innerHTML = '<option value="">Primeiro selecione o bloco</option>';
        return;
    }
    
    try {
        const resultado = await API.buscarLaboratoriosPorBloco(blocoId);
        
        if (!resultado.sucesso) {
            throw new Error(resultado.erro);
        }
        
        laboratorioSelect.innerHTML = '<option value="">Selecione o laboratório</option>';
        
        resultado.dados.forEach(laboratorio => {
            const option = new Option(laboratorio.nome, laboratorio.id);
            laboratorioSelect.add(option);
        });
        
        laboratorioSelect.disabled = false;
        
    } catch (error) {
        console.error('Erro ao carregar laboratórios:', error);
        laboratorioSelect.innerHTML = '<option value="">Erro ao carregar</option>';
        Utils.showToast('Erro ao carregar laboratórios', 'danger');
    }
}

/**
 * Carregar equipamentos do bloco selecionado
 */
async function carregarEquipamentos() {
    const blocoId = document.getElementById('blocoEquipamento').value;
    const container = document.getElementById('equipamentosContainer');
    
    // Mostrar loading
    Utils.showLoading(container, 'Carregando equipamentos...');
    
    if (!blocoId) {
        container.innerHTML = '<p class="text-muted mb-0">Primeiro selecione o bloco</p>';
        return;
    }
    
    try {
        const resultado = await API.buscarEquipamentosPorBloco(blocoId);
        
        if (!resultado.sucesso) {
            throw new Error(resultado.erro);
        }
        
        if (resultado.dados.length === 0) {
            container.innerHTML = '<p class="text-muted mb-0">Nenhum equipamento disponível neste bloco</p>';
            return;
        }
        
        // Gerar checkboxes dos equipamentos
        let html = '';
        resultado.dados.forEach(equipamento => {
            const necessitaAcompanhamento = equipamento.necessita_acompanhamento ? 
                '<small class="text-warning"><i class="bi bi-exclamation-triangle"></i> Necessita acompanhamento</small>' : '';
            
            html += `
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="${equipamento.id}" 
                           id="eq_${equipamento.id}" onchange="verificarAcompanhamento()">
                    <label class="form-check-label" for="eq_${equipamento.id}">
                        <strong>${equipamento.nome}</strong>
                        <br><small class="text-muted">Local: ${equipamento.local}</small>
                        ${necessitaAcompanhamento}
                    </label>
                </div>
            `;
        });
        
        container.innerHTML = html;
        
    } catch (error) {
        console.error('Erro ao carregar equipamentos:', error);
        container.innerHTML = '<p class="text-danger mb-0">Erro ao carregar equipamentos</p>';
        Utils.showToast('Erro ao carregar equipamentos', 'danger');
    }
}

/**
 * Toggle da recorrência
 */
function toggleRecorrencia() {
    const tipo = document.getElementById('recorrenciaTipo').value;
    const dataFim = document.getElementById('recorrenciaFim');
    
    if (tipo === 'nenhuma') {
        dataFim.disabled = true;
        dataFim.value = '';
        dataFim.removeAttribute('required');
    } else {
        dataFim.disabled = false;
        dataFim.setAttribute('required', 'required');
        
        // Definir data mínima como amanhã
        const amanha = new Date();
        amanha.setDate(amanha.getDate() + 1);
        dataFim.min = amanha.toISOString().split('T')[0];
    }
}

/**
 * Validar horários
 */
function validarHorarios() {
    const horaInicio = document.getElementById('horaInicio').value;
    const horaFim = document.getElementById('horaFim').value;
    
    if (!horaInicio || !horaFim) return;
    
    if (!Validadores.horario(horaInicio, horaFim)) {
        Utils.adicionarErro('horaFim', 'A hora de fim deve ser posterior à hora de início');
        return false;
    } else {
        Utils.removerErro('horaFim');
        // REMOVIDO: validarConflitos(); <- Causava loop infinito
        return true;
    }
}

/**
 * Validar e-mail institucional
 */
function validarEmail() {
    const email = document.getElementById('email').value;
    
    if (!email) return;
    
    if (!Validadores.emailInstitucional(email)) {
        Utils.adicionarErro('email', SISTEMA_CONFIG.mensagens.erro.emailInvalido);
        return false;
    } else {
        Utils.removerErro('email');
        return true;
    }
}

/**
 * Formatar telefone
 */
function formatarTelefone() {
    const telefone = document.getElementById('telefone');
    telefone.value = Utils.formatarTelefone(telefone.value);
}

/**
 * Verificar se recursos selecionados necessitam acompanhamento
 */
async function verificarAcompanhamento() {
    const laboratorioId = document.getElementById('laboratorio').value;
    const equipamentosSelecionados = Array.from(document.querySelectorAll('#equipamentosContainer input:checked'));
    const professorContainer = document.getElementById('professorContainer');
    const professorInput = document.getElementById('professorAcompanhante');
    
    let necessitaAcompanhamento = false;
    
    // Verificar laboratório (assumindo que alguns podem necessitar)
    // Esta lógica pode ser expandida conforme necessário
    
    // Verificar equipamentos
    for (const checkbox of equipamentosSelecionados) {
        const label = document.querySelector(`label[for="${checkbox.id}"]`);
        if (label && label.innerHTML.includes('Necessita acompanhamento')) {
            necessitaAcompanhamento = true;
            break;
        }
    }
    
    if (necessitaAcompanhamento) {
        professorContainer.style.display = 'block';
        professorInput.setAttribute('required', 'required');
    } else {
        professorContainer.style.display = 'none';
        professorInput.removeAttribute('required');
        professorInput.value = '';
        Utils.removerErro('professorAcompanhante');
    }
    
    // Revalidar conflitos
    validarConflitos();
}

/**
 * Validar conflitos de horário
 */
async function validarConflitos() {
    const dataReservaInput = document.getElementById("dataReserva").value;
    const horaInicioInput = document.getElementById("horaInicio").value;
    const horaFimInput = document.getElementById("horaFim").value;
    const laboratorioSelect = document.getElementById('laboratorio');
    
    // Verificar se todos os campos necessários estão preenchidos
    if (!dataReservaInput || !horaInicioInput || !horaFimInput) {
        return;
    }
    
    // Obter o laboratório selecionado (pode ser null se não houver seleção)
    const laboratorioId = laboratorioSelect.value ? parseInt(laboratorioSelect.value) : null;

    // Converter para UTC a partir do horário de Cuiabá
    const dataInicioCuiaba = new Date(`${dataReservaInput}T${horaInicioInput}:00`);
    const dataFimCuiaba = new Date(`${dataReservaInput}T${horaFimInput}:00`);

    const dataInicioUTC = DateUtils.convertFromCuiabaToUTC(dataInicioCuiaba);
    const dataFimUTC = DateUtils.convertFromCuiabaToUTC(dataFimCuiaba);
    
    // Verificar se as conversões foram bem-sucedidas
    if (!dataInicioUTC || !dataFimUTC || !dataInicioUTC.toISO || !dataFimUTC.toISO) {
        console.error('Erro na conversão de datas para UTC');
        return;
    }

    const dataReservaFormatada = dataInicioUTC.toISO().split("T")[0];
    const horaInicioFormatada = dataInicioUTC.toISO().split("T")[1].substring(0, 5);
    const horaFimFormatada = dataFimUTC.toISO().split("T")[1].substring(0, 5);
    const equipamentosSelecionados = Array.from(document.querySelectorAll('#equipamentosContainer input:checked'))
        .map(cb => parseInt(cb.value));
    
    const conflitosContainer = document.getElementById('conflitosContainer');
    const btnSubmit = document.getElementById('btnSubmit');
    
    // Esconder conflitos anteriores
    conflitosContainer.style.display = 'none';
    btnSubmit.disabled = false;
    
    // REMOVIDO: if (!validarHorarios()) return; <- Causava loop infinito
    
    try {
        const resultado = await API.verificarConflitos(
            dataReservaFormatada, 
            horaInicioFormatada, 
            horaFimFormatada, 
            laboratorioId || null, 
            equipamentosSelecionados
        );
        
        if (!resultado.sucesso) {
            throw new Error(resultado.erro);
        }
        
        if (resultado.dados.length > 0) {
            mostrarConflitos(resultado.dados);
            btnSubmit.disabled = true;
        } else {
            estadoFormulario.conflitosDetectados = [];
        }
        
    } catch (error) {
        console.error('Erro ao verificar conflitos:', error);
        Utils.showToast('Erro ao verificar conflitos de horário', 'warning');
    }
}

/**
 * Mostrar conflitos detectados
 */
function mostrarConflitos(conflitos) {
    const conflitosContainer = document.getElementById('conflitosContainer');
    const conflitosLista = document.getElementById('conflitosLista');
    
    let html = '<ul class="mb-0">';
    
    conflitos.forEach(conflito => {
        if (conflito.tipo === 'laboratorio') {
            html += `<li>Laboratório "${conflito.recurso}" já reservado das ${DateUtils.formatarHora(conflito.reserva.hora_inicio)} às ${DateUtils.formatarHora(conflito.reserva.hora_fim)}</li>`;
        } else if (conflito.tipo === 'equipamento') {
            html += `<li>Equipamento(s) já reservado(s) das ${DateUtils.formatarHora(conflito.reserva.hora_inicio)} às ${DateUtils.formatarHora(conflito.reserva.hora_fim)}</li>`;
        }
    });
    
    html += '</ul>';
    
    conflitosLista.innerHTML = html;
    conflitosContainer.style.display = 'block';
    
    estadoFormulario.conflitosDetectados = conflitos;
    
    // Scroll para os conflitos
    Utils.scrollTo(conflitosContainer, 100);
}

/**
 * Submeter formulário
 */
async function submeterFormulario(event) {
    event.preventDefault();

    const form = event.target;
    const btnSubmit = document.getElementById('btnSubmit');

    // Validar formulário
    if (!Utils.validarFormulario(form)) {
        Utils.showToast(SISTEMA_CONFIG.mensagens.erro.camposObrigatorios, 'warning');
        return;
    }

    // Verificar se há conflitos
    if (estadoFormulario.conflitosDetectados.length > 0) {
        Utils.showToast(SISTEMA_CONFIG.mensagens.erro.conflitosDetectados, 'danger');
        return;
    }

    // Verificar se pelo menos um recurso foi selecionado
    const laboratorioId = document.getElementById('laboratorio').value;
    const equipamentosSelecionados = Array.from(document.querySelectorAll('#equipamentosContainer input:checked'));

    if (!laboratorioId && equipamentosSelecionados.length === 0) {
        Utils.showToast(SISTEMA_CONFIG.mensagens.erro.semRecursosSelecionados, 'warning');
        return;
    }

    // Validações específicas
    if (!validarEmail()) return;
    if (!validarHorarios()) return;

    // Definir datas formatadas para envio
    const dataReservaInput = document.getElementById("dataReserva").value;
    const horaInicioInput = document.getElementById("horaInicio").value;
    const horaFimInput = document.getElementById("horaFim").value;
    const dataInicioCuiaba = new Date(`${dataReservaInput}T${horaInicioInput}:00`);
    const dataFimCuiaba = new Date(`${dataReservaInput}T${horaFimInput}:00`);
    const dataInicioUTC = DateUtils.convertFromCuiabaToUTC(dataInicioCuiaba);
    const dataFimUTC = DateUtils.convertFromCuiabaToUTC(dataFimCuiaba);
    const dataReservaFormatada = dataInicioUTC.toISO().split("T")[0];
    const horaInicioFormatada = dataInicioUTC.toISO().split("T")[1].substring(0, 5);
        const horaFimFormatada = dataFimUTC.toISO().split("T")[1].substring(0, 5);

    // Mostrar loading
    btnSubmit.disabled = true;
    btnSubmit.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Enviando...';

    try {
        // Coletar dados do formulário
        const dadosReserva = {
            nomeCompleto: document.getElementById('nomeCompleto').value,
            siapeRga: document.getElementById('siapeRga').value,
            email: document.getElementById('email').value,
            telefone: document.getElementById('telefone').value,
            dataReserva: dataReservaFormatada,
            horaInicio: horaInicioFormatada,
            horaFim: horaFimFormatada,
            finalidade: document.getElementById('finalidade').value,
            laboratorioId: laboratorioId || null,
            equipamentos: equipamentosSelecionados.map(cb => parseInt(cb.value)),
            professorAcompanhante: document.getElementById('professorAcompanhante').value,
            recorrenciaTipo: document.getElementById('recorrenciaTipo').value,
            recorrenciaFim: document.getElementById('recorrenciaFim').value
        };

        // Enviar reserva
        const resultado = await API.criarReserva(dadosReserva);

        if (!resultado.sucesso) {
            throw new Error(resultado.erro);
        }

        // Mostrar sucesso
        mostrarSucesso(resultado.dados.protocolo);

    } catch (error) {
        console.error('Erro ao criar reserva:', error);
        Utils.showToast('Erro ao enviar solicitação: ' + error.message, 'danger');

        // Restaurar botão
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = '<i class="bi bi-send"></i> Enviar Solicitação';
    }
}

/**
 * Mostrar modal de sucesso
 */
function mostrarSucesso(protocolo) {
    document.getElementById('protocoloGerado').textContent = protocolo;
    
    const modal = new bootstrap.Modal(document.getElementById('modalSucesso'));
    modal.show();
}

/**
 * Limpar formulário
 */
function limparFormulario() {
    const form = document.getElementById('formReserva');
    
    Utils.showConfirm(
        'Limpar Formulário',
        'Tem certeza que deseja limpar todos os campos preenchidos?',
        (confirmado) => {
            if (confirmado) {
                form.reset();
                Utils.limparValidacao(form);
                
                // Resetar estado
                estadoFormulario.conflitosDetectados = [];
                
                // Esconder seções condicionais
                document.getElementById('professorContainer').style.display = 'none';
                document.getElementById('conflitosContainer').style.display = 'none';
                
                // Resetar selects
                document.getElementById('laboratorio').innerHTML = '<option value="">Primeiro selecione o bloco</option>';
                document.getElementById('laboratorio').disabled = true;
                document.getElementById('equipamentosContainer').innerHTML = '<p class="text-muted mb-0">Primeiro selecione o bloco</p>';
                
                // Reconfigurar datas
                configurarDatas();
                
                Utils.showToast('Formulário limpo com sucesso', 'success');
            }
        }
    );
}

/**
 * Nova reserva (após sucesso)
 */
function novaReserva() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalSucesso'));
    modal.hide();
    
    limparFormulario();
}

/**
 * Abrir modal de busca de reserva
 */
function abrirBuscaReserva() {
    const modal = new bootstrap.Modal(document.getElementById('modalBuscaReserva'));
    modal.show();
    
    // Limpar busca anterior
    document.getElementById('protocoloBusca').value = '';
    document.getElementById('resultadoBusca').innerHTML = '';
}

/**
 * Buscar reserva por protocolo
 */
async function buscarReserva() {
    const protocolo = document.getElementById('protocoloBusca').value.trim();
    const resultadoDiv = document.getElementById('resultadoBusca');
    
    if (!protocolo) {
        Utils.showToast('Por favor, informe o protocolo', 'warning');
        return;
    }
    
    if (!Validadores.protocolo(protocolo)) {
        Utils.showToast('Protocolo deve ter 12 dígitos', 'warning');
        return;
    }
    
    Utils.showLoading(resultadoDiv, 'Buscando reserva...');
    
    try {
        const resultado = await API.buscarReservaPorProtocolo(protocolo);
        
        if (!resultado.sucesso) {
            throw new Error(resultado.erro);
        }
        
        mostrarResultadoBusca(resultado.dados);
        
    } catch (error) {
        console.error('Erro ao buscar reserva:', error);
        resultadoDiv.innerHTML = `
            <div class="alert alert-warning">
                <i class="bi bi-exclamation-triangle"></i>
                Reserva não encontrada. Verifique o protocolo informado.
            </div>
        `;
    }
}

/**
 * Mostrar resultado da busca
 */
function mostrarResultadoBusca(reserva) {
    const resultadoDiv = document.getElementById('resultadoBusca');
    const status = ReservaUtils.formatarStatus(reserva.status);
    
    // Converter datas e horas para o fuso horário de Cuiabá para exibição
    const dataReservaCuiaba = DateUtils.convertToCuiabaTime(new Date(`${reserva.data_reserva}T${reserva.hora_inicio}`));
    const horaInicioCuiaba = DateUtils.convertToCuiabaTime(new Date(`${reserva.data_reserva}T${reserva.hora_inicio}`));
    const horaFimCuiaba = DateUtils.convertToCuiabaTime(new Date(`${reserva.data_reserva}T${reserva.hora_fim}`));
    
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
                        ${DateUtils.formatarData(dataReservaCuiaba)}<br>
                        <small class="text-muted">${DateUtils.formatarHora(horaInicioCuiaba.toTimeString())} às ${DateUtils.formatarHora(horaFimCuiaba.toTimeString())}</small>
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
            </div>
        </div>
    `;
}

// Exportar funções para uso global
window.limparFormulario = limparFormulario;
window.novaReserva = novaReserva;
window.abrirBuscaReserva = abrirBuscaReserva;
window.buscarReserva = buscarReserva;
window.verificarAcompanhamento = verificarAcompanhamento;

