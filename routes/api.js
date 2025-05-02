const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const authenticateToken = require('../middleware/auth');
const upload = require('../middleware/upload');

const prisma = new PrismaClient();

// Rotas de Questões
router.get('/questions', authenticateToken, async (req, res) => {
    try {
        const questions = await prisma.question.findMany();
        res.json(questions);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar questões' });
    }
});

router.post('/questions', authenticateToken, async (req, res) => {
    try {
        const { tema, pergunta, alternativas, resposta_correta, explicacao, dificuldade } = req.body;
        const question = await prisma.question.create({
            data: {
                tema,
                pergunta,
                alternativas,
                resposta_correta,
                explicacao,
                dificuldade
            }
        });
        res.status(201).json(question);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar questão' });
    }
});

// Rotas de Cursos
router.get('/courses', async (req, res) => {
    try {
        const courses = await prisma.course.findMany({
            include: {
                author: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar cursos' });
    }
});

router.post('/courses', authenticateToken, async (req, res) => {
    try {
        const { title, description, price } = req.body;
        const course = await prisma.course.create({
            data: {
                title,
                description,
                price,
                authorId: req.user.userId
            }
        });
        res.status(201).json(course);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar curso' });
    }
});

// Rotas de Ranking
router.get('/ranking', async (req, res) => {
    try {
        const ranking = await prisma.testResult.groupBy({
            by: ['userId'],
            _count: {
                correct: true
            },
            where: {
                correct: true
            },
            orderBy: {
                _count: {
                    correct: 'desc'
                }
            },
            take: 10
        });

        const rankingWithUsers = await Promise.all(
            ranking.map(async (rank) => {
                const user = await prisma.user.findUnique({
                    where: { id: rank.userId },
                    select: { name: true }
                });
                return {
                    name: user.name,
                    score: rank._count.correct
                };
            })
        );

        res.json(rankingWithUsers);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar ranking' });
    }
});

// Rotas de Resultados de Testes
router.post('/test-results', authenticateToken, async (req, res) => {
    try {
        const { questionId, answer, correct } = req.body;
        const result = await prisma.testResult.create({
            data: {
                userId: req.user.userId,
                questionId,
                answer,
                correct
            }
        });
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao salvar resultado' });
    }
});

module.exports = router; 