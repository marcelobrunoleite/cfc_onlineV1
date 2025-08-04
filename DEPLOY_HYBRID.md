# Deploy do Backend Híbrido (Express + Firebase)

Este projeto usa um backend híbrido com Express.js para a API e Firebase Authentication para autenticação.

## Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
# Configurações do Firebase
FIREBASE_API_KEY=AIzaSyCJyU2FPLLGLq8mpODbgHs811E8EkT3RBU
FIREBASE_AUTH_DOMAIN=cfconline-a34ad.firebaseapp.com
FIREBASE_PROJECT_ID=cfconline-a34ad
FIREBASE_STORAGE_BUCKET=cfconline-a34ad.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=990149263496
FIREBASE_APP_ID=1:990149263496:web:a71d6e7dc03265417a5f3d

# Configurações do JWT
JWT_SECRET=seu-jwt-secret-super-seguro-aqui

# Configurações do Servidor
PORT=3000
NODE_ENV=development
```

### 2. Instalação de Dependências

```bash
npm install
```

### 3. Desenvolvimento Local

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3000`

## Deploy

### Opção 1: Deploy Automático

```bash
chmod +x deploy-hybrid.sh
./deploy-hybrid.sh
```

### Opção 2: Deploy Manual

```bash
# Instalar dependências
npm install

# Executar linting
npm run lint

# Fazer build
npm run build

# Deploy para Firebase Hosting
firebase deploy --only hosting
```

## Estrutura do Backend

- `server.js` - Servidor Express principal
- `services/firebaseService.js` - Serviços do Firebase
- `services/simulationService.js` - Serviços de simulação
- `config/firebase.js` - Configuração do Firebase

## Rotas da API

- `POST /api/register` - Registro de usuário
- `POST /api/login` - Login de usuário
- `GET /api/profile` - Perfil do usuário (protegida)
- `POST /api/simulations` - Salvar resultado de simulado
- `GET /api/simulations` - Listar simulados do usuário
- `GET /api/simulations/statistics` - Estatísticas do usuário
- `GET /api/simulations/ranking` - Ranking global
- `GET /api/simulations/:id` - Detalhes de um simulado

## Autenticação

O sistema usa JWT tokens para autenticação. Inclua o token no header:

```
Authorization: Bearer <seu-token-jwt>
```

## Produção

Para produção, configure as variáveis de ambiente adequadamente e use um serviço como:

- **Vercel**: Deploy automático do Express
- **Railway**: Deploy simples
- **Heroku**: Deploy tradicional
- **DigitalOcean App Platform**: Deploy escalável

## Monitoramento

O sistema inclui logs com Winston. Em produção, configure:

- Logs estruturados
- Monitoramento de performance
- Alertas de erro
