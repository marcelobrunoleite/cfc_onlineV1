const fs = require('fs');
const path = require('path');

function testImagePaths() {
    console.log('🧪 Testando caminhos das imagens das placas...\n');

    try {
        // Carregar dados das placas
        const placasData = JSON.parse(fs.readFileSync('data/placas.json', 'utf8'));
        
        console.log('📊 Verificando imagens por categoria:\n');

        // Verificar placas de regulamentação
        console.log('1️⃣ Placas de Regulamentação:');
        placasData.regulamentacao.forEach(placa => {
            const imagePath = path.join(__dirname, placa.imagem);
            const exists = fs.existsSync(imagePath);
            console.log(`   ${exists ? '✅' : '❌'} ${placa.id}: ${placa.imagem} ${exists ? '(encontrada)' : '(NÃO ENCONTRADA)'}`);
        });

        console.log('\n2️⃣ Placas de Advertência:');
        placasData.advertencia.forEach(placa => {
            const imagePath = path.join(__dirname, placa.imagem);
            const exists = fs.existsSync(imagePath);
            console.log(`   ${exists ? '✅' : '❌'} ${placa.id}: ${placa.imagem} ${exists ? '(encontrada)' : '(NÃO ENCONTRADA)'}`);
        });

        console.log('\n3️⃣ Placas de Indicação:');
        placasData.indicacao.forEach(placa => {
            const imagePath = path.join(__dirname, placa.imagem);
            const exists = fs.existsSync(imagePath);
            console.log(`   ${exists ? '✅' : '❌'} ${placa.id}: ${placa.imagem} ${exists ? '(encontrada)' : '(NÃO ENCONTRADA)'}`);
        });

        // Verificar estrutura de pastas
        console.log('\n📁 Verificando estrutura de pastas:');
        const assetsPath = path.join(__dirname, 'assets/images/placas');
        const regulamentacaoPath = path.join(assetsPath, 'regulamentacao');
        const advertenciaPath = path.join(assetsPath, 'advertencia');

        console.log(`   ${fs.existsSync(assetsPath) ? '✅' : '❌'} assets/images/placas/`);
        console.log(`   ${fs.existsSync(regulamentacaoPath) ? '✅' : '❌'} assets/images/placas/regulamentacao/`);
        console.log(`   ${fs.existsSync(advertenciaPath) ? '✅' : '❌'} assets/images/placas/advertencia/`);

        // Listar arquivos na pasta de regulamentação
        if (fs.existsSync(regulamentacaoPath)) {
            const files = fs.readdirSync(regulamentacaoPath);
            console.log(`\n📄 Arquivos em regulamentacao/ (${files.length}):`);
            files.forEach(file => {
                console.log(`   📄 ${file}`);
            });
        }

        console.log('\n🎉 Teste de imagens concluído!');
        console.log('💡 Para corrigir problemas:');
        console.log('   1. Verifique se as imagens estão na pasta correta');
        console.log('   2. Verifique se os nomes dos arquivos estão corretos');
        console.log('   3. Verifique se o caminho no JSON está correto');

    } catch (error) {
        console.error('❌ Erro no teste:', error.message);
    }
}

// Executar teste
testImagePaths(); 