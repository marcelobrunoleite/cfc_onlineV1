const { db } = require('./config/firebase');
const { 
    collection, 
    doc, 
    setDoc, 
    addDoc,
    getDocs,
    query,
    where 
} = require('firebase/firestore');

// Importar dados existentes
const coursesData = require('./data/courses.json');
const placasData = require('./data/placas.json');
const transitoData = require('./data/transito.json');

async function setupFirestoreCollections() {
    console.log('🚀 Iniciando configuração das coleções do Firestore...\n');

    try {
        // 1. Coleção: users (já configurada pelo firebaseService)
        console.log('1️⃣ Verificando coleção "users"...');
        console.log('✅ Coleção "users" será criada automaticamente quando necessário\n');

        // 2. Coleção: courses
        console.log('2️⃣ Configurando coleção "courses"...');
        for (const course of coursesData.courses) {
            try {
                await setDoc(doc(db, 'courses', course.id), {
                    ...course,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
                console.log(`   ✅ Curso "${course.title}" adicionado`);
            } catch (error) {
                console.log(`   ⚠️ Erro ao adicionar curso "${course.title}": ${error.message}`);
            }
        }
        console.log('✅ Coleção "courses" configurada\n');

        // 3. Coleção: placas
        console.log('3️⃣ Configurando coleção "placas"...');
        
        // Adicionar placas de regulamentação
        for (const placa of placasData.regulamentacao) {
            try {
                await setDoc(doc(db, 'placas', placa.id), {
                    ...placa,
                    categoria: 'regulamentacao',
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
                console.log(`   ✅ Placa "${placa.nome}" (regulamentação) adicionada`);
            } catch (error) {
                console.log(`   ⚠️ Erro ao adicionar placa "${placa.nome}": ${error.message}`);
            }
        }

        // Adicionar placas de advertência
        for (const placa of placasData.advertencia) {
            try {
                await setDoc(doc(db, 'placas', placa.id), {
                    ...placa,
                    categoria: 'advertencia',
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
                console.log(`   ✅ Placa "${placa.nome}" (advertência) adicionada`);
            } catch (error) {
                console.log(`   ⚠️ Erro ao adicionar placa "${placa.nome}": ${error.message}`);
            }
        }
        console.log('✅ Coleção "placas" configurada\n');

        // 4. Coleção: questions
        console.log('4️⃣ Configurando coleção "questions"...');
        for (const question of transitoData) {
            try {
                await setDoc(doc(db, 'questions', question.id), {
                    ...question,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
                console.log(`   ✅ Questão "${question.id}" adicionada`);
            } catch (error) {
                console.log(`   ⚠️ Erro ao adicionar questão "${question.id}": ${error.message}`);
            }
        }
        console.log('✅ Coleção "questions" configurada\n');

        // 5. Coleção: user_progress (para acompanhar progresso dos usuários)
        console.log('5️⃣ Verificando coleção "user_progress"...');
        console.log('✅ Coleção "user_progress" será criada automaticamente quando necessário\n');

        // 6. Coleção: user_scores (para pontuações e rankings)
        console.log('6️⃣ Verificando coleção "user_scores"...');
        console.log('✅ Coleção "user_scores" será criada automaticamente quando necessário\n');

        // 7. Coleção: flashcards
        console.log('7️⃣ Verificando coleção "flashcards"...');
        console.log('✅ Coleção "flashcards" será criada automaticamente quando necessário\n');

        console.log('🎉 Configuração das coleções concluída com sucesso!');
        console.log('\n📊 Resumo das coleções criadas:');
        console.log('   - users (criada automaticamente)');
        console.log('   - courses (dados importados)');
        console.log('   - placas (dados importados)');
        console.log('   - questions (dados importados)');
        console.log('   - user_progress (criada automaticamente)');
        console.log('   - user_scores (criada automaticamente)');
        console.log('   - flashcards (criada automaticamente)');

    } catch (error) {
        console.error('❌ Erro na configuração:', error.message);
        console.log('\n🔧 Verifique:');
        console.log('   - Conexão com Firebase');
        console.log('   - Permissões do Firestore');
        console.log('   - Regras de segurança');
    }
}

// Executar configuração
setupFirestoreCollections(); 