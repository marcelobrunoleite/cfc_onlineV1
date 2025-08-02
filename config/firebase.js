const { initializeApp } = require('firebase/app');
const { getAuth } = require('firebase/auth');
const { getFirestore } = require('firebase/firestore');

// Configuração do Firebase
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "AIzaSyCJyU2FPLLGLq8mpODbgHs811E8EkT3RBU",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "cfconline-a34ad.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "cfconline-a34ad",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "cfconline-a34ad.firebasestorage.app",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "990149263496",
  appId: process.env.FIREBASE_APP_ID || "1:990149263496:web:a71d6e7dc03265417a5f3d"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar serviços
const auth = getAuth(app);
const db = getFirestore(app);

module.exports = {
  app,
  auth,
  db
}; 