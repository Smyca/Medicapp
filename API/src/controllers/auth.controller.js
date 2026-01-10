const axios = require('axios');
const { validationResult } = require('express-validator');

// URL del servicio de autenticación
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';

// Controlador de registro
exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const response = await axios.post(`${AUTH_SERVICE_URL}/auth/register`, req.body);
    res.status(201).json(response.data);
  } catch (error) {
    console.error('Error en registro:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: 'Error en el registro',
      details: error.response?.data || error.message
    });
  }
};

// Controlador de login
exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const response = await axios.post(`${AUTH_SERVICE_URL}/auth/login`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('Error en login:', error.response?.data || error.message);
    res.status(error.response?.status || 401).json({
      error: 'Error en el login',
      details: error.response?.data || error.message
    });
  }
};

// Middleware de verificación de token
exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    // Verificar el token con el servicio de autenticación
    const response = await axios.get(`${AUTH_SERVICE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    req.user = response.data.user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

// Controlador para obtener perfil
exports.getProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    const response = await axios.get(`${AUTH_SERVICE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el perfil' });
  }
}; 