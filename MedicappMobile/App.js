import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, TouchableOpacity, Text } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import HomeScreen from './screens/HomeScreen';
import MedicamentosScreen from './screens/MedicamentosScreen';
import InformacionScreen from './screens/InformacionScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ThemeProvider, ThemeContext } from './context/ThemeContext';
import { MedicamentosProvider } from './context/MedicamentosContext';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const MainNavigator = () => {
  const { theme } = useContext(ThemeContext);
  const { signOut } = useContext(AuthContext);

  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.primary,
        },
        headerTintColor: theme.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        drawerStyle: {
          backgroundColor: theme.background,
        },
        drawerActiveTintColor: theme.accent,
        drawerInactiveTintColor: theme.text,
        drawerLabelStyle: {
          color: theme.text,
        },
      }}
      drawerContent={(props) => (
        <View style={{ flex: 1 }}>
          <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
          </DrawerContentScrollView>
          <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: '#ccc' }}>
            <TouchableOpacity
              onPress={signOut}
              style={{
                padding: 15,
                borderRadius: 8,
                backgroundColor: '#ff3b30',
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
                Cerrar Sesión
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    >
      <Drawer.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio' }} />
      <Drawer.Screen name="Medicamentos" component={MedicamentosScreen} options={{ title: 'Medicamentos' }} />
      <Drawer.Screen name="Informacion" component={InformacionScreen} options={{ title: 'Información' }} />
    </Drawer.Navigator>
  );
};

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

const AppContent = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainNavigator /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AuthProvider>
          <MedicamentosProvider>
            <AppContent />
          </MedicamentosProvider>
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
} 