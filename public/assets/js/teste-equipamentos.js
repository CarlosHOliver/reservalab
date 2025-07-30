// Script de teste para a funcionalidade de equipamentos
// Execute no console do navegador após fazer login no sistema

// Teste 1: Verificar conexão e listar equipamentos
async function testarListagemEquipamentos() {
    console.log('📋 Testando listagem de equipamentos...');
    const { data, error } = await supabase
        .from('equipamentos')
        .select(`
            *,
            blocos (nome)
        `)
        .order('nome');
    
    if (error) {
        console.error('❌ Erro ao listar:', error);
    } else {
        console.table(data);
        console.log(`✅ ${data.length} equipamentos encontrados`);
    }
    return data;
}

// Teste 2: Criar equipamento de teste
async function criarEquipamentoTeste() {
    console.log('🛠️ Criando equipamento de teste...');
    
    // Primeiro buscar um bloco
    const { data: blocos } = await supabase.from('blocos').select('*').limit(1);
    if (!blocos || blocos.length === 0) {
        console.log('⚠️ Nenhum bloco encontrado');
        return;
    }
    
    const equipamentoTeste = {
        nome: 'Equipamento de Teste',
        patrimonio: `TEST-${Date.now()}`, // Garante unicidade
        bloco_id: blocos[0].id,
        local: 'Sala de Testes',
        descricao: 'Equipamento criado automaticamente para testes do sistema',
        status: 'disponivel',
        permitir_uso_compartilhado: true,
        quantidade_maxima_ocupantes: 2,
        necessita_acompanhamento: false,
        ativo: true
    };
    
    const { data, error } = await supabase
        .from('equipamentos')
        .insert(equipamentoTeste)
        .select();
    
    if (error) {
        console.error('❌ Erro ao criar equipamento:', error);
    } else {
        console.log('✅ Equipamento de teste criado:', data[0]);
        // Recarregar a lista se estivermos na página de equipamentos
        if (typeof loadEquipamentos === 'function') {
            loadEquipamentos();
        }
    }
    return data;
}

// Teste 3: Testar validação de patrimônio duplicado
async function testarPatrimonioDuplicado() {
    console.log('🔍 Testando validação de patrimônio duplicado...');
    
    const { data, error } = await supabase
        .from('equipamentos')
        .insert({
            nome: 'Teste Duplicado',
            patrimonio: 'PROJ-001', // Patrimônio que já existe
            bloco_id: 1,
            local: 'Teste',
            status: 'disponivel',
            ativo: true
        });
    
    if (error) {
        console.log('✅ Validação funcionando - patrimônio duplicado rejeitado:', error.message);
    } else {
        console.warn('⚠️ Validação falhou - patrimônio duplicado foi aceito');
    }
}

// Teste 4: Verificar diferentes status
async function verificarStatusEquipamentos() {
    console.log('📊 Verificando equipamentos por status...');
    
    const status = ['disponivel', 'em_manutencao', 'inativo'];
    
    for (const stat of status) {
        const { data, error } = await supabase
            .from('equipamentos')
            .select('id, nome, patrimonio, status')
            .eq('status', stat);
        
        if (error) {
            console.error(`❌ Erro ao buscar status ${stat}:`, error);
        } else {
            console.log(`📋 Status "${stat}": ${data.length} equipamentos`);
            if (data.length > 0) {
                console.table(data);
            }
        }
    }
}

// Teste 5: Verificar equipamentos com uso compartilhado
async function verificarEquipamentosCompartilhados() {
    console.log('👥 Verificando equipamentos com uso compartilhado...');
    
    const { data, error } = await supabase
        .from('equipamentos')
        .select('nome, patrimonio, quantidade_maxima_ocupantes')
        .eq('permitir_uso_compartilhado', true);
    
    if (error) {
        console.error('❌ Erro:', error);
    } else {
        console.log(`✅ ${data.length} equipamentos permitem uso compartilhado`);
        console.table(data);
    }
}

// Teste 6: Simular busca por bloco
async function buscarEquipamentosPorBloco(nomeBloco) {
    console.log(`🏢 Buscando equipamentos no bloco: ${nomeBloco}`);
    
    const { data, error } = await supabase
        .from('equipamentos')
        .select(`
            nome,
            patrimonio,
            local,
            status,
            blocos (nome)
        `)
        .eq('blocos.nome', nomeBloco);
    
    if (error) {
        console.error('❌ Erro:', error);
    } else {
        console.log(`✅ ${data.length} equipamentos encontrados`);
        console.table(data);
    }
}

// Executar todos os testes
async function executarTodosTestesEquipamentos() {
    console.log('🚀 Iniciando bateria completa de testes de equipamentos...');
    
    try {
        await testarListagemEquipamentos();
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        await criarEquipamentoTeste();
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        await testarPatrimonioDuplicado();
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        await verificarStatusEquipamentos();
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        await verificarEquipamentosCompartilhados();
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        await buscarEquipamentosPorBloco('Bloco C - Laboratórios');
        
        console.log('🎉 Todos os testes de equipamentos concluídos!');
    } catch (error) {
        console.error('💥 Erro durante os testes:', error);
    }
}

// Instruções
console.log('🧪 Scripts de teste para equipamentos carregados!');
console.log('📋 Comandos disponíveis:');
console.log('- testarListagemEquipamentos()');
console.log('- criarEquipamentoTeste()');
console.log('- testarPatrimonioDuplicado()');
console.log('- verificarStatusEquipamentos()');
console.log('- verificarEquipamentosCompartilhados()');
console.log('- buscarEquipamentosPorBloco("nome_do_bloco")');
console.log('- executarTodosTestesEquipamentos()');
