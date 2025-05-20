import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthContext } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import HomeScreen from '../screens/HomeScreen';
import MedicamentosScreen from '../screens/MedicamentosScreen';
import InformacionScreen from '../screens/InformacionScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isAuthenticated ? (
          // Rutas autenticadas
          <>
            <Stack.Screen 
              name="Home" 
              component={HomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="Medicamentos" 
              component={MedicamentosScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="Informacion" 
              component={InformacionScreen}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          // Rutas de autenticación
          <Stack.Screen 
            name="Auth" 
            component={AuthNavigator}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 