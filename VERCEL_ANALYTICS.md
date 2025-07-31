# IMPLEMENTAÇÃO VERCEL ANALYTICS - RESERVALAB

## 📊 Configuração do Vercel Analytics para JavaScript Vanilla

### ✅ Instalação Realizada

1. **Dependência instalada:**
   ```bash
   npm install @vercel/analytics
   ```

2. **Arquivos criados/modificados:**
   - `public/assets/js/analytics.js` - Script customizado para rastreamento
   - `public/assets/snippets/vercel-analytics-head.html` - Snippet para <head>
   - `public/assets/snippets/vercel-analytics-body.html` - Snippet para <body>
   - `vercel.json` - Configuração habilitada
   - Todas as páginas HTML atualizadas

### 🔧 Implementação

#### 1. Script Base (Todas as páginas)
```html
<!-- No <head> de cada página -->
<script>
    window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
</script>
<script defer src="/_vercel/insights/script.js"></script>
```

#### 2. Eventos Customizados (analytics.js)
```javascript
// Rastreamento automático de:
- Envio de formulários de reserva
- Busca de reservas
- Navegação entre páginas
- Acesso ao dashboard admin
```

### 📈 Eventos Rastreados

#### Eventos Automáticos:
- **page_view** - Visualização de páginas
- **reserva_enviada** - Envio de nova reserva
- **busca_reserva** - Busca por protocolo
- **navegacao** - Navegação entre páginas
- **admin_access** - Acesso ao dashboard

#### Eventos Customizados:
```javascript
// Para adicionar eventos customizados em qualquer lugar:
window.trackCustomEvent('nome_evento', {
    propriedade1: 'valor1',
    propriedade2: 'valor2'
});
```

### 🌐 Páginas Configuradas

✅ **Páginas com Analytics:**
- `index.html` - Nova Reserva
- `calendario.html` - Calendário
- `laboratorios.html` - Laboratórios
- `equipamentos.html` - Equipamentos
- `admin/index.html` - Dashboard Admin

### ⚙️ Configuração vercel.json

```json
{
  "analytics": {
    "enable": true
  }
}
```

### 🚀 Próximos Passos

1. **Deploy no Vercel:**
   ```bash
   git add .
   git commit -m "feat: implementar Vercel Analytics"
   git push origin main
   ```

2. **Verificar no Dashboard Vercel:**
   - Acesse: https://vercel.com/dashboard
   - Vá em seu projeto > Analytics
   - Aguarde 30 segundos após o deploy

3. **Testar Analytics:**
   - Visite o site após deploy
   - Navegue entre páginas
   - Faça uma reserva teste
   - Verifique os dados no dashboard

### 📋 Métricas Disponíveis

**Métricas Básicas:**
- Page Views (visualizações)
- Unique Visitors (visitantes únicos)
- Top Pages (páginas mais visitadas)
- Referrers (origem do tráfego)

**Métricas Customizadas:**
- Reservas enviadas
- Buscas realizadas
- Uso do admin
- Padrões de navegação

### 🔍 Debug e Monitoramento

**Console do navegador:**
```javascript
// Verificar se analytics está funcionando
console.log(window.va); // Deve retornar function

// Testar evento manual
window.trackCustomEvent('teste', { debug: true });
```

**Verificar no Network tab:**
- Deve aparecer requisições para `/_vercel/insights/`

### 📝 Observações Importantes

1. **Analytics só funciona em produção** (domínio .vercel.app)
2. **Aguardar 30 segundos** para dados aparecerem
3. **Verificar bloqueadores de anúncios** que podem bloquear analytics
4. **Navegar entre páginas** para gerar mais dados

---

**Data:** 31/07/2025  
**Status:** ✅ IMPLEMENTADO - Pronto para deploy  
**Desenvolvedor:** Carlos Henrique C. de Oliveira - FAEN/UFGD  
**Próximo:** Deploy e verificação no dashboard Vercel
