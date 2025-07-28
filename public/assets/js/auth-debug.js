/**
 * Utilitário de Debug para Autenticação
 * Execute este código no console do navegador para diagnosticar problemas de login
 */

console.log('🔧 === DEBUG DE AUTENTICAÇÃO ===');

// Função para testar diferentes senhas contra o hash conhecido
function debugBcrypt() {
    console.log('🔍 Verificando biblioteca bcrypt...');
    
    // Verificar se bcrypt está disponível
    const bcryptAvailable = typeof bcrypt !== 'undefined' || 
                           typeof window.bcrypt !== 'undefined' || 
                           (typeof dcodeIO !== 'undefined' && dcodeIO.bcrypt);
    
    if (!bcryptAvailable) {
        console.error('❌ BCrypt não está disponível');
        return;
    }
    
    // Obter referência do bcrypt
    let bcryptLib;
    if (typeof bcrypt !== 'undefined') {
        bcryptLib = bcrypt;
        console.log('✅ Usando bcrypt global');
    } else if (typeof window.bcrypt !== 'undefined') {
        bcryptLib = window.bcrypt;
        console.log('✅ Usando window.bcrypt');
    } else if (typeof dcodeIO !== 'undefined' && dcodeIO.bcrypt) {
        bcryptLib = dcodeIO.bcrypt;
        console.log('✅ Usando dcodeIO.bcrypt');
    }
    
    // Hash conhecido do banco
    const hashDoBanco = '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';
    
    // Senhas para testar
    const senhasParaTestar = [
        'secret',
        'admin', 
        'password',
        'admin123',
        '123456',
        'test',
        'demo',
        'password123'
    ];
    
    // Testar também o hash atual do banco de dados
    console.log('🔍 Testando hash atual do banco...');
    const hashAtual = '$2b$10$eImiTXuWVxfM37uY4JANjOEhEhg7EfaQ2o9qHr6BaJDrfGUUJ.w7u';
    console.log('Hash atual:', hashAtual);
    
    console.log('🔐 Testando senhas contra o hash:', hashDoBanco);
    
    senhasParaTestar.forEach(senha => {
        try {
            const resultado = bcryptLib.compareSync(senha, hashDoBanco);
            console.log(`${resultado ? '✅' : '❌'} Senha "${senha}": ${resultado ? 'VÁLIDA!' : 'inválida'}`);
            
            if (resultado) {
                console.log(`🎉 SENHA ENCONTRADA: "${senha}"`);
                console.log(`📝 Use esta credencial:`);
                console.log(`   Login: admin`);
                console.log(`   Senha: ${senha}`);
            }
        } catch (error) {
            console.error(`❌ Erro ao testar senha "${senha}":`, error);
        }
    });
    
    // Testar também contra o hash atual
    console.log('\n🔍 Testando senhas contra o hash ATUAL do banco...');
    senhasParaTestar.forEach(senha => {
        try {
            const resultado = bcryptLib.compareSync(senha, hashAtual);
            console.log(`${resultado ? '✅' : '❌'} Senha "${senha}" (hash atual): ${resultado ? 'VÁLIDA!' : 'inválida'}`);
            
            if (resultado) {
                console.log(`🎉 SENHA ENCONTRADA PARA HASH ATUAL: "${senha}"`);
            }
        } catch (error) {
            console.error(`❌ Erro ao testar senha "${senha}" no hash atual:`, error);
        }
    });
}

// Função para gerar novo hash
function gerarNovoHash(senha) {
    if (!senha) {
        console.log('💡 Uso: gerarNovoHash("sua_nova_senha")');
        return;
    }
    
    let bcryptLib;
    if (typeof bcrypt !== 'undefined') {
        bcryptLib = bcrypt;
    } else if (typeof window.bcrypt !== 'undefined') {
        bcryptLib = window.bcrypt;
    } else if (typeof dcodeIO !== 'undefined' && dcodeIO.bcrypt) {
        bcryptLib = dcodeIO.bcrypt;
    } else {
        console.error('❌ BCrypt não disponível');
        return;
    }
    
    try {
        const novoHash = bcryptLib.hashSync(senha, 10);
        console.log(`🔐 Novo hash gerado para senha "${senha}":`);
        console.log(novoHash);
        console.log(`\n📝 SQL para atualizar no banco:`);
        console.log(`UPDATE usuarios SET senha_hash = '${novoHash}' WHERE login = 'admin';`);
        
        // Testar o hash gerado
        const teste = bcryptLib.compareSync(senha, novoHash);
        console.log(`✅ Teste do hash: ${teste ? 'OK' : 'ERRO'}`);
        
        return novoHash;
    } catch (error) {
        console.error('❌ Erro ao gerar hash:', error);
    }
}

// Função para testar hash específico
function testarHashEspecifico(hash, senhas = ['admin123', 'password', 'admin', 'secret']) {
    console.log(`🔍 Testando hash específico: ${hash}`);
    
    let bcryptLib;
    if (typeof bcrypt !== 'undefined') {
        bcryptLib = bcrypt;
    } else if (typeof window.bcrypt !== 'undefined') {
        bcryptLib = window.bcrypt;
    } else if (typeof dcodeIO !== 'undefined' && dcodeIO.bcrypt) {
        bcryptLib = dcodeIO.bcrypt;
    } else {
        console.error('❌ BCrypt não disponível');
        return;
    }
    
    senhas.forEach(senha => {
        try {
            const resultado = bcryptLib.compareSync(senha, hash);
            console.log(`${resultado ? '✅' : '❌'} "${senha}": ${resultado ? 'VÁLIDA!' : 'inválida'}`);
            
            if (resultado) {
                console.log(`🎉 SENHA CORRETA: "${senha}"`);
                return senha;
            }
        } catch (error) {
            console.error(`❌ Erro testando "${senha}":`, error);
        }
    });
    
    return null;
}

// Executar debug automaticamente
if (typeof window !== 'undefined') {
    // Aguardar um pouco para garantir que bcrypt foi carregado
    setTimeout(() => {
        debugBcrypt();
        
        console.log('\n🔧 Funções disponíveis:');
        console.log('- debugBcrypt() - Testa senhas comuns');
        console.log('- gerarNovoHash("senha") - Gera novo hash');
        console.log('- testarHashEspecifico("hash", ["senha1", "senha2"]) - Testa hash específico');
        
        // Tornar funções globais para uso no console
        window.debugBcrypt = debugBcrypt;
        window.gerarNovoHash = gerarNovoHash;
        window.testarHashEspecifico = testarHashEspecifico;
    }, 2000);
}
