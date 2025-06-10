import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, TextInput, TouchableOpacity, View } from 'react-native';

export default function PanicSettingsScreen() {
  const [settings, setSettings] = useState({
    isEnabled: true,
    emergencyContact: '',
    customMessage: '',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('panicButtonSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleSave = async () => {
    try {
      await AsyncStorage.setItem('panicButtonSettings', JSON.stringify(settings));
      Alert.alert('Configuración guardada', 'Los ajustes del botón de pánico se guardaron correctamente.');
      router.back();
    } catch (error) {
      Alert.alert('Error', 'No se pudieron guardar los ajustes.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={["#FF3B30", "#FF6B6B", "#ffffff"]}
        style={styles.gradientHeader}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <IconSymbol size={24} name="chevron.left" color="#fff" />
        </TouchableOpacity>
        <ThemedText type="title" style={styles.headerTitle}>Configurar Botón de Pánico</ThemedText>
      </LinearGradient>

      <View style={styles.formCard}>
        <View style={styles.settingItem}>
          <View style={styles.settingHeader}>
            <IconSymbol size={24} name="exclamationmark.triangle.fill" color="#FF3B30" />
            <ThemedText style={styles.settingLabel}>Activar botón de pánico</ThemedText>
          </View>
          <Switch
            value={settings.isEnabled}
            onValueChange={(value) => setSettings({ ...settings, isEnabled: value })}
            trackColor={{ false: '#767577', true: '#FF6B6B' }}
            thumbColor={settings.isEnabled ? '#FF3B30' : '#f4f3f4'}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingHeader}>
            <IconSymbol size={24} name="phone.fill" color="#2196F3" />
            <ThemedText style={styles.settingLabel}>Contacto de emergencia</ThemedText>
          </View>
          <TextInput
            style={styles.input}
            value={settings.emergencyContact}
            onChangeText={(text) => setSettings({ ...settings, emergencyContact: text })}
            placeholder="Ingresa un número de teléfono"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingHeader}>
            <IconSymbol size={24} name="message.fill" color="#4CAF50" />
            <ThemedText style={styles.settingLabel}>Mensaje personalizado</ThemedText>
          </View>
          <TextInput
            style={[styles.input, styles.messageInput]}
            value={settings.customMessage}
            onChangeText={(text) => setSettings({ ...settings, customMessage: text })}
            placeholder="Mensaje que se enviará en caso de emergencia"
            multiline
            numberOfLines={3}
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <IconSymbol size={22} name="checkmark.circle.fill" color="#fff" />
          <ThemedText style={styles.saveButtonText}>Guardar configuración</ThemedText>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eaf6fb',
  },
  gradientHeader: {
    paddingTop: 40,
    paddingBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
    marginBottom: 10,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  formCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 16,
    padding: 18,
    borderRadius: 18,
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  settingItem: {
    marginBottom: 20,
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  input: {
    backgroundColor: '#f8fafd',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontSize: 15,
  },
  messageInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF3B30',
    padding: 14,
    borderRadius: 12,
    marginTop: 18,
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10,
    fontSize: 16,
  },
}); 