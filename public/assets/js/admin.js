/**
 * ReservaLAB - Sistema de Reservas de Laboratórios e Equipamentos
 * Admin JavaScript - Dashboard Administrativa
 * 
 * Idealizado e Desenvolvido por Carlos Henrique C. de Oliveira - Tec. Laboratório de Informática FAEN/UFGD - Engenheiro da Computação
 */

// Verificar se bcrypt está disponível e configurar
let bcryptLib;

function getBcryptLib() {
    // Verificar múltiplas formas de acesso ao bcrypt
    if (typeof bcrypt !== 'undefined') {
        console.log('🔧 Usando bcrypt global');
        return bcrypt;
    } else if (typeof window.bcrypt !== 'undefined') {
        console.log('🔧 Usando window.bcrypt');
        return window.bcrypt;
    } else if (typeof dcodeIO !== 'undefined' && dcodeIO.bcrypt) {
        console.log('🔧 Usando dcodeIO.bcrypt');
        return dcodeIO.bcrypt;
    } else {
        console.error('❌ ERRO: Biblioteca bcrypt não encontrada');
        console.log('🔍 Verificando variáveis globais:', {
            bcrypt: typeof bcrypt,
            'window.bcrypt': typeof window.bcrypt,
            'dcodeIO': typeof dcodeIO
        });
        return null;
    }
}

// Função fallback para formatação de data caso DateUtils não esteja disponível
function formatarDataFallback(dataString) {
    try {
        if (!dataString) return 'Data não informada';
        
        // Se DateUtils estiver disponível, usar ele
        if (typeof DateUtils !== 'undefined' && DateUtils.formatarData) {
            return DateUtils.formatarData(dataString);
        }
        
        // Fallback usando Date nativo do JavaScript
        const data = new Date(dataString);
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();
        return `${dia}/${mes}/${ano}`;
    } catch (error) {
        console.warn('Erro ao formatar data:', error);
        return dataString; // Retorna a string original se houver erro
    }
}

// Inicializar bcryptLib
bcryptLib = getBcryptLib();

// Estado da aplicação
let currentUser = null;
let currentReservaId = null;

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se as bibliotecas essenciais estão carregadas
    setTimeout(() => {
        if (typeof luxon === 'undefined') {
            console.warn('⚠️ Luxon não carregado - usando formatação de data fallback');
        } else {
            console.log('✅ Luxon disponível');
        }
        
        if (typeof DateUtils === 'undefined') {
            console.warn('⚠️ DateUtils não disponível - usando formatação de data fallback');
        } else {
            console.log('✅ DateUtils disponível');
        }
    }, 1000);
    
    checkLoginStatus();
    setupEventListeners();
});

/**
 * Configurar event listeners
 */
function setupEventListeners() {
    // Login form
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // Configurações form
    document.getElementById('formConfiguracoes').addEventListener('submit', salvarConfiguracoes);
    
    // Alterar senha form
    document.getElementById('formAlterarSenha').addEventListener('submit', alterarSenha);
}

/**
 * Verificar status de login
 */
function checkLoginStatus() {
    const userData = localStorage.getItem('adminUser');
    if (userData) {
        currentUser = JSON.parse(userData);
        showDashboard();
    } else {
        showLogin();
    }
}

/**
 * Mostrar tela de login
 */
function showLogin() {
    document.getElementById('loginScreen').style.display = 'block';
    document.getElementById('dashboardScreen').style.display = 'none';
    document.getElementById('userInfo').style.display = 'none';
}

/**
 * Mostrar dashboard
 */
function showDashboard() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('dashboardScreen').style.display = 'block';
    document.getElementById('userInfo').style.display = 'block';
    document.getElementById('userName').textContent = currentUser.nome;
    
    // Carregar dados iniciais
    loadDashboardData();
}

/**
 * Handle login
 */
async function handleLogin(e) {
    e.preventDefault();
    
    const login = document.getElementById('loginUser').value;
    const senha = document.getElementById('loginPassword').value;
    const errorDiv = document.getElementById('loginError');
    
    try {
        console.log('🔍 Tentando login com:', login);
        
        // Buscar usuário no banco
        const { data, error } = await supabase
            .from('usuarios')
            .select('*')
            .eq('login', login)
            .eq('ativo', true)
            .single();
        
        console.log('📊 Resposta do banco:', { data, error });
        
        if (error || !data) {
            console.error('❌ Usuário não encontrado:', error);
            throw new Error('Usuário não encontrado ou inativo');
        }
        
        console.log('🔐 Verificando senha...');
        console.log('Hash do banco:', data.senha_hash);
        console.log('Senha digitada:', senha);
        
        // Reobter bcryptLib se necessário
        if (!bcryptLib) {
            bcryptLib = getBcryptLib();
            if (!bcryptLib) {
                throw new Error('Biblioteca bcrypt não disponível');
            }
        }
        
        // Verificar senha usando bcrypt
        console.log('📚 Usando biblioteca:', bcryptLib.constructor.name || 'bcrypt');
        const senhaValida = bcryptLib.compareSync(senha, data.senha_hash);
        
        console.log('✅ Senha válida:', senhaValida);
        
        // Teste adicional de debug (remover em produção)
        if (!senhaValida) {
            console.log('🔍 Debug - testando senhas conhecidas...');
            const senhasTest = ['secret', 'admin', 'password', '123456'];
            senhasTest.forEach(senhaTest => {
                const testeValido = bcryptLib.compareSync(senhaTest, data.senha_hash);
                console.log(`   Teste "${senhaTest}": ${testeValido}`);
            });
        }
        
        if (!senhaValida) {
            throw new Error('Senha incorreta');
        }
        
        // Login bem-sucedido
        currentUser = data;
        localStorage.setItem('adminUser', JSON.stringify(data));
        
        // Atualizar último acesso
        await supabase
            .from('usuarios')
            .update({ ultimo_acesso: new Date().toISOString() })
            .eq('id', data.id);
        
        showDashboard();
        errorDiv.style.display = 'none';
        
    } catch (error) {
        console.error('Erro no login:', error);
        errorDiv.textContent = error.message;
        errorDiv.style.display = 'block';
    }
}

/**
 * Logout
 */
function logout() {
    localStorage.removeItem('adminUser');
    currentUser = null;
    showLogin();
    
    // Limpar formulários
    document.getElementById('loginForm').reset();
    document.getElementById('loginError').style.display = 'none';
}

