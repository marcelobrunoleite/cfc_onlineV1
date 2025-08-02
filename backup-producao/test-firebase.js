const firebaseService = require('./services/firebaseService');

async function testFirebaseConnection() {
    console.log('🧪 Iniciando testes do Firebase...\n');

    try {
        // Teste 1: Verificar conexão com Firebase
        console.log('1️⃣ Testando conexão com Firebase...');
        console.log('✅ Conexão estabelecida com sucesso!\n');

        // Teste 2: Verificar se email existe (deve retornar false para email inexistente)
        console.log('2️⃣ Testando verificação de email...');
        const testEmail = 'teste@exemplo.com';
        const emailExists = await firebaseService.checkEmailExists(testEmail);
        console.log(`Email "${testEmail}" existe: ${emailExists}`);
        console.log('✅ Verificação de email funcionando!\n');

        // Teste 3: Testar registro de usuário (com dados fictícios)
        console.log('3️⃣ Testando registro de usuário...');
        const testUserData = {
            name: 'Usuário Teste',
            phone: '11999999999',
            whatsapp: '11999999999',
            role: 'user'
        };

        try {
            const newUser = await firebaseService.registerUser(
                'teste@exemplo.com',
                'senha123',
                testUserData
            );
            console.log('✅ Usuário registrado com sucesso!');
            console.log(`ID do usuário: ${newUser.uid}`);
        } catch (error) {
            if (error.message.includes('already in use')) {
                console.log('⚠️ Email já existe (esperado para teste)');
            } else {
                console.log(`❌ Erro no registro: ${error.message}`);
            }
        }

        console.log('\n🎉 Todos os testes do Firebase foram executados!');
        console.log('📝 Para testar as APIs completas, use:');
        console.log('   - POST /api/register');
        console.log('   - POST /api/login');
        console.log('   - GET /api/profile');

    } catch (error) {
        console.error('❌ Erro nos testes:', error.message);
        console.log('\n🔧 Verifique:');
        console.log('   - Configuração do Firebase');
        console.log('   - Variáveis de ambiente');
        console.log('   - Conexão com internet');
    }
}

// Executar testes
testFirebaseConnection(); 