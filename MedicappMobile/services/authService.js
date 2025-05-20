import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuración base de axios
const api = axios.create({
  baseURL: 'http://localhost:3000/api', // URL del API Gateway
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a las peticiones
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('@auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authService = {
  // Registro de usuario
  register: async (userData) => {
    try {
      const response = await api.post('/register', userData);
      const { token, user } = response.data;
      await authService.saveToken(token);
      return { success: true, user };
    } catch (error) {
      throw error.response?.data || { message: 'Error al registrar usuario' };
    }
  },

  // Login
  login: async (email, password) => {
    try {
      const response = await api.post('/login', { email, password });
      const { token, user } = response.data;
      await authService.saveToken(token);
      return { token, user };
    } catch (error) {
      throw error.response?.data || { message: 'Error al iniciar sesión' };
    }
  },

  // Obtener perfil del usuario
  getProfile: async () => {
    try {
      const response = await api.get('/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener el perfil' };
    }
  },

  // Método para guardar el token en AsyncStorage
  saveToken: async (token) => {
    try {
      await AsyncStorage.setItem('@auth_token', token);
    } catch (error) {
      console.error('Error al guardar el token:', error);
    }
  },

  // Método para obtener el token guardado
  getToken: async () => {
    try {
      return await AsyncStorage.getItem('@auth_token');
    } catch (error) {
      console.error('Error al obtener el token:', error);
      return null;
    }
  },

  // Método para eliminar el token (logout)
  removeToken: async () => {
    try {
      await AsyncStorage.removeItem('@auth_token');
    } catch (error) {
      console.error('Error al eliminar el token:', error);
    }
  },

  // Verificar si el usuario está autenticado
  isAuthenticated: async () => {
    try {
      const token = await authService.getToken();
      return !!token;
    } catch (error) {
      return false;
    }
  }
}; 