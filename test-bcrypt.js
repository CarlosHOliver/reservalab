const bcrypt = require('bcryptjs');

const hashAtual = '$2b$10$eImiTXuWVxfM37uY4JANjOEhEhg7EfaQ2o9qHr6BaJDrfGUUJ.w7u';

// Lista expandida de senhas para testar
const senhas = [
    'admin123', 'password', 'admin', 'secret', '123456',
    'test', 'demo', 'senha', 'senha123', 'password123',
    'secret123', 'admin321', 'qwerty', '12345', 'abc123',
    'test123', 'demo123', 'user', 'user123', 'default',
    'changeme', 'temp123', 'temporary', 'inicial', 'setup',
    'config', 'system', 'root', 'toor', 'guest'
];

console.log('🔍 Testando hash atual com lista expandida:');
console.log('Hash:', hashAtual);

let senhaEncontrada = null;

senhas.forEach(senha => {
  const resultado = bcrypt.compareSync(senha, hashAtual);
  console.log(`${resultado ? '✅' : '❌'} Senha "${senha}": ${resultado ? 'VÁLIDA!' : 'inválida'}`);
  
  if (resultado) {
    senhaEncontrada = senha;
  }
});

if (senhaEncontrada) {
    console.log(`\n🎉 SENHA ENCONTRADA: "${senhaEncontrada}"`);
} else {
    console.log('\n❌ Nenhuma senha da lista funcionou com este hash');
}

console.log('\n🔧 Gerando novo hash para admin123:');
const novoHash = bcrypt.hashSync('admin123', 10);
const teste = bcrypt.compareSync('admin123', novoHash);
console.log('Novo hash:', novoHash);
console.log('Teste:', teste ? 'OK' : 'ERRO');

console.log('\n📝 SQL para atualizar:');
console.log(`UPDATE usuarios SET senha_hash = '${novoHash}' WHERE login = 'admin';`);
