# ReservaLAB - Sistema de Reservas FAEN/UFGD

**Idealizado e Desenvolvido por Carlos Henrique C. de Oliveira - Tec. Laboratório de Informática FAEN/UFGD - Engenheiro da Computação**

## 📋 Descrição

Sistema completo de reservas de laboratórios e equipamentos da Faculdade de Engenharia (FAEN) da Universidade Federal da Grande Dourados (UFGD). Desenvolvido em JavaScript puro com integração ao Supabase para persistência de dados.

## 🎯 Funcionalidades Principais

### 🏠 **Página Inicial (Formulário de Reserva)**
- Formulário completo com validação de e-mail institucional (@ufgd.edu.br / @academico.ufgd.edu.br)
- Seleção de laboratórios e equipamentos por bloco (FAEN/Produção, Civil, Energia, Alimentos, Mecânica)
- Verificação de conflitos em tempo real
- Campo obrigatório para professor acompanhante quando necessário
- Links para calendário visual e listas de equipamentos
- Confirmação e opção de impressão da solicitação
- Busca de reservas por protocolo único

### 🎛️ **Dashboard Administrativa**
- 2 tipos de usuários: Administrador (poder total) e Gestor (limitado)
- Usuário admin padrão: `admin` / `admin123` (alterável via dashboard)
- Visualização de reservas pendentes, aprovadas e rejeitadas
- Estatísticas em tempo real
- Gestão completa de usuários, laboratórios e equipamentos
- Sistema de backup/restauração
- Relatórios com gráficos

### 📅 **Calendário Visual**
- Visualização mensal das reservas aprovadas
- Filtros por bloco, tipo de recurso e status
- Detalhes das reservas por dia
- Interface responsiva e intuitiva

### 🔧 **Lista de Equipamentos**
- Visualização em cards, lista ou tabela
- Filtros por bloco, status e uso compartilhado
- Status: Disponível, Em Manutenção, Inativo
- Upload de fotos para equipamentos e laboratórios

### 🏢 **Lista de Laboratórios**
- Visualização organizada por blocos
- Informações detalhadas de cada laboratório
- Status de disponibilidade
- Fotos e descrições

## 🛠️ Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript ES6+, Bootstrap 5.3.2
- **Backend**: Supabase (PostgreSQL)
- **Autenticação**: Sistema próprio com hash de senhas
- **Responsividade**: Bootstrap + CSS Grid/Flexbox
- **Ícones**: Bootstrap Icons 1.11.1

## 🎨 Identidade Visual

