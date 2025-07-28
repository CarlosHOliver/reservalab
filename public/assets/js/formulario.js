/**
 * ReservaLAB - Formulário de Reservas
 * Sistema de Reservas de Laboratórios e Equipamentos - FAEN/UFGD
 * Desenvolvido por Carlos Henrique C. de Oliveira
 * Versão: 1.0.2 - Versão limpa e otimizada - 28/07/2025
 */

console.log('✅ ReservaLAB v1.0.2 - Sistema totalmente funcional');

// Objeto com utilitários para formulário
const FormularioUtils = {
    /**
     * Formatar data de forma segura
     */
    formatarDataSegura(data) {
        try {
            // Se data é nula ou undefined
            if (!data) return 'Data inválida';
            
            // Se é uma string de data ISO (YYYY-MM-DD)
            if (typeof data === 'string' && data.includes('-')) {
                const partes = data.split('T')[0].split('-');
                if (partes.length === 3) {
                    return `${partes[2]}/${partes[1]}/${partes[0]}`;
                }
                return data;
            }
            
            // Tentar usar DateUtils se disponível
            if (typeof DateUtils !== 'undefined' && DateUtils.formatarData) {
                return DateUtils.formatarData(data);
            }
            
            // Fallback para Date nativo
            if (data instanceof Date) {
                return data.toLocaleDateString('pt-BR');
            }
            
            // Se é um objeto DateTime do Luxon
            if (data && typeof data.toFormat === 'function') {
                return data.toFormat('dd/MM/yyyy');
            }
            
            return data.toString();
            
        } catch (error) {
            console.error('Erro ao formatar data:', error, data);
            return typeof data === 'string' ? data : 'Data inválida';
        }
    },

    /**
     * Formatação de hora completamente defensiva
     */
    formatarHoraSegura(hora) {
        // Se já é string no formato correto, retornar
        if (typeof hora === 'string' && /^\d{2}:\d{2}$/.test(hora)) {
            return hora;
        }
        
        // Se é string no formato com segundos, remover segundos
        if (typeof hora === 'string' && /^\d{2}:\d{2}:\d{2}/.test(hora)) {
            return hora.substring(0, 5);
        }
        
        // Se é string de timestamp, converter
        if (typeof hora === 'string' && hora.includes('T')) {
            try {
                const dt = DateTime.fromISO(hora, { zone: 'America/Cuiaba' });
                if (dt.isValid) {
                    return dt.toFormat('HH:mm');
                }
            } catch (error) {
                console.error('Erro ao converter ISO string:', error);
            }
        }
        
        // Se é objeto Date, usar Luxon
        if (hora instanceof Date) {
            try {
                const dt = DateTime.fromJSDate(hora, { zone: 'America/Cuiaba' });
                if (dt.isValid) {
                    return dt.toFormat('HH:mm');
                }
            } catch (error) {
                console.error('Erro ao converter Date:', error);
            }
        }
        
        // Se é objeto DateTime do Luxon
        if (hora && typeof hora.toFormat === 'function') {
            try {
                return hora.toFormat('HH:mm');
            } catch (error) {
                console.error('Erro ao converter DateTime:', error);
            }
        }
        
        // Último recurso: tentar extrair de qualquer formato
        const horaStr = String(hora);
        const match = horaStr.match(/(\d{1,2}):(\d{2})/);
        if (match) {
            return match[1].padStart(2, '0') + ':' + match[2];
        }
        
        // Se nada funcionou, retornar fallback
        console.warn('Não foi possível formatar hora:', hora);
        return '00:00';
    },

    /**
     * Converter para horário de Cuiabá de forma segura
     */
    convertToCuiabaTimeSeguro(data) {
        try {
            // Se data é nula ou undefined
            if (!data) return data;
            
            // Tentar usar DateUtils se disponível
            if (typeof DateUtils !== 'undefined' && DateUtils.convertToCuiabaTime) {
                const resultado = DateUtils.convertToCuiabaTime(data);
                if (resultado) return resultado;
            }
            
            // Fallback: retornar a data original se não conseguir converter
            return data;
            
        } catch (error) {
            console.error('Erro ao converter para horário de Cuiabá:', error, data);
            return data;
        }
    }
};

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
        
    } catch (error) {
        console.error('Erro ao inicializar formulário:', error);
        alert('Erro ao carregar o formulário: ' + error.message);
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
    document.getElementById('recorrenciaFim').addEventListener('change', validarRecorrenciaFim);
    document.getElementById('recorrenciaFim').addEventListener('blur', validarRecorrenciaFim);
    
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
        Utils.removerErro('recorrenciaFim');
    } else {
        dataFim.disabled = false;
        dataFim.setAttribute('required', 'required');
        
        // Definir data mínima como amanhã
        const amanha = new Date();
        amanha.setDate(amanha.getDate() + 1);
        dataFim.min = amanha.toISOString().split('T')[0];
        
        // Definir data máxima (2 meses à frente)
        dataFim.max = DateUtils.getDataMaxima();
    }
}

