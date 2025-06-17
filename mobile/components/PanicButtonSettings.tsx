import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function PanicButtonSettings() {
  const [isEnabled, setIsEnabled] = useState(true);
  const [emergencyContact, setEmergencyContact] = useState('');
  const [customMessage, setCustomMessage] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem('panicButtonSettings');
      if (settings) {
        const { isEnabled: savedEnabled, emergencyContact: savedContact, customMessage: savedMessage } = JSON.parse(settings);
        setIsEnabled(savedEnabled);
        setEmergencyContact(savedContact);
        setCustomMessage(savedMessage);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async () => {
    try {
      const settings = {
        isEnabled,
        emergencyContact,
        customMessage,
      };
      await AsyncStorage.setItem('panicButtonSettings', JSON.stringify(settings));
      Alert.alert('Éxito', 'Configuración guardada correctamente');
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('Error', 'No se pudieron guardar los ajustes');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Activar botón de pánico</Text>
        <Switch
          value={isEnabled}
          onValueChange={setIsEnabled}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isEnabled ? '#FF3B30' : '#f4f3f4'}
        />
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Contacto de emergencia</Text>
        <TextInput
          style={styles.input}
          value={emergencyContact}
          onChangeText={setEmergencyContact}
          placeholder="Ingresa un número de teléfono"
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Mensaje personalizado</Text>
        <TextInput
          style={[styles.input, styles.messageInput]}
          value={customMessage}
          onChangeText={setCustomMessage}
          placeholder="Mensaje que se enviará en caso de emergencia"
          multiline
          numberOfLines={3}
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={saveSettings}>
        <Text style={styles.saveButtonText}>Guardar configuración</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  settingItem: {
    marginBottom: 20,
  },
  settingLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  messageInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 