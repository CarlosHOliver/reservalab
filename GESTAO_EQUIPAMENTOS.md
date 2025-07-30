# Gestão de Equipamentos - ReservaLAB

## Funcionalidade Implementada

A funcionalidade de gestão de equipamentos permite aos administradores do sistema:

### ✅ Funcionalidades Principais

1. **Listar Equipamentos**
   - Visualização em tabela com informações principais
   - Status disponível/em manutenção/inativo
   - Informações de localização e patrimônio
   - Configurações de uso compartilhado

2. **Criar Novo Equipamento**
   - Formulário completo com validações
   - Campos obrigatórios: Nome, Patrimônio, Bloco e Local
   - Configurações avançadas:
     - Status do equipamento
     - Uso compartilhado
     - Máximo de ocupantes simultâneos
     - Necessita acompanhamento
     - URL da foto
     - Ativo/inativo no sistema

3. **Editar Equipamento**
   - Carregamento automático dos dados existentes
   - Atualização de qualquer campo
   - Validações mantidas

4. **Visualizar Detalhes**
   - Modal com informações completas
   - Exibição da foto (se disponível)
   - Status detalhado e configurações

5. **Excluir Equipamento**
   - Modal de confirmação
   - Verificação de reservas associadas
   - Exclusão permanente do banco de dados

### 🔧 Status de Equipamentos

- **Disponível**: Equipamento pronto para uso
- **Em Manutenção**: Equipamento temporariamente indisponível
- **Inativo**: Equipamento permanentemente fora de uso

### 📋 Campos Disponíveis

- **Nome do Equipamento** (obrigatório)
- **Número do Patrimônio** (obrigatório, único)
- **Bloco** (obrigatório - seleção automática)
- **Local** (obrigatório - ex: Sala 101, Lab. Química)
- **Descrição** (opcional)
- **Status** (disponível/em manutenção/inativo)
- **URL da Foto** (opcional)
- **Uso Compartilhado** (checkbox)
- **Máximo de Ocupantes Simultâneos** (condicional)
- **Necessita Acompanhamento** (checkbox)
- **Ativo no Sistema** (checkbox)

### 🛠️ Estrutura Técnica

**Campos do Banco:**
```sql
equipamentos:
- id (SERIAL PRIMARY KEY)
- nome (VARCHAR 255) *obrigatório
- patrimonio (VARCHAR 100) *obrigatório, UNIQUE
- bloco_id (INTEGER) *obrigatório  
- local (VARCHAR 255) *obrigatório
- descricao (TEXT)
- status (VARCHAR 50) - disponivel, em_manutencao, inativo
- permitir_uso_compartilhado (BOOLEAN)
- necessita_acompanhamento (BOOLEAN)
- quantidade_maxima_ocupantes (INTEGER)
- foto_url (TEXT)
- ativo (BOOLEAN)
- created_at, updated_at (TIMESTAMP)
```

### 🧪 Como Testar

1. **Preparar Dados**
   - Execute: `database/dados_basicos_equipamentos.sql`
   
2. **Acesso**
   - Login no sistema administrativo
   - Navegue para a aba "Equipamentos"
   - Use "Novo Equipamento" para criar

3. **Testes Funcionais**
   - Criar equipamento com patrimônio único
   - Editar configurações existentes
   - Testar validação de patrimônio duplicado
   - Visualizar detalhes completos
   - Tentar excluir (verificar validação de reservas)

### 🎯 Recursos Implementados

- ✅ CRUD completo (Create, Read, Update, Delete)
- ✅ Validação de patrimônio único
- ✅ Status coloridos com ícones
- ✅ Interface responsiva
- ✅ Campos condicionais
- ✅ Verificação de integridade antes da exclusão
- ✅ Tratamento de erros específicos
- ✅ Loading states e feedback visual
- ✅ Relacionamento com blocos

### 🔍 Diferenças dos Laboratórios

**Campos Únicos dos Equipamentos:**
- Número do patrimônio (obrigatório e único)
- Status específicos (disponível/manutenção/inativo)
- Local mais específico (sala/laboratório)
- Foco em rastreabilidade patrimonial

**Validações Específicas:**
- Patrimônio não pode ser duplicado
- Status de manutenção para controle
- Local obrigatório para localização

### 📊 Exemplos de Dados

O script de dados inclui:
- Projetor Multimídia
- Microscópio Digital
- Notebook Dell
- Sistema de Som
- Câmera Fotográfica
- Balança de Precisão
- Impressora 3D

### 🚀 Integração com Sistema

- Relacionamento com tabela de blocos
- Preparado para integração com reservas
- Sistema de logs automático
- Interface consistente com laboratórios
- Reutilização de componentes visuais

### 🔒 Validações de Segurança

- Verificação de reservas antes da exclusão
- Validação de campos obrigatórios
- Sanitização de dados de entrada
- Tratamento de erros de duplicação
- Logs de auditoria automáticos

Esta implementação complementa perfeitamente a gestão de laboratórios, oferecendo controle completo sobre o patrimônio de equipamentos da instituição! 🎉
