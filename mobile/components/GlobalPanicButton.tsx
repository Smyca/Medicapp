import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import React, { useEffect, useState, useRef } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View, Modal, Text } from 'react-native';

const PANIC_BAR_HEIGHT = 60;

export default function GlobalPanicButton() {
  const [settings, setSettings] = useState({
    isEnabled: true,
    emergencyContact: '',
    customMessage: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [timer, setTimer] = useState(15);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    if (showModal && timer > 0) {
      timerRef.current = setTimeout(() => setTimer(t => t - 1), 1000);
    }
    if (timer === 0 && showModal) {
      handleConfirm();
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [showModal, timer]);

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

  const callEmergencyContacts = async (contacts) => {
    for (const contact of contacts.slice(0, 2)) { // Solo los dos primeros
      try {
        await fetch('https://abcd1234.ngrok.io/panic-call', { // Usa aquí tu URL pública de ngrok
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ to: contact.phone }),
        });
      } catch (error) {
        console.error('Error llamando a contacto:', contact.phone, error);
      }
    }
  };

  const handlePanicButton = async () => {
    if (!settings.isEnabled) {
      Alert.alert('Botón de pánico desactivado', 'El botón de pánico está desactivado en la configuración.');
      return;
    }
    setTimer(15);
    setShowModal(true);
  };

  const handleConfirm = async () => {
    setShowModal(false);
    try {
      const contactsRaw = await AsyncStorage.getItem('emergencyContacts');
      const contacts = contactsRaw ? JSON.parse(contactsRaw) : [];
      await callEmergencyContacts(contacts);
      Alert.alert(
        '¡Botón de pánico activado!',
        `Se está llamando a tus contactos de emergencia.`
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudieron llamar a los contactos de emergencia');
    }
  };

  const handleCancel = () => {
    setShowModal(false);
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
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>¡Activaste el botón de pánico!</Text>
            <Text style={styles.modalText}>
              Estás en problemas?
            </Text>
            <Text style={styles.modalTimer}>{timer}s</Text>
            <Text style={styles.modalSubText}>
              Esto llamará a tus contactos de emergencia.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalBtnYes} onPress={handleConfirm}>
                <Text style={styles.modalBtnText}>Sí</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalBtnNo} onPress={handleCancel}>
                <Text style={styles.modalBtnText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#23272f',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    width: 320,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    color: '#FF3B30',
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  modalText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalTimer: {
    color: '#FFD93D',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 18,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  modalBtnYes: {
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 28,
    marginHorizontal: 8,
  },
  modalBtnNo: {
    backgroundColor: '#23272f',
    borderWidth: 1,
    borderColor: '#FF3B30',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 28,
    marginHorizontal: 8,
  },
  modalBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});