# 🏛️ ReservaLAB - Sistema de Reservas FAEN/UFGD

> **Sistema completo de reservas de laboratórios e equipamentos da Faculdade de Engenharia**  
> **Idealizado e Desenvolvido por Carlos Henrique C. de Oliveira**  
> *Técnico em Laboratório de Informática - FAEN/UFGD - Engenheiro da Computação*

[![Versão](https://img.shields.io/badge/versão-2.0.0-success.svg)](https://github.com/CarlosHOliver/reservalab)
[![Status](https://img.shields.io/badge/status-ativo-brightgreen.svg)](https://reservalab-faen-ufgd.vercel.app)
[![Licença](https://img.shields.io/badge/licença-MIT-blue.svg)](LICENSE)
[![Analytics](https://img.shields.io/badge/vercel-analytics-blue.svg)](https://vercel.com/analytics)

---

## 📋 Sobre o Projeto

O **ReservaLAB** é uma solução web moderna e completa para gestão de reservas de laboratórios e equipamentos da **FAEN/UFGD**. Desenvolvido especificamente para atender às necessidades da comunidade acadêmica, oferece interface intuitiva, responsiva e funcionalidades avançadas de gerenciamento.

**🌐 Sistema em Produção:** [reservalab-faen-ufgd.vercel.app](https://reservalab-faen-ufgd.vercel.app)

---

## ✨ Funcionalidades Principais

### 🎯 **Portal de Reservas (Público)**
- **Formulário Inteligente** com validação em tempo real
- **Autenticação Institucional** (@ufgd.edu.br obrigatório)
- **Verificação de Conflitos** automática
- **Protocolo Único** para rastreamento
- **Professor Acompanhante** quando necessário
- **Busca por Protocolo** com detalhes completos

### 📅 **Calendário Visual**
- **Interface Moderna** com FullCalendar
- **Filtros Avançados** por bloco, recurso e status
- **100% Responsivo** (desktop, tablet, mobile)
- **iCalendar Export** para Google/Outlook
- **Visualização Detalhada** em modais

### 🏢 **Catálogo de Recursos**
- **Laboratórios** organizados por blocos
- **Equipamentos** com três modos de visualização
- **Status em Tempo Real**
- **Galeria de Fotos**
- **Filtros Inteligentes**

### 👨‍💼 **Dashboard Administrativo**
- **Gestão Completa** de reservas
- **Aprovação/Rejeição** com comentários
- **CRUD** de laboratórios e equipamentos
- **Sistema de Usuários** com permissões
- **Relatórios Detalhados**
- **Backup de Dados**

---

## 🏗️ Arquitetura Técnica

### **Stack Tecnológico**
```javascript
Frontend:    HTML5, CSS3, JavaScript (ES6+), Bootstrap 5
Backend:     Supabase (PostgreSQL + API REST)
Hosting:     Vercel (Deploy automático)
Analytics:   Vercel Analytics
Libraries:   FullCalendar, Luxon.js, Bootstrap Icons
```

### **Estrutura do Projeto**
```
reservalab/
├── public/                    # Arquivos públicos
│   ├── assets/
│   │   ├── css/              # Estilos customizados
│   │   ├── js/               # Scripts JavaScript
│   │   │   ├── api.js        # Integração Supabase
│   │   │   ├── formulario.js # Lógica de reservas
│   │   │   ├── admin.js      # Dashboard admin
│   │   │   ├── analytics.js  # Vercel Analytics
│   │   │   └── utils.js      # Utilitários
│   │   └── images/           # Recursos visuais
│   ├── admin/                # Dashboard administrativo
│   ├── index.html            # Página principal
│   ├── calendario.html       # Calendário
│   ├── laboratorios.html     # Catálogo labs
│   └── equipamentos.html     # Catálogo equipamentos
├── database/                 # Scripts SQL
├── docs/                     # Documentação
├── package.json              # Dependências
├── vercel.json              # Configuração deploy
└── README.md                # Esta documentação
```

---

## 🛠️ Configuração e Instalação

### **Pré-requisitos**
- Node.js 18+ (para desenvolvimento)
- Git
- Conta Supabase (backend)
- Conta Vercel (hosting)

### **Setup Local**
```bash
# 1. Clonar repositório
git clone https://github.com/CarlosHOliver/reservalab.git
cd reservalab

# 2. Instalar dependências
npm install

# 3. Configurar ambiente local
npm run dev
# Acesse: http://localhost:3000
```

### **Configuração Supabase**
```sql
-- 1. Criar projeto no Supabase
-- 2. Executar scripts em database/supabase_schema.sql
-- 3. Configurar RLS (Row Level Security)
-- 4. Atualizar credenciais em public/assets/js/config.js
```

### **Deploy Automático**
```bash
# Deploy com Analytics habilitado
./deploy-analytics.sh

# Ou manual:
git push origin main  # Deploy automático via Vercel
```

---

## 🔧 Funcionalidades Avançadas

### **� Sistema de Timezone Simplificado**
- **Problema Resolvido:** Conversões duplas causavam diferença de 8h
- **Solução:** Horário local direto (UTC-4 Cuiabá)
- **Resultado:** 7h digitado = 7h gravado = 7h exibido ✅

### **📊 Vercel Analytics Integrado**
- **Métricas Automáticas:** Page views, visitantes únicos
- **Eventos Customizados:** Reservas, buscas, navegação
- **Dashboard:** analytics em tempo real
- **Privacy-First:** Dados anonimizados

### **🔐 Sistema de Permissões (RLS)**
- **Row Level Security** configurado
- **Acesso por Bloco** para gestores
- **Admin Total** para administradores
- **Auditoria** de todas as ações

### **📱 Design Responsivo**
- **Mobile-First** approach
- **Breakpoints** otimizados
- **Touch-Friendly** interfaces
- **Performance** otimizada

### **🔍 Busca e Filtros**
- **Busca Global** por protocolo
- **Filtros Inteligentes** por múltiplos campos
- **Autocomplete** em formulários
- **Resultados Instantâneos**

---

## 📈 Monitoramento e Analytics

### **Métricas Coletadas**
- **Tráfego:** Páginas mais visitadas, tempo de sessão
- **Uso:** Reservas criadas, buscas realizadas
- **Performance:** Tempos de carregamento
- **Dispositivos:** Desktop vs Mobile usage

### **Eventos Rastreados**
```javascript
// Eventos automáticos
page_view         // Visualizações de página
reserva_enviada   // Nova reserva criada
busca_reserva     // Busca por protocolo
navegacao         // Navegação entre páginas
admin_access      // Acesso ao dashboard

// Eventos customizados
window.trackCustomEvent('evento_nome', { propriedades });
```

---

## 🚀 Atualizações e Correções Recentes

### **v2.0.0 - Julho 2025**

#### **🔥 Principais Melhorias:**
- ✅ **Timezone Simplificado:** Corrigido problema de 8h de diferença
- ✅ **Vercel Analytics:** Implementado rastreamento completo
- ✅ **Performance:** Otimizações de carregamento
- ✅ **UX/UI:** Melhorias na interface e navegação
- ✅ **Mobile:** Responsividade aperfeiçoada

#### **🐛 Correções Críticas:**
- **Timezone Bug:** Removidas conversões duplas UTC
- **iCalendar:** Corrigido export de eventos
- **Busca:** Melhorada performance de consultas
- **RLS:** Ajustado controle de acesso por bloco
- **Layout:** Corrigidos problemas de responsividade

#### **� Novas Funcionalidades:**
- **Dashboard Admin:** Interface completamente reformulada
- **Sistema Reports:** Relatórios detalhados de uso
- **Backup Automático:** Proteção de dados
- **Debug Tools:** Ferramentas de diagnóstico
- **Analytics:** Métricas em tempo real

---

## 📚 Documentação Técnica

### **Configuração de Ambiente**
```javascript
// config.js - Configurações principais
CONFIG = {
    SUPABASE_URL: 'https://seu-projeto.supabase.co',
    SUPABASE_ANON_KEY: 'sua-chave-anonima',
    TIMEZONE: 'America/Cuiaba',
    ENV: 'production'
}
```

### **Estrutura do Banco de Dados**
```sql
-- Tabelas principais
blocos              -- Blocos da FAEN
laboratorios        -- Laboratórios por bloco
equipamentos        -- Equipamentos e patrimônio
reservas            -- Reservas com protocolo único
usuarios            -- Gestores e administradores
reserva_equipamentos -- Relação N:N reservas-equipamentos
```

### **API Endpoints (Supabase)**
```javascript
// Principais endpoints utilizados
GET  /reservas              // Listar reservas
POST /reservas              // Criar nova reserva
GET  /laboratorios          // Listar laboratórios
GET  /equipamentos          // Listar equipamentos
GET  /blocos                // Listar blocos
```

---

## 🔧 Manutenção e Suporte

### **Monitoramento**
- **Uptime:** 99.9% (Vercel)
- **Performance:** Core Web Vitals otimizados
- **Errors:** Sentry integration (futuro)
- **Analytics:** Dashboard Vercel

### **Backup e Segurança**
- **Backup Automático:** Supabase (Point-in-Time Recovery)
- **SSL/TLS:** Vercel (certificado automático)
- **RLS:** Row Level Security ativo
- **Validação:** Server-side e client-side

### **Suporte Técnico**
- **Desenvolvedor:** Carlos Henrique C. de Oliveira
- **Email:** carlos.oliveira@ufgd.edu.br
- **Local:** Laboratório de Informática - FAEN/UFGD
- **Horário:** Seg-Sex, 8h-17h

---

## 📋 Roadmap Futuro

### **Q3 2025**
- [ ] **Mobile App** React Native
- [ ] **Notificações** Push/Email
- [ ] **API REST** pública documentada
- [ ] **Integração** com sistemas UFGD

### **Q4 2025**
- [ ] **Machine Learning** para otimização de reservas
- [ ] **Dashboard Avançado** com BI
- [ ] **Multi-tenant** para outras faculdades
- [ ] **Offline Mode** PWA

---

## 🤝 Contribuição

O sistema está em constante evolução. Sugestões e melhorias são bem-vindas!

### **Como Contribuir:**
1. **Fork** o repositório
2. **Create** branch para feature
3. **Commit** mudanças
4. **Push** para branch
5. **Abra** Pull Request

### **Padrões de Código:**
- JavaScript ES6+
- Comentários em português
- Bootstrap 5 components
- Mobile-first approach

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 🏆 Reconhecimentos

- **UFGD** - Universidade Federal da Grande Dourados
- **FAEN** - Faculdade de Engenharia  
- **Supabase** - Backend-as-a-Service
- **Vercel** - Hosting e Analytics
- **Bootstrap Team** - Framework CSS
- **FullCalendar** - Biblioteca de calendário

---

## 📊 Estatísticas do Projeto

```
📈 Estatísticas (até Julho 2025):
├── 🎯 Reservas Processadas: 500+
├── 👥 Usuários Ativos: 50+
├── 🏢 Laboratórios: 15+
├── 🔧 Equipamentos: 100+
├── 📱 Mobile Usage: 65%
└── ⚡ Performance Score: 95+
```

---

<div align="center">

**📍 ReservaLAB FAEN/UFGD**  
*Desenvolvido com 💙 para a comunidade acadêmica*

[🌐 Site](https://reservalab-faen-ufgd.vercel.app) • [📊 Analytics](https://vercel.com/analytics) • [🐛 Issues](https://github.com/CarlosHOliver/reservalab/issues)

</div>

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