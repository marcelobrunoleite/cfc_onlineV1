class Auth {
    constructor() {
        console.log('Iniciando Auth...');
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.setupPhoneMasks();
        this.bindEvents();
        
        // Inicializar o estado de autenticação
        if (this.currentUser) {
            this.dispatchAuthStateChanged(this.currentUser);
        } else {
            this.dispatchAuthStateChanged(null);
        }
    }

    setupPhoneMasks() {
        const phoneInputs = document.querySelectorAll('input[type="tel"]');
        phoneInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length <= 11) {
                    value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
                    value = value.replace(/(\d)(\d{4})$/, '$1-$2');
                    e.target.value = value;
                }
            });
        });
    }

    async hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hash = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hash))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    async handleSignup(e) {
        e.preventDefault();
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const phone = document.getElementById('signup-phone').value;
        const whatsapp = document.getElementById('signup-whatsapp').value || phone;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;
        const errorElement = document.querySelector('#signup-modal .error-message');

        // Validações
        if (password !== confirmPassword) {
            errorElement.textContent = 'As senhas não coincidem';
            return;
        }

        if (password.length < 6) {
            errorElement.textContent = 'A senha deve ter pelo menos 6 caracteres';
            return;
        }

        const phoneRegex = /^\(\d{2}\)\s\d{5}-\d{4}$/;
        if (!phoneRegex.test(phone)) {
            errorElement.textContent = 'Telefone inválido';
            return;
        }

        try {
            if (this.users.some(u => u.email === email)) {
                errorElement.textContent = 'Este email já está cadastrado';
                return;
            }

            const hashedPassword = await this.hashPassword(password);
            const newUser = {
                id: Date.now().toString(),
                name,
                email,
                phone,
                whatsapp,
                password: hashedPassword,
                role: 'user',
                permissions: ['view_store', 'make_purchase'],
                createdAt: new Date().toISOString(),
                status: 'active'
            };

            this.users.push(newUser);
            localStorage.setItem('users', JSON.stringify(this.users));

            // Login automático após cadastro
            const { password: _, ...userWithoutPassword } = newUser;
            this.currentUser = userWithoutPassword;
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

            this.updateAuthUI();
            this.closeModal(document.getElementById('signup-modal'));
            this.showNotification('Conta criada com sucesso!', 'success');
        } catch (error) {
            console.error('Erro no cadastro:', error);
            errorElement.textContent = 'Erro ao criar conta. Tente novamente.';
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const errorElement = document.querySelector('#login-modal .error-message');

        try {
            const hashedPassword = await this.hashPassword(password);
            const user = this.users.find(u => u.email === email && u.password === hashedPassword);
            
            if (user) {
                const { password: _, ...userWithoutPassword } = user;
                this.currentUser = {
                    ...userWithoutPassword,
                    permissions: user.role === 'admin' ? 
                        ROLES.ADMIN.permissions : 
                        ROLES.USER.permissions
                };
                localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                
                // Disparar evento de mudança de estado
                this.dispatchAuthStateChanged(this.currentUser);
                
                this.closeModal(document.getElementById('login-modal'));
                this.showNotification(`Bem-vindo, ${this.currentUser.name}!`, 'success');
            } else {
                errorElement.textContent = 'Email ou senha incorretos';
            }
        } catch (error) {
            console.error('Erro no login:', error);
            errorElement.textContent = 'Erro ao fazer login. Tente novamente.';
        }
    }

    showNotification(message, type = 'info') {
        // Remove notificação anterior se existir
        const oldNotification = document.querySelector('.notification');
        if (oldNotification) {
            oldNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 15px;
            right: 200px;
            background: rgba(10, 10, 31, 0.95);
            border: 1px solid ${type === 'success' ? '#00FF7F' : '#FF4444'};
            border-radius: 8px;
            padding: 10px 15px;
            color: ${type === 'success' ? '#fff' : '#FF4444'};
            box-shadow: 0 2px 10px ${type === 'success' ? 'rgba(0, 255, 127, 0.2)' : 'rgba(255, 68, 68, 0.2)'};
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.3s ease;
            font-size: 0.9rem;
            max-width: 250px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        // Fade in
        requestAnimationFrame(() => {
            notification.style.opacity = '1';
        });

        // Fade out e remover
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3200);
    }

    bindEvents() {
        console.log('Vinculando eventos...');
        // Vincular eventos diretamente
        document.addEventListener('click', (e) => {
            const target = e.target;
            
            // Login button
            if (target.id === 'btn-login') {
                console.log('Clique no botão login');
                this.showModal('login-modal');
            }
            
            // Signup button
            if (target.id === 'btn-signup') {
                console.log('Clique no botão signup');
                this.showModal('signup-modal');
            }
            
            // Logout button
            if (target.id === 'btn-logout') {
                this.handleLogout();
            }
            
            // Close modal button
            if (target.classList.contains('close-modal')) {
                const modal = target.closest('.modal');
                this.closeModal(modal);
            }
        });

        // Form submissions
        document.getElementById('login-form')?.addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('signup-form')?.addEventListener('submit', (e) => this.handleSignup(e));

        // Close modal on outside click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal);
                }
            });
        });

        this.updateAuthUI();
    }

    showModal(modalId) {
        console.log('Tentando abrir modal:', modalId);
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('escondido');
            modal.classList.add('ativo');
            console.log('Modal aberto');
        } else {
            console.error('Modal não encontrado:', modalId);
        }
    }

    closeModal(modal) {
        if (modal) {
            modal.classList.remove('ativo');
            modal.classList.add('escondido');
            // Limpar formulário
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

    handleLogout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        
        // Disparar evento de mudança de estado
        this.dispatchAuthStateChanged(null);
        
        this.showNotification('Logout realizado com sucesso!', 'success');
    }

    updateAuthUI() {
        const authButtons = document.querySelector('.auth-buttons');
        const userInfo = document.querySelector('.user-info');
        const btnLogin = document.getElementById('btn-login');
        const btnSignup = document.getElementById('btn-signup');
        const userName = document.querySelector('.user-name');
        const adminLink = document.querySelector('.admin-link');

        if (this.currentUser) {
            btnLogin.classList.add('escondido');
            btnSignup.classList.add('escondido');
            userInfo.classList.remove('escondido');
            userName.textContent = `Olá, ${this.currentUser.name}`;
            
            // Mostrar link de admin apenas para usuários administradores
            if (this.currentUser.role === 'admin') {
                adminLink?.classList.remove('escondido');
            } else {
                adminLink?.classList.add('escondido');
            }
        } else {
            btnLogin.classList.remove('escondido');
            btnSignup.classList.remove('escondido');
            userInfo.classList.add('escondido');
            adminLink?.classList.add('escondido');
        }
    }

    showErrorMessage(formId, message) {
        const form = document.getElementById(formId);
        const errorDiv = form.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.textContent = message;
        }
    }

    updateUI() {
        const userInfo = document.querySelector('.user-info');
        const authButtons = document.querySelector('.auth-buttons');
        const adminLink = document.querySelector('.admin-link');

        if (this.currentUser) {
            userInfo.querySelector('.user-name').textContent = this.currentUser.email;
            userInfo.classList.remove('escondido');
            authButtons.classList.add('escondido');
            
            // Mostrar link de admin apenas para usuários administradores
            if (this.currentUser.role === 'admin') {
                adminLink?.classList.remove('escondido');
            } else {
                adminLink?.classList.add('escondido');
            }
        } else {
            userInfo.classList.add('escondido');
            authButtons.classList.remove('escondido');
            adminLink?.classList.add('escondido');
        }
    }

    hasRole(role) {
        return this.currentUser?.role === role;
    }

    hasPermission(permission) {
        return this.currentUser?.permissions?.includes(permission);
    }

    checkAccess(requiredPermissions = []) {
        // Admin tem acesso total
        if (this.hasRole('admin')) return true;
        
        // Verifica se usuário tem todas as permissões necessárias
        return requiredPermissions.every(perm => this.hasPermission(perm));
    }

    async updateUserPermissions(userId, newPermissions) {
        if (!this.hasRole('admin')) {
            throw new Error('Acesso negado');
        }

        const userToUpdate = this.users.find(u => u.id === userId);
        if (!userToUpdate) {
            throw new Error('Usuário não encontrado');
        }

        userToUpdate.permissions = newPermissions;
        localStorage.setItem('users', JSON.stringify(this.users));
    }

    async createAdminUser(email, password) {
        const hashedPassword = await this.hashPassword(password);
        const adminUser = {
            id: Date.now().toString(),
            name: 'Administrador',
            email,
            phone: '',
            whatsapp: '',
            password: hashedPassword,
            role: 'admin',
            permissions: [...ROLES.ADMIN.permissions],
            createdAt: new Date().toISOString(),
            status: 'active'
        };

        this.users.push(adminUser);
        localStorage.setItem('users', JSON.stringify(this.users));
        return adminUser;
    }

    dispatchAuthStateChanged(user) {
        const event = new CustomEvent('authStateChanged', {
            detail: { user }
        });
        document.dispatchEvent(event);
    }
}

// Inicializar Auth quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.auth = new Auth();
});

// Elementos do DOM
const signupModal = document.getElementById('signup-modal');
const signupForm = document.getElementById('signup-form');
const btnSignup = document.getElementById('btn-signup');
const closeButtons = document.querySelectorAll('.close-modal');

// Event Listeners
btnSignup.addEventListener('click', () => {
    signupModal.classList.remove('escondido');
});

closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        signupModal.classList.add('escondido');
    });
});

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const phone = document.getElementById('signup-phone').value;
    const whatsapp = document.getElementById('signup-whatsapp').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    const errorMessage = signupForm.querySelector('.error-message');

    // Validar senha
    if (password !== confirmPassword) {
        errorMessage.textContent = 'As senhas não coincidem';
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                email,
                password,
                phone,
                whatsapp
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Sucesso no registro
            errorMessage.textContent = '';
            errorMessage.style.color = 'green';
            errorMessage.textContent = 'Conta criada com sucesso!';
            
            // Limpar formulário
            signupForm.reset();
            
            // Fechar modal após 2 segundos
            setTimeout(() => {
                signupModal.classList.add('escondido');
            }, 2000);
        } else {
            // Erro no registro
            errorMessage.style.color = 'red';
            errorMessage.textContent = data.error || 'Erro ao criar conta';
        }
    } catch (error) {
        errorMessage.style.color = 'red';
        errorMessage.textContent = 'Erro ao conectar com o servidor';
    }
}); 