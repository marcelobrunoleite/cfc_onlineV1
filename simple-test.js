const firebaseService = require('./services/firebaseService');

async function simpleTest() {
    console.log('🧪 Teste simples do Firebase...\n');

    try {
        // Testar registro
        console.log('1️⃣ Registrando usuário...');
        const userData = {
            name: 'Usuário Simples',
            phone: '11666666666',
            whatsapp: '11666666666',
            role: 'user'
        };

        const email = 'simples@cfconline.com';
        const password = 'senha123456';

        try {
            const newUser = await firebaseService.registerUser(email, password, userData);
            console.log('✅ Usuário registrado:', newUser);
        } catch (error) {
            console.log('⚠️ Erro no registro:', error.message);
        }

        // Testar login
        console.log('\n2️⃣ Testando login...');
        try {
            const loginUser = await firebaseService.loginUser(email, password);
            console.log('✅ Login realizado:', loginUser);
        } catch (error) {
            console.log('❌ Erro no login:', error.message);
        }

        // Testar verificação de email
        console.log('\n3️⃣ Verificando email...');
        try {
            const emailExists = await firebaseService.checkEmailExists(email);
            console.log(`✅ Email "${email}" existe: ${emailExists}`);
        } catch (error) {
            console.log('❌ Erro na verificação:', error.message);
        }

    } catch (error) {
        console.error('❌ Erro geral:', error.message);
    }
}

simpleTest(); 