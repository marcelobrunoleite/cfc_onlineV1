#!/usr/bin/env node

/**
 * Script de Migração para Firebase Functions
 * 
 * Este script ajuda a migrar do servidor Express.js para Firebase Functions
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando migração para Firebase Functions...\n');

// Verificar se Firebase CLI está instalado
function checkFirebaseCLI() {
    try {
        require('child_process').execSync('firebase --version', { stdio: 'ignore' });
        console.log('✅ Firebase CLI encontrado');
        return true;
    } catch (error) {
        console.log('❌ Firebase CLI não encontrado');
        console.log('📦 Instale com: npm install -g firebase-tools');
        return false;
    }
}

// Verificar estrutura atual
function checkCurrentStructure() {
    const requiredFiles = [
        'server.js',
        'services/firebaseService.js',
        'services/simulationService.js',
        'config/firebase.js'
    ];

    console.log('📁 Verificando estrutura atual...');
    
    requiredFiles.forEach(file => {
        if (fs.existsSync(file)) {
            console.log(`✅ ${file}`);
        } else {
            console.log(`❌ ${file} não encontrado`);
        }
    });
}

// Criar estrutura do Firebase Functions
function createFunctionsStructure() {
    console.log('\n🏗️ Criando estrutura do Firebase Functions...');
    
    const functionsDir = 'functions';
    
    if (!fs.existsSync(functionsDir)) {
        fs.mkdirSync(functionsDir);
        console.log('✅ Diretório functions criado');
    }
    
    if (!fs.existsSync(path.join(functionsDir, 'services'))) {
        fs.mkdirSync(path.join(functionsDir, 'services'));
        console.log('✅ Diretório services criado');
    }
}

// Verificar se já existe firebase.json
function checkFirebaseConfig() {
    if (fs.existsSync('firebase.json')) {
        console.log('✅ firebase.json encontrado');
        return true;
    } else {
        console.log('❌ firebase.json não encontrado');
        console.log('💡 Execute: firebase init');
        return false;
    }
}

// Mostrar próximos passos
function showNextSteps() {
    console.log('\n📋 Próximos Passos:');
    console.log('1. Execute: firebase login');
    console.log('2. Execute: firebase init functions');
    console.log('3. Execute: cd functions && npm install');
    console.log('4. Configure as variáveis de ambiente em functions/env.example');
    console.log('5. Execute: firebase emulators:start --only functions');
    console.log('6. Teste as funções localmente');
    console.log('7. Execute: firebase deploy --only functions');
}

// Verificar dependências
function checkDependencies() {
    console.log('\n📦 Verificando dependências...');
    
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const requiredDeps = [
        'firebase',
        'express',
        'cors',
        'jsonwebtoken',
        'bcryptjs'
    ];
    
    requiredDeps.forEach(dep => {
        if (packageJson.dependencies[dep]) {
            console.log(`✅ ${dep}: ${packageJson.dependencies[dep]}`);
        } else {
            console.log(`❌ ${dep} não encontrado`);
        }
    });
}

// Mostrar diferenças principais
function showKeyDifferences() {
    console.log('\n🔄 Principais Diferenças:');
    console.log('Express.js → Firebase Functions');
    console.log('├── server.js → functions/index.js');
    console.log('├── firebase SDK → firebase-admin');
    console.log('├── app.listen() → exports.api');
    console.log('├── CORS manual → CORS wrapper');
    console.log('└── Variáveis de ambiente → Firebase Config');
}

// Executar verificações
function main() {
    console.log('🔍 Verificando ambiente...\n');
    
    const hasFirebaseCLI = checkFirebaseCLI();
    checkCurrentStructure();
    checkDependencies();
    const hasFirebaseConfig = checkFirebaseConfig();
    
    if (hasFirebaseCLI && hasFirebaseConfig) {
        createFunctionsStructure();
        showKeyDifferences();
        showNextSteps();
        
        console.log('\n🎉 Migração preparada!');
        console.log('📚 Consulte functions/README.md para detalhes completos');
    } else {
        console.log('\n⚠️  Resolva os problemas acima antes de continuar');
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    main();
}

module.exports = {
    checkFirebaseCLI,
    checkCurrentStructure,
    createFunctionsStructure,
    checkFirebaseConfig,
    showNextSteps
}; 