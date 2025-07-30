// Script de teste para a funcionalidade de laboratórios
// Execute no console do navegador após fazer login no sistema

// Teste 1: Verificar se Supabase está funcionando
console.log('🧪 Testando conexão com Supabase...');
supabase.from('blocos').select('*').then(result => {
    if (result.error) {
        console.error('❌ Erro na conexão:', result.error);
    } else {
        console.log('✅ Blocos encontrados:', result.data);
    }
});

// Teste 2: Criar um bloco de teste se não existir
async function criarBlocoTeste() {
    console.log('🏗️ Criando bloco de teste...');
    const { data, error } = await supabase
        .from('blocos')
        .upsert({
            nome: 'Bloco Teste - Desenvolvimento'
        }, { onConflict: 'nome' });
    
    if (error) {
        console.error('❌ Erro ao criar bloco:', error);
    } else {
        console.log('✅ Bloco de teste criado/atualizado');
    }
}

// Teste 3: Criar laboratório de teste
async function criarLaboratorioTeste() {
    console.log('🧪 Criando laboratório de teste...');
    
    // Primeiro buscar um bloco
    const { data: blocos } = await supabase.from('blocos').select('*').limit(1);
    if (!blocos || blocos.length === 0) {
        console.log('⚠️ Nenhum bloco encontrado, criando bloco de teste...');
        await criarBlocoTeste();
        return criarLaboratorioTeste();
    }
    
    const { data, error } = await supabase
        .from('laboratorios')
        .insert({
            nome: 'Laboratório de Teste',
            bloco_id: blocos[0].id,
            descricao: 'Laboratório criado para testes do sistema',
            capacidade: 15,
            permitir_uso_compartilhado: true,
            quantidade_maxima_ocupantes_simultaneos: 2,
            necessita_acompanhamento: false,
            ativo: true
        });
    
    if (error) {
        console.error('❌ Erro ao criar laboratório:', error);
    } else {
        console.log('✅ Laboratório de teste criado');
        // Recarregar a lista se estivermos na página de laboratórios
        if (typeof loadLaboratorios === 'function') {
            loadLaboratorios();
        }
    }
}

// Teste 4: Listar laboratórios
async function listarLaboratorios() {
    console.log('📋 Listando laboratórios...');
    const { data, error } = await supabase
        .from('laboratorios')
        .select(`
            *,
            blocos (nome)
        `)
        .order('nome');
    
    if (error) {
        console.error('❌ Erro ao listar:', error);
    } else {
        console.table(data);
        console.log(`✅ ${data.length} laboratórios encontrados`);
    }
}

// Executar testes
console.log('🚀 Iniciando testes da funcionalidade de laboratórios...');
console.log('Execute os comandos:');
console.log('- criarBlocoTeste()');
console.log('- criarLaboratorioTeste()'); 
console.log('- listarLaboratorios()');
