// Gerenciamento de estado global
const AuthState = {
    init() {
        this.checkAuthState();
        this.setupAuthListeners();
        this.setupNavigationProtection();
        this.setupNavigationInterception();
    },

    checkAuthState() {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            try {
                const user = JSON.parse(currentUser);
                this.updateUIForLoggedUser(user);
                this.protectRoutes(user);
            } catch (error) {
                console.error('Erro ao parsear usuário:', error);
                this.updateUIForLoggedOutUser();
            }
        } else {
            this.updateUIForLoggedOutUser();
        }
    },

    updateUIForLoggedUser(user) {
        const authButtons = document.querySelector('.auth-buttons');
        const userInfo = document.querySelector('.user-info');
        const userName = document.querySelector('.user-name');
        const adminLink = document.querySelector('.admin-link');
        
        if (authButtons) {
            document.getElementById('btn-login')?.classList.add('escondido');
            document.getElementById('btn-signup')?.classList.add('escondido');
        }
        
        if (userInfo) {
            userInfo.classList.remove('escondido');
            userName.textContent = `Olá, ${user.name}`;
        }
        
        if (adminLink && user.role === 'admin') {
            adminLink.classList.remove('escondido');
        }
    },

    updateUIForLoggedOutUser() {
        const authButtons = document.querySelector('.auth-buttons');
        const userInfo = document.querySelector('.user-info');
        const adminLink = document.querySelector('.admin-link');
        
        if (authButtons) {
            document.getElementById('btn-login')?.classList.remove('escondido');
            document.getElementById('btn-signup')?.classList.remove('escondido');
        }
        
        if (userInfo) {
            userInfo.classList.add('escondido');
        }
        
        if (adminLink) {
            adminLink.classList.add('escondido');
        }
    },

    setupAuthListeners() {
        // Listener para mudanças no localStorage
        window.addEventListener('storage', (e) => {
            if (e.key === 'currentUser') {
                if (e.newValue) {
                    try {
                        const user = JSON.parse(e.newValue);
                        this.updateUIForLoggedUser(user);
                        this.protectRoutes(user);
                    } catch (error) {
                        console.error('Erro ao parsear usuário:', error);
                        this.updateUIForLoggedOutUser();
                    }
                } else {
                    this.updateUIForLoggedOutUser();
                }
            }
        });

        // Listener para mudanças no estado de autenticação
        document.addEventListener('authStateChanged', (e) => {
            if (e.detail.user) {
                this.updateUIForLoggedUser(e.detail.user);
                this.protectRoutes(e.detail.user);
            } else {
                this.updateUIForLoggedOutUser();
            }
        });
    },

    setupNavigationProtection() {
        const protectedRoutes = ['admin-marketplace.html', 'ranking.html'];
        const currentPath = window.location.pathname.split('/').pop();
        
        if (protectedRoutes.includes(currentPath)) {
            const currentUser = localStorage.getItem('currentUser');
            if (!currentUser) {
                window.location.href = 'index.html';
                return;
            }
            
            try {
                const user = JSON.parse(currentUser);
                if (currentPath === 'admin-marketplace.html' && user.role !== 'admin') {
                    window.location.href = 'index.html';
                }
            } catch (error) {
                console.error('Erro ao verificar permissões:', error);
                window.location.href = 'index.html';
            }
        }
    },

    setupNavigationInterception() {
        // Interceptar todos os cliques em links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.href && link.href.startsWith(window.location.origin)) {
                e.preventDefault();
                const href = link.href;
                
                // Verificar autenticação antes de navegar
                const currentUser = localStorage.getItem('currentUser');
                if (currentUser) {
                    try {
                        const user = JSON.parse(currentUser);
                        if (href.includes('admin-marketplace.html') && user.role !== 'admin') {
                            this.showNotification('Acesso negado. Apenas administradores podem acessar esta página.', 'error');
                            return;
                        }
                    } catch (error) {
                        console.error('Erro ao verificar permissões:', error);
                    }
                }
                
                // Navegar para a página
                window.location.href = href;
            }
        });
    },

    protectRoutes(user) {
        const adminRoutes = document.querySelectorAll('.admin-link');
        if (user.role !== 'admin') {
            adminRoutes.forEach(route => {
                route.style.display = 'none';
            });
        }
    },

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
};

// Inicializar o estado de autenticação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    AuthState.init();
}); 