#!/bin/bash

echo "🚀 Iniciando deploy do backend híbrido..."

# Verificar se o Firebase CLI está instalado
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI não encontrado. Instale com: npm install -g firebase-tools"
    exit 1
fi

# Verificar se está logado no Firebase
if ! firebase projects:list &> /dev/null; then
    echo "❌ Não está logado no Firebase. Execute: firebase login"
    exit 1
fi

echo "📦 Instalando dependências..."
npm install

echo "🔍 Executando linting..."
npm run lint

echo "🏗️ Fazendo build do projeto..."
npm run build

echo "🔥 Deployando para Firebase Hosting..."
firebase deploy --only hosting

echo "✅ Deploy concluído!"
echo "🌐 Seu aplicativo está disponível em: https://cfconline-a34ad.web.app" 