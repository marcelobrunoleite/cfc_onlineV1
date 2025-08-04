# Firebase Functions - API do Aplicativo de Trânsito

## 📋 Visão Geral

Este diretório contém as **Firebase Functions** que substituem o servidor Express.js tradicional. As funções são executadas de forma serverless, escalando automaticamente conforme a demanda.

## 🏗️ Arquitetura

```
Cliente → Firebase Functions → Firebase Services (Auth + Firestore)
```

### **Principais Diferenças:**

| Aspecto            | Express.js            | Firebase Functions     |
| ------------------ | --------------------- | ---------------------- |
| **Escalabilidade** | Manual                | Automática             |
| **Custo**          | Servidor sempre ativo | Paga por uso           |
| **Manutenção**     | Gerenciar servidor    | Gerenciado pelo Google |
| **Performance**    | Cold start            | Cold start (otimizado) |
| **Integração**     | Via SDK               | Nativa                 |

## 🚀 Como Funciona

### **1. Trigger HTTP**

```javascript
exports.api = functions.https.onRequest(app);
```

- Função executada quando há requisição HTTP
- Suporta Express.js como middleware
- URL: `https://us-central1-PROJECT_ID.cloudfunctions.net/api`

### **2. Firebase Admin SDK**

```javascript
const admin = require("firebase-admin");
admin.initializeApp(); // Sem configuração manual
```

### **3. Autenticação**

- **JWT**: Para autenticação de usuários
- **Firebase Auth**: Para criação/validação de usuários
- **Firebase ID Token**: Para verificação de tokens

## 📁 Estrutura de Arquivos

```
functions/
├── index.js              # Função principal (HTTP trigger)
├── package.json          # Dependências
├── services/
│   ├── firebaseService.js    # Serviços de autenticação
│   └── simulationService.js  # Serviços de simulações
└── env.example          # Variáveis de ambiente
```

## 🔧 Configuração

### **1. Instalar Firebase CLI**

```bash
npm install -g firebase-tools
```

### **2. Login no Firebase**

```bash
firebase login
```

### **3. Inicializar Functions**

```bash
firebase init functions
```

### **4. Instalar Dependências**

```bash
cd functions
npm install
```

### **5. Configurar Variáveis de Ambiente**

```bash
# Copiar arquivo de exemplo
cp env.example .env

# Editar variáveis
nano .env
```

### **6. Configurar Secrets (Produção)**

```bash
firebase functions:config:set jwt.secret="sua-chave-secreta"
firebase functions:config:set openai.api_key="sua-api-key"
```

## 🧪 Desenvolvimento Local

### **1. Emulador Local**

```bash
firebase emulators:start --only functions
```

### **2. Testar Funções**

```bash
# Testar registro
curl -X POST http://localhost:5001/PROJECT_ID/us-central1/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Teste","email":"teste@teste.com","password":"123456"}'

# Testar login
curl -X POST http://localhost:5001/PROJECT_ID/us-central1/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@teste.com","password":"123456"}'
```

## 🚀 Deploy

### **1. Deploy das Functions**

```bash
firebase deploy --only functions
```

### **2. Deploy Completo**

```bash
firebase deploy
```

### **3. Deploy Específico**

```bash
firebase deploy --only functions:api
```

## 📊 Monitoramento

### **1. Logs**

```bash
firebase functions:log
```

### **2. Métricas**

- Firebase Console → Functions → Métricas
- Latência, invocações, erros

### **3. Alertas**

- Configurar alertas para erros
- Monitorar uso de recursos

## 🔒 Segurança

### **1. CORS**

```javascript
const cors = require("cors")({ origin: true });
```

### **2. Rate Limiting**

- Implementado no nível do Firebase
- Configurável via Firebase Console

### **3. Autenticação**

- JWT para APIs
- Firebase Auth para usuários
- Verificação de tokens

## 💰 Custos

### **Plano Gratuito (Spark)**

- 125K invocações/mês
- 40K GB-segundos/mês
- 5GB de transferência/mês

### **Plano Pago (Blaze)**

- $0.40 por milhão de invocações
- $0.0025 por GB-segundo
- $0.15 por GB transferido

## 🔄 Migração do Express.js

### **Antes (Express.js):**

```javascript
app.post("/api/register", async (req, res) => {
  // Lógica aqui
});
```

### **Depois (Firebase Functions):**

```javascript
app.post("/api/register", async (req, res) => {
  cors(req, res, async () => {
    // Mesma lógica aqui
  });
});
```

## 🎯 Vantagens da Migração

1. **Escalabilidade**: 0 → 1000 instâncias automaticamente
2. **Custo**: Paga apenas pelo que usar
3. **Manutenção**: Sem servidores para gerenciar
4. **Integração**: Nativa com Firebase
5. **Performance**: Distribuído globalmente
6. **Segurança**: Ambiente isolado do Google

## 📈 Performance

### **Cold Start**

- Primeira invocação: ~2-5 segundos
- Invocações subsequentes: ~100-500ms
- Otimizações disponíveis

### **Limites**

- Timeout: 540 segundos (9 minutos)
- Memória: 1GB (configurável)
- CPU: 1 vCPU

## 🛠️ Troubleshooting

### **Erro: Function timeout**

- Otimizar código
- Aumentar timeout
- Usar cache

### **Erro: Memory limit**

- Otimizar uso de memória
- Aumentar limite
- Dividir função

### **Erro: CORS**

- Verificar configuração CORS
- Adicionar domínios permitidos

## 📚 Recursos Adicionais

- [Firebase Functions Docs](https://firebase.google.com/docs/functions)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Serverless Best Practices](https://firebase.google.com/docs/functions/best-practices)
