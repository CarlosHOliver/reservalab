# 🏛️ ReservaLAB - Sistema de Reservas FAEN/UFGD

> **Sistema completo de reservas de laboratórios e equipamentos**  
> **Idealizado e Desenvolvido por Carlos Henrique C. de Oliveira**  
> *Técnico em Laboratório de Informática - FAEN/UFGD*  
> *Engenheiro da Computação*

[![Versão](https://img.shields.io/badge/versão-1.0.0-success.svg)](https://github.com/CarlosHOliver/reservalab)
[![Status](https://img.shields.io/badge/status-ativo-brightgreen.svg)](https://github.com/CarlosHOliver/reservalab)
[![Licença](https://img.shields.io/badge/licença-MIT-blue.svg)](LICENSE)

## 📋 Sobre o Projeto

O **ReservaLAB** é um sistema web completo desenvolvido especificamente para a gestão de reservas de laboratórios e equipamentos da **Faculdade de Engenharia (FAEN)** da **Universidade Federal da Grande Dourados (UFGD)**. 

O sistema oferece uma solução moderna, intuitiva e responsiva para facilitar o processo de solicitação, aprovação e gerenciamento de reservas, atendendo às necessidades específicas da comunidade acadêmica.

---

## ✨ Funcionalidades Principais

### � **Portal de Reservas (Público)**
- **Formulário Inteligente**: Sistema de reserva com validação em tempo real
- **Autenticação Institucional**: Validação obrigatória de e-mail @ufgd.edu.br ou @academico.ufgd.edu.br
- **Verificação de Conflitos**: Prevenção automática de sobreposição de horários
- **Protocolo Único**: Geração automática de protocolo para rastreamento
- **Professor Acompanhante**: Campo obrigatório quando necessário
- **Busca de Reservas**: Consulta por protocolo com detalhes completos

### 📅 **Calendário Visual**
- **Interface Moderna**: Visualização mensal com FullCalendar
- **Filtros Avançados**: Por bloco, tipo de recurso e status
- **Responsivo**: Adaptação perfeita para desktop, tablet e mobile
- **Detalhes Instantâneos**: Modal com informações completas da reserva
- **iCalendar**: Exportação para Google Calendar, Outlook e outros

### 🏢 **Catálogo de Recursos**

#### **Laboratórios**
- Visualização organizada por blocos da FAEN
- Informações detalhadas (capacidade, descrição, localização)
- Status de disponibilidade em tempo real
- Galeria de fotos para melhor identificação

#### **Equipamentos**
- Catálogo completo com três formatos de visualização (cards, lista, tabela)
- Filtros por bloco, status e disponibilidade
- Informações de patrimônio e localização
- Status: Disponível, Em Manutenção, Inativo
- Upload de fotos e documentação técnica

### 🔐 **Dashboard Administrativa**
- **Dois Níveis de Acesso**: Administrador (total) e Gestor (limitado)
- **Gestão de Reservas**: Aprovação, rejeição e histórico completo
- **Analytics**: Estatísticas em tempo real e relatórios gráficos
- **Gestão de Usuários**: CRUD completo com controle de permissões
- **Gestão de Recursos**: Administração de laboratórios e equipamentos
- **Sistema de Backup**: Exportação e importação de dados
- **Auditoria**: Log completo de todas as ações do sistema

### 🛡️ **Dashboard Patrimonial**
- **Acesso Restrito**: Exclusivo para Divisão de Proteção Patrimonial
- **Monitoramento 24/7**: Visualização em tempo real das reservas
- **Relógio Sincronizado**: Fuso horário de Cuiabá/Dourados
- **Sistema de Reports**: Formulário para reportar eventualidades
- **Estatísticas do Dia**: Métricas de reservas em andamento e futuras
- **Interface Otimizada**: Design específico para uso operacional

---

## 🛠️ Stack Tecnológica

### **Frontend**
- **HTML5** com semântica moderna
- **CSS3** com Grid, Flexbox e animações
- **JavaScript ES6+** vanilla (sem frameworks pesados)
- **Bootstrap 5.3.2** para responsividade e componentes
- **Bootstrap Icons 1.11.1** para iconografia consistente
- **FullCalendar 6.1.10** para visualização de calendário

### **Backend & Banco de Dados**
- **Supabase** (PostgreSQL managed)
- **Row Level Security (RLS)** habilitado
- **Real-time subscriptions** para atualizações instantâneas
- **Storage** para upload de imagens

### **Segurança**
- Autenticação JWT via Supabase
- Hash bcrypt para senhas
- Validação client-side e server-side
- Sanitização de inputs
- Proteção CSRF

---

## 📦 Estrutura do Projeto

```
reservalab/
├── 📁 public/                    # Arquivos públicos
│   ├── 📄 index.html            # Página principal (formulário de reservas)
│   ├── 📄 calendario.html       # Calendário visual
│   ├── 📄 equipamentos.html     # Catálogo de equipamentos
│   ├── 📄 laboratorios.html     # Catálogo de laboratórios
│   ├── 📄 patrimonial.html      # Dashboard patrimonial
│   ├── 📁 admin/                # Área administrativa
│   │   └── 📄 index.html        # Dashboard administrativa
│   ├── 📁 assets/               # Recursos estáticos
│   │   ├── 📁 css/
│   │   │   └── 📄 style.css     # Estilos customizados
│   │   ├── 📁 js/               # Scripts JavaScript
│   │   │   ├── 📄 config.js     # Configurações do Supabase
│   │   │   ├── 📄 api.js        # Camada de API
│   │   │   ├── 📄 utils.js      # Utilitários gerais
│   │   │   ├── 📄 formulario.js # Lógica do formulário
│   │   │   ├── 📄 calendario.js # Lógica do calendário
│   │   │   ├── 📄 admin.js      # Dashboard administrativa
│   │   │   ├── 📄 patrimonial.js# Dashboard patrimonial
│   │   │   ├── 📄 equipamentos.js# Catálogo de equipamentos
│   │   │   ├── 📄 laboratorios.js# Catálogo de laboratórios
│   │   │   └── 📄 icalendar.js  # Geração de iCalendar
│   │   └── 📁 images/           # Imagens e assets
│   │       ├── 🖼️ logo-ufgd.png # Logo oficial da UFGD
│   │       └── 🖼️ favicon.ico   # Favicon do sistema
│   └── 📁 docs/                 # Documentação adicional
├── 📁 database/                 # Scripts do banco de dados
│   ├── 📄 supabase_schema.sql   # Schema completo
│   ├── 📄 inserir_dados_teste.sql# Dados para desenvolvimento
│   └── 📄 criar_usuarios_admin.sql# Usuários administrativos
├── 📄 package.json              # Dependências e scripts
├── 📄 vercel.json              # Configuração de deploy
└── 📄 README.md                # Esta documentação
```

---

## 🚀 Instalação e Configuração

### **Pré-requisitos**
- Conta no [Supabase](https://supabase.com) (gratuita)
- Servidor web (Netlify, Vercel, GitHub Pages, etc.)
- Editor de código

### **1. Configuração do Banco de Dados**

1. **Crie um projeto no Supabase**
   ```bash
   # Acesse https://supabase.com e crie um novo projeto
   ```

2. **Execute o schema do banco**
   ```sql
   -- Cole o conteúdo de database/supabase_schema.sql no SQL Editor
   -- Isso criará todas as tabelas e configurações necessárias
   ```

3. **Insira dados iniciais**
   ```sql
   -- Execute database/inserir_dados_teste.sql para dados de exemplo
   -- Execute database/criar_usuarios_admin.sql para usuários administrativos
   ```

### **2. Configuração do Sistema**

1. **Configure as credenciais do Supabase**
   ```javascript
   // Edite public/assets/js/config.js
   const SUPABASE_CONFIG = {
       url: 'https://seu-projeto.supabase.co',
       anonKey: 'sua-chave-anonima-aqui'
   };
   ```

2. **Personalize a identidade visual**
   - Substitua `public/assets/images/logo-ufgd.png` pelo logo oficial
   - Ajuste as cores no `style.css` se necessário

### **3. Deploy**

#### **Vercel (Recomendado)**
```bash
npm install -g vercel
vercel --prod
```

#### **Netlify**
- Arraste a pasta `public` para o deploy dashboard
- Configure redirects se necessário

#### **GitHub Pages**
- Configure o diretório `public` como source
- Ative GitHub Pages nas configurações do repositório

---

## 👥 Usuários e Permissões

### **Tipos de Usuário**

| Tipo | Descrição | Permissões |
|------|-----------|------------|
| **Público** | Usuários com e-mail institucional | Criar reservas, consultar calendário |
| **Gestor** | Responsável por bloco/laboratório | Aprovar/rejeitar reservas do seu bloco |
| **Administrador** | Acesso completo ao sistema | Todas as permissões + gestão de usuários |
| **Patrimonial** | Divisão de Proteção Patrimonial | Dashboard especializado + reports |

### **Credenciais Padrão**
> ⚠️ **IMPORTANTE**: Altere todas as senhas padrão após a instalação

- **Administrador**: Login definido no banco de dados
- **Gestor**: Login definido no banco de dados

---

## 🎨 Identidade Visual

### **Paleta de Cores**
```css
:root {
  --ufgd-green-primary: #749719;    /* Verde UFGD principal */
  --ufgd-green-light: #C8D400;     /* Verde UFGD claro */
  --ufgd-green-dark: #5a7214;      /* Verde UFGD escuro */
  --bootstrap-primary: #0d6efd;     /* Azul Bootstrap */
  --bootstrap-success: #198754;     /* Verde Bootstrap */
  --bootstrap-warning: #ffc107;     /* Amarelo Bootstrap */
}
```

### **Tipografia**
- **Primária**: Segoe UI, Tahoma, Geneva, Verdana, sans-serif
- **Monospace**: 'Courier New', Courier, monospace (para protocolos e códigos)

---

## 📊 Banco de Dados

### **Principais Entidades**

| Tabela | Descrição | Principais Campos |
|--------|-----------|-------------------|
| `reservas` | Solicitações de reserva | protocolo, data_reserva, status, finalidade |
| `laboratorios` | Cadastro de laboratórios | nome, bloco_id, capacidade, ativo |
| `equipamentos` | Cadastro de equipamentos | nome, patrimonio, status, permitir_uso_compartilhado |
| `usuarios` | Usuários do sistema | nome, login, email, perfil |
| `blocos` | Blocos da FAEN | nome |
| `reserva_equipamentos` | Relação N:N reservas-equipamentos | reserva_id, equipamento_id |

### **Recursos Especiais**
- **RLS (Row Level Security)**: Segurança em nível de linha
- **Triggers**: Auditoria automática de alterações
- **Views**: Consultas otimizadas para relatórios
- **Índices**: Performance otimizada para consultas frequentes

---

## 🔒 Segurança

### **Medidas Implementadas**
- ✅ Validação de e-mail institucional obrigatória
- ✅ Autenticação JWT com refresh tokens
- ✅ Hash bcrypt para todas as senhas
- ✅ Sanitização e validação de todos os inputs
- ✅ Row Level Security (RLS) no Supabase
- ✅ Proteção contra SQL Injection
- ✅ Headers de segurança configurados
- ✅ HTTPS obrigatório em produção

### **Boas Práticas de Segurança**
1. **Jamais** exponha credenciais no código fonte
2. Use variáveis de ambiente para dados sensíveis
3. Altere todas as senhas padrão imediatamente
4. Configure backup automático do banco de dados
5. Monitore logs de acesso regularmente
6. Mantenha o sistema sempre atualizado

---

## 📱 Responsividade

O sistema foi desenvolvido com **mobile-first design** e é totalmente responsivo:

- **Desktop** (≥1200px): Layout completo com sidebar e múltiplas colunas
- **Tablet** (768px-1199px): Layout adaptado com navegação otimizada
- **Mobile** (≤767px): Interface simplificada e otimizada para toque

---

## 🧪 Desenvolvimento

### **Scripts Disponíveis**
```bash
# Instalar dependências
npm install

# Servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Deploy para Vercel
npm run deploy
```

### **Estrutura de Development**
```bash
# Clone o repositório
git clone https://github.com/CarlosHOliver/reservalab.git

# Instale as dependências
cd reservalab
npm install

# Configure o ambiente
cp config.example.js config.js
# Edite config.js com suas credenciais

# Inicie o servidor de desenvolvimento
npm run dev
```

---

## 📈 Funcionalidades Avançadas

### **Sistema de Notificações**
- Toast notifications para feedback imediato
- E-mails automáticos para confirmações
- Lembretes de reservas próximas

### **Relatórios e Analytics**
- Dashboard com métricas em tempo real
- Gráficos de utilização por laboratório
- Relatórios de reservas por período
- Exportação para Excel/PDF

### **API RESTful**
- Endpoints padronizados para todas as operações
- Documentação automática via Supabase
- Rate limiting e throttling configurados

### **PWA (Progressive Web App)**
- Instalável em dispositivos móveis
- Funciona offline (cache estratégico)
- Push notifications (em desenvolvimento)

---

## 🔧 Manutenção e Suporte

### **Backup e Recuperação**
```bash
# Backup automático via Supabase
# Configurar no dashboard do Supabase:
# Settings > Database > Backups

# Backup manual (via dashboard administrativa)
# Acesse: Admin > Configurações > Backup/Restauração
```

### **Monitoramento**
- Logs de erro via Supabase Dashboard
- Métricas de performance integradas
- Alertas automáticos para problemas críticos

### **Atualizações**
1. Sempre teste em ambiente de desenvolvimento
2. Faça backup antes de qualquer atualização
3. Siga as releases notes do projeto
4. Monitore o sistema após deploy

---

## 🤝 Contribuição

Este sistema foi desenvolvido especificamente para a FAEN/UFGD. Para sugestões, melhorias ou relato de bugs:

### **Contato**
**Carlos Henrique C. de Oliveira**  
📧 Email: [contato através da UFGD]  
🏢 Técnico em Laboratório de Informática  
🎓 Faculdade de Engenharia - FAEN/UFGD  

### **Como Contribuir**
1. Reporte bugs através dos issues
2. Sugira melhorias com casos de uso específicos
3. Documente problemas com steps para reprodução
4. Inclua screenshots quando relevante

---

## � Licença

Copyright © 2025 Carlos Henrique C. de Oliveira - FAEN/UFGD

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

### **Termos de Uso**
- ✅ Uso comercial permitido
- ✅ Modificação permitida
- ✅ Distribuição permitida
- ✅ Uso privado permitido
- ❌ Sem garantias expressas

---

## 🌟 Agradecimentos

- **UFGD** - Universidade Federal da Grande Dourados
- **FAEN** - Faculdade de Engenharia
- **Supabase** - Plataforma de backend
- **Bootstrap** - Framework CSS
- **FullCalendar** - Biblioteca de calendário

---

<div align="center">

**Desenvolvido com ❤️ para a FAEN/UFGD**

![UFGD Logo](public/assets/images/logo-ufgd.png)

*Sistema ReservaLAB - Facilitando o acesso ao conhecimento através da tecnologia*

---

[![GitHub](https://img.shields.io/badge/GitHub-reservalab-black?style=for-the-badge&logo=github)](https://github.com/CarlosHOliver/reservalab) [![UFGD](https://img.shields.io/badge/UFGD-FAEN-green?style=for-the-badge)](https://portal.ufgd.edu.br)

</div>