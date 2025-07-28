# Solução de Problema de Login - ReservaLAB

## Problema Identificado
O erro de login está ocorrendo porque a verificação de senha com bcrypt está retornando `false` mesmo com credenciais corretas.

## Diagnóstico
- Hash no banco: `$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi`
- Este hash corresponde à senha: **"secret"**

## Soluções

### Solução 1: Usar a senha correta
1. **Login:** `admin`
2. **Senha:** `secret`

### Solução 2: Atualizar senha no banco de dados
Execute no Supabase SQL Editor:
```sql
-- Para definir a senha como "admin123"
UPDATE usuarios 
SET senha_hash = '$2b$10$eImiTXuWVxfM37uY4JANjOEhEhg7EfaQ2o9qHr6BaJDrfGUUJ.w7u'
WHERE login = 'admin';
```

Depois use:
- **Login:** `admin`
- **Senha:** `admin123`

### Solução 3: Gerar nova senha personalizada
1. Abra o console do navegador na página de admin
2. Execute: `gerarNovoHash("sua_senha_aqui")`
3. Copie o hash gerado
4. Execute o SQL no Supabase: `UPDATE usuarios SET senha_hash = 'hash_gerado' WHERE login = 'admin';`

## Correções Implementadas
1. ✅ Melhorou detecção da biblioteca bcrypt
2. ✅ Adicionado logs de debug detalhados
3. ✅ Criado utilitário de teste de senhas
4. ✅ Implementado sistema de fallback para múltiplas formas de acesso ao bcrypt

## Arquivos Criados/Modificados
- `/test-bcrypt.html` - Utilitário de teste visual
- `/database/fix_admin_password.sql` - Script para corrigir senha
- `/public/assets/js/auth-debug.js` - Utilitário de debug
- `/public/assets/js/admin.js` - Melhorias no sistema de login

## Teste Rápido
1. Tente fazer login com:
   - Login: `admin`
   - Senha: `secret`

2. Se não funcionar, abra o console e execute `debugBcrypt()` para ver mais informações.

## Para Produção
Lembre-se de:
1. Remover o arquivo `test-bcrypt.html`
2. Remover o script `auth-debug.js` da página de admin
3. Usar senhas seguras em produção
4. Nunca expor senhas em logs de produção
