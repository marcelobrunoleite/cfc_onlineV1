/**
 * Service Worker para CFC Online
 * Melhora a performance e permite funcionamento offline
 */

const CACHE_NAME = 'cfc-online-v1.0.0';
const STATIC_CACHE = 'cfc-static-v1.0.0';
const DYNAMIC_CACHE = 'cfc-dynamic-v1.0.0';

// Arquivos para cache estático
const STATIC_FILES = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/auth.js',
    '/quiz.html',
    '/placas.html',
    '/flashcards.html',
    '/ranking.html',
    '/marketplace.html',
    '/courses.html',
    '/sobre.html',
    '/js/auth.js',
    '/js/cart.js',
    '/js/marketplace.js',
    '/js/payment.js',
    '/js/permissions.js',
    '/js/placas.js',
    '/js/admin-marketplace.js',
    '/js/flashcards.js',
    '/public/data/courses.json',
    '/public/data/placas.json',
    '/public/data/transito.json',
    '/assets/images/placas/regulamentacao/r-1-placa-pare-parada-obrigat-ria.webp',
    '/assets/images/placas/regulamentacao/r-2-placa-d--a-prefer-ncia-.webp',
    '/assets/images/placas/regulamentacao/r-3-placa-sentido-proibido-.webp',
    '/assets/images/placas/regulamentacao/r-4a-placa-proibido-virar---esquerda-.webp',
    '/assets/images/placas/regulamentacao/r-4b-placa-proibido-virar---direita.webp',
    '/assets/images/placas/regulamentacao/r-10-placa-proibido-tr-nsito-de-ve-culos-automotores-.webp',
    '/assets/images/placas/regulamentacao/r-11-placa-proibido-tr-nsito-de-ve-culos-de-tra-o-animal-.webp',
    '/assets/images/placas/regulamentacao/r-19---50km-h-placa-velocidade-m-xima-permitida-.webp'
];

// Instalação do Service Worker
self.addEventListener('install', event => {
    console.log('Service Worker: Instalando...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('Service Worker: Cache estático criado');
                return cache.addAll(STATIC_FILES);
            })
            .catch(error => {
                console.log('Service Worker: Erro ao cachear arquivos estáticos:', error);
            })
    );
    
    self.skipWaiting();
});

// Ativação do Service Worker
self.addEventListener('activate', event => {
    console.log('Service Worker: Ativando...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('Service Worker: Removendo cache antigo:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
    );
    
    self.clients.claim();
});

// Interceptação de requisições
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Estratégia para diferentes tipos de recursos
    if (request.method === 'GET') {
        // API calls - Network First
        if (url.pathname.startsWith('/api/')) {
            event.respondWith(networkFirst(request));
        }
        // Assets estáticos - Cache First
        else if (isStaticAsset(url.pathname)) {
            event.respondWith(cacheFirst(request));
        }
        // Páginas HTML - Network First
        else if (url.pathname.endsWith('.html') || url.pathname === '/') {
            event.respondWith(networkFirst(request));
        }
        // Outros recursos - Cache First
        else {
            event.respondWith(cacheFirst(request));
        }
    }
});

// Estratégia Cache First
function cacheFirst(request) {
    return caches.match(request)
        .then(response => {
            if (response) {
                return response;
            }
            return fetch(request)
                .then(fetchResponse => {
                    if (fetchResponse && fetchResponse.status === 200) {
                        const responseClone = fetchResponse.clone();
                        caches.open(DYNAMIC_CACHE)
                            .then(cache => {
                                cache.put(request, responseClone);
                            });
                    }
                    return fetchResponse;
                });
        });
}

// Estratégia Network First
function networkFirst(request) {
    return fetch(request)
        .then(response => {
            if (response && response.status === 200) {
                const responseClone = response.clone();
                caches.open(DYNAMIC_CACHE)
                    .then(cache => {
                        cache.put(request, responseClone);
                    });
            }
            return response;
        })
        .catch(() => {
            return caches.match(request);
        });
}

// Verificar se é um asset estático
function isStaticAsset(pathname) {
    const staticExtensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico', '.woff', '.woff2', '.ttf', '.eot'];
    return staticExtensions.some(ext => pathname.endsWith(ext));
}

// Mensagens do Service Worker
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_NAME });
    }
});

// Background Sync (para funcionalidades offline)
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

// Função para sincronização em background
function doBackgroundSync() {
    // Implementar sincronização de dados offline
    console.log('Service Worker: Sincronizando dados em background...');
    return Promise.resolve();
}

// Push notifications (opcional)
self.addEventListener('push', event => {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: '/assets/images/icon-192x192.png',
            badge: '/assets/images/badge-72x72.png',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: 1
            },
            actions: [
                {
                    action: 'explore',
                    title: 'Ver mais',
                    icon: '/assets/images/checkmark.png'
                },
                {
                    action: 'close',
                    title: 'Fechar',
                    icon: '/assets/images/xmark.png'
                }
            ]
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

// Clique em notificação
self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
}); 