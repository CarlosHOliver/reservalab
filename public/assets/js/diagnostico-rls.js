// Script de diagnóstico para problemas de RLS (Row Level Security)
// Execute no console do navegador após fazer login

async function diagnosticarProblemaRLS() {
    console.log('🔍 Iniciando diagnóstico de problemas RLS...');
    
    try {
        // Teste 1: Verificar conexão básica
        console.log('\n1️⃣ Testando conexão básica...');
        const { data: testConnection, error: errorConnection } = await supabase
            .from('blocos')
            .select('count(*)')
            .limit(1);
        
        if (errorConnection) {
            console.error('❌ Erro na conexão:', errorConnection);
            return;
        }
        console.log('✅ Conexão funcionando');
        
        // Teste 2: Tentar ler equipamentos
        console.log('\n2️⃣ Testando leitura de equipamentos...');
        const { data: equipamentos, error: errorRead } = await supabase
            .from('equipamentos')
            .select('*')
            .limit(5);
        
        if (errorRead) {
            console.error('❌ Erro ao ler equipamentos:', errorRead);
        } else {
            console.log('✅ Leitura funcionando, equipamentos encontrados:', equipamentos.length);
        }
        
        // Teste 3: Tentar inserir equipamento simples
        console.log('\n3️⃣ Testando inserção simples...');
        const equipamentoTeste = {
            nome: 'Teste Diagnóstico',
            patrimonio: `DIAG-${Date.now()}`,
            bloco_id: 1, // Assumindo que existe bloco com ID 1
            local: 'Teste',
            status: 'disponivel',
            ativo: true
        };
        
        console.log('📋 Dados para inserção:', equipamentoTeste);
        
        const { data: insertResult, error: errorInsert } = await supabase
            .from('equipamentos')
            .insert([equipamentoTeste])
            .select();
        
        if (errorInsert) {
            console.error('❌ Erro na inserção:', errorInsert);
            console.log('🔍 Código do erro:', errorInsert.code);
            console.log('🔍 Mensagem:', errorInsert.message);
            console.log('🔍 Detalhes:', errorInsert.details);
            
            // Análise específica do erro
            if (errorInsert.code === '42501') {
                console.log('🚨 PROBLEMA: Erro de permissão (42501)');
                console.log('💡 SOLUÇÃO: Execute o script fix_rls_equipamentos.sql no Supabase');
            } else if (errorInsert.message.includes('row-level security')) {
                console.log('🚨 PROBLEMA: Row Level Security bloqueando inserção');
                console.log('💡 SOLUÇÃO: Desabilite RLS ou crie políticas adequadas');
            }
        } else {
            console.log('✅ Inserção funcionando! Equipamento criado:', insertResult[0]);
            
            // Limpar o teste
            const { error: errorDelete } = await supabase
                .from('equipamentos')
                .delete()
                .eq('id', insertResult[0].id);
            
            if (errorDelete) {
                console.warn('⚠️ Não foi possível deletar o equipamento de teste');
            } else {
                console.log('🧹 Equipamento de teste removido');
            }
        }
        
        // Teste 4: Verificar estrutura da tabela
        console.log('\n4️⃣ Verificando informações da tabela...');
        const { data: tableInfo, error: errorTable } = await supabase
            .rpc('get_table_info', { table_name: 'equipamentos' })
            .catch(() => null);
        
        if (tableInfo) {
            console.log('📊 Informações da tabela:', tableInfo);
        } else {
            console.log('⚠️ Não foi possível obter informações da tabela');
        }
        
        console.log('\n🏁 Diagnóstico concluído!');
        
    } catch (error) {
        console.error('💥 Erro durante diagnóstico:', error);
    }
}

// Teste específico para RLS
async function testarRLS() {
    console.log('🔒 Testando políticas RLS...');
    
    // Query para verificar RLS
    const query = `
        SELECT 
            schemaname, 
            tablename, 
            rowsecurity as rls_enabled
        FROM pg_tables 
        WHERE tablename = 'equipamentos';
    `;
    
    try {
        const { data, error } = await supabase.rpc('exec_sql', { query });
        if (error) {
            console.error('❌ Erro ao verificar RLS:', error);
        } else {
            console.log('📋 Status RLS:', data);
        }
    } catch (error) {
        console.log('⚠️ Não foi possível verificar RLS diretamente');
    }
}

// Script de solução rápida
async function solucionarRapida() {
    console.log('🚀 Tentando solução rápida...');
    
    try {
        // Tentar inserção com dados mínimos
        const { data, error } = await supabase
            .from('equipamentos')
            .insert({
                nome: 'Equipamento Teste Rápido',
                patrimonio: `QUICK-${Date.now()}`,
                bloco_id: 1,
                local: 'Teste Rápido'
            })
            .select();
        
        if (error) {
            console.error('❌ Solução rápida falhou:', error);
            console.log('\n📋 INSTRUÇÕES PARA CORRIGIR:');
            console.log('1. Acesse o Supabase Dashboard');
            console.log('2. Vá em SQL Editor');
            console.log('3. Execute: ALTER TABLE equipamentos DISABLE ROW LEVEL SECURITY;');
            console.log('4. Ou execute o script completo: fix_rls_equipamentos.sql');
        } else {
            console.log('✅ Solução rápida funcionou! Equipamento criado:', data[0]);
        }
    } catch (error) {
        console.error('💥 Erro na solução rápida:', error);
    }
}

console.log('🧪 Scripts de diagnóstico carregados!');
console.log('📋 Comandos disponíveis:');
console.log('- diagnosticarProblemaRLS() - Diagnóstico completo');
console.log('- testarRLS() - Verificar status do RLS');  
console.log('- solucionarRapida() - Tentar solução rápida');
console.log('\n🚨 Se houver erro de RLS, execute fix_rls_equipamentos.sql no Supabase!');
