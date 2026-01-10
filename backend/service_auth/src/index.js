const express = require('express');
const cors = require('cors');
const { body, validationResult } = require('express-validator');
const admin = require('./config/firebase');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.send('API funcionando correctamente 🚀');
});

// Validación de registro
const registerValidation = [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('nombre').notEmpty().withMessage('El nombre es requerido')
];

// Validación de login
const loginValidation = [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').notEmpty().withMessage('La contraseña es requerida')
];

// Endpoint de registro
app.post('/auth/register', registerValidation, async (req, res) => {
  try {
    // Validar datos
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, nombre } = req.body;

    // Crear usuario en Firebase
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: nombre
    });

    // Crear token personalizado
    const token = await admin.auth().createCustomToken(userRecord.uid);

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        nombre: userRecord.displayName
      },
      token
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      error: 'Error al crear el usuario',
      details: error.message
    });
  }
});

// Endpoint de login
app.post('/auth/login', loginValidation, async (req, res) => {
  try {
    // Validar datos
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Obtener usuario por email
    const userRecord = await admin.auth().getUserByEmail(email);

    // Crear token personalizado
    const token = await admin.auth().createCustomToken(userRecord.uid);

    res.json({
      message: 'Login exitoso',
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        nombre: userRecord.displayName
      },
      token
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(401).json({
      error: 'Credenciales inválidas',
      details: error.message
    });
  }
});

// Middleware de verificación de token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

// Endpoint protegido de ejemplo
app.get('/auth/profile', verifyToken, async (req, res) => {
  try {
    const userRecord = await admin.auth().getUser(req.user.uid);
    res.json({
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        nombre: userRecord.displayName
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el perfil' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'auth-service' });
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servicio de autenticación corriendo en el puerto ${port}`);
});
