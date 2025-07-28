/**
 * Utilitário para gerar hashes de senhas bcrypt
 * Use este arquivo no console do navegador para gerar novos hashes
 * 
 * ATENÇÃO: Este utilitário é apenas para desenvolvimento/configuração inicial
 * Nunca exponha senhas ou hashes em produção!
 */

// Para gerar um hash de senha, execute no console:
// gerarHashSenha('sua_senha_aqui')

function gerarHashSenha(senha) {
    if (typeof bcrypt === 'undefined') {
        console.error('Biblioteca bcrypt não carregada. Inclua: https://cdn.jsdelivr.net/npm/bcryptjs@2.4.3/dist/bcrypt.min.js');
        return;
    }
    
    const hash = bcrypt.hashSync(senha, 10);
    console.log(`Hash gerado para a senha fornecida:`);
    console.log(`${hash}`);
    console.log(`\nPara inserir no banco de dados:`);
    console.log(`UPDATE usuarios SET senha_hash = '${hash}' WHERE login = 'login_do_usuario';`);
    
    return hash;
}

// Para verificar se uma senha corresponde ao hash:
function verificarSenha(senha, hash) {
    if (typeof bcrypt === 'undefined') {
        console.error('Biblioteca bcrypt não carregada.');
        return false;
    }
    
    const resultado = bcrypt.compareSync(senha, hash);
    console.log(`Senha ${resultado ? 'VÁLIDA' : 'INVÁLIDA'} para o hash fornecido`);
    return resultado;
}

console.log('=== Utilitário de Hash de Senhas ===');
console.log('Para gerar um hash, use: gerarHashSenha("sua_senha")');
console.log('IMPORTANTE: Nunca exponha senhas em código de produção!');
