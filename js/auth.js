class Auth {
    constructor() {
        // Garantir que existe um admin padrão (agora assíncrono)
        this.init();
    }

    async init() {
        await this.initializeAdminUser();
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.setupEventListeners();
        this.bindEvents();
    }

    async hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hash = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hash))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    async initializeAdminUser() {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const adminExists = users.some(user => user.role === 'admin');

        if (!adminExists) {
            const hashedPassword = await this.hashPassword('admin123');
            const adminUser = {
                id: 1,
                name: 'Administrador',
                email: 'admin@admin.com',
                password: hashedPassword,
                role: 'admin'
            };
            users.push(adminUser);
            localStorage.setItem('users', JSON.stringify(users));
        }
    }

    setupEventListeners() {
        // Botões de login/signup
        const btnLogin = document.getElementById('btn-login');
        const btnSignup = document.getElementById('btn-signup');
        const btnLogout = document.getElementById('btn-logout');

        if (btnLogin) btnLogin.addEventListener('click', () => this.showLoginModal());
        if (btnSignup) btnSignup.addEventListener('click', () => this.showSignupModal());
        if (btnLogout) btnLogout.addEventListener('click', () => this.logout());

        // Forms de login/signup
        const loginForm = document.getElementById('login-form');
        const signupForm = document.getElementById('signup-form');

        if (loginForm) loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        if (signupForm) signupForm.addEventListener('submit', (e) => this.handleSignup(e));
    }

    showLoginModal() {
        const modal = document.getElementById('login-modal');
        if (modal) {
            modal.classList.remove('escondido');
            modal.classList.add('ativo');
        }
    }

    showSignupModal() {
        const modal = document.getElementById('signup-modal');
        if (modal) {
            modal.classList.remove('escondido');
            modal.classList.add('ativo');
        }
    }

    updateAuthUI() {
        const authButtons = document.querySelector('.auth-buttons');
        const userInfo = document.querySelector('.user-info');
        const adminLink = document.querySelector('.admin-link');

        if (this.currentUser) {
            if (authButtons) authButtons.classList.add('escondido');
            if (userInfo) {
                userInfo.classList.remove('escondido');
                userInfo.querySelector('.user-name').textContent = this.currentUser.name;
            }
            if (adminLink && this.currentUser.role === 'admin') {
                adminLink.classList.remove('escondido');
            }
        } else {
            if (authButtons) authButtons.classList.remove('escondido');
            if (userInfo) userInfo.classList.add('escondido');
            if (adminLink) adminLink.classList.add('escondido');
        }
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('escondido');
            modal.classList.add('ativo');
        }
    }

    closeModal(modal) {
        if (modal) {
            modal.classList.add('escondido');
            modal.classList.remove('ativo');
            
            const form = modal.querySelector('form');
            if (form) {
                form.reset();
                const errorMessage = form.querySelector('.error-message');
                if (errorMessage) {
                    errorMessage.textContent = '';
                }
            }
        }
    }

    bindEvents() {
        // Fechar modal ao clicar no X
        document.querySelectorAll('.close-modal').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const modal = closeBtn.closest('.modal');
                this.closeModal(modal);
            });
        });

        // Fechar modal ao clicar fora
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal);
                }
            });
        });

        // Prevenir fechamento ao clicar dentro do modal
        document.querySelectorAll('.modal-content').forEach(content => {
            content.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        });
    }

    async handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const errorMessage = document.querySelector('#login-modal .error-message');

        try {
            const hashedPassword = await this.hashPassword(password);
            const user = this.users.find(u => u.email === email && u.password === hashedPassword);
            if (user) {
                this.currentUser = user;
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.updateAuthUI();
                this.closeModal(document.getElementById('login-modal'));
                if (user.role === 'admin') {
                    window.location.href = 'admin-marketplace.html';
                }
            } else {
                errorMessage.textContent = 'Email ou senha incorretos';
            }
        } catch (error) {
            console.error('Erro no login:', error);
            errorMessage.textContent = 'Erro ao fazer login. Tente novamente.';
        }
    }

    async handleSignup(e) {
        e.preventDefault();
        
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const phone = document.getElementById('signup-phone').value;
        const whatsapp = document.getElementById('signup-whatsapp').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;
        const errorMessage = document.querySelector('#signup-modal .error-message');

        try {
            if (password !== confirmPassword) {
                errorMessage.textContent = 'As senhas não coincidem';
                return;
            }

            if (this.users.some(u => u.email === email)) {
                errorMessage.textContent = 'Este email já está cadastrado';
                return;
            }

            const newUser = {
                id: this.users.length + 1,
                name,
                email,
                phone,
                whatsapp,
                password,
                role: 'user'
            };

            this.users.push(newUser);
            localStorage.setItem('users', JSON.stringify(this.users));
            
            this.currentUser = newUser;
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            
            this.updateAuthUI();
            this.closeModal(document.getElementById('signup-modal'));
        } catch (error) {
            console.error('Erro no cadastro:', error);
            errorMessage.textContent = 'Erro ao criar conta. Tente novamente.';
        }
    }

    logout() {
        localStorage.removeItem('currentUser');
        this.currentUser = null;
        this.updateAuthUI();
        window.location.reload();
    }

    checkAdminAccess() {
        return this.currentUser && this.currentUser.role === 'admin';
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    window.auth = new Auth();
}); 