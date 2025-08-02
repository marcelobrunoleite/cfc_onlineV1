const { 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc,
    collection,
    addDoc,
    query,
    where,
    getDocs,
    orderBy,
    limit
} = require('firebase/firestore');
const { db } = require('../config/firebase');

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
                completedAt: new Date(),
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const docRef = await addDoc(collection(db, 'user_simulations'), simulation);
            
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
            const q = query(
                collection(db, 'user_simulations'),
                where('userId', '==', userId),
                orderBy('completedAt', 'desc'),
                limit(limit)
            );

            const querySnapshot = await getDocs(q);
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
            const q = query(
                collection(db, 'user_simulations'),
                where('userId', '==', userId)
            );

            const querySnapshot = await getDocs(q);
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
                correctAnswers,
                accuracyRate: totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0
            };
        } catch (error) {
            throw new Error(`Erro ao buscar estatísticas: ${error.message}`);
        }
    }

    // Buscar ranking geral
    async getGlobalRanking(limit = 20) {
        try {
            const q = query(
                collection(db, 'user_simulations'),
                orderBy('score', 'desc'),
                limit(limit)
            );

            const querySnapshot = await getDocs(q);
            const ranking = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                ranking.push({
                    id: doc.id,
                    userId: data.userId,
                    score: data.score,
                    percentage: data.percentage,
                    completedAt: data.completedAt,
                    title: data.title
                });
            });

            return ranking;
        } catch (error) {
            throw new Error(`Erro ao buscar ranking: ${error.message}`);
        }
    }

    // Buscar simulado específico
    async getSimulation(simulationId) {
        try {
            const docRef = doc(db, 'user_simulations', simulationId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return {
                    id: docSnap.id,
                    ...docSnap.data()
                };
            } else {
                throw new Error('Simulado não encontrado');
            }
        } catch (error) {
            throw new Error(`Erro ao buscar simulado: ${error.message}`);
        }
    }

    // Atualizar simulado
    async updateSimulation(simulationId, updateData) {
        try {
            const docRef = doc(db, 'user_simulations', simulationId);
            await updateDoc(docRef, {
                ...updateData,
                updatedAt: new Date()
            });

            return { message: 'Simulado atualizado com sucesso' };
        } catch (error) {
            throw new Error(`Erro ao atualizar simulado: ${error.message}`);
        }
    }

    // Deletar simulado
    async deleteSimulation(simulationId) {
        try {
            const docRef = doc(db, 'user_simulations', simulationId);
            await deleteDoc(docRef);

            return { message: 'Simulado deletado com sucesso' };
        } catch (error) {
            throw new Error(`Erro ao deletar simulado: ${error.message}`);
        }
    }
}

module.exports = new SimulationService(); 