/**
 * Validar data de fim da recorrência
 */
function validarRecorrenciaFim() {
    const dataFim = document.getElementById('recorrenciaFim');
    const tipo = document.getElementById('recorrenciaTipo').value;
    
    if (tipo === 'nenhuma' || !dataFim.value) {
        Utils.removerErro('recorrenciaFim');
        return true;
    }
    
    const dataMaxima = DateUtils.getDataMaxima();
    const dataInformada = dataFim.value;
    
    if (dataInformada > dataMaxima) {
        // Converter a data máxima para exibição formatada
        const dataMaximaFormatada = DateUtils.formatarData(dataMaxima);
        Utils.adicionarErro('recorrenciaFim', `A data final não pode ultrapassar ${dataMaximaFormatada} (limite de 2 meses)`);
        return false;
    } else {
        Utils.removerErro('recorrenciaFim');
        return true;
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
        try {
            if (conflito.tipo === 'laboratorio') {
                html += `<li>Laboratório "${conflito.recurso}" já reservado das ${FormularioUtils.formatarHoraSegura(conflito.reserva.hora_inicio)} às ${FormularioUtils.formatarHoraSegura(conflito.reserva.hora_fim)}</li>`;
            } else if (conflito.tipo === 'equipamento') {
                html += `<li>Equipamento(s) já reservado(s) das ${FormularioUtils.formatarHoraSegura(conflito.reserva.hora_inicio)} às ${FormularioUtils.formatarHoraSegura(conflito.reserva.hora_fim)}</li>`;
            }
        } catch (error) {
            console.error('Erro ao formatar horário do conflito:', error, conflito);
            if (conflito.tipo === 'laboratorio') {
                html += `<li>Laboratório "${conflito.recurso}" já reservado das ${conflito.reserva.hora_inicio} às ${conflito.reserva.hora_fim}</li>`;
            } else if (conflito.tipo === 'equipamento') {
                html += `<li>Equipamento(s) já reservado(s) das ${conflito.reserva.hora_inicio} às ${conflito.reserva.hora_fim}</li>`;
            }
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

    // Validar data final da recorrência
    if (!validarRecorrenciaFim()) {
        Utils.showToast('Por favor, corrija a data final da recorrência.', 'warning');
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
 * Buscar reserva por protocolo - Debug Version
 */
async function buscarReserva() {
    const protocolo = document.getElementById('protocoloBusca').value.trim();
    const resultadoDiv = document.getElementById('resultadoBusca');
    
    console.log('🔍 BUSCAR RESERVA INICIADA');
    console.log('📋 Protocolo digitado:', protocolo);
    
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
        console.log('🌐 Iniciando busca por protocolo:', protocolo);
        console.log('🔧 API disponível:', typeof API);
        console.log('🔧 API.buscarReservaPorProtocolo disponível:', typeof API.buscarReservaPorProtocolo);
        
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
                            <strong>💡 Dica:</strong> Para testar o sistema, você pode usar os protocolos reais:<br>
                            • <code>202507000001</code> - Carlos Henrique Oliveira<br>
                            • <code>202507000002</code> - Carlos Henrique Oliveira<br>
                            • <code>202507000003</code> - Carlos Henrique Oliveira<br><br>
                            Ou execute <code>window.testarConexaoBanco()</code> no console para verificar a conexão.
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
        const status = ReservaUtils.formatarStatus(primeiraReserva.status);
        
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
                                // Versão ultra-defensiva: tentar primeiro formatação, depois dados brutos
                                let dataFormatada, horaInicioFormatada, horaFimFormatada;
                                let statusReserva;
                                
                                try {
                                    statusReserva = ReservaUtils.formatarStatus(reserva.status);
                                } catch (error) {
                                    console.error('Erro ao formatar status:', error);
                                    statusReserva = { classe: 'bg-secondary', texto: reserva.status || 'Indefinido' };
                                }
                                
                                try {
                                    // Tentar conversão para Cuiabá
                                    const dataReservaCuiaba = FormularioUtils.convertToCuiabaTimeSeguro(new Date(`${reserva.data_reserva}T${reserva.hora_inicio}`));
                                    const horaInicioCuiaba = FormularioUtils.convertToCuiabaTimeSeguro(new Date(`${reserva.data_reserva}T${reserva.hora_inicio}`));
                                    const horaFimCuiaba = FormularioUtils.convertToCuiabaTimeSeguro(new Date(`${reserva.data_reserva}T${reserva.hora_fim}`));
                                    
                                    dataFormatada = FormularioUtils.formatarDataSegura(dataReservaCuiaba);
                                    horaInicioFormatada = FormularioUtils.formatarHoraSegura(horaInicioCuiaba);
                                    horaFimFormatada = FormularioUtils.formatarHoraSegura(horaFimCuiaba);
                                } catch (error) {
                                    console.error('Erro na conversão de data/hora:', error);
                                    // Usar dados brutos se a conversão falhar
                                    dataFormatada = FormularioUtils.formatarDataSegura(reserva.data_reserva);
                                    horaInicioFormatada = FormularioUtils.formatarHoraSegura(reserva.hora_inicio);
                                    horaFimFormatada = FormularioUtils.formatarHoraSegura(reserva.hora_fim);
                                }
                                
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
                </div>
            </div>
        `;
    } else {
        // Compatibilidade com reservas individuais (código anterior)
        console.log('Processando reserva individual:', reservas);
        const reserva = reservas;
        const status = ReservaUtils.formatarStatus(reserva.status);
        
        // Versão ultra-defensiva para reservas individuais
        let dataFormatada, horaInicioFormatada, horaFimFormatada;
        
        try {
            // Tentar conversão para Cuiabá
            const dataReservaCuiaba = FormularioUtils.convertToCuiabaTimeSeguro(new Date(`${reserva.data_reserva}T${reserva.hora_inicio}`));
            const horaInicioCuiaba = FormularioUtils.convertToCuiabaTimeSeguro(new Date(`${reserva.data_reserva}T${reserva.hora_inicio}`));
            const horaFimCuiaba = FormularioUtils.convertToCuiabaTimeSeguro(new Date(`${reserva.data_reserva}T${reserva.hora_fim}`));
            
            dataFormatada = FormularioUtils.formatarDataSegura(dataReservaCuiaba);
            horaInicioFormatada = FormularioUtils.formatarHoraSegura(horaInicioCuiaba);
            horaFimFormatada = FormularioUtils.formatarHoraSegura(horaFimCuiaba);
        } catch (error) {
            console.error('Erro na conversão de data/hora individual:', error);
            // Usar dados brutos se a conversão falhar
            dataFormatada = FormularioUtils.formatarDataSegura(reserva.data_reserva);
            horaInicioFormatada = FormularioUtils.formatarHoraSegura(reserva.hora_inicio);
            horaFimFormatada = FormularioUtils.formatarHoraSegura(reserva.hora_fim);
        }
        
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
                </div>
            </div>
        `;
    }
}

// Definir as funções globalmente IMEDIATAMENTE, não apenas no final
(function() {
    'use strict';
    
    // Função para abrir modal de busca de reserva
    function abrirBuscaReservaGlobal() {
        try {
            const modal = new bootstrap.Modal(document.getElementById('modalBuscaReserva'));
            modal.show();
            
            // Limpar busca anterior
            const protocoloBusca = document.getElementById('protocoloBusca');
            const resultadoBusca = document.getElementById('resultadoBusca');
            
            if (protocoloBusca) protocoloBusca.value = '';
            if (resultadoBusca) resultadoBusca.innerHTML = '';
            
            console.log('Modal de busca aberto com sucesso');
        } catch (error) {
            console.error('Erro ao abrir modal de busca:', error);
            alert('Erro ao abrir janela de busca. Recarregue a página e tente novamente.');
        }
    }
    
    // Função para buscar reserva por protocolo - wrapper global
    async function buscarReservaGlobal() {
        try {
            // Chamar diretamente a implementação original
            const protocolo = document.getElementById('protocoloBusca')?.value?.trim();
            const resultadoDiv = document.getElementById('resultadoBusca');
            
            console.log('🔍 BUSCAR RESERVA INICIADA');
            console.log('📋 Protocolo digitado:', protocolo);
            
            if (!protocolo) {
                Utils.showToast('Por favor, informe o protocolo', 'warning');
                return;
            }
            
            if (!Validadores.protocolo(protocolo)) {
                Utils.showToast('Protocolo deve ter 12 dígitos', 'warning');
                return;
            }
            
            Utils.showLoading(resultadoDiv, 'Buscando reserva...');
            
            console.log('🌐 Iniciando busca por protocolo:', protocolo);
            console.log('🔧 API disponível:', typeof API);
            console.log('🔧 API.buscarReservaPorProtocolo disponível:', typeof API.buscarReservaPorProtocolo);
            
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
                                <strong>💡 Dica:</strong> Para testar o sistema, você pode usar os protocolos reais:<br>
                                • <code>202507000001</code> - Carlos Henrique Oliveira<br>
                                • <code>202507000002</code> - Carlos Henrique Oliveira<br>
                                • <code>202507000003</code> - Carlos Henrique Oliveira<br><br>
                                Ou execute <code>window.testarConexaoBanco()</code> no console para verificar a conexão.
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
            const resultadoDiv = document.getElementById('resultadoBusca');
            if (resultadoDiv) {
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
    }
    
    // Função para verificar acompanhamento
    function verificarAcompanhamentoGlobal() {
        try {
            if (typeof verificarAcompanhamento === 'function') {
                verificarAcompanhamento();
            } else {
                console.log('Função verificarAcompanhamento não carregada ainda');
            }
        } catch (error) {
            console.error('Erro ao verificar acompanhamento:', error);
        }
    }
    
    // Atribuir às variáveis globais IMEDIATAMENTE
    window.abrirBuscaReserva = abrirBuscaReservaGlobal;
    window.buscarReserva = buscarReservaGlobal;
    window.verificarAcompanhamento = verificarAcompanhamentoGlobal;
    
    console.log('Funções globais definidas imediatamente');
})();

// Exportar funções para uso global de forma mais robusta
if (typeof window !== 'undefined') {
    // NÃO sobrescrever - manter as versões globais já definidas
    if (typeof limparFormulario === 'function') window.limparFormulario = limparFormulario;
    if (typeof novaReserva === 'function') window.novaReserva = novaReserva;
    // Não reatribuir buscarReserva para evitar recursão
    
    // Marcar que o script foi carregado
    window.FormularioCarregado = true;
    console.log('Formulário JavaScript carregado com sucesso');
    
    // Debug: mostrar todas as funções disponíveis
    console.log('Funções disponíveis:', {
        abrirBuscaReserva: typeof window.abrirBuscaReserva,
        buscarReserva: typeof window.buscarReserva,
        verificarAcompanhamento: typeof window.verificarAcompanhamento,
        limparFormulario: typeof window.limparFormulario,
        novaReserva: typeof window.novaReserva
    });
}

// Verificar se todas as dependências estão disponíveis
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado - verificando dependências...');
    
    // Verificar dependências principais
    const dependencias = ['Utils', 'API', 'DateUtils', 'Validadores', 'ReservaUtils', 'SISTEMA_CONFIG'];
    const faltando = [];
    
    dependencias.forEach(dep => {
        if (typeof window[dep] === 'undefined') {
            faltando.push(dep);
        }
    });
    
    if (faltando.length > 0) {
        console.warn('Dependências faltando:', faltando);
    }
    
    // Verificar se as funções foram exportadas
    const funcoes = ['limparFormulario', 'novaReserva', 'abrirBuscaReserva', 'buscarReserva', 'verificarAcompanhamento'];
    funcoes.forEach(funcao => {
        if (typeof window[funcao] !== 'function') {
            console.error(`Função ${funcao} não foi exportada corretamente`);
        } else {
            console.log(`✓ Função ${funcao} disponível`);
        }
    });
});

// 🚀 CACHE BUSTER - Versão Ultra-Defensiva v2.1 - ${Date.now()}
console.log('🔥 FORMULARIO.JS ULTRA-DEFENSIVO CARREGADO EM:', new Date().toISOString());

// 🧪 FUNÇÃO DE TESTE - Listar todas as reservas para debug
window.testarConexaoBanco = async function() {
    console.log('🧪 TESTANDO CONEXÃO COM O BANCO...');
    try {
        console.log('🔗 Supabase cliente:', typeof supabase);
        console.log('🔗 Configuração:', SUPABASE_CONFIG?.url);
        
        const { data, error } = await supabase
            .from('reservas')
            .select('protocolo, status, data_reserva, nome_completo, hora_inicio, hora_fim')
            .limit(10);
            
        if (error) {
            console.error('❌ Erro na conexão:', error);
            console.error('❌ Detalhes do erro:', JSON.stringify(error, null, 2));
            return;
        }
        
        console.log('✅ Conexão OK! Reservas encontradas:', data.length);
        console.log('📋 Todas as reservas:', data);
        
        if (data.length > 0) {
            console.log('🎯 Protocolos disponíveis para teste:');
            data.forEach((r, i) => {
                console.log(`  ${i+1}. ${r.protocolo} - ${r.nome_completo} - ${r.status} - ${r.data_reserva} ${r.hora_inicio}-${r.hora_fim}`);
            });
        } else {
            console.log('⚠️ Nenhuma reserva encontrada no banco!');
        }
    } catch (error) {
        console.error('💥 Erro geral:', error);
        console.error('💥 Stack:', error.stack);
    }
};

// Executar teste automaticamente
setTimeout(() => {
    console.log('🔄 Executando teste automático da conexão...');
    window.testarConexaoBanco();
}, 2000);

