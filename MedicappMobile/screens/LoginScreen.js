import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  useColorScheme,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { authService } from '../services/authService';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(useColorScheme() === 'dark');
  const { signIn } = useContext(AuthContext);

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor ingresa tu correo y contraseña');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.login(email, password);
      if (response && response.token) {
        await signIn(response.token);
      } else {
        throw new Error('Credenciales inválidas');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const aumentarFuente = () => setFontSize((prev) => Math.min(prev + 2, 28));
  const disminuirFuente = () => setFontSize((prev) => Math.max(prev - 2, 12));

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#f0f2f5' }]}>
      <View style={styles.darkModeContainer}>
        <TouchableOpacity
          style={[styles.darkModeButton, { backgroundColor: isDarkMode ? '#333' : '#e0e0e0' }]}
          onPress={() => setIsDarkMode(!isDarkMode)}
        >
          <MaterialCommunityIcons 
            name={isDarkMode ? "white-balance-sunny" : "moon-waning-crescent"} 
            size={22} 
            color={isDarkMode ? "#f5f5f5" : "#000"} 
          />
        </TouchableOpacity>
      </View>

      <Text style={[styles.title, { color: isDarkMode ? '#f5f5f5' : '#121212' }]}>
        Medicapp
      </Text>

      <View style={[styles.card, { backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff' }]}>
        <Text style={[styles.cardTitle, { color: isDarkMode ? '#f5f5f5' : '#333' }]}>
          Iniciar Sesión
        </Text>

        <View style={styles.fontSizeButtons}>
          <TouchableOpacity
            style={[styles.fontButton, { backgroundColor: '#007bff' }]}
            onPress={disminuirFuente}
          >
            <Text style={styles.fontButtonText}>A-</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.fontButton, { backgroundColor: '#007bff' }]}
            onPress={aumentarFuente}
          >
            <Text style={styles.fontButtonText}>A+</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={[
            styles.input,
            {
              fontSize,
              backgroundColor: isDarkMode ? '#2c2c2c' : '#fff',
              color: isDarkMode ? '#f5f5f5' : '#000',
            },
          ]}
          placeholder="Correo electrónico"
          placeholderTextColor={isDarkMode ? '#888' : '#666'}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
        />

        <View style={styles.passwordContainer}>
          <TextInput
            style={[
              styles.input,
              {
                fontSize,
                backgroundColor: isDarkMode ? '#2c2c2c' : '#fff',
                color: isDarkMode ? '#f5f5f5' : '#000',
              },
            ]}
            placeholder="Contraseña"
            placeholderTextColor={isDarkMode ? '#888' : '#666'}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            editable={!loading}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
            disabled={loading}
          >
            <MaterialCommunityIcons
              name={showPassword ? "eye" : "eye-off"}
              size={22}
              color={isDarkMode ? "#f5f5f5" : "#333"}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#007bff', opacity: loading ? 0.7 : 1 }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Ingresar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Register')}
          style={styles.registerLink}
          disabled={loading}
        >
          <Text style={{ color: isDarkMode ? '#f5f5f5' : '#333' }}>
            ¿No tienes cuenta? Regístrate aquí
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  card: {
    width: '90%',
    maxWidth: 400,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  fontSizeButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
  },
  fontButton: {
    padding: 10,
    borderRadius: 8,
  },
  fontButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  input: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  passwordContainer: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  button: {
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  registerLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  darkModeContainer: {
    position: 'absolute',
    top: 35,
    right: 20,
    zIndex: 1,
  },
  darkModeButton: {
    padding: 12,
    borderRadius: 20,
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoginScreen; 