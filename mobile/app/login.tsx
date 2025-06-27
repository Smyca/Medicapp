import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, Link } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, TextInput, TouchableOpacity, View, Text, Platform } from 'react-native';
import { API_URL } from '@env';

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

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        showAlert('Error', 'Por favor ingresa tu email y contraseña');
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
            secureTextEntry
            placeholderTextColor="#999"
          />
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
    color: '#666',
    marginTop: 10,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  inputIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    paddingHorizontal: 10,
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
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: '#666',
  },
  registerText: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
});