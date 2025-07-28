# 🔒 GUIA DE SEGURANÇA - ReservaLAB

## ⚠️ AÇÕES OBRIGATÓRIAS ANTES DO USO EM PRODUÇÃO

### 1. **Configuração de Credenciais**
- [ ] Editar `/public/assets/js/config.js` com suas credenciais reais do Supabase
- [ ] Remover URLs e chaves de exemplo
- [ ] Configurar variáveis de ambiente para produção

### 2. **Alteração de Senhas Padrão**
- [ ] Acessar dashboard administrativo
- [ ] Alterar senha do usuário `admin`
- [ ] Alterar senha do usuário `gestor` 
- [ ] Alterar senha do usuário `carlos`
- [ ] Remover usuários desnecessários

### 3. **Configurações do Banco de Dados**
- [ ] Verificar se RLS (Row Level Security) está ativo
- [ ] Revisar políticas de acesso nas tabelas
- [ ] Configurar backups automáticos
- [ ] Definir políticas de retenção de dados

## 🛡️ BOAS PRÁTICAS DE SEGURANÇA

### Configuração Supabase
1. **Row Level Security (RLS)**
   - Ative RLS em todas as tabelas sensíveis
   - Configure políticas específicas por tipo de usuário
   - Teste as políticas em ambiente de desenvolvimento

2. **Autenticação**
   - Use senhas fortes (mínimo 12 caracteres)
   - Implemente 2FA quando possível
   - Configure expiração de sessões

3. **API Keys**
   - Use apenas chaves anônimas no frontend
   - Mantenha service keys no backend
   - Rotacione chaves periodicamente

### Desenvolvimento
1. **Controle de Versão**
   - Nunca commite credenciais no Git
   - Use `.env` para configurações locais
   - Configure `.gitignore` adequadamente

2. **Logs e Monitoramento**
   - Monitore tentativas de login
   - Log de ações administrativas
   - Alertas para atividades suspeitas

## 🚨 VULNERABILIDADES CORRIGIDAS

### ❌ Problemas Identificados e Resolvidos:
1. **Credenciais Expostas no Frontend**
   - Problema: URLs e chaves do Supabase visíveis no código
   - Solução: Substituídas por placeholders

2. **Senhas em Texto Puro**
   - Problema: Senhas padrão visíveis em comentários
   - Solução: Removidas e documentadas separadamente

3. **Hashes Expostos**
   - Problema: Hashes bcrypt visíveis em utility files
   - Solução: Removidos e comentados adequadamente

## 📋 CHECKLIST DE SEGURANÇA

### Antes da Instalação
- [ ] Revisar todas as configurações
- [ ] Preparar credenciais seguras
- [ ] Configurar ambiente de produção

### Durante a Instalação  
- [ ] Configurar Supabase corretamente
- [ ] Importar schema do banco
- [ ] Configurar RLS policies
- [ ] Testar autenticação

### Após a Instalação
- [ ] Alterar todas as senhas padrão
- [ ] Testar funcionalidades críticas
- [ ] Configurar backups
- [ ] Documentar credenciais de forma segura

### Manutenção Contínua
- [ ] Monitorar logs de acesso
- [ ] Atualizar dependências
- [ ] Revisar políticas de segurança
- [ ] Realizar backups regulares

## 🆘 EM CASO DE COMPROMETIMENTO

### Ações Imediatas
1. **Revogar Acessos**
   - Rotacionar chaves API
   - Desativar usuários comprometidos
   - Alterar senhas de admin

2. **Investigar**
   - Verificar logs de acesso
   - Identificar ações suspeitas
   - Documentar incidente

3. **Recuperar**
   - Restaurar backup confiável
   - Reconfigurar segurança
   - Notificar usuários se necessário

## 📞 CONTATO DE SEGURANÇA

Para reportar vulnerabilidades ou questões de segurança:
- **Desenvolvedor**: Carlos Henrique C. de Oliveira
- **Instituição**: FAEN/UFGD
- **E-mail**: [contato institucional]

---
**Data da última atualização**: Janeiro 2025
**Versão do documento**: 1.0
