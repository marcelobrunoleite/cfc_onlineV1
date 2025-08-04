# Script de Deploy para Backend Híbrido (Windows PowerShell)

Write-Host "🚀 Iniciando deploy do backend híbrido..." -ForegroundColor Green

# Verificar se o Firebase CLI está instalado
try {
    firebase --version | Out-Null
    Write-Host "✅ Firebase CLI encontrado" -ForegroundColor Green
} catch {
    Write-Host "❌ Firebase CLI não encontrado. Instale com: npm install -g firebase-tools" -ForegroundColor Red
    exit 1
}

# Verificar se está logado no Firebase
try {
    firebase projects:list | Out-Null
    Write-Host "✅ Logado no Firebase" -ForegroundColor Green
} catch {
    Write-Host "❌ Não está logado no Firebase. Execute: firebase login" -ForegroundColor Red
    exit 1
}

Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
npm install

Write-Host "🔍 Executando linting..." -ForegroundColor Yellow
npm run lint

Write-Host "🏗️ Fazendo build do projeto..." -ForegroundColor Yellow
npm run build

Write-Host "🔥 Deployando para Firebase Hosting..." -ForegroundColor Yellow
firebase deploy --only hosting

Write-Host "✅ Deploy concluído!" -ForegroundColor Green
Write-Host "🌐 Seu aplicativo está disponível em: https://cfconline-a34ad.web.app" -ForegroundColor Cyan 