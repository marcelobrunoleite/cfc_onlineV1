const simulationService = require('./services/simulationService');

async function testSimulations() {
    console.log('🧪 Testando funcionalidades de simulados...\n');

    try {
        const userId = 'c3W2EpWuQbVXtQHqNuy3QQOTUv72'; // ID do usuário teste

        // 1. Testar salvamento de simulado
        console.log('1️⃣ Salvando resultado de simulado...');
        const simulationData = {
            title: 'Simulado de Legislação',
            questions: ['Q001', 'Q002', 'Q003', 'Q004', 'Q005'],
            answers: {
                'Q001': 'a',
                'Q002': 'c',
                'Q003': 'b',
                'Q004': 'd',
                'Q005': 'a'
            },
            correctAnswers: 4,
            totalQuestions: 5,
            score: 80,
            percentage: 80,
            timeSpent: 1200 // 20 minutos
        };

        const savedSimulation = await simulationService.saveSimulationResult(userId, simulationData);
        console.log('✅ Simulado salvo:', savedSimulation.id);

        // 2. Testar busca de simulados do usuário
        console.log('\n2️⃣ Buscando simulados do usuário...');
        const userSimulations = await simulationService.getUserSimulations(userId, 5);
        console.log(`✅ Encontrados ${userSimulations.length} simulados`);

        // 3. Testar estatísticas do usuário
        console.log('\n3️⃣ Buscando estatísticas do usuário...');
        const statistics = await simulationService.getUserStatistics(userId);
        console.log('✅ Estatísticas:', statistics);

        // 4. Testar ranking global
        console.log('\n4️⃣ Buscando ranking global...');
        const ranking = await simulationService.getGlobalRanking(10);
        console.log(`✅ Ranking com ${ranking.length} posições`);

        // 5. Testar busca de simulado específico
        if (savedSimulation.id) {
            console.log('\n5️⃣ Buscando simulado específico...');
            const specificSimulation = await simulationService.getSimulation(savedSimulation.id);
            console.log('✅ Simulado encontrado:', specificSimulation.title);
        }

        console.log('\n🎉 Teste de simulados concluído com sucesso!');
        console.log('📝 Para testar as APIs REST, use:');
        console.log('   - POST /api/simulations (salvar simulado)');
        console.log('   - GET /api/simulations (listar simulados)');
        console.log('   - GET /api/simulations/statistics (estatísticas)');
        console.log('   - GET /api/simulations/ranking (ranking global)');

    } catch (error) {
        console.error('❌ Erro no teste:', error.message);
        console.log('\n🔧 Verifique:');
        console.log('   - Configuração do Firebase');
        console.log('   - Regras do Firestore');
        console.log('   - Conexão com internet');
    }
}

// Executar teste
testSimulations(); 