import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, Link } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, TextInput, TouchableOpacity, View, Text, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import { API_URL } from '@env';
import { Ionicons } from '@expo/vector-icons';

console.log('API_URL:', API_URL);

function showAlert(title: string, message: string) {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n${message}`);
  } else {
    Alert.alert(title, message);
  }
}

export default function RegistroUsuario() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Nuevo estado

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        showAlert('Error', 'Por favor ingresa tu email y contraseña');
        return;
      }

      // Usuario de desarrollo (login local)
      if (email === 'user@gmail.com' && password === 'contraseña1') {
        await AsyncStorage.setItem('userEmail', email);
        await AsyncStorage.setItem('usuarioId', 'dev-usuario');
        router.replace('/(tabs)');
        return;
      }

      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        await AsyncStorage.setItem('userEmail', email);
        await AsyncStorage.setItem('usuarioId', data.usuarioId.toString()); 

        router.replace('/(tabs)');
      } else {
        showAlert('Error', data.message || 'Usuario o contraseña incorrectos');
      }
    } catch (error) {
      console.error('Error during login:', error);
      showAlert('Error', 'Ocurrió un error al iniciar sesión');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 30}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <IconSymbol size={100} name="heart.circle.fill" color="#2196F3" />
            <ThemedText type="title" style={styles.title}>MedicApp</ThemedText>
            <ThemedText style={styles.subtitle}>Tu asistente médico personal</ThemedText>
          </View>

          <ThemedView style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <IconSymbol size={24} name="envelope.fill" color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputContainer}>
              <IconSymbol size={24} name="lock.fill" color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholderTextColor="#999"
              />
              <TouchableOpacity
                onPress={() => setShowPassword((v) => !v)}
                style={{ padding: 10 }}
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={22}
                  color="#999"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <IconSymbol size={24} name="arrow.right.circle.fill" color="#FFFFFF" />
              <ThemedText style={styles.loginButtonText}>Iniciar Sesión</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.forgotPasswordButton}>
              <ThemedText style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</ThemedText>
            </TouchableOpacity>
          </ThemedView>

          <View style={styles.footer}>
            <ThemedText style={styles.footerText}>
              ¿No tienes una cuenta?{" "}
              <Link href="/registrousuario" asChild>
                <TouchableOpacity>
                  <Text style={styles.registerText}>Regístrate aquí</Text>
                </TouchableOpacity>
              </Link>
            </ThemedText>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}



function AppAlert({ message, onClose }: { message: string, onClose: () => void }) {
  if (!message) return null;
  return (
    <View style={styles.appAlertContainer}>
      <IconSymbol name="exclamationmark.triangle.fill" size={20} color="#FF6B6B" style={{ marginRight: 8 }} />
      <Text style={styles.appAlertText}>{message}</Text>
      <TouchableOpacity onPress={onClose} style={{ marginLeft: 8 }}>
        <IconSymbol name="xmark.circle.fill" size={20} color="#FF6B6B" />
      </TouchableOpacity>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181A20',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#2196F3',
  },
  subtitle: {
    fontSize: 18,
    color: '#A9A9A9',
    marginTop: 10,
  },
  formContainer: {
    backgroundColor: '#23272f',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#181A20',
  },
  inputIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    paddingHorizontal: 10,
    color: '#fff',
    backgroundColor: '#181A20',
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    height: 50,
    borderRadius: 10,
    marginTop: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  forgotPasswordButton: {
    alignItems: 'center',
    marginTop: 20,
  },
  forgotPasswordText: {
    color: '#2196F3',
    fontSize: 16,
  },
  footer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 16,
    color: '#A9A9A9',
  },
  registerText: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  appAlertContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#23272f',
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FF6B6B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  appAlertText: {
    color: '#FF6B6B',
    fontSize: 15,
    flex: 1,
    textAlign: 'left',
    fontWeight: 'bold',
  },
});