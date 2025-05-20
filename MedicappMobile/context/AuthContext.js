import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { useNavigation } from '@react-navigation/native';

export const AuthContext = createContext({
  signIn: async () => {},
  signOut: async () => {},
  isAuthenticated: false,
});

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar el estado de autenticación al iniciar
  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const isAuth = await authService.isAuthenticated();
      setIsAuthenticated(isAuth);
    } catch (error) {
      console.error('Error al verificar estado de autenticación:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (token) => {
    try {
      await authService.saveToken(token);
      setIsAuthenticated(true);
      // La navegación se manejará automáticamente por el estado isAuthenticated
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await authService.removeToken();
      setIsAuthenticated(false);
      // La navegación se manejará automáticamente por el estado isAuthenticated
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  };

  if (isLoading) {
    return null; // O un componente de carga
  }

  return (
    <AuthContext.Provider value={{ signIn, signOut, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}; 