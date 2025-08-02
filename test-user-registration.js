const firebaseService = require('./services/firebaseService');

async function testUserRegistration() {
    console.log('🧪 Testando registro de usuário com Firebase...\n');

    try {
        // Dados do usuário teste
        const testUserData = {
            name: 'Usuário Teste',
            phone: '11999999999',
            whatsapp: '11999999999',
            role: 'user'
        };

        const testEmail = 'teste@cfconline.com';
        const testPassword = 'senha123456';

        console.log('📝 Dados do usuário teste:');
        console.log(`   Email: ${testEmail}`);
        console.log(`   Nome: ${testUserData.name}`);
        console.log(`   Telefone: ${testUserData.phone}`);
        console.log(`   Função: ${testUserData.role}\n`);

        // 1. Verificar se o email já existe
        console.log('1️⃣ Verificando se o email já existe...');
        const emailExists = await firebaseService.checkEmailExists(testEmail);
        console.log(`   Email "${testEmail}" existe: ${emailExists}`);

        if (emailExists) {
            console.log('   ⚠️ Email já existe, tentando fazer login...\n');
            
            // Tentar fazer login
            try {
                const user = await firebaseService.loginUser(testEmail, testPassword);
                console.log('✅ Login realizado com sucesso!');
                console.log(`   ID do usuário: ${user.uid}`);
                console.log(`   Nome: ${user.name}`);
                console.log(`   Email: ${user.email}`);
                console.log(`   Função: ${user.role}`);
            } catch (loginError) {
                console.log(`❌ Erro no login: ${loginError.message}`);
            }
        } else {
            console.log('   ✅ Email disponível para registro\n');

            // 2. Registrar novo usuário
            console.log('2️⃣ Registrando novo usuário...');
            try {
                const newUser = await firebaseService.registerUser(testEmail, testPassword, testUserData);
                console.log('✅ Usuário registrado com sucesso!');
                console.log(`   ID do usuário: ${newUser.uid}`);
                console.log(`   Nome: ${newUser.name}`);
                console.log(`   Email: ${newUser.email}`);
                console.log(`   Função: ${newUser.role}\n`);

                // 3. Testar login com o usuário recém-criado
                console.log('3️⃣ Testando login com usuário recém-criado...');
                const loginUser = await firebaseService.loginUser(testEmail, testPassword);
                console.log('✅ Login realizado com sucesso!');
                console.log(`   ID do usuário: ${loginUser.uid}`);
                console.log(`   Nome: ${loginUser.name}`);
                console.log(`   Email: ${loginUser.email}`);
                console.log(`   Função: ${loginUser.role}\n`);

                // 4. Testar busca de perfil
                console.log('4️⃣ Testando busca de perfil...');
                const userProfile = await firebaseService.getUserProfile(newUser.uid);
                console.log('✅ Perfil carregado com sucesso!');
                console.log(`   Nome: ${userProfile.name}`);
                console.log(`   Telefone: ${userProfile.phone}`);
                console.log(`   WhatsApp: ${userProfile.whatsapp}`);
                console.log(`   Função: ${userProfile.role}`);

            } catch (registerError) {
                console.log(`❌ Erro no registro: ${registerError.message}`);
            }
        }

        console.log('\n🎉 Teste de usuário concluído!');
        console.log('📝 Para testar as APIs REST, use:');
        console.log(`   curl -X POST http://localhost:3000/api/register`);
        console.log(`   curl -X POST http://localhost:3000/api/login`);
        console.log(`   curl -X GET http://localhost:3000/api/profile`);

    } catch (error) {
        console.error('❌ Erro no teste:', error.message);
        console.log('\n🔧 Verifique:');
        console.log('   - Configuração do Firebase');
        console.log('   - Regras do Firestore');
        console.log('   - Conexão com internet');
    }
}

// Executar teste
testUserRegistration(); 