/**
 * Mostrar seção específica
 */
function showSection(sectionName) {
    // Ocultar todas as seções
    document.querySelectorAll('.dashboard-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Remover classe active de todos os nav-links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Mostrar seção selecionada
    document.getElementById(`section-${sectionName}`).style.display = 'block';
    
    // Adicionar classe active ao link clicado
    event.target.classList.add('active');
    
    // Carregar dados específicos da seção
    switch(sectionName) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'reservas':
            loadReservas();
            break;
        case 'laboratorios':
            loadLaboratorios();
            break;
        case 'equipamentos':
            loadEquipamentos();
            break;
        case 'usuarios':
            carregarUsuarios();
            break;
        case 'reports':
            carregarReports();
            break;
        case 'formularios':
            loadFormularios();
            break;
        case 'configuracoes':
            loadConfiguracoes();
            break;
    }
}

/**
 * Carregar dados do dashboard
 */
async function loadDashboardData() {
    try {
        // Carregar estatísticas
        await Promise.all([
            loadEstatisticas(),
            loadReservasPendentes()
        ]);
    } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
    }
}

/**
 * Carregar estatísticas
 */
async function loadEstatisticas() {
    try {
        // Total de reservas pendentes
        const { data: pendentes } = await supabase
            .from('reservas')
            .select('id')
            .eq('status', 'pendente');
        
        document.getElementById('totalPendentes').textContent = pendentes?.length || 0;
        
        // Total de reservas aprovadas
        const { data: aprovadas } = await supabase
            .from('reservas')
            .select('id')
            .eq('status', 'aprovada');
        
        document.getElementById('totalAprovadas').textContent = aprovadas?.length || 0;
        
        // Total de laboratórios
        const { data: laboratorios } = await supabase
            .from('laboratorios')
            .select('id')
            .eq('ativo', true);
        
        document.getElementById('totalLaboratorios').textContent = laboratorios?.length || 0;
        
        // Total de equipamentos
        const { data: equipamentos } = await supabase
            .from('equipamentos')
            .select('id')
            .eq('ativo', true);
        
        document.getElementById('totalEquipamentos').textContent = equipamentos?.length || 0;
        
        // Total de usuários ativos
        const { data: usuarios } = await supabase
            .from('usuarios')
            .select('id')
            .eq('ativo', true);
        
        document.getElementById('totalUsuarios').textContent = usuarios?.length || 0;
        
        // Total de reports pendentes
        const resultadoReports = await API.buscarEstatisticasReports();
        if (resultadoReports.sucesso) {
            document.getElementById('totalReportsPendentesDb').textContent = resultadoReports.dados.pendentes;
        }
        
        // Estatísticas do mês
        const agora = new Date();
        const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);
        const fimMes = new Date(agora.getFullYear(), agora.getMonth() + 1, 0);
        
        const { data: reservasMes } = await supabase
            .from('reservas')
            .select('*')
            .gte('created_at', inicioMes.toISOString())
            .lte('created_at', fimMes.toISOString());
        
        const totalMes = reservasMes?.length || 0;
        const aprovadasMes = reservasMes?.filter(r => r.status === 'aprovada').length || 0;
        const taxaAprovacao = totalMes > 0 ? Math.round((aprovadasMes / totalMes) * 100) : 0;
        
        document.getElementById('estatTotalMes').textContent = totalMes;
        document.getElementById('estatTaxaAprovacao').textContent = `${taxaAprovacao}%`;
        
    } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
    }
}

/**
 * Carregar reservas pendentes
 */
