const https = require('https');
const http = require('http');

async function testAPI() {
    console.log('🧪 Testando APIs do Firebase...\n');

    try {
        // 1. Testar registro
        console.log('1️⃣ Testando registro...');
        const registerData = JSON.stringify({
            name: 'Usuário API Teste',
            email: 'apiteste@cfconline.com',
            password: 'senha123456',
            phone: '11777777777'
        });

        const registerOptions = {
            hostname: 'localhost',
            port: 3000,
            path: '/api/register',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': registerData.length
            }
        };

        const registerResponse = await makeRequest(registerOptions, registerData);
        console.log('✅ Registro:', registerResponse);

        // 2. Testar login
        console.log('\n2️⃣ Testando login...');
        const loginData = JSON.stringify({
            email: 'apiteste@cfconline.com',
            password: 'senha123456'
        });

        const loginOptions = {
            hostname: 'localhost',
            port: 3000,
            path: '/api/login',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': loginData.length
            }
        };

        const loginResponse = await makeRequest(loginOptions, loginData);
        console.log('✅ Login:', loginResponse);

        // 3. Testar perfil com token
        if (loginResponse.token) {
            console.log('\n3️⃣ Testando perfil...');
            const profileOptions = {
                hostname: 'localhost',
                port: 3000,
                path: '/api/profile',
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${loginResponse.token}`
                }
            };

            const profileResponse = await makeRequest(profileOptions);
            console.log('✅ Perfil:', profileResponse);
        }

        console.log('\n🎉 Teste das APIs concluído com sucesso!');

    } catch (error) {
        console.error('❌ Erro no teste:', error.message);
    }
}

function makeRequest(options, data = null) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let responseData = '';
            
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(responseData);
                    resolve(parsed);
                } catch (e) {
                    resolve(responseData);
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        if (data) {
            req.write(data);
        }
        
        req.end();
    });
}

// Executar teste
testAPI(); 