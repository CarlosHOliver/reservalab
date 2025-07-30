# 🔐 Controle de Acesso - Gestão de Usuários

## 📋 Resumo das Alterações

Foi implementado um sistema de controle de acesso que **impede usuários com perfil "gestor" de acessar o gerenciamento de usuários**, mantendo essa funcionalidade restrita apenas aos **administradores**.

---

## 🎯 Objetivo

Garantir que apenas administradores tenham acesso ao gerenciamento de usuários, seguindo princípios de segurança e separação de responsabilidades.

---

## 🔧 Implementações Realizadas

### 1. **Função de Verificação de Permissões**
```javascript
function verificarPermissao(funcionalidade)
```

**Regras implementadas:**
- **Admin**: Acesso total a todas as funcionalidades
- **Gestor**: Acesso a tudo **EXCETO** gerenciamento de usuários
- **Portaria**: Acesso limitado (dashboard, reservas, reports)

### 2. **Controle Visual de Menus**
```javascript
function controlarVisibilidadeMenus()
```

- **Oculta o menu "Usuários"** para perfis que não têm permissão
- Executada automaticamente após login (`showDashboard()`)
- Feedback visual claro do que cada perfil pode acessar

### 3. **Validação de Acesso às Seções**
```javascript
function showSection(sectionName)
```

- **Validação antes de mostrar qualquer seção**
- **Mensagem de erro informativa** em caso de acesso negado
- **Redirecionamento automático** para dashboard em casos de tentativa de acesso não autorizada

### 4. **Proteção da Função de Carregamento**
```javascript
function carregarUsuarios()
```

- **Verificação adicional de segurança** na função que carrega dados de usuários
- **Mensagem de erro na tabela** caso alguém tente burlar o sistema
- **Log de tentativas não autorizadas** para auditoria

---

## 🛡️ Níveis de Segurança

### **Nível 1: Visual**
- Menu de usuários fica **oculto** para gestores

### **Nível 2: Funcional**  
- **Bloqueio ativo** ao tentar acessar seção de usuários
- **Alerta informativo** explicando a restrição

### **Nível 3: Dados**
- **Proteção na função de carregamento** de dados
- **Impossível carregar dados** mesmo com acesso direto à função

---

## 📊 Perfis e Permissões

| Funcionalidade | Admin | Gestor | Portaria |
|----------------|-------|--------|----------|
| Dashboard | ✅ | ✅ | ✅ |
| Reservas | ✅ | ✅ | ✅ |
| Laboratórios | ✅ | ✅ | ❌ |
| Equipamentos | ✅ | ✅ | ❌ |
| **Usuários** | ✅ | ❌ | ❌ |
| Reports | ✅ | ✅ | ✅ |
| Formulários | ✅ | ✅ | ❌ |
| Configurações | ✅ | ✅ | ❌ |

---

## 🔍 Como Testar

### **1. Login como Gestor**
- Menu "Usuários" deve estar **oculto**
- Tentativa de acesso direto deve ser **bloqueada**

### **2. Login como Admin**  
- Menu "Usuários" deve estar **visível**
- Acesso normal à gestão de usuários

### **3. Tentativa de Burla**
- Qualquer tentativa de acessar função `carregarUsuarios()` diretamente
- Deve resultar em **bloqueio** e **mensagem de erro**

---

## 📝 Logs e Auditoria

O sistema registra:
- ✅ **Acessos permitidos** com perfil do usuário
- 🚫 **Tentativas de acesso negado** com perfil e seção
- 🔍 **Verificações de permissão** para auditoria

**Exemplo de logs:**
```
🔐 Verificando permissão: usuarios para perfil: gestor
🚫 Acesso negado à seção: usuarios para perfil: gestor  
✅ Acesso permitido à seção: laboratorios
```

---

## 🎯 Benefícios Implementados

1. **🔒 Segurança Aprimorada**
   - Separação clara de responsabilidades
   - Prevenção de acesso não autorizado

2. **👤 Experiência do Usuário**
   - Interface limpa (menus desnecessários ocultos)
   - Mensagens claras de permissão

3. **📊 Auditoria**
   - Logs detalhados de tentativas de acesso
   - Rastreabilidade de ações

4. **🛡️ Múltiplas Camadas**
   - Proteção visual, funcional e de dados
   - Redundância de segurança

---

## 💡 Próximos Passos (Opcionais)

1. **Logs em Banco**: Registrar tentativas de acesso no banco de dados
2. **Perfis Customizados**: Sistema mais flexível de permissões
3. **Auditoria Avançada**: Dashboard de auditoria para administradores
4. **Timeout de Sessão**: Logout automático por inatividade

---

**✅ Status: Implementado e Funcional**  
**🔧 Desenvolvido por: Carlos Henrique C. de Oliveira**  
**📅 Data: 30/07/2025**
