#!/bin/bash

# Script de Deploy para Firebase Hosting
# Aplicativo de Trânsito - CFC Online

echo "🚀 Iniciando deploy para Firebase Hosting..."

# Verificar se Firebase CLI está instalado
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI não encontrado"
    echo "📦 Instale com: npm install -g firebase-tools"
    exit 1
fi

# Verificar se está logado no Firebase
if ! firebase projects:list &> /dev/null; then
    echo "🔐 Faça login no Firebase primeiro:"
    echo "firebase login"
    exit 1
fi

# Verificar se está no projeto correto
CURRENT_PROJECT=$(firebase use --json | grep -o '"current":"[^"]*"' | cut -d'"' -f4)
if [ "$CURRENT_PROJECT" != "cfconline-a34ad" ]; then
    echo "🔄 Configurando projeto Firebase..."
    firebase use cfconline-a34ad
fi

echo "📋 Verificando arquivos..."

# Verificar se os arquivos principais existem
if [ ! -f "index.html" ]; then
    echo "❌ index.html não encontrado"
    exit 1
fi

if [ ! -f "firebase.json" ]; then
    echo "❌ firebase.json não encontrado"
    exit 1
fi

echo "✅ Arquivos principais encontrados"

# Limpar cache se necessário
if [ "$1" = "--clean" ]; then
    echo "🧹 Limpando cache..."
    firebase hosting:clear
fi

# Deploy do hosting
echo "🌐 Fazendo deploy do hosting..."
firebase deploy --only hosting

if [ $? -eq 0 ]; then
    echo "✅ Deploy do hosting concluído com sucesso!"
    echo "🌍 Aplicação disponível em: https://cfconline-a34ad.web.app"
    echo "🔗 URL alternativa: https://cfconline-a34ad.firebaseapp.com"
else
    echo "❌ Erro no deploy do hosting"
    exit 1
fi

# Deploy das functions (opcional)
if [ "$1" = "--functions" ] || [ "$2" = "--functions" ]; then
    echo "⚡ Fazendo deploy das functions..."
    firebase deploy --only functions
    
    if [ $? -eq 0 ]; then
        echo "✅ Deploy das functions concluído!"
    else
        echo "❌ Erro no deploy das functions"
    fi
fi

echo "🎉 Deploy concluído!"
echo "📊 Para ver logs: firebase hosting:log"
echo "🔧 Para configurar domínio customizado: firebase hosting:channel:deploy" 