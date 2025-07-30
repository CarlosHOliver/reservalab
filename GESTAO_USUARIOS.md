# Gestão de Usuários - ReservaLAB

## Funcionalidades Implementadas

### 1. Visualização de Usuários
- ✅ Lista completa de usuários com informações:
  - Nome completo
  - Login
  - E-mail
  - Perfil (Gestor/Administrador)
  - Bloco associado
  - Status (Ativo/Inativo)
- ✅ Carregamento automático ao acessar a seção "Usuários"
- ✅ Interface responsiva com Bootstrap

### 2. Criação de Novos Usuários
- ✅ Modal para cadastro de novos usuários
- ✅ Campos obrigatórios:
  - Nome completo
  - Login (único no sistema)
  - E-mail (único no sistema)
  - Senha (mínimo 6 caracteres)
  - Perfil (Gestor/Administrador)
- ✅ Campos opcionais:
  - Bloco associado
  - Status ativo/inativo
- ✅ Validações implementadas:
  - Verificação de login único
  - Verificação de e-mail único
  - Confirmação de senha
  - Campos obrigatórios
- ✅ Criptografia de senha com bcrypt

### 3. Edição de Usuários
- ✅ Modal para edição de usuários existentes
- ✅ Carregamento automático dos dados atuais
- ✅ Alteração de senha opcional (deixar em branco mantém a atual)
- ✅ Mesmas validações do cadastro
- ✅ Prevenção de conflitos de login/e-mail

### 4. Exclusão de Usuários
- ✅ Soft delete (marca como inativo)
- ✅ Confirmação antes da exclusão
- ✅ Preserva histórico no banco de dados

### 5. Integração com Dashboard
- ✅ Contador de usuários ativos no dashboard principal
- ✅ Layout responsivo com 5 cards no dashboard
- ✅ Atualização automática das estatísticas

### 6. API Implementada
- ✅ `API.buscarUsuarios()` - Lista todos os usuários
- ✅ `API.criarUsuario(dados)` - Cria novo usuário
- ✅ `API.atualizarUsuario(id, dados)` - Atualiza usuário
- ✅ `API.excluirUsuario(id)` - Soft delete de usuário
- ✅ `API.verificarLoginExistente(login, idExcluir)` - Verifica unicidade do login
- ✅ `API.verificarEmailExistente(email, idExcluir)` - Verifica unicidade do e-mail

## Arquivos Modificados

### 1. `/public/admin/index.html`
- Adicionado card para contador de usuários no dashboard
- Adicionado CSS customizado para layout de 5 colunas

### 2. `/public/assets/js/api.js`
- Implementadas 6 novas funções para gestão de usuários
- Integração completa com Supabase

### 3. `/public/assets/js/admin.js`
- Implementadas funções de gestão de usuários:
  - `carregarUsuarios()`
  - `novoUsuario()`
  - `editarUsuario(id)`
  - `salvarUsuario()`
  - `excluirUsuario(id, nome)`
- Atualizada contagem de usuários no dashboard

## Segurança Implementada

1. **Criptografia de Senhas**: Utiliza bcrypt com salt 10
2. **Validação de Dados**: Validação tanto no frontend quanto esperada no backend
3. **Soft Delete**: Usuários excluídos são marcados como inativos, preservando histórico
4. **Unicidade**: Verificação de login e e-mail únicos

## Como Usar

1. **Acessar Gestão de Usuários**:
   - No dashboard administrativo, clique em "Usuários"

2. **Criar Novo Usuário**:
   - Clique em "Novo Usuário"
   - Preencha os campos obrigatórios
   - Defina uma senha segura
   - Escolha o perfil adequado
   - Clique em "Salvar"

3. **Editar Usuário**:
   - Na lista de usuários, clique no ícone de lápis
   - Modifique os campos desejados
   - Para alterar senha, preencha os campos de nova senha
   - Clique em "Salvar Alterações"

4. **Excluir Usuário**:
   - Na lista de usuários, clique no ícone de lixeira
   - Confirme a exclusão
   - O usuário será marcado como inativo

## Próximos Passos Sugeridos

1. **Filtros e Pesquisa**: Implementar filtros por perfil, bloco e status
2. **Paginação**: Para grandes quantidades de usuários
3. **Auditoria**: Log de ações administrativas
4. **Perfis Personalizados**: Criação de perfis com permissões específicas
5. **Importação em Massa**: Upload de CSV para cadastro múltiplo