O sistema segue rigorosamente a identidade visual da UFGD:
- **Cores Primárias**: Verde UFGD (#749719, #C8D400)
- **Tipografia**: Segoe UI, system fonts
- **Layout**: Responsivo e acessível
- **Componentes**: Cards, modais, formulários padronizados

## 📦 Estrutura do Projeto

```
ReservaLAB_FINAL/
├── public/
│   ├── index.html              # Página principal (formulário)
│   ├── equipamentos.html       # Lista de equipamentos
│   ├── laboratorios.html       # Lista de laboratórios
│   ├── calendario.html         # Calendário visual
│   ├── patrimonial.html        # Sistema patrimonial
│   ├── admin/
│   │   └── index.html         # Dashboard administrativa
│   └── assets/
│       ├── css/
│       │   └── style.css      # Estilos personalizados
│       ├── js/
│       │   ├── config.js      # Configurações do Supabase
│       │   ├── utils.js       # Utilitários gerais
│       │   ├── api.js         # Funções de API
│       │   ├── formulario.js  # Lógica do formulário
│       │   ├── calendario.js  # Lógica do calendário
│       │   ├── equipamentos.js # Lógica dos equipamentos
│       │   ├── laboratorios.js # Lógica dos laboratórios
│       │   ├── admin.js       # Dashboard administrativa
│       │   └── icalendar.js   # Geração de iCalendar
│       └── images/
│           ├── logo-ufgd.png  # Logo da UFGD
│           └── favicon.ico    # Favicon
├── database/
│   ├── schema_completo_final.sql # Schema completo do banco
│   └── dados_iniciais.sql     # Dados iniciais para testes
└── README.md                  # Esta documentação
```

## 🚀 Instalação e Configuração

### 1. **Configuração do Supabase**

1. Crie um projeto no [Supabase](https://supabase.com)
2. Execute o SQL do arquivo `database/schema_completo_final.sql` no SQL Editor
3. Execute o SQL do arquivo `database/dados_iniciais.sql` para dados de teste
4. Copie a URL e a chave anônima do projeto

### 2. **Configuração do Sistema**

1. Edite o arquivo `public/assets/js/config.js`:
```javascript
const SUPABASE_CONFIG = {
    url: 'SUA_URL_DO_SUPABASE',
    anonKey: 'SUA_CHAVE_ANONIMA'
};
```

2. Substitua o arquivo `public/assets/images/logo-ufgd.png` pelo logo oficial da UFGD

### 3. **Deploy**

O sistema pode ser hospedado em qualquer servidor web estático:
- **Netlify**: Arraste a pasta `public` para o deploy
- **Vercel**: Conecte o repositório Git
- **GitHub Pages**: Configure o diretório `public` como source
- **Servidor próprio**: Copie os arquivos da pasta `public`

## 👤 Usuários Padrão

### Administrador
- **Usuário**: `admin`
- **Senha**: `admin123`
- **Permissões**: Acesso total ao sistema

*A senha pode ser alterada através da dashboard administrativa.*

## 📊 Banco de Dados

### Tabelas Principais:
- `reservas` - Solicitações de reserva
- `laboratorios` - Cadastro de laboratórios
- `equipamentos` - Cadastro de equipamentos
- `usuarios` - Usuários do sistema
- `blocos` - Blocos da FAEN
- `formularios_acesso` - Formulários de acesso
- `configuracoes` - Configurações do sistema

### Recursos Especiais:
- **RLS (Row Level Security)** habilitado
- **Triggers** para auditoria
- **Views** para relatórios
- **Índices** otimizados para performance

## 🔒 Segurança

- Validação de e-mail institucional obrigatória
- Senhas criptografadas com hash seguro
- Sanitização de inputs
- Proteção contra SQL Injection
- HTTPS obrigatório em produção

## 📱 Responsividade

O sistema é totalmente responsivo e funciona perfeitamente em:
- **Desktop** (1200px+)
- **Tablet** (768px - 1199px)
- **Mobile** (até 767px)

## 🎯 Funcionalidades Especiais

### Sistema Patrimonial
- Relatórios para divisão patrimonial
- Acesso protegido por senha
- Exportação de dados

### Calendário iCal
- Geração automática de arquivos .ics
- Integração com Google Calendar, Outlook
- Lembretes automáticos

### Notificações
- Sistema de toast notifications
- Feedback visual para todas as ações
- Mensagens de erro e sucesso

## 🔧 Manutenção

### Backup Regular
- Exporte os dados do Supabase regularmente
- Mantenha cópias dos arquivos de configuração
- Monitore logs de erro

### Atualizações
- Verifique atualizações do Bootstrap e dependências
- Teste em ambiente de desenvolvimento antes de aplicar em produção
- Mantenha documentação atualizada

## 📞 Suporte

Para suporte técnico ou dúvidas sobre o sistema:

**Carlos Henrique C. de Oliveira**  
Técnico em Laboratório de Informática  
Faculdade de Engenharia - FAEN/UFGD  
Engenheiro da Computação

## 📄 Licença

Este sistema foi desenvolvido exclusivamente para a FAEN/UFGD. Todos os direitos reservados.

---

**Desenvolvido com ❤️ para a FAEN/UFGD**  
*Sistema ReservaLAB - 2025*