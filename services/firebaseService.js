const { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} = require('firebase/auth');
const { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs
} = require('firebase/firestore');
const { auth, db } = require('../config/firebase');

class FirebaseService {
  // Autenticação
  async registerUser(email, password, userData) {
    try {
      // Criar usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Salvar dados adicionais no Firestore
      await setDoc(doc(db, 'users', user.uid), {
        ...userData,
        email,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      return {
        uid: user.uid,
        email: user.email,
        ...userData
      };
    } catch (error) {
      throw new Error(`Erro ao registrar usuário: ${error.message}`);
    }
  }

  async loginUser(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Buscar dados adicionais do Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();

      return {
        uid: user.uid,
        email: user.email,
        ...userData
      };
    } catch (error) {
      throw new Error(`Erro ao fazer login: ${error.message}`);
    }
  }

  async logoutUser() {
    try {
      await signOut(auth);
      return { message: 'Logout realizado com sucesso' };
    } catch (error) {
      throw new Error(`Erro ao fazer logout: ${error.message}`);
    }
  }

  async getUserProfile(uid) {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
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
      await updateDoc(doc(db, 'users', uid), {
        ...userData,
        updatedAt: new Date()
      });
      return { message: 'Perfil atualizado com sucesso' };
    } catch (error) {
      throw new Error(`Erro ao atualizar perfil: ${error.message}`);
    }
  }

  // Verificar se email já existe
  async checkEmailExists(email) {
    try {
      const q = query(collection(db, 'users'), where('email', '==', email));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      throw new Error(`Erro ao verificar email: ${error.message}`);
    }
  }

  // Listener para mudanças de autenticação
  onAuthStateChange(callback) {
    return onAuthStateChanged(auth, callback);
  }
}

module.exports = new FirebaseService(); 