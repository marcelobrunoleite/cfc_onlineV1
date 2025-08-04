# 🚀 Guia de Deploy - Firebase Hosting

## 📋 Pré-requisitos

### 1. Instalar Firebase CLI
```bash
npm install -g firebase-tools
```

### 2. Login no Firebase
```bash
firebase login
```

### 3. Verificar projeto
```bash
firebase projects:list
firebase use cfconline-a34ad
```

## 🔧 Configuração

### 1. Estrutura de Arquivos
```
aplicativo_v6_loja/
├── index.html              # Página principal
├── firebase.json           # Configuração Firebase
├── .firebaserc            # Projeto Firebase
├── manifest.json          # PWA Manifest
├── sw.js                 # Service Worker
├── production-config.js   # Configuração produção
├── deploy.sh             # Script de deploy
└── [outros arquivos...]
```

### 2. Verificar Configurações
- ✅ `firebase.json` configurado
- ✅ `.firebaserc` com projeto correto
- ✅ `manifest.json` para PWA
- ✅ `sw.js` para cache

## 🚀 Deploy Rápido

### Opção 1: Script Automático
```bash
# Dar permissão de execução
chmod +x deploy.sh

# Deploy básico
./deploy.sh

# Deploy com limpeza de cache
./deploy.sh --clean

# Deploy completo (hosting + functions)
./deploy.sh --functions
```

### Opção 2: Comandos Manuais
```bash
# Deploy apenas do hosting
firebase deploy --only hosting

# Deploy completo
firebase deploy

# Deploy com preview
firebase hosting:channel:deploy preview
```

## 📊 Monitoramento

### 1. Logs
```bash
# Ver logs do hosting
firebase hosting:log

# Ver logs das functions
firebase functions:log
```

### 2. Analytics
- Firebase Console → Analytics
- Google Analytics (se configurado)

### 3. Performance
- Firebase Console → Performance
- Lighthouse Audit

## 🔒 Segurança

### 1. Regras do Firestore
```bash
# Deploy das regras
firebase deploy --only firestore:rules
```

### 2. Configurações de Segurança
- CORS configurado
- Rate limiting ativo
- Headers de segurança

## 🌐 URLs de Acesso

### Produção
- **Principal**: https://cfconline-a34ad.web.app
- **Alternativa**: https://cfconline-a34ad.firebaseapp.com

### Preview (se configurado)
- **Preview**: https://preview-cfconline-a34ad.web.app

## 📱 PWA Features

### 1. Instalação
- Aplicativo pode ser instalado
- Ícones configurados
- Manifest completo

### 2. Offline
- Service Worker ativo
- Cache inteligente
- Funcionamento offline

### 3. Notificações
- Push notifications configuradas
- Background sync

## 🛠️ Troubleshooting

### Erro: "Project not found"
```bash
firebase projects:list
firebase use cfconline-a34ad
```

### Erro: "Permission denied"
```bash
firebase login
firebase logout
firebase login
```

### Erro: "Build failed"
```bash
# Verificar arquivos
ls -la

# Verificar configuração
firebase projects:list
```

### Erro: "Cache issues"
```bash
# Limpar cache
firebase hosting:clear

# Deploy com --force
firebase deploy --only hosting --force
```

## 🔄 Atualizações

### 1. Deploy de Atualização
```bash
# Deploy normal
firebase deploy --only hosting

# Deploy com preview
firebase hosting:channel:deploy v2.0.0
```

### 2. Rollback
```bash
# Ver versões
firebase hosting:releases:list

# Rollback
firebase hosting:releases:rollback
```

## 📈 Performance

### 1. Otimizações Implementadas
- ✅ Service Worker para cache
- ✅ Headers de cache configurados
- ✅ Compressão ativa
- ✅ CDN global

### 2. Métricas Importantes
- **First Contentful Paint**: < 2s
- **Largest Contentful Paint**: < 3s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

## 🔧 Configurações Avançadas

### 1. Domínio Customizado
```bash
# Adicionar domínio
firebase hosting:sites:add seu-dominio

# Configurar DNS
firebase hosting:channel:deploy production
```

### 2. SSL/TLS
- Automático com Firebase
- Certificados gerenciados

### 3. CDN
- Global automaticamente
- Edge locations

## 📱 Mobile Optimization

### 1. Responsive Design
- ✅ Mobile-first
- ✅ Touch-friendly
- ✅ PWA ready

### 2. Performance Mobile
- ✅ Lazy loading
- ✅ Image optimization
- ✅ Minimal bundle size

## 🎯 Checklist de Deploy

### Antes do Deploy
- [ ] Firebase CLI instalado
- [ ] Login realizado
- [ ] Projeto configurado
- [ ] Arquivos principais verificados
- [ ] Testes locais passaram

### Durante o Deploy
- [ ] Deploy iniciado
- [ ] Sem erros de build
- [ ] Deploy concluído
- [ ] URLs verificadas

### Após o Deploy
- [ ] Site acessível
- [ ] Funcionalidades testadas
- [ ] Performance verificada
- [ ] Analytics configurado

## 🚀 Próximos Passos

1. **Deploy inicial**: `./deploy.sh`
2. **Testar funcionalidades**: Acessar URLs
3. **Configurar analytics**: Google Analytics
4. **Monitorar performance**: Firebase Console
5. **Configurar domínio**: Se necessário

## 📞 Suporte

- **Firebase Docs**: https://firebase.google.com/docs/hosting
- **Firebase Console**: https://console.firebase.google.com
- **Status Firebase**: https://status.firebase.google.com

---

**🎉 Deploy concluído! Sua aplicação está online!** 