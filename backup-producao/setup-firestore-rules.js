const { db } = require('./config/firebase');
const fs = require('fs');
const path = require('path');

async function setupFirestoreRules() {
    console.log('🔒 Configurando regras de segurança do Firestore...\n');

    try {
        // Ler as regras do arquivo
        const rulesPath = path.join(__dirname, 'firestore-rules.rules');
        const rules = fs.readFileSync(rulesPath, 'utf8');

        console.log('📋 Regras de segurança carregadas:');
        console.log('   - Acesso total para desenvolvimento');
        console.log('   - Proteção para dados de usuários');
        console.log('   - Acesso público para cursos, placas e questões');
        console.log('   - Proteção para progresso e pontuações\n');

        console.log('⚠️ IMPORTANTE: Para aplicar as regras, você precisa:');
        console.log('   1. Ir ao console do Firebase');
        console.log('   2. Navegar para Firestore Database');
        console.log('   3. Clicar na aba "Regras"');
        console.log('   4. Copiar o conteúdo do arquivo firestore-rules.rules');
        console.log('   5. Colar nas regras e clicar "Publicar"\n');

        console.log('📄 Conteúdo das regras:');
        console.log('='.repeat(50));
        console.log(rules);
        console.log('='.repeat(50));

        console.log('\n✅ Configuração das regras concluída!');
        console.log('🔧 Após aplicar as regras, execute novamente:');
        console.log('   node setup-firestore.js');

    } catch (error) {
        console.error('❌ Erro na configuração das regras:', error.message);
    }
}

// Executar configuração
setupFirestoreRules(); 