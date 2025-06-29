import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import 'react-native-reanimated';

import GlobalPanicButton from '@/components/GlobalPanicButton';
import { WelcomeMessage } from '@/components/WelcomeMessage';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const segments = useSegments();
  const router = useRouter();
  const [showWelcome, setShowWelcome] = useState(true);
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const flatSegments = segments.flat();
  const isLoginScreen = flatSegments.includes('login');
  const isRegistroScreen = flatSegments.includes('registrousuario');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const usuarioId = await AsyncStorage.getItem('usuarioId');
      if (!usuarioId && !isLoginScreen && !isRegistroScreen) {
        router.replace('/login');
      } else if (usuarioId && (isLoginScreen || isRegistroScreen)) {
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      router.replace('/login');
    }
  };

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="login" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="add-medication" />
          <Stack.Screen name="edit-profile" />
          <Stack.Screen name="panic-settings" />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
        {/* Solo muestra el botón si NO es login ni registro */}
        {!(isLoginScreen || isRegistroScreen) && <GlobalPanicButton />}
        {showWelcome && <WelcomeMessage />}
      </View>
    </ThemeProvider>
  );
}
