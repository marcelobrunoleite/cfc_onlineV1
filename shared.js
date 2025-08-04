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
        // Elementos de autenticação
        const authButtons = document.querySelector('.auth-buttons');
        const btnLogin = document.getElementById('btn-login');
        const btnSignup = document.getElementById('btn-signup');
        const userInfo = document.querySelector('.user-info');
        const userName = document.querySelector('.user-name');
        const btnLogout = document.getElementById('btn-logout');
        const adminLink = document.querySelector('.admin-link');

        // Esconder botões de login/signup
        if (btnLogin) btnLogin.classList.add('escondido');
        if (btnSignup) btnSignup.classList.add('escondido');

        // Mostrar informações do usuário
        if (userInfo) {
            userInfo.classList.remove('escondido');
            userInfo.style.display = 'flex';
        }

        // Atualizar nome do usuário
        if (userName) {
            userName.textContent = `Olá, ${user.name}`;
        }

        // Mostrar botão de logout
        if (btnLogout) {
            btnLogout.classList.remove('escondido');
            btnLogout.style.display = 'block';
        }

        // Mostrar link de admin se necessário
        if (adminLink && user.role === 'admin') {
            adminLink.classList.remove('escondido');
        }
    },

    updateUIForLoggedOutUser() {
        // Elementos de autenticação
        const authButtons = document.querySelector('.auth-buttons');
        const btnLogin = document.getElementById('btn-login');
        const btnSignup = document.getElementById('btn-signup');
        const userInfo = document.querySelector('.user-info');
        const btnLogout = document.getElementById('btn-logout');
        const adminLink = document.querySelector('.admin-link');

        // Mostrar botões de login/signup
        if (btnLogin) {
            btnLogin.classList.remove('escondido');
            btnLogin.style.display = 'block';
        }
        if (btnSignup) {
            btnSignup.classList.remove('escondido');
            btnSignup.style.display = 'block';
        }

        // Esconder informações do usuário
        if (userInfo) {
            userInfo.classList.add('escondido');
            userInfo.style.display = 'none';
        }

        // Esconder botão de logout
        if (btnLogout) {
            btnLogout.classList.add('escondido');
            btnLogout.style.display = 'none';
        }

        // Esconder link de admin
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
        // Remover interceptação de links para permitir funcionamento normal
        // A proteção será feita apenas na página de destino
        console.log('Navegação livre habilitada');
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