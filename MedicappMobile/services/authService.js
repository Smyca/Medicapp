import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuración base de axios
const api = axios.create({
  baseURL: 'http://tu-backend-url/api', // Reemplazar con la URL real del backend
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authService = {
  // Registro de usuario
  register: async (userData) => {
    try {
      // Guardar usuario localmente
      const users = await authService.getUsers();
      const userExists = users.some(user => user.email === userData.email);
      
      if (userExists) {
        throw { message: 'El correo electrónico ya está registrado' };
      }

      const newUser = {
        ...userData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };

      await authService.saveUsers([...users, newUser]);
      return { success: true, user: newUser };
    } catch (error) {
      throw error.response?.data || { message: 'Error al registrar usuario' };
    }
  },

  // Login local
  login: async (email, password) => {
    try {
      const users = await authService.getUsers();
      const user = users.find(u => u.email === email && u.password === password);
      
      if (!user) {
        throw { message: 'Credenciales inválidas' };
      }

      const token = `local-token-${Date.now()}`;
      await authService.saveToken(token);
      return { token, user };
    } catch (error) {
      throw error.response?.data || { message: 'Error al iniciar sesión' };
    }
  },

  // Métodos para manejar usuarios
  getUsers: async () => {
    try {
      const usersJson = await AsyncStorage.getItem('@users');
      return usersJson ? JSON.parse(usersJson) : [];
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      return [];
    }
  },

  saveUsers: async (users) => {
    try {
      await AsyncStorage.setItem('@users', JSON.stringify(users));
    } catch (error) {
      console.error('Error al guardar usuarios:', error);
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
}; 