const admin = require('firebase-admin');
const { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signOut
} = require('firebase/auth');

// Usar Firebase Admin SDK
const auth = admin.auth();
const db = admin.firestore();

class FirebaseService {
    // Autenticação
    async registerUser(email, password, userData) {
        try {
            // Criar usuário no Firebase Auth
            const userRecord = await auth.createUser({
                email,
                password,
                displayName: userData.name
            });

            // Salvar dados adicionais no Firestore
            await db.collection('users').doc(userRecord.uid).set({
                ...userData,
                email,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });

            return {
                uid: userRecord.uid,
                email: userRecord.email,
                ...userData
            };
        } catch (error) {
            throw new Error(`Erro ao registrar usuário: ${error.message}`);
        }
    }

    async loginUser(email, password) {
        try {
            // Buscar usuário por email
            const userRecord = await auth.getUserByEmail(email);
            
            // Buscar dados adicionais do Firestore
            const userDoc = await db.collection('users').doc(userRecord.uid).get();
            const userData = userDoc.data();

            return {
                uid: userRecord.uid,
                email: userRecord.email,
                ...userData
            };
        } catch (error) {
            throw new Error(`Erro ao fazer login: ${error.message}`);
        }
    }

    async logoutUser() {
        try {
            // No Firebase Functions, o logout é gerenciado pelo cliente
            return { message: 'Logout realizado com sucesso' };
        } catch (error) {
            throw new Error(`Erro ao fazer logout: ${error.message}`);
        }
    }

    async getUserProfile(uid) {
        try {
            const userDoc = await db.collection('users').doc(uid).get();
            if (userDoc.exists) {
                return userDoc.data();
            } else {
                throw new Error('Usuário não encontrado');
            }
        } catch (error) {
            throw new Error(`Erro ao buscar perfil: ${error.message}`);
        }
    }

    async updateUserProfile(uid, userData) {
        try {
            await db.collection('users').doc(uid).update({
                ...userData,
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });
            return { message: 'Perfil atualizado com sucesso' };
        } catch (error) {
            throw new Error(`Erro ao atualizar perfil: ${error.message}`);
        }
    }

    // Verificar se email já existe
    async checkEmailExists(email) {
        try {
            const userRecord = await auth.getUserByEmail(email);
            return !!userRecord;
        } catch (error) {
            // Se o erro for "user not found", significa que o email não existe
            if (error.code === 'auth/user-not-found') {
                return false;
            }
            throw new Error(`Erro ao verificar email: ${error.message}`);
        }
    }

    // Verificar token de autenticação
    async verifyToken(token) {
        try {
            const decodedToken = await auth.verifyIdToken(token);
            return decodedToken;
        } catch (error) {
            throw new Error(`Token inválido: ${error.message}`);
        }
    }

    // Listener para mudanças de autenticação
    onAuthStateChange(callback) {
        // No Firebase Functions, isso é gerenciado pelo cliente
        return null;
    }
}

module.exports = new FirebaseService(); 