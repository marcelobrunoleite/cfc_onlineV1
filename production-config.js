// Configuração para produção do backend híbrido
module.exports = {
  // Configurações do servidor
  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || '0.0.0.0'
  },

  // Configurações do Firebase
  firebase: {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
  },

  // Configurações de segurança
  security: {
    jwtSecret: process.env.JWT_SECRET,
    corsOrigin: process.env.CORS_ORIGIN || '*',
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: process.env.RATE_LIMIT_MAX || 100
    }
  },

  // Configurações de logs
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    filename: process.env.LOG_FILE || 'app.log'
  },

  // Configurações de ambiente
  environment: process.env.NODE_ENV || 'development',

  // URLs de produção
  urls: {
    frontend: process.env.FRONTEND_URL || 'https://cfconline-a34ad.web.app',
    api: process.env.API_URL || 'https://cfconline-a34ad.web.app/api'
  }
}; 