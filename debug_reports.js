/**
 * Script de debug para testar o sistema de reports
 * Cole este código no console do navegador na dashboard administrativa
 */

// 1. Verificar usuário logado
console.log('=== DEBUG SISTEMA DE REPORTS ===');
console.log('1. Estado do usuário:');
console.log('   currentUser:', currentUser);
console.log('   localStorage adminUser:', localStorage.getItem('adminUser'));

// 2. Testar conexão com Supabase
console.log('2. Testando Supabase:');
console.log('   supabase:', typeof supabase);
console.log('   API:', typeof API);

// 3. Testar busca de reports
if (typeof API !== 'undefined') {
    API.buscarReports().then(resultado => {
        console.log('3. Teste buscar reports:', resultado);
    }).catch(error => {
        console.error('3. Erro ao buscar reports:', error);
    });
}

// 4. Testar busca de usuários
if (typeof API !== 'undefined') {
    API.buscarUsuarios().then(resultado => {
        console.log('4. Teste buscar usuários:', resultado);
    }).catch(error => {
        console.error('4. Erro ao buscar usuários:', error);
    });
}

// 5. Função para criar report de teste
window.criarReportTeste = async function() {
    try {
        const resultado = await API.criarReport({
            tipo_eventualidade: 'outros',
            protocolo_relacionado: 'DEBUG001',
            descricao: 'Report de teste criado via debug',
            autor_nome: 'Teste Debug',
            prioridade: 'normal'
        });
        console.log('5. Report teste criado:', resultado);
        return resultado;
    } catch (error) {
        console.error('5. Erro ao criar report teste:', error);
        return null;
    }
};

// 6. Função para testar ciência
window.testarCiencia = async function(reportId) {
    try {
        if (!currentUser) {
            const userData = localStorage.getItem('adminUser');
            if (userData) {
                currentUser = JSON.parse(userData);
            }
        }
        
        if (!currentUser || !currentUser.id) {
            console.error('6. Usuário não identificado para teste');
            return;
        }
        
        const resultado = await API.marcarReportCiente(reportId, currentUser.id, 'Teste de ciência via debug');
        console.log('6. Ciência teste:', resultado);
        return resultado;
    } catch (error) {
        console.error('6. Erro ao testar ciência:', error);
        return null;
    }
};

console.log('=== FUNÇÕES DE TESTE DISPONÍVEIS ===');
console.log('- criarReportTeste() - Cria um report de teste');
console.log('- testarCiencia(reportId) - Testa marcar ciência');
console.log('=====================================');
