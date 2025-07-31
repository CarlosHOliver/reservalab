#!/bin/bash

# Script para atualizar schema do banco de dados
# ReservaLAB - Sistema de Reservas FAEN/UFGD
# Autor: Carlos Henrique C. de Oliveira

echo "📊 ReservaLAB - Backup do Schema Atual"
echo "Data: $(date '+%d/%m/%Y %H:%M:%S')"
echo ""

# Verificar se existe arquivo de schema atual
if [ -f "database/schema_atual_producao.sql" ]; then
    echo "✅ Schema atual encontrado"
    
    # Fazer backup com timestamp
    TIMESTAMP=$(date '+%Y%m%d_%H%M%S')
    cp database/schema_atual_producao.sql "database/backup_schema_${TIMESTAMP}.sql"
    echo "📁 Backup criado: backup_schema_${TIMESTAMP}.sql"
else
    echo "❌ Arquivo schema_atual_producao.sql não encontrado"
    exit 1
fi

echo ""
echo "📋 Para atualizar o schema:"
echo "1. Exporte o schema atual do Supabase"
echo "2. Substitua o conteúdo de database/schema_atual_producao.sql"
echo "3. Execute: git add . && git commit -m 'update: schema banco de dados'"
echo ""
echo "🔍 Schema atual tem as seguintes tabelas:"
grep "CREATE TABLE" database/schema_atual_producao.sql | sed 's/CREATE TABLE public\./- /' | sed 's/ (.*//'

echo ""
echo "✅ Processo concluído!"
