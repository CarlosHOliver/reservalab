# Gestão de Laboratórios - ReservaLAB

## Funcionalidade Implementada

A funcionalidade de gestão de laboratórios permite aos administradores do sistema:

### ✅ Funcionalidades Principais

1. **Listar Laboratórios**
   - Visualização em tabela com informações principais
   - Status ativo/inativo
   - Informações de capacidade e configurações
   - Bloco de localização

2. **Criar Novo Laboratório**
   - Formulário completo com validações
   - Campos obrigatórios: Nome e Bloco
   - Configurações avançadas:
     - Capacidade de pessoas
     - Uso compartilhado
     - Máximo de ocupantes simultâneos
     - Necessita acompanhamento
     - URL da foto
     - Status ativo/inativo

3. **Editar Laboratório**
   - Carregamento automático dos dados existentes
   - Atualização de qualquer campo
   - Validações mantidas

4. **Visualizar Detalhes**
   - Modal com informações completas
   - Exibição da foto (se disponível)
   - Datas de criação e atualização

5. **Excluir Laboratório**
   - Modal de confirmação
   - Exclusão permanente do banco de dados

### 🔧 Configurações Disponíveis

- **Uso Compartilhado**: Permite múltiplos usuários simultaneamente
- **Máximo de Ocupantes**: Definido quando compartilhado está ativo
- **Necessita Acompanhamento**: Para laboratórios que precisam de supervisão
- **Capacidade**: Número total de pessoas que o laboratório comporta
- **Status**: Ativo ou inativo no sistema

### 📋 Como Testar

1. **Acesso ao Sistema**
   - URL: `http://localhost:8080/public/admin/`
   - Login: `admin`
   - Senha: `admin123`

2. **Dados de Teste**
   - Execute o script: `database/dados_basicos_laboratorios.sql`
   - Execute o script: `database/usuario_teste_admin.sql`

3. **Navegação**
   - Após login, clique na aba "Laboratórios"
   - Use o botão "Novo Laboratório" para criar
   - Use os botões de ação (editar, visualizar, excluir) na tabela

### 🛠️ Estrutura Técnica

**Frontend:**
- Bootstrap 5.3.2 para interface
- JavaScript vanilla para funcionalidades
- Modais para formulários e confirmações
- Validações client-side

**Backend:**
- Supabase (PostgreSQL)
- Tabelas: `laboratorios`, `blocos`
- Relacionamentos com foreign keys

**Campos do Banco:**
```sql
laboratorios:
- id (SERIAL PRIMARY KEY)
- nome (VARCHAR 255) *obrigatório
- bloco_id (INTEGER) *obrigatório  
- descricao (TEXT)
- capacidade (INTEGER)
- permitir_uso_compartilhado (BOOLEAN)
- necessita_acompanhamento (BOOLEAN)
- quantidade_maxima_ocupantes_simultaneos (INTEGER)
- foto_url (TEXT)
- ativo (BOOLEAN)
- created_at, updated_at (TIMESTAMP)
```

### 🎯 Recursos Implementados

- ✅ CRUD completo (Create, Read, Update, Delete)
- ✅ Validações de formulário
- ✅ Interface responsiva
- ✅ Feedback visual (badges, ícones)
- ✅ Confirmação antes de exclusões
- ✅ Relacionamento com blocos
- ✅ Campos condicionais (máximo ocupantes)
- ✅ Tratamento de erros
- ✅ Loading states
- ✅ Formatação de dados

### 🔍 Logs e Debug

O sistema inclui logs detalhados no console do navegador:
- ✅ Conexão com Supabase
- 🔄 Operações de CRUD
- ❌ Tratamento de erros
- 📝 Estados de formulário

### 📱 Interface

A interface é totalmente responsiva e inclui:
- Cards informativos no dashboard
- Tabela responsiva com ações
- Modais para formulários
- Badges coloridos para status
- Ícones Bootstrap para melhor UX
- Validações visuais em tempo real

### 🚀 Próximos Passos

Esta implementação serve como base para:
- Gestão de Equipamentos (similar)
- Relatórios de uso
- Integração com reservas
- Histórico de alterações
- Upload de imagens
- Filtros avançados
