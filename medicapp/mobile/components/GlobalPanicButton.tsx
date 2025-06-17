import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';

const PANIC_BAR_HEIGHT = 60;

export default function GlobalPanicButton() {
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

  const handlePanicButton = async () => {
    if (!settings.isEnabled) {
      Alert.alert('Botón de pánico desactivado', 'El botón de pánico está desactivado en la configuración.');
      return;
    }

    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permiso de ubicación',
          'Se necesita permiso para acceder a la ubicación',
          [{ text: 'OK' }]
        );
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const message = settings.customMessage || '¡Necesito ayuda!';
      const contact = settings.emergencyContact ? `\nContacto de emergencia: ${settings.emergencyContact}` : '';
      
      Alert.alert(
        '¡Botón de pánico activado!',
        `${message}\n\nTu ubicación actual es: ${location.coords.latitude}, ${location.coords.longitude}.${contact}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Error al obtener la ubicación');
    }
  };

  if (!settings.isEnabled) {
    return null;
  }

  return (
    <View pointerEvents="box-none" style={styles.absoluteContainer}>
      <TouchableOpacity
        style={styles.panicBar}
        onPress={handlePanicButton}
        activeOpacity={0.85}
      >
        <Ionicons name="alert-circle" size={32} color="white" style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  absoluteContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 1000,
    pointerEvents: 'box-none',
    height: PANIC_BAR_HEIGHT,
  },
  panicBar: {
    width: '100%',
    height: PANIC_BAR_HEIGHT,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    zIndex: 1002,
  },
  icon: {
    alignSelf: 'center',
  },
}); 