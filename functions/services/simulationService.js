const admin = require('firebase-admin');

// Usar Firebase Admin SDK
const db = admin.firestore();

class SimulationService {
    // Salvar resultado de um simulado
    async saveSimulationResult(userId, simulationData) {
        try {
            const simulation = {
                userId,
                title: simulationData.title || 'Simulado',
                questions: simulationData.questions || [],
                answers: simulationData.answers || {},
                correctAnswers: simulationData.correctAnswers || 0,
                totalQuestions: simulationData.totalQuestions || 0,
                score: simulationData.score || 0,
                percentage: simulationData.percentage || 0,
                timeSpent: simulationData.timeSpent || 0, // em segundos
                completedAt: admin.firestore.FieldValue.serverTimestamp(),
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            };

            const docRef = await db.collection('user_simulations').add(simulation);
            
            return {
                id: docRef.id,
                ...simulation
            };
        } catch (error) {
            throw new Error(`Erro ao salvar simulado: ${error.message}`);
        }
    }

    // Buscar simulados de um usuário
    async getUserSimulations(userId, limit = 10) {
        try {
            const querySnapshot = await db.collection('user_simulations')
                .where('userId', '==', userId)
                .orderBy('completedAt', 'desc')
                .limit(limit)
                .get();

            const simulations = [];

            querySnapshot.forEach((doc) => {
                simulations.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            return simulations;
        } catch (error) {
            throw new Error(`Erro ao buscar simulados: ${error.message}`);
        }
    }

    // Buscar estatísticas do usuário
    async getUserStatistics(userId) {
        try {
            const querySnapshot = await db.collection('user_simulations')
                .where('userId', '==', userId)
                .get();

            const simulations = [];

            querySnapshot.forEach((doc) => {
                simulations.push(doc.data());
            });

            if (simulations.length === 0) {
                return {
                    totalSimulations: 0,
                    averageScore: 0,
                    bestScore: 0,
                    totalTimeSpent: 0,
                    totalQuestions: 0,
                    correctAnswers: 0
                };
            }

            const totalSimulations = simulations.length;
            const totalScore = simulations.reduce((sum, sim) => sum + sim.score, 0);
            const averageScore = Math.round(totalScore / totalSimulations);
            const bestScore = Math.max(...simulations.map(sim => sim.score));
            const totalTimeSpent = simulations.reduce((sum, sim) => sum + (sim.timeSpent || 0), 0);
            const totalQuestions = simulations.reduce((sum, sim) => sum + sim.totalQuestions, 0);
            const correctAnswers = simulations.reduce((sum, sim) => sum + sim.correctAnswers, 0);

            return {
                totalSimulations,
                averageScore,
                bestScore,
                totalTimeSpent,
                totalQuestions,
                correctAnswers
            };
        } catch (error) {
            throw new Error(`Erro ao buscar estatísticas: ${error.message}`);
        }
    }

    // Buscar ranking global
    async getGlobalRanking(limit = 20) {
        try {
            const querySnapshot = await db.collection('user_simulations')
                .orderBy('score', 'desc')
                .orderBy('completedAt', 'desc')
                .limit(limit)
                .get();

            const simulations = [];

            querySnapshot.forEach((doc) => {
                simulations.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            // Agrupar por usuário e pegar melhor pontuação
            const userScores = {};
            simulations.forEach(sim => {
                if (!userScores[sim.userId] || sim.score > userScores[sim.userId].score) {
                    userScores[sim.userId] = {
                        userId: sim.userId,
                        score: sim.score,
                        percentage: sim.percentage,
                        completedAt: sim.completedAt
                    };
                }
            });

            // Converter para array e ordenar
            const ranking = Object.values(userScores)
                .sort((a, b) => b.score - a.score)
                .slice(0, limit);

            return ranking;
        } catch (error) {
            throw new Error(`Erro ao buscar ranking: ${error.message}`);
        }
    }

    // Buscar simulado específico
    async getSimulation(simulationId) {
        try {
            const doc = await db.collection('user_simulations').doc(simulationId).get();
            
            if (!doc.exists) {
                throw new Error('Simulado não encontrado');
            }

            return {
                id: doc.id,
                ...doc.data()
            };
        } catch (error) {
            throw new Error(`Erro ao buscar simulado: ${error.message}`);
        }
    }

    // Atualizar simulado
    async updateSimulation(simulationId, updateData) {
        try {
            await db.collection('user_simulations').doc(simulationId).update({
                ...updateData,
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });

            return { message: 'Simulado atualizado com sucesso' };
        } catch (error) {
            throw new Error(`Erro ao atualizar simulado: ${error.message}`);
        }
    }

    // Deletar simulado
    async deleteSimulation(simulationId) {
        try {
            await db.collection('user_simulations').doc(simulationId).delete();
            return { message: 'Simulado deletado com sucesso' };
        } catch (error) {
            throw new Error(`Erro ao deletar simulado: ${error.message}`);
        }
    }
}

module.exports = new SimulationService(); 