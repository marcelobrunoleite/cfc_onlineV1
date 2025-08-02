const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');
const winston = require('winston');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Configuração do Firebase
const firebaseService = require('./services/firebaseService');
const simulationService = require('./services/simulationService');
const app = express();

// Configuração de logs
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

// Middleware de segurança
app.use(helmet());
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? 'https://seu-dominio.com' : '*',
    credentials: true
}));

// Limite de requisições
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100 // limite de 100 requisições por IP
});
app.use(limiter);

// Compressão de resposta
app.use(compression());

// Logs de acesso
app.use(morgan('combined', {
    stream: fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
}));

// Middleware para parsear JSON
app.use(express.json());

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido' });
        }
        req.user = user;
        next();
    });
};

// Rotas da API - IMPLEMENTADAS COM FIREBASE
app.post('/api/register', async (req, res) => {
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

        // Criar usuário com Firebase
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

app.post('/api/login', async (req, res) => {
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

// Rota protegida de exemplo
app.get('/api/profile', authenticateToken, async (req, res) => {
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

// Rotas de Simulados
app.post('/api/simulations', authenticateToken, async (req, res) => {
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

app.get('/api/simulations', authenticateToken, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const simulations = await simulationService.getUserSimulations(req.user.userId, limit);
        
        res.json(simulations);
    } catch (error) {
        logger.error('Erro ao buscar simulados:', error);
        res.status(500).json({ error: `Erro ao buscar simulados: ${error.message}` });
    }
});

app.get('/api/simulations/statistics', authenticateToken, async (req, res) => {
    try {
        const statistics = await simulationService.getUserStatistics(req.user.userId);
        
        res.json(statistics);
    } catch (error) {
        logger.error('Erro ao buscar estatísticas:', error);
        res.status(500).json({ error: `Erro ao buscar estatísticas: ${error.message}` });
    }
});

app.get('/api/simulations/ranking', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;
        const ranking = await simulationService.getGlobalRanking(limit);
        
        res.json(ranking);
    } catch (error) {
        logger.error('Erro ao buscar ranking:', error);
        res.status(500).json({ error: `Erro ao buscar ranking: ${error.message}` });
    }
});

app.get('/api/simulations/:id', authenticateToken, async (req, res) => {
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

// Tratamento de erros
app.use((err, req, res, next) => {
    logger.error('Erro não tratado:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    logger.info(`Servidor rodando na porta ${PORT}`);
}); 