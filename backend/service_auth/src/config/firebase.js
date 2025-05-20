const admin = require('firebase-admin');
require('dotenv').config();

// Inicializar Firebase Admin
const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/"/g, '') : undefined,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL
};

// Verificar que la clave privada esté presente y correctamente formateada
if (!serviceAccount.private_key) {
  throw new Error('FIREBASE_PRIVATE_KEY no está definida en las variables de entorno');
}

// Asegurarse de que la clave privada tenga el formato correcto
if (!serviceAccount.private_key.includes('-----BEGIN PRIVATE KEY-----')) {
  throw new Error('FIREBASE_PRIVATE_KEY no tiene el formato correcto');
}

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} catch (error) {
  console.error('Error al inicializar Firebase Admin:', error);
  throw error;
}

module.exports = admin; 

