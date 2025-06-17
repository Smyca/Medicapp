import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Switch, TextInput, TouchableOpacity, View } from 'react-native';

const FREQUENCY_OPTIONS = [
  'Cada 8 horas',
  'Cada 12 horas',
  'Cada 24 horas',
];
const HOUR_OPTIONS = [
  "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
  "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"
];

export default function AddMedicationScreen() {
  const [medication, setMedication] = useState({
    name: '',
    dosage: '',
    frequency: '',
    time: '',
    notes: '',
  });
  const [reminder, setReminder] = useState(false);

  const validateMedication = () => {
    if (!medication.name.trim()) {
      Alert.alert('Error', 'El nombre del medicamento es requerido');
      return false;
    }
    if (!medication.dosage.trim()) {
      Alert.alert('Error', 'La dosis es requerida');
      return false;
    }
    if (!medication.frequency.trim()) {
      Alert.alert('Error', 'La frecuencia es requerida');
      return false;
    }
    if (!medication.time.trim()) {
      Alert.alert('Error', 'La hora es requerida');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    try {
      if (!validateMedication()) {
        return;
      }
      const usuarioId = await AsyncStorage.getItem('usuarioId');
      if (!usuarioId) {
        Alert.alert('Error', 'No se encontró el usuario');
        return;
      }
      const res = await fetch('http://localhost:8080/medicamentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuarioId: Number(usuarioId),
          nombre: medication.name,
          dosis: medication.dosage,
          frecuenciaPersonalizada: medication.frequency,
          horaPersonalizada: medication.time,
          recordatorioActivo: reminder,
          notasAdicionales: medication.notes,
          creadoEn: new Date().toISOString(),
        }),
      });
      if (!res.ok) {
        Alert.alert('Error', 'No se pudo guardar el medicamento');
        return;
      }
      if (reminder) {
        await Notifications.requestPermissionsAsync();
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Recordatorio de medicamento',
            body: `Es hora de tomar: ${medication.name}`,
            sound: 'default',
          },
          trigger: {
            channelId: 'medicamentos',
            hour: 8, // Puedes ajustar según la hora seleccionada
            minute: 0,
            repeats: true,
          },
        });
      }
      router.back();
    } catch (error) {
      console.error('Error saving medication:', error);
      Alert.alert('Error', 'Ocurrió un error al guardar el medicamento');
    }
  };

  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
    // Crear canal de notificaciones en Android
    Notifications.getPermissionsAsync();
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('medicamentos', {
        name: 'Medicamentos',
        importance: Notifications.AndroidImportance.HIGH,
        sound: 'default',
      });
    }
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      {/* Botón flotante grande de volver */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.fabBack}
        accessibilityLabel="Volver"
      >
        <IconSymbol size={32} name="chevron.left" color="#fff" />
      </TouchableOpacity>
      <ScrollView contentContainerStyle={{ paddingTop: 80, paddingBottom: 30 }}>
        <ThemedText type="title" style={styles.title}>Agregar Medicamento</ThemedText>
        <ThemedView style={styles.form}>
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Nombre del Medicamento *</ThemedText>
            <TextInput
              style={styles.input}
              value={medication.name}
              onChangeText={(text) => {
                if (text.length <= 30) setMedication({ ...medication, name: text });
              }}
              placeholder="Ej: Paracetamol"
              placeholderTextColor="#aaa"
              autoFocus
              maxLength={30}
            />
          </View>
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Dosis *</ThemedText>
            <TextInput
              style={styles.input}
              value={medication.dosage}
              onChangeText={(text) => {
                if (text.length <= 15) setMedication({ ...medication, dosage: text });
              }}
              placeholder="Ej: 500mg"
              placeholderTextColor="#aaa"
              maxLength={15}
            />
          </View>
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Frecuencia *</ThemedText>
            <View style={styles.optionsRow}>
              {FREQUENCY_OPTIONS.map(opt => (
                <TouchableOpacity
                  key={opt}
                  style={[styles.optionBtn, medication.frequency === opt && styles.optionBtnSelected]}
                  onPress={() => setMedication({ ...medication, frequency: opt })}
                >
                  <ThemedText style={[styles.optionBtnText, medication.frequency === opt && styles.optionBtnTextSelected]}>{opt}</ThemedText>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.input}
              value={medication.frequency}
              onChangeText={(text) => {
                if (text.length <= 25) setMedication({ ...medication, frequency: text });
              }}
              placeholder="Ej: Cada 8 horas"
              placeholderTextColor="#aaa"
              maxLength={25}
            />
          </View>
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Hora *</ThemedText>
            <View style={styles.optionsRow}>
              {HOUR_OPTIONS.map(opt => (
                <TouchableOpacity
                  key={opt}
                  style={[styles.optionBtn, medication.time === opt && styles.optionBtnSelected]}
                  onPress={() => setMedication({ ...medication, time: opt })}
                >
                  <ThemedText style={[styles.optionBtnText, medication.time === opt && styles.optionBtnTextSelected]}>{opt}</ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>¿Activar recordatorio?</ThemedText>
            <Switch
              value={reminder}
              onValueChange={setReminder}
              thumbColor={reminder ? '#1976D2' : '#ccc'}
              trackColor={{ false: '#bbb', true: '#90caf9' }}
            />
          </View>
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Notas Adicionales</ThemedText>
            <TextInput
              style={[styles.input, styles.notesInput]}
              value={medication.notes}
              onChangeText={(text) => {
                if (text.length <= 100) setMedication({ ...medication, notes: text });
              }}
              placeholder="Ej: Tomar después de las comidas"
              placeholderTextColor="#aaa"
              multiline
              numberOfLines={4}
              maxLength={100}
            />
          </View>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave} accessibilityLabel="Guardar Medicamento">
            <IconSymbol size={28} name="checkmark.circle.fill" color="#FFFFFF" />
            <ThemedText style={styles.saveButtonText}>Guardar Medicamento</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fabBack: {
    position: 'absolute',
    top: 70,
    left: 20,
    zIndex: 100,
    backgroundColor: '#2196F3',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 18,
    marginTop: 10,
    color: '#222',
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 22,
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#222',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 10,
    padding: 16,
    fontSize: 20,
    marginTop: 4,
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1976D2',
    padding: 18,
    borderRadius: 14,
    marginTop: 20,
    shadowColor: '#1976D2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
    letterSpacing: 1,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  optionBtn: {
    backgroundColor: '#eee',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 6,
    marginBottom: 6,
  },
  optionBtnSelected: {
    backgroundColor: '#2196F3',
  },
  optionBtnText: {
    fontSize: 18,
    color: '#222',
  },
  optionBtnTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
});