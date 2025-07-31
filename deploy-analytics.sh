#!/bin/bash

# Script de Deploy ReservaLAB com Vercel Analytics
# Autor: Carlos Henrique C. de Oliveira - FAEN/UFGD

echo "🚀 Iniciando deploy do ReservaLAB com Vercel Analytics..."

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
    git commit -m "feat: implementar Vercel Analytics

- Adicionado script analytics.js para rastreamento customizado
- Configurado Vercel Analytics em todas as páginas HTML
- Habilitado analytics no vercel.json
- Eventos rastreados: page_view, reserva_enviada, busca_reserva, navegacao, admin_access
- Sistema pronto para coleta de métricas de uso"
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
echo "✅ Deploy concluído!"
echo ""
echo "📊 Próximos passos:"
echo "1. Aguarde o deploy terminar no Vercel"
echo "2. Visite seu site: https://seu-projeto.vercel.app"
echo "3. Navegue pelas páginas para gerar dados"
echo "4. Verifique analytics em: https://vercel.com/dashboard/analytics"
echo "5. Aguarde 30 segundos para ver os primeiros dados"
echo ""
echo "🔍 Para debug: abra DevTools > Console e verifique window.va"
