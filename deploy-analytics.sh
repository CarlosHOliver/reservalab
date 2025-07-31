#!/bin/bash

# Script de Deploy ReservaLAB v2.0.0 - Sistema Completo
# Autor: Carlos Henrique C. de Oliveira - FAEN/UFGD

echo "🚀 Iniciando deploy do ReservaLAB v2.0.0..."
echo "📦 Sistema completo com Vercel Analytics integrado"

# Verificar se está em um repositório git
if [ ! -d ".git" ]; then
    echo "❌ Erro: Este não é um repositório git"
    echo "Execute: git init && git remote add origin <sua-url>"
    exit 1
fi

# Verificar se há mudanças para commit
if [ -z "$(git status --porcelain)" ]; then
    echo "ℹ️ Nenhuma mudança detectada"
else
    echo "📝 Preparando commit..."
    git add .
    git commit -m "feat: ReservaLAB v2.0.0 - Sistema Completo

✨ Funcionalidades Principais:
- Sistema de reservas completo com validação em tempo real
- Dashboard administrativo com gestão completa
- Calendário visual com filtros avançados
- Catálogo de laboratórios e equipamentos

🔧 Melhorias Técnicas:
- Timezone simplificado (corrigido bug de 8h diferença)
- Vercel Analytics implementado com eventos customizados
- Sistema RLS com controle de acesso por bloco
- Performance otimizada e design responsivo

📊 Analytics & Monitoramento:
- Eventos rastreados: page_view, reserva_enviada, busca_reserva
- Dashboard em tempo real via Vercel Analytics
- Métricas de uso e performance

🏗️ Arquitetura:
- Frontend: HTML5, CSS3, JavaScript ES6+, Bootstrap 5
- Backend: Supabase (PostgreSQL + API REST)
- Hosting: Vercel com deploy automático
- Analytics: Vercel Analytics integrado

📚 Documentação:
- README.md completo com toda documentação condensada
- Guias de instalação, configuração e manutenção
- Roadmap e planos futuros

Desenvolvido por Carlos Henrique C. de Oliveira - FAEN/UFGD"
fi

# Push para o repositório
echo "⬆️ Enviando para repositório..."
git push origin main

# Deploy no Vercel (se vercel CLI estiver instalado)
if command -v vercel &> /dev/null; then
    echo "🌐 Fazendo deploy no Vercel..."
    vercel --prod
else
    echo "ℹ️ Vercel CLI não encontrado"
    echo "📌 Push realizado. Deploy automático será feito pelo Vercel se configurado"
fi

echo ""
echo "✅ Deploy do ReservaLAB v2.0.0 concluído!"
echo ""
echo "📊 Próximos passos:"
echo "1. 🌐 Visite: https://reservalab-faen-ufgd.vercel.app"
echo "2. 📱 Teste responsividade em diferentes dispositivos"
echo "3. 🎯 Faça uma reserva teste para gerar analytics"
echo "4. 📈 Verifique métricas: https://vercel.com/dashboard/analytics"
echo "5. ⏱️ Aguarde 30 segundos para ver primeiros dados"
echo ""
echo "🔍 Debug Analytics: console.log(window.va) no DevTools"
echo "📋 Documentação: README.md contém toda informação necessária"
echo "🤝 Suporte: carlos.oliveira@ufgd.edu.br"