async function loadReservasPendentes() {
    try {
        console.log('🔍 Carregando reservas pendentes...');
        
        const { data: reservas, error } = await supabase
            .from('reservas')
            .select(`
                *,
                laboratorios (nome),
                reserva_equipamentos (
                    equipamentos (nome)
                )
            `)
            .eq('status', 'pendente')
            .order('created_at', { ascending: false })
            .limit(10);
        
        console.log('📊 Resposta das reservas pendentes:', { reservas, error });
        
        if (error) throw error;
        
        const container = document.getElementById('reservasPendentes');
        
        if (!reservas || reservas.length === 0) {
            console.log('⚠️ Nenhuma reserva pendente encontrada');
            container.innerHTML = '<p class="text-muted text-center">Nenhuma reserva pendente</p>';
            
            // Debug: verificar se existem reservas com outros status
            const { data: todasReservas, error: errorTodas } = await supabase
                .from('reservas')
                .select('id, protocolo, status, created_at')
                .order('created_at', { ascending: false })
                .limit(20);
            
            console.log('🔍 Todas as reservas (debug):', todasReservas);
            
            return;
        }
        
        container.innerHTML = reservas.map(reserva => `
            <div class="border rounded p-3 mb-2">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h6 class="mb-1">
                            <span class="badge bg-warning">Pendente</span>
                            ${reserva.protocolo}
                        </h6>
                        <p class="mb-1"><strong>${reserva.nome_completo}</strong></p>
                        <p class="mb-1 text-muted">
                            ${formatarDataFallback(reserva.data_reserva)} - 
                            ${reserva.hora_inicio} às ${reserva.hora_fim}
                        </p>
                        <p class="mb-0 small text-muted">
                            ${reserva.laboratorios?.nome || 'Sem laboratório'} 
                            ${reserva.reserva_equipamentos?.length > 0 ? 
                                `+ ${reserva.reserva_equipamentos.length} equipamento(s)` : ''}
                        </p>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="verDetalhesReserva(${reserva.id})">
                        <i class="bi bi-eye"></i> Ver
                    </button>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Erro ao carregar reservas pendentes:', error);
        document.getElementById('reservasPendentes').innerHTML = 
            '<p class="text-danger text-center">Erro ao carregar reservas</p>';
    }
}

/**
 * Carregar reservas
 */
async function loadReservas() {
    try {
        const { data: reservas, error } = await supabase
            .from('reservas')
            .select(`
                *,
                laboratorios (nome),
                reserva_equipamentos (
                    equipamentos (nome)
                )
            `)
            .order('created_at', { ascending: false })
            .limit(50);
        
        if (error) throw error;
        
        const tbody = document.getElementById('tabelaReservas');
        
        if (!reservas || reservas.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">Nenhuma reserva encontrada</td></tr>';
            return;
        }
        
        tbody.innerHTML = reservas.map(reserva => `
            <tr>
                <td>${reserva.protocolo}</td>
                <td>
                    <div>${reserva.nome_completo}</div>
                    <small class="text-muted">${reserva.email}</small>
                </td>
                <td>
                    <div>${formatarDataFallback(reserva.data_reserva)}</div>
                    <small class="text-muted">${reserva.hora_inicio} - ${reserva.hora_fim}</small>
                </td>
                <td>
                    <div>${reserva.laboratorios?.nome || 'Sem laboratório'}</div>
                    ${reserva.reserva_equipamentos?.length > 0 ? 
                        `<small class="text-muted">${reserva.reserva_equipamentos.length} equipamento(s)</small>` : ''}
                </td>
                <td>
                    <span class="badge ${getStatusBadgeClass(reserva.status)}">
                        ${getStatusText(reserva.status)}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="verDetalhesReserva(${reserva.id})">
                        <i class="bi bi-eye"></i>
                    </button>
                </td>
            </tr>
        `).join('');
        
    } catch (error) {
        console.error('Erro ao carregar reservas:', error);
    }
}

/**
 * Ver detalhes da reserva
 */
async function verDetalhesReserva(reservaId) {
    try {
        const { data: reserva, error } = await supabase
            .from('reservas')
            .select(`
                *,
                laboratorios (nome, blocos (nome)),
                reserva_equipamentos (
                    equipamentos (nome, patrimonio, blocos (nome))
                )
            `)
            .eq('id', reservaId)
            .single();
        
        if (error) throw error;
        
        currentReservaId = reservaId;
        
        const content = document.getElementById('detalhesReservaContent');
        content.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <h6><i class="bi bi-person"></i> Dados do Solicitante</h6>
                    <table class="table table-sm">
                        <tr><td><strong>Nome:</strong></td><td>${reserva.nome_completo}</td></tr>
                        <tr><td><strong>SIAPE/RGA:</strong></td><td>${reserva.siape_rga}</td></tr>
                        <tr><td><strong>E-mail:</strong></td><td>${reserva.email}</td></tr>
                        <tr><td><strong>Telefone:</strong></td><td>${reserva.telefone || 'Não informado'}</td></tr>
                    </table>
                </div>
                <div class="col-md-6">
                    <h6><i class="bi bi-calendar"></i> Dados da Reserva</h6>
                    <table class="table table-sm">
                        <tr><td><strong>Protocolo:</strong></td><td>${reserva.protocolo}</td></tr>
                        <tr><td><strong>Data:</strong></td><td>${formatarDataFallback(reserva.data_reserva)}</td></tr>
                        <tr><td><strong>Horário:</strong></td><td>${reserva.hora_inicio} às ${reserva.hora_fim}</td></tr>
                        <tr><td><strong>Status:</strong></td><td>
                            <span class="badge ${getStatusBadgeClass(reserva.status)}">
                                ${getStatusText(reserva.status)}
                            </span>
                        </td></tr>
                    </table>
                </div>
            </div>
            
            <div class="row mt-3">
                <div class="col-12">
                    <h6><i class="bi bi-chat-text"></i> Finalidade</h6>
                    <p class="border rounded p-2">${reserva.finalidade}</p>
                </div>
            </div>
            
            ${reserva.laboratorios ? `
                <div class="row mt-3">
                    <div class="col-12">
                        <h6><i class="bi bi-building"></i> Laboratório</h6>
                        <p>${reserva.laboratorios.nome} - ${reserva.laboratorios.blocos?.nome || 'Bloco não informado'}</p>
                    </div>
                </div>
            ` : ''}
            
            ${reserva.reserva_equipamentos?.length > 0 ? `
                <div class="row mt-3">
                    <div class="col-12">
                        <h6><i class="bi bi-tools"></i> Equipamentos</h6>
                        <ul class="list-group">
                            ${reserva.reserva_equipamentos.map(re => `
                                <li class="list-group-item">
                                    ${re.equipamentos.nome} 
                                    <small class="text-muted">(${re.equipamentos.patrimonio})</small>
                                    - ${re.equipamentos.blocos?.nome || 'Bloco não informado'}
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
            ` : ''}
            
            ${reserva.professor_acompanhante ? `
                <div class="row mt-3">
                    <div class="col-12">
                        <h6><i class="bi bi-person-badge"></i> Professor/Técnico Responsável</h6>
                        <p>${reserva.professor_acompanhante}</p>
                    </div>
                </div>
            ` : ''}
            
            ${reserva.motivo_rejeicao ? `
                <div class="row mt-3">
                    <div class="col-12">
                        <h6><i class="bi bi-x-circle"></i> Motivo da Rejeição</h6>
                        <div class="alert alert-danger">${reserva.motivo_rejeicao}</div>
                    </div>
                </div>
            ` : ''}
        `;
        
        // Mostrar/ocultar botões baseado no status
        const btnAprovar = document.getElementById('btnAprovar');
        const btnRejeitar = document.getElementById('btnRejeitar');
        
        if (reserva.status === 'pendente') {
            btnAprovar.style.display = 'inline-block';
            btnRejeitar.style.display = 'inline-block';
        } else {
            btnAprovar.style.display = 'none';
            btnRejeitar.style.display = 'none';
        }
        
        const modal = new bootstrap.Modal(document.getElementById('modalDetalhesReserva'));
        modal.show();
        
    } catch (error) {
        console.error('Erro ao carregar detalhes da reserva:', error);
        alert('Erro ao carregar detalhes da reserva');
    }
}

/**
 * Aprovar reserva
 */
async function aprovarReserva() {
    if (!currentReservaId) return;
    
    try {
        const { error } = await supabase
            .from('reservas')
            .update({
                status: 'aprovada',
                aprovado_por: currentUser.id,
                data_aprovacao: new Date().toISOString()
            })
            .eq('id', currentReservaId);
        
        if (error) throw error;
        
        alert('Reserva aprovada com sucesso!');
        
        // Fechar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalDetalhesReserva'));
        modal.hide();
        
        // Recarregar dados
        loadDashboardData();
        if (document.getElementById('section-reservas').style.display !== 'none') {
            loadReservas();
        }
        
    } catch (error) {
        console.error('Erro ao aprovar reserva:', error);
        alert('Erro ao aprovar reserva');
    }
}

/**
 * Mostrar modal de motivo de rejeição
 */
function mostrarMotivoRejeicao() {
    const modal = new bootstrap.Modal(document.getElementById('modalMotivoRejeicao'));
    modal.show();
}

/**
 * Rejeitar reserva
 */
async function rejeitarReserva() {
    if (!currentReservaId) return;
    
    const motivo = document.getElementById('motivoRejeicao').value.trim();
    if (!motivo) {
        alert('Por favor, informe o motivo da rejeição');
        return;
    }
    
    try {
        const { error } = await supabase
            .from('reservas')
            .update({
                status: 'rejeitada',
                motivo_rejeicao: motivo,
                aprovado_por: currentUser.id,
                data_aprovacao: new Date().toISOString()
            })
            .eq('id', currentReservaId);
        
        if (error) throw error;
        
        alert('Reserva rejeitada com sucesso!');
        
        // Fechar modais
        const modalMotivo = bootstrap.Modal.getInstance(document.getElementById('modalMotivoRejeicao'));
        modalMotivo.hide();
        
        const modalDetalhes = bootstrap.Modal.getInstance(document.getElementById('modalDetalhesReserva'));
        modalDetalhes.hide();
        
        // Limpar campo
        document.getElementById('motivoRejeicao').value = '';
        
        // Recarregar dados
        loadDashboardData();
        if (document.getElementById('section-reservas').style.display !== 'none') {
            loadReservas();
        }
        
    } catch (error) {
        console.error('Erro ao rejeitar reserva:', error);
        alert('Erro ao rejeitar reserva');
    }
}

/**
 * Filtrar reservas
 */
function filtrarReservas() {
    // TODO: Implementar filtros
    loadReservas();
}

/**
 * Exportar reservas
 */
function exportarReservas() {
    // TODO: Implementar exportação
    alert('Funcionalidade de exportação será implementada em breve');
}

/**
 * Funções para outras seções (stub)
 */
function loadLaboratorios() {
    document.getElementById('tabelaLaboratorios').innerHTML = 
        '<tr><td colspan="5" class="text-center">Funcionalidade em desenvolvimento</td></tr>';
}

function loadEquipamentos() {
    document.getElementById('tabelaEquipamentos').innerHTML = 
        '<tr><td colspan="6" class="text-center">Funcionalidade em desenvolvimento</td></tr>';
}

function loadFormularios() {
    document.getElementById('tabelaFormularios').innerHTML = 
        '<tr><td colspan="4" class="text-center">Funcionalidade em desenvolvimento</td></tr>';
}

function loadConfiguracoes() {
    // TODO: Carregar configurações do banco
}

function salvarConfiguracoes(e) {
    e.preventDefault();
    // TODO: Salvar configurações
    alert('Configurações salvas com sucesso!');
}

function alterarSenha(e) {
    e.preventDefault();
    
    const senhaAtual = document.getElementById('senhaAtual').value;
    const novaSenha = document.getElementById('novaSenha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;
    
    // Validações
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
        alert('Por favor, preencha todos os campos');
        return;
    }
    
    if (novaSenha !== confirmarSenha) {
        alert('A nova senha e a confirmação não coincidem');
        return;
    }
    
    if (novaSenha.length < 6) {
        alert('A nova senha deve ter pelo menos 6 caracteres');
        return;
    }
    
    // Verificar senha atual
    const senhaAtualValida = bcryptLib.compareSync(senhaAtual, currentUser.senha_hash);
    
    if (!senhaAtualValida) {
        alert('Senha atual incorreta');
        return;
    }
    
    // Gerar hash da nova senha
    const novoHash = bcryptLib.hashSync(novaSenha, 10);
    
    // Atualizar no banco
    supabase
        .from('usuarios')
        .update({ senha_hash: novoHash })
        .eq('id', currentUser.id)
        .then(({ error }) => {
            if (error) {
                console.error('Erro ao alterar senha:', error);
                alert('Erro ao alterar senha');
            } else {
                // Atualizar usuário local
                currentUser.senha_hash = novoHash;
                localStorage.setItem('adminUser', JSON.stringify(currentUser));
                
                alert('Senha alterada com sucesso!');
                document.getElementById('formAlterarSenha').reset();
            }
        });
}

/**
 * Funções auxiliares
 */
function getStatusBadgeClass(status) {
    switch(status) {
        case 'pendente': return 'bg-warning';
        case 'aprovada': return 'bg-success';
        case 'rejeitada': return 'bg-danger';
        default: return 'bg-secondary';
    }
}

function getStatusText(status) {
    switch(status) {
        case 'pendente': return 'Pendente';
        case 'aprovada': return 'Aprovada';
        case 'rejeitada': return 'Rejeitada';
        default: return 'Desconhecido';
    }
}

// Placeholder functions para desenvolvimento futuro
// ==================== GESTÃO DE REPORTS/OCORRÊNCIAS ====================

let reportAtual = null;

/**
 * Carregar lista de reports
 */
async function carregarReports() {
    try {
        // Carregar estatísticas
        await carregarEstatisticasReports();
        
        // Carregar lista de reports
        const resultado = await API.buscarReports();
        
        if (!resultado.sucesso) {
            throw new Error(resultado.erro);
        }
        
        const tbody = document.getElementById('tabelaReports');
        if (!tbody) return;
        
        if (resultado.dados.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center">Nenhum report encontrado</td></tr>';
            return;
        }
        
        tbody.innerHTML = resultado.dados.map(report => {
            const dataFormatada = formatarDataFallback(report.created_at);
            const tipoFormatado = formatarTipoEventualidade(report.tipo_eventualidade);
            const statusBadge = getStatusBadge(report.status);
            const cienciaBadge = getCienciaBadge(report.ciente, report.ciente_por_usuario?.nome);
            
            return `
                <tr ${!report.ciente ? 'class="table-warning"' : ''}>
                    <td><strong>#${report.id}</strong></td>
                    <td><small>${dataFormatada}</small></td>
                    <td>${tipoFormatado}</td>
                    <td>
                        ${report.protocolo_relacionado ? 
                            `<span class="badge bg-info">${report.protocolo_relacionado}</span>` : 
                            '<span class="text-muted">-</span>'
                        }
                    </td>
                    <td>
                        <div class="text-truncate" style="max-width: 200px;" title="${report.descricao}">
                            ${report.descricao}
                        </div>
                    </td>
                    <td>${statusBadge}</td>
                    <td>${cienciaBadge}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary" onclick="verDetalhesReport(${report.id})" title="Ver detalhes">
                            <i class="bi bi-eye"></i>
                        </button>
                        ${!report.ciente ? 
                            `<button class="btn btn-sm btn-outline-success" onclick="marcarCienciaRapida(${report.id})" title="Marcar ciência">
                                <i class="bi bi-check"></i>
                            </button>` : ''
                        }
                    </td>
                </tr>
            `;
        }).join('');
        
    } catch (error) {
        console.error('Erro ao carregar reports:', error);
        const tbody = document.getElementById('tabelaReports');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center text-danger">Erro ao carregar reports</td></tr>';
        }
    }
}

/**
 * Carregar estatísticas de reports
 */
async function carregarEstatisticasReports() {
    try {
        const resultado = await API.buscarEstatisticasReports();
        
        if (resultado.sucesso) {
            document.getElementById('totalReports').textContent = resultado.dados.total;
            document.getElementById('totalReportsPendentes').textContent = resultado.dados.pendentes;
            document.getElementById('totalReportsResolvidos').textContent = resultado.dados.resolvidos;
            document.getElementById('reportsUltimos7Dias').textContent = resultado.dados.ultimos7Dias;
        }
    } catch (error) {
        console.error('Erro ao carregar estatísticas de reports:', error);
    }
}

/**
 * Filtrar reports
 */
async function filtrarReports() {
    const filtros = {
        status: document.getElementById('filtroStatusReport').value,
        tipo_eventualidade: document.getElementById('filtroTipoReport').value,
        ciente: document.getElementById('filtroCienteReport').value === '' ? undefined : 
                document.getElementById('filtroCienteReport').value === 'true'
    };
    
    try {
        const resultado = await API.buscarReports(filtros);
        
        if (!resultado.sucesso) {
            throw new Error(resultado.erro);
        }
        
        const tbody = document.getElementById('tabelaReports');
        if (!tbody) return;
        
        if (resultado.dados.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center">Nenhum report encontrado com os filtros aplicados</td></tr>';
            return;
        }
        
        tbody.innerHTML = resultado.dados.map(report => {
            const dataFormatada = formatarDataFallback(report.created_at);
            const tipoFormatado = formatarTipoEventualidade(report.tipo_eventualidade);
            const statusBadge = getStatusBadge(report.status);
            const cienciaBadge = getCienciaBadge(report.ciente, report.ciente_por_usuario?.nome);
            
            return `
                <tr ${!report.ciente ? 'class="table-warning"' : ''}>
                    <td><strong>#${report.id}</strong></td>
                    <td><small>${dataFormatada}</small></td>
                    <td>${tipoFormatado}</td>
                    <td>
                        ${report.protocolo_relacionado ? 
                            `<span class="badge bg-info">${report.protocolo_relacionado}</span>` : 
                            '<span class="text-muted">-</span>'
                        }
                    </td>
                    <td>
                        <div class="text-truncate" style="max-width: 200px;" title="${report.descricao}">
                            ${report.descricao}
                        </div>
                    </td>
                    <td>${statusBadge}</td>
                    <td>${cienciaBadge}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary" onclick="verDetalhesReport(${report.id})" title="Ver detalhes">
                            <i class="bi bi-eye"></i>
                        </button>
                        ${!report.ciente ? 
                            `<button class="btn btn-sm btn-outline-success" onclick="marcarCienciaRapida(${report.id})" title="Marcar ciência">
                                <i class="bi bi-check"></i>
                            </button>` : ''
                        }
                    </td>
                </tr>
            `;
        }).join('');
        
    } catch (error) {
        console.error('Erro ao filtrar reports:', error);
    }
}

/**
 * Ver detalhes de um report
 */
async function verDetalhesReport(reportId) {
    try {
        const resultado = await API.buscarReports();
        if (!resultado.sucesso) {
            throw new Error(resultado.erro);
        }
        
        const report = resultado.dados.find(r => r.id === reportId);
        if (!report) {
            throw new Error('Report não encontrado');
        }
        
        reportAtual = report;
        
        const dataFormatada = formatarDataFallback(report.created_at);
        const tipoFormatado = formatarTipoEventualidade(report.tipo_eventualidade);
        const statusBadge = getStatusBadge(report.status);
        const cienciaBadge = getCienciaBadge(report.ciente, report.ciente_por_usuario?.nome);
        
        const conteudo = `
            <div class="row">
                <div class="col-md-6">
                    <h6><i class="bi bi-hash"></i> Identificação</h6>
                    <p><strong>ID:</strong> #${report.id}</p>
                    <p><strong>Data/Hora:</strong> ${dataFormatada}</p>
                    <p><strong>Autor:</strong> ${report.autor_nome}</p>
                </div>
                <div class="col-md-6">
                    <h6><i class="bi bi-info-circle"></i> Status</h6>
                    <p><strong>Status:</strong> ${statusBadge}</p>
                    <p><strong>Ciência:</strong> ${cienciaBadge}</p>
                    <p><strong>Prioridade:</strong> <span class="badge bg-secondary">${report.prioridade}</span></p>
                </div>
            </div>
            
            <hr>
            
            <div class="row">
                <div class="col-md-6">
                    <h6><i class="bi bi-exclamation-triangle"></i> Eventualidade</h6>
                    <p><strong>Tipo:</strong> ${tipoFormatado}</p>
                    ${report.protocolo_relacionado ? 
                        `<p><strong>Protocolo Relacionado:</strong> <span class="badge bg-info">${report.protocolo_relacionado}</span></p>` : 
                        ''
                    }
                </div>
                <div class="col-md-6">
                    ${report.ciente ? `
                        <h6><i class="bi bi-check-circle"></i> Ciência</h6>
                        <p><strong>Marcado por:</strong> ${report.ciente_por_usuario?.nome || 'N/A'}</p>
                        <p><strong>Data:</strong> ${formatarDataFallback(report.ciente_em)}</p>
                    ` : ''}
                </div>
            </div>
            
            <hr>
            
            <h6><i class="bi bi-file-text"></i> Descrição da Eventualidade</h6>
            <div class="alert alert-light">
                ${report.descricao}
            </div>
            
            ${report.observacoes_gestao ? `
                <h6><i class="bi bi-clipboard-check"></i> Observações da Gestão</h6>
                <div class="alert alert-info">
                    ${report.observacoes_gestao}
                </div>
            ` : ''}
        `;
        
        document.getElementById('detalhesReportContent').innerHTML = conteudo;
        
        // Configurar botões do modal
        const btnCiente = document.getElementById('btnMarcarCiente');
        const btnStatus = document.getElementById('btnAlterarStatus');
        
        if (btnCiente) {
            btnCiente.style.display = report.ciente ? 'none' : 'inline-block';
        }
        if (btnStatus) {
            btnStatus.style.display = 'inline-block';
        }
        
        // Mostrar modal
        const modal = new bootstrap.Modal(document.getElementById('modalDetalhesReport'));
        modal.show();
        
    } catch (error) {
        console.error('Erro ao carregar detalhes do report:', error);
        alert('Erro ao carregar detalhes do report: ' + error.message);
    }
}

/**
 * Marcar ciência rapidamente
 */
async function marcarCienciaRapida(reportId) {
    if (!confirm('Deseja marcar ciência deste report?')) {
        return;
    }
    
    try {
        // Debug: verificar estado do usuário
        console.log('🔍 Debug currentUser:', currentUser);
        console.log('🔍 Debug localStorage adminUser:', localStorage.getItem('adminUser'));
        
        // Verificar se o usuário está logado
        if (!currentUser || !currentUser.id) {
            // Tentar recuperar do localStorage
            const userData = localStorage.getItem('adminUser');
            if (userData) {
                currentUser = JSON.parse(userData);
                console.log('🔄 Usuário recuperado do localStorage:', currentUser);
            } else {
                throw new Error('Usuário não identificado. Faça login novamente.');
            }
        }
        
        const resultado = await API.marcarReportCiente(reportId, currentUser.id);
        
        if (!resultado.sucesso) {
            throw new Error(resultado.erro);
        }
        
        await carregarReports(); // Recarregar lista
        
        // Usar toast se disponível, senão alert
        if (typeof Utils !== 'undefined' && Utils.showToast) {
            Utils.showToast('Ciência marcada com sucesso!', 'success');
        } else {
            alert('Ciência marcada com sucesso!');
        }
        
    } catch (error) {
        console.error('Erro ao marcar ciência:', error);
        
        // Usar toast se disponível, senão alert
        if (typeof Utils !== 'undefined' && Utils.showToast) {
            Utils.showToast('Erro ao marcar ciência: ' + error.message, 'danger');
        } else {
            alert('Erro ao marcar ciência: ' + error.message);
        }
    }
}

/**
 * Mostrar modal de ciência
 */
function mostrarModalCiencia() {
    const modal = new bootstrap.Modal(document.getElementById('modalCiencia'));
    modal.show();
}

/**
 * Confirmar ciência com observações
 */
async function confirmarCiencia() {
    if (!reportAtual) {
        alert('Nenhum report selecionado');
        return;
    }
    
    try {
        // Debug: verificar estado do usuário
        console.log('🔍 Debug currentUser:', currentUser);
        
        // Verificar se o usuário está logado
        if (!currentUser || !currentUser.id) {
            // Tentar recuperar do localStorage
            const userData = localStorage.getItem('adminUser');
            if (userData) {
                currentUser = JSON.parse(userData);
                console.log('🔄 Usuário recuperado do localStorage:', currentUser);
            } else {
                throw new Error('Usuário não identificado. Faça login novamente.');
            }
        }
        
        const observacoes = document.getElementById('observacoesCiencia').value.trim();
        
        const resultado = await API.marcarReportCiente(reportAtual.id, currentUser.id, observacoes);
        
        if (!resultado.sucesso) {
            throw new Error(resultado.erro);
        }
        
        // Fechar modais
        bootstrap.Modal.getInstance(document.getElementById('modalCiencia')).hide();
        bootstrap.Modal.getInstance(document.getElementById('modalDetalhesReport')).hide();
        
        // Limpar campo de observações
        document.getElementById('observacoesCiencia').value = '';
        
        // Recarregar lista
        await carregarReports();
        
        // Usar toast se disponível, senão alert
        if (typeof Utils !== 'undefined' && Utils.showToast) {
            Utils.showToast('Ciência marcada com sucesso!', 'success');
        } else {
            alert('Ciência marcada com sucesso!');
        }
        
    } catch (error) {
        console.error('Erro ao marcar ciência:', error);
        
        // Usar toast se disponível, senão alert
        if (typeof Utils !== 'undefined' && Utils.showToast) {
            Utils.showToast('Erro ao marcar ciência: ' + error.message, 'danger');
        } else {
            alert('Erro ao marcar ciência: ' + error.message);
        }
    }
}

/**
 * Mostrar modal de alteração de status
 */
function mostrarModalStatus() {
    if (reportAtual) {
        document.getElementById('novoStatus').value = reportAtual.status;
        document.getElementById('observacoesStatus').value = reportAtual.observacoes_gestao || '';
    }
    
    const modal = new bootstrap.Modal(document.getElementById('modalStatus'));
    modal.show();
}

/**
 * Confirmar alteração de status
 */
async function confirmarAlteracaoStatus() {
    if (!reportAtual) {
        alert('Nenhum report selecionado');
        return;
    }
    
    const novoStatus = document.getElementById('novoStatus').value;
    const observacoes = document.getElementById('observacoesStatus').value.trim();
    
    if (!novoStatus) {
        alert('Selecione um status');
        return;
    }
    
    try {
        const resultado = await API.atualizarStatusReport(reportAtual.id, novoStatus, observacoes);
        
        if (!resultado.sucesso) {
            throw new Error(resultado.erro);
        }
        
        // Fechar modais
        bootstrap.Modal.getInstance(document.getElementById('modalStatus')).hide();
        bootstrap.Modal.getInstance(document.getElementById('modalDetalhesReport')).hide();
        
        // Recarregar lista
        await carregarReports();
        alert('Status atualizado com sucesso!');
        
    } catch (error) {
        console.error('Erro ao alterar status:', error);
        alert('Erro ao alterar status: ' + error.message);
    }
}

/**
 * Funções auxiliares para formatação
 */
function formatarTipoEventualidade(tipo) {
    const tipos = {
        'nao_compareceu': 'Não compareceu',
        'problema_acesso': 'Problema de acesso',
        'equipamento_danificado': 'Equipamento danificado',
        'uso_inadequado': 'Uso inadequado',
        'outros': 'Outros'
    };
    return tipos[tipo] || tipo;
}

function getStatusBadge(status) {
    const badges = {
        'aberto': '<span class="badge bg-warning">Aberto</span>',
        'em_analise': '<span class="badge bg-info">Em Análise</span>',
        'resolvido': '<span class="badge bg-success">Resolvido</span>',
        'arquivado': '<span class="badge bg-secondary">Arquivado</span>'
    };
    return badges[status] || `<span class="badge bg-light text-dark">${status}</span>`;
}

function getCienciaBadge(ciente, nomeUsuario) {
    if (ciente) {
        return `<span class="badge bg-success" title="Ciência por: ${nomeUsuario || 'N/A'}">
                    <i class="bi bi-check"></i> Ciente
                </span>`;
    } else {
        return '<span class="badge bg-warning"><i class="bi bi-clock"></i> Pendente</span>';
    }
}

// ==================== GESTÃO DE USUÁRIOS ====================

let usuarioEditando = null;

/**
 * Carregar lista de usuários
 */
async function carregarUsuarios() {
    try {
        const resultado = await API.buscarUsuarios();
        
        if (!resultado.sucesso) {
            throw new Error(resultado.erro);
        }
        
        const tbody = document.getElementById('tabelaUsuarios');
        if (!tbody) return;
        
        if (resultado.dados.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center">Nenhum usuário encontrado</td></tr>';
            return;
        }
        
        tbody.innerHTML = resultado.dados.map(usuario => `
            <tr>
                <td>${usuario.nome}</td>
                <td>${usuario.login}</td>
                <td>${usuario.email}</td>
                <td>
                    <span class="badge ${usuario.perfil === 'administrador' ? 'bg-danger' : 'bg-primary'}">
                        ${usuario.perfil === 'administrador' ? 'Administrador' : 'Gestor'}
                    </span>
                </td>
                <td>${usuario.blocos?.nome || 'Sem bloco'}</td>
                <td>
                    <span class="badge ${usuario.ativo ? 'bg-success' : 'bg-secondary'}">
                        ${usuario.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="editarUsuario(${usuario.id})" title="Editar">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="excluirUsuario(${usuario.id}, '${usuario.nome}')" title="Excluir">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
        
    } catch (error) {
        console.error('Erro ao carregar usuários:', error);
        const tbody = document.getElementById('tabelaUsuarios');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center text-danger">Erro ao carregar usuários</td></tr>';
        }
    }
}

/**
 * Mostrar modal para novo usuário
 */
async function novoUsuario() {
    usuarioEditando = null;
    
    // Carregar blocos para o select
    const resultadoBlocos = await API.buscarBlocos();
    const opcoesBlocos = resultadoBlocos.sucesso ? 
        resultadoBlocos.dados.map(bloco => `<option value="${bloco.id}">${bloco.nome}</option>`).join('') : 
        '<option value="">Erro ao carregar blocos</option>';
    
    const modalHtml = `
        <div class="modal fade" id="modalUsuario" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title">Novo Usuário</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="formUsuario">
                            <div class="mb-3">
                                <label for="usuarioNome" class="form-label">Nome Completo <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="usuarioNome" required>
                            </div>
                            <div class="mb-3">
                                <label for="usuarioLogin" class="form-label">Login <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="usuarioLogin" required>
                                <div class="form-text">O login deve ser único no sistema</div>
                            </div>
                            <div class="mb-3">
                                <label for="usuarioEmail" class="form-label">E-mail <span class="text-danger">*</span></label>
                                <input type="email" class="form-control" id="usuarioEmail" required>
                            </div>
                            <div class="mb-3">
                                <label for="usuarioSenha" class="form-label">Senha <span class="text-danger">*</span></label>
                                <input type="password" class="form-control" id="usuarioSenha" required>
                                <div class="form-text">Mínimo 6 caracteres</div>
                            </div>
                            <div class="mb-3">
                                <label for="usuarioConfirmarSenha" class="form-label">Confirmar Senha <span class="text-danger">*</span></label>
                                <input type="password" class="form-control" id="usuarioConfirmarSenha" required>
                            </div>
                            <div class="mb-3">
                                <label for="usuarioPerfil" class="form-label">Perfil <span class="text-danger">*</span></label>
                                <select class="form-control" id="usuarioPerfil" required>
                                    <option value="">Selecione o perfil</option>
                                    <option value="gestor">Gestor</option>
                                    <option value="administrador">Administrador</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="usuarioBloco" class="form-label">Bloco</label>
                                <select class="form-control" id="usuarioBloco">
                                    <option value="">Sem bloco específico</option>
                                    ${opcoesBlocos}
                                </select>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="usuarioAtivo" checked>
                                <label class="form-check-label" for="usuarioAtivo">
                                    Usuário ativo
                                </label>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" onclick="salvarUsuario()">Salvar</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remover modal existente
    const modalExistente = document.getElementById('modalUsuario');
    if (modalExistente) {
        modalExistente.remove();
    }
    
    // Adicionar novo modal
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('modalUsuario'));
    modal.show();
}

/**
 * Editar usuário existente
 */
async function editarUsuario(id) {
    try {
        // Buscar dados do usuário
        const resultado = await API.buscarUsuarios();
        if (!resultado.sucesso) {
            throw new Error(resultado.erro);
        }
        
        const usuario = resultado.dados.find(u => u.id === id);
        if (!usuario) {
            throw new Error('Usuário não encontrado');
        }
        
        usuarioEditando = usuario;
        
        // Carregar blocos para o select
        const resultadoBlocos = await API.buscarBlocos();
        const opcoesBlocos = resultadoBlocos.sucesso ? 
            resultadoBlocos.dados.map(bloco => `<option value="${bloco.id}" ${bloco.id === usuario.bloco_id ? 'selected' : ''}>${bloco.nome}</option>`).join('') : 
            '<option value="">Erro ao carregar blocos</option>';
        
        const modalHtml = `
            <div class="modal fade" id="modalUsuario" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header bg-warning text-dark">
                            <h5 class="modal-title">Editar Usuário</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <form id="formUsuario">
                                <div class="mb-3">
                                    <label for="usuarioNome" class="form-label">Nome Completo <span class="text-danger">*</span></label>
                                    <input type="text" class="form-control" id="usuarioNome" value="${usuario.nome}" required>
                                </div>
                                <div class="mb-3">
                                    <label for="usuarioLogin" class="form-label">Login <span class="text-danger">*</span></label>
                                    <input type="text" class="form-control" id="usuarioLogin" value="${usuario.login}" required>
                                    <div class="form-text">O login deve ser único no sistema</div>
                                </div>
                                <div class="mb-3">
                                    <label for="usuarioEmail" class="form-label">E-mail <span class="text-danger">*</span></label>
                                    <input type="email" class="form-control" id="usuarioEmail" value="${usuario.email}" required>
                                </div>
                                <div class="mb-3">
                                    <label for="usuarioSenha" class="form-label">Nova Senha</label>
                                    <input type="password" class="form-control" id="usuarioSenha">
                                    <div class="form-text">Deixe em branco para manter a senha atual</div>
                                </div>
                                <div class="mb-3">
                                    <label for="usuarioConfirmarSenha" class="form-label">Confirmar Nova Senha</label>
                                    <input type="password" class="form-control" id="usuarioConfirmarSenha">
                                </div>
                                <div class="mb-3">
                                    <label for="usuarioPerfil" class="form-label">Perfil <span class="text-danger">*</span></label>
                                    <select class="form-control" id="usuarioPerfil" required>
                                        <option value="">Selecione o perfil</option>
                                        <option value="gestor" ${usuario.perfil === 'gestor' ? 'selected' : ''}>Gestor</option>
                                        <option value="administrador" ${usuario.perfil === 'administrador' ? 'selected' : ''}>Administrador</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label for="usuarioBloco" class="form-label">Bloco</label>
                                    <select class="form-control" id="usuarioBloco">
                                        <option value="">Sem bloco específico</option>
                                        ${opcoesBlocos}
                                    </select>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="usuarioAtivo" ${usuario.ativo ? 'checked' : ''}>
                                    <label class="form-check-label" for="usuarioAtivo">
                                        Usuário ativo
                                    </label>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-warning" onclick="salvarUsuario()">Salvar Alterações</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Remover modal existente
        const modalExistente = document.getElementById('modalUsuario');
        if (modalExistente) {
            modalExistente.remove();
        }
        
        // Adicionar novo modal
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        // Mostrar modal
        const modal = new bootstrap.Modal(document.getElementById('modalUsuario'));
        modal.show();
        
    } catch (error) {
        console.error('Erro ao editar usuário:', error);
        alert('Erro ao carregar dados do usuário: ' + error.message);
    }
}

/**
 * Salvar usuário (novo ou editando)
 */
async function salvarUsuario() {
    try {
        const nome = document.getElementById('usuarioNome').value.trim();
        const login = document.getElementById('usuarioLogin').value.trim();
        const email = document.getElementById('usuarioEmail').value.trim();
        const senha = document.getElementById('usuarioSenha').value;
        const confirmarSenha = document.getElementById('usuarioConfirmarSenha').value;
        const perfil = document.getElementById('usuarioPerfil').value;
        const blocoId = document.getElementById('usuarioBloco').value || null;
        const ativo = document.getElementById('usuarioAtivo').checked;
        
        // Validações
        if (!nome || !login || !email || !perfil) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }
        
        if (!usuarioEditando && !senha) {
            alert('A senha é obrigatória para novos usuários.');
            return;
        }
        
        if (senha && senha.length < 6) {
            alert('A senha deve ter pelo menos 6 caracteres.');
            return;
        }
        
        if (senha && senha !== confirmarSenha) {
            alert('As senhas não coincidem.');
            return;
        }
        
        // Verificar se login já existe
        const verificacaoLogin = await API.verificarLoginExistente(login, usuarioEditando?.id);
        if (!verificacaoLogin.sucesso) {
            throw new Error(verificacaoLogin.erro);
        }
        if (verificacaoLogin.existe) {
            alert('Este login já está sendo usado por outro usuário.');
            return;
        }
        
        // Verificar se email já existe
        const verificacaoEmail = await API.verificarEmailExistente(email, usuarioEditando?.id);
        if (!verificacaoEmail.sucesso) {
            throw new Error(verificacaoEmail.erro);
        }
        if (verificacaoEmail.existe) {
            alert('Este e-mail já está sendo usado por outro usuário.');
            return;
        }
        
        // Preparar dados para salvar
        const dadosUsuario = {
            nome,
            login,
            email,
            perfil,
            bloco_id: blocoId,
            ativo
        };
        
        // Se há senha, criptografar
        if (senha) {
            const bcryptLib = getBcryptLib();
            if (!bcryptLib) {
                throw new Error('Biblioteca de criptografia não disponível');
            }
            
            const salt = bcryptLib.genSaltSync(10);
            dadosUsuario.senha_hash = bcryptLib.hashSync(senha, salt);
        }
        
        let resultado;
        if (usuarioEditando) {
            // Atualizar usuário existente
            resultado = await API.atualizarUsuario(usuarioEditando.id, dadosUsuario);
        } else {
            // Criar novo usuário
            resultado = await API.criarUsuario(dadosUsuario);
        }
        
        if (!resultado.sucesso) {
            throw new Error(resultado.erro);
        }
        
        // Fechar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalUsuario'));
        modal.hide();
        
        // Recarregar lista
        await carregarUsuarios();
        
        alert(usuarioEditando ? 'Usuário atualizado com sucesso!' : 'Usuário criado com sucesso!');
        
    } catch (error) {
        console.error('Erro ao salvar usuário:', error);
        alert('Erro ao salvar usuário: ' + error.message);
    }
}

/**
 * Excluir usuário
 */
async function excluirUsuario(id, nome) {
    if (!confirm(`Tem certeza que deseja excluir o usuário "${nome}"?\n\nEsta ação não pode ser desfeita.`)) {
        return;
    }
    
    try {
        const resultado = await API.excluirUsuario(id);
        
        if (!resultado.sucesso) {
            throw new Error(resultado.erro);
        }
        
        await carregarUsuarios();
        alert('Usuário excluído com sucesso!');
        
    } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        alert('Erro ao excluir usuário: ' + error.message);
    }
}

function novoLaboratorio() {
    alert('Funcionalidade em desenvolvimento');
}

function novoEquipamento() {
    alert('Funcionalidade em desenvolvimento');
}

function novoFormulario() {
    alert('Funcionalidade em desenvolvimento');
}
