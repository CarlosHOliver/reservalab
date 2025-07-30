# Sistema de Reports/Ocorrências - ReservaLAB

## Visão Geral

Implementei um sistema completo de reports/ocorrências que permite à Divisão de Proteção Patrimonial reportar eventualidades e aos gestores administrativos receber, visualizar e dar ciência dessas ocorrências.

## 🏗️ Estrutura do Sistema

### 1. Banco de Dados
- **Tabela**: `reports_ocorrencias`
- **Campos principais**:
  - `id`: Identificador único do report
  - `tipo_eventualidade`: Tipo da ocorrência
  - `protocolo_relacionado`: Protocolo de reserva relacionada (opcional)
  - `descricao`: Descrição detalhada da eventualidade
  - `autor_nome`: Nome do autor (padrão: "Divisão de Proteção Patrimonial")
  - `ciente`: Se algum gestor já deu ciência
  - `ciente_por`: ID do usuário que deu ciência
  - `ciente_em`: Data/hora da ciência
  - `observacoes_gestao`: Observações dos gestores
  - `status`: Status do report (aberto, em_analise, resolvido, arquivado)
  - `prioridade`: Prioridade (baixa, normal, alta, urgente)

### 2. Autenticação
- **Usuário**: `portaria`
- **Senha**: `patrimonio123`
- **Perfil**: Gestor
- Validação de credenciais usando bcrypt

## 📱 Funcionalidades Implementadas

### Dashboard Patrimonial (Envio de Reports)

1. **Botão "Reportar"** no header
2. **Modal de Report** com campos:
   - Tipo de eventualidade (dropdown)
   - Protocolo da reserva (opcional)
   - Descrição detalhada
   - Senha de autorização

3. **Tipos de Eventualidades**:
   - Solicitante não compareceu
   - Problema de acesso
   - Equipamento danificado
   - Uso inadequado do espaço/equipamento
   - Outros

4. **Validações**:
   - Campos obrigatórios
   - Verificação de senha do usuário portaria
   - Feedback de sucesso/erro

### Dashboard Administrativa (Gestão de Reports)

1. **Nova Seção "Reports"** na navegação

2. **Estatísticas**:
   - Reports pendentes (sem ciência)
   - Reports resolvidos
   - Total de reports
   - Reports dos últimos 7 dias

3. **Lista de Reports**:
   - Tabela completa com todos os reports
   - Destaque visual para reports sem ciência
   - Informações resumidas: ID, data, tipo, protocolo, status, ciência

4. **Filtros**:
   - Por status (aberto, em análise, resolvido, arquivado)
   - Por tipo de eventualidade
   - Por ciência (com/sem ciência)

5. **Ações disponíveis**:
   - Visualizar detalhes completos
   - Marcar ciência (botão rápido)
   - Alterar status
   - Adicionar observações

### Modais de Gestão

1. **Modal de Detalhes**:
   - Informações completas do report
   - Status e ciência atuais
   - Histórico de observações

2. **Modal de Ciência**:
   - Confirmação para marcar ciência
   - Campo para observações opcionais
   - Registro automático do usuário e data/hora

3. **Modal de Status**:
   - Alteração do status do report
   - Adição de observações da gestão

## 🔧 API Implementada

### Novas Funções na API:

1. **`API.verificarCredenciais(login, senha)`**
   - Verifica credenciais de usuário
   - Usa bcrypt para validação segura

2. **`API.criarReport(dadosReport)`**
   - Cria novo report/ocorrência
   - Retorna dados do report criado

3. **`API.buscarReports(filtros)`**
   - Lista reports com filtros opcionais
   - Inclui dados do usuário que deu ciência

4. **`API.marcarReportCiente(reportId, usuarioId, observacoes)`**
   - Marca report como ciente
   - Registra usuário e timestamp

5. **`API.atualizarStatusReport(reportId, novoStatus, observacoes)`**
   - Atualiza status do report
   - Adiciona observações da gestão

6. **`API.buscarEstatisticasReports()`**
   - Retorna estatísticas consolidadas
   - Usado no dashboard

## 📊 Dashboard Principal

- **Novo card**: "Reports Pendentes" no dashboard principal
- Atualização automática das estatísticas
- Layout responsivo com 6 cards

## 🔒 Segurança

1. **Autenticação**: Senha do usuário portaria obrigatória
2. **Validação**: Verificação de credenciais no backend
3. **Auditoria**: Registro de quem deu ciência e quando
4. **Controle de acesso**: Apenas gestores podem acessar a dashboard administrativa

## 📝 Arquivos Modificados/Criados

### Novos Arquivos:
- `/database/schema_reports.sql` - Schema da tabela de reports
- `/database/criar_usuario_portaria.sql` - Script para criar usuário portaria

### Arquivos Modificados:
- `/public/admin/index.html` - Nova seção de reports
- `/public/assets/js/api.js` - Novas funções da API
- `/public/assets/js/admin.js` - Gestão de reports
- `/public/assets/js/patrimonial.js` - Envio de reports

## 🚀 Como Usar

### Para a Portaria (Dashboard Patrimonial):
1. Acessar `patrimonial.html`
2. Clicar em "Reportar" no header
3. Preencher o formulário de eventualidade
4. Inserir a senha: `patrimonio123`
5. Enviar o report

### Para os Gestores (Dashboard Administrativa):
1. Fazer login na dashboard administrativa
2. Navegar para a seção "Reports"
3. Visualizar lista de reports
4. Clicar em "👁️" para ver detalhes
5. Usar "✅" para marcar ciência rapidamente
6. Gerenciar status e adicionar observações

## 📈 Benefícios Implementados

1. **Comunicação Eficiente**: Canal direto entre portaria e gestão
2. **Rastreabilidade**: Histórico completo de ocorrências
3. **Responsabilização**: Registro de quem deu ciência
4. **Organização**: Filtros e categorização de reports
5. **Estatísticas**: Visão geral da situação dos reports
6. **Usabilidade**: Interface intuitiva para ambos os perfis

O sistema está completo e funcional, proporcionando uma gestão profissional de ocorrências patrimoniais!
