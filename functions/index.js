const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });
const express = require('express');
const jwt = require('jsonwebtoken');
const winston = require('winston');

// Inicializar Firebase Admin
admin.initializeApp();

// Configuração do logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console({
            format: winston.format.simple()
        })
    ]
});

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'default-secret-key', (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido' });
        }
        req.user = user;
        next();
    });
};

// Serviços
const firebaseService = require('./services/firebaseService');
const simulationService = require('./services/simulationService');

// Express app
const app = express();
app.use(express.json());

// ===== ROTAS DE AUTENTICAÇÃO =====

// Registro de usuário
app.post('/api/register', async (req, res) => {
    cors(req, res, async () => {
        try {
            const { name, email, password, phone, whatsapp } = req.body;
            
            // Validações
            if (!name || !email || !password) {
                return res.status(400).json({ error: 'Campos obrigatórios não preenchidos' });
            }

            // Verificar se o email já existe
            const emailExists = await firebaseService.checkEmailExists(email);
            if (emailExists) {
                return res.status(400).json({ error: 'Email já cadastrado' });
            }

            // Criar usuário
            const userData = {
                name,
                phone: phone || '',
                whatsapp: whatsapp || phone || '',
                role: 'user'
            };

            const user = await firebaseService.registerUser(email, password, userData);

            // Gerar token JWT
            const token = jwt.sign(
                { userId: user.uid, email: user.email, role: user.role },
                process.env.JWT_SECRET || 'default-secret-key',
                { expiresIn: '24h' }
            );

            res.status(201).json({
                message: 'Usuário criado com sucesso',
                token,
                user: {
                    id: user.uid,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            logger.error('Erro no registro:', error);
            res.status(500).json({ error: `Erro ao criar usuário: ${error.message}` });
        }
    });
});

// Login
app.post('/api/login', async (req, res) => {
    cors(req, res, async () => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: 'Email e senha são obrigatórios' });
            }

            // Autenticar com Firebase
            const user = await firebaseService.loginUser(email, password);

            // Gerar token JWT
            const token = jwt.sign(
                { userId: user.uid, email: user.email, role: user.role },
                process.env.JWT_SECRET || 'default-secret-key',
                { expiresIn: '24h' }
            );

            res.json({
                token,
                user: {
                    id: user.uid,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            logger.error('Erro no login:', error);
            res.status(401).json({ error: `Erro ao fazer login: ${error.message}` });
        }
    });
});

// ===== ROTAS PROTEGIDAS =====

// Perfil do usuário
app.get('/api/profile', authenticateToken, async (req, res) => {
    cors(req, res, async () => {
        try {
            const userProfile = await firebaseService.getUserProfile(req.user.userId);

            res.json({
                id: req.user.userId,
                email: req.user.email,
                role: req.user.role,
                ...userProfile
            });
        } catch (error) {
            logger.error('Erro ao buscar perfil:', error);
            res.status(500).json({ error: `Erro ao buscar perfil: ${error.message}` });
        }
    });
});

// ===== ROTAS DE SIMULAÇÕES =====

// Salvar simulado
app.post('/api/simulations', authenticateToken, async (req, res) => {
    cors(req, res, async () => {
        try {
            const simulationData = req.body;
            const simulation = await simulationService.saveSimulationResult(req.user.userId, simulationData);
            
            res.status(201).json({
                message: 'Simulado salvo com sucesso',
                simulation
            });
        } catch (error) {
            logger.error('Erro ao salvar simulado:', error);
            res.status(500).json({ error: `Erro ao salvar simulado: ${error.message}` });
        }
    });
});

// Buscar simulados do usuário
app.get('/api/simulations', authenticateToken, async (req, res) => {
    cors(req, res, async () => {
        try {
            const limit = parseInt(req.query.limit) || 10;
            const simulations = await simulationService.getUserSimulations(req.user.userId, limit);
            
            res.json(simulations);
        } catch (error) {
            logger.error('Erro ao buscar simulados:', error);
            res.status(500).json({ error: `Erro ao buscar simulados: ${error.message}` });
        }
    });
});

// Estatísticas do usuário
app.get('/api/simulations/statistics', authenticateToken, async (req, res) => {
    cors(req, res, async () => {
        try {
            const statistics = await simulationService.getUserStatistics(req.user.userId);
            
            res.json(statistics);
        } catch (error) {
            logger.error('Erro ao buscar estatísticas:', error);
            res.status(500).json({ error: `Erro ao buscar estatísticas: ${error.message}` });
        }
    });
});

// Ranking global
app.get('/api/simulations/ranking', async (req, res) => {
    cors(req, res, async () => {
        try {
            const limit = parseInt(req.query.limit) || 20;
            const ranking = await simulationService.getGlobalRanking(limit);
            
            res.json(ranking);
        } catch (error) {
            logger.error('Erro ao buscar ranking:', error);
            res.status(500).json({ error: `Erro ao buscar ranking: ${error.message}` });
        }
    });
});

// Buscar simulado específico
app.get('/api/simulations/:id', authenticateToken, async (req, res) => {
    cors(req, res, async () => {
        try {
            const simulation = await simulationService.getSimulation(req.params.id);
            
            // Verificar se o usuário é dono do simulado
            if (simulation.userId !== req.user.userId) {
                return res.status(403).json({ error: 'Acesso negado' });
            }
            
            res.json(simulation);
        } catch (error) {
            logger.error('Erro ao buscar simulado:', error);
            res.status(500).json({ error: `Erro ao buscar simulado: ${error.message}` });
        }
    });
});

// ===== ROTA DE SAÚDE =====
app.get('/api/health', (req, res) => {
    cors(req, res, () => {
        res.json({ 
            status: 'OK', 
            timestamp: new Date().toISOString(),
            service: 'Firebase Functions API'
        });
    });
});

// Tratamento de erros
app.use((err, req, res, next) => {
    logger.error('Erro não tratado:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
});

// Exportar como Firebase Function
exports.api = functions.https.onRequest(app); 