import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Switch, TextInput, TouchableOpacity, View } from 'react-native';
import { API_URL } from '@env';
import DateTimePicker from '@react-native-community/datetimepicker';

const HOUR_OPTIONS = Array.from({ length: 24 }, (_, i) =>
  `${i.toString().padStart(2, '0')}:00`
);

export default function EditMedicationScreen() {
  const { id } = useLocalSearchParams();
  const [medication, setMedication] = useState({
    name: '',
    dosage: '',
    frequency: '',
    time: '',
    notes: '',
  });
  const [reminder, setReminder] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    if (id) {
      loadMedication();
    }
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
    Notifications.getPermissionsAsync();
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('medicamentos', {
        name: 'Medicamentos',
        importance: Notifications.AndroidImportance.HIGH,
        sound: 'default',
      });
    }
  }, [id]);

  const loadMedication = async () => {
    try {
      const res = await fetch(`${API_URL}/medicamentos/${id}`);
      if (res.ok) {
        const med = await res.json();
        setMedication({
          name: med.nombre || '',
          dosage: med.dosis || '',
          frequency: med.frecuenciaPersonalizada || '',
          time: med.horaPersonalizada || '',
          notes: med.notasAdicionales || '',
        });
        setReminder(!!med.recordatorioActivo);
      } else {
        Alert.alert('Error', 'No se pudo cargar el medicamento');
      }
    } catch (error) {
      console.error('Error loading medication:', error);
      Alert.alert('Error', 'No se pudo cargar el medicamento');
    }
  };

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
      const res = await fetch(`${API_URL}/medicamentos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuarioId: Number(usuarioId),
          nombre: medication.name,
          dosis: medication.dosage,
          frecuenciaPersonalizada: medication.frequency,
          horaPersonalizada: medication.time,
          recordatorioActivo: reminder,
          notasAdicionales: medication.notes,
        }),
      });
      if (!res.ok) {
        Alert.alert('Error', 'No se pudo actualizar el medicamento');
        return;
      }
      if (reminder) {
        await Notifications.requestPermissionsAsync();
        const [startHour, startMinute] = medication.time.split(':').map(Number);
        const intervalHours = Number(medication.frequency) || 24;

          // Calcular la próxima fecha/hora de notificación
        const now = new Date();
        let firstNotification = new Date(now);
        firstNotification.setHours(startHour, startMinute, 0, 0);
        if (firstNotification <= now) {
          firstNotification.setDate(firstNotification.getDate() + 1);
        }

        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Recordatorio de medicamento',
            body: `Es hora de tomar: ${medication.name}`,
            sound: 'default',
          },
          trigger: firstNotification, 
        });

        for (let i = 0; i < 24; i += intervalHours) {
          const hour = (startHour + i) % 24;
          await Notifications.scheduleNotificationAsync({
            content: {
              title: 'Recordatorio de medicamento',
              body: `Medicamento: ${medication.name} agendado!`,
              sound: 'default',
            },
            trigger: {
              channelId: 'medicamentos',
              hour,
              minute: startMinute,
              repeats: true,
              
            },
          });
        }

       
      }
      router.back();
    } catch (error) {
      console.error('Error saving medication:', error);
      Alert.alert('Error', 'Ocurrió un error al guardar el medicamento');
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Eliminar Medicamento',
      '¿Estás seguro de que deseas eliminar este medicamento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const res = await fetch(`${API_URL}/medicamentos/${id}`, {
                method: 'DELETE',
              });
              if (!res.ok) {
                Alert.alert('Error', 'No se pudo eliminar el medicamento');
                return;
              }
              router.back();
            } catch (error) {
              Alert.alert('Error', 'Ocurrió un error al eliminar el medicamento');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#181A20' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 70, marginBottom: 10, justifyContent: 'center' }}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.squareBackBtn}
          accessibilityLabel="Volver"
        >
          <ThemedText style={{ color: '#fff', fontSize: 28, fontWeight: 'bold', marginTop: -2 }}>&lt;</ThemedText>
        </TouchableOpacity>
        <ThemedText
          type="title"
          style={[styles.title, { textAlign: 'left', marginLeft: 12 }]}
        >
          Editar Medicamento
        </ThemedText>
      </View>
      <ScrollView contentContainerStyle={{ paddingTop: 10, paddingBottom: 30 }}>
        <ThemedView style={styles.form}>
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Nombre del Medicamento *</ThemedText>
            <TextInput
              style={styles.input}
              value={medication.name}
              onChangeText={(text) => {
                const clean = text.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/g, '');
                if (clean.length <= 30) setMedication({ ...medication, name: clean });
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
                const clean = text.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ\s]/g, '');
                if (clean.length <= 15) setMedication({ ...medication, dosage: clean });
              }}
              placeholder="Ej: 2 comprimidos de 500mg"
              placeholderTextColor="#aaa"
              maxLength={15}
            />
          </View>
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Frecuencia *</ThemedText>
            <View style={{ flexDirection: 'row', alignItems: 'center',justifyContent: 'center' }}>
              <ThemedText style={{ fontSize: 18, color: '#A9A9A9' }}>Cada </ThemedText>
              <TextInput
                style={[styles.input, { width: 60, marginRight: 8, marginLeft: 4, textAlign: 'center' }]}
                value={medication.frequency}
                onChangeText={text => {
                  let numeric = text.replace(/\D/g, '').slice(0, 2);
                  if (numeric) {
                    let num = parseInt(numeric, 10);
                    if (num < 1) numeric = '1';
                    else if (num > 24) numeric = '24';
                    else numeric = num.toString();
                  }
                  setMedication({ ...medication, frequency: numeric });
                }}
                placeholder="8"
                placeholderTextColor="#aaa"
                keyboardType="numeric"
                maxLength={2}
              />
              <ThemedText style={{ fontSize: 18, color: '#A9A9A9' }}>horas</ThemedText>
            </View>
          </View>
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Hora *</ThemedText>
            <TouchableOpacity
              style={[
                styles.input,
                {
                  width: 200,
                  minHeight: 54,
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                  paddingVertical: 18,
                },
              ]}
              onPress={() => setShowTimePicker(true)}
            >
              <ThemedText style={{ color: '#fff', fontSize: 24, letterSpacing: 2 }}>
                {medication.time ? medication.time.slice(0, 5) : 'Seleccionar'}
              </ThemedText>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={
                  medication.time
                    ? (() => {
                        const [h, m] = medication.time.split(':').map(Number);
                        const now = new Date();
                        now.setHours(h);
                        now.setMinutes(m);
                        now.setSeconds(0);
                        now.setMilliseconds(0);
                        return now;
                      })()
                    : new Date()
                }
                mode="time"
                is24Hour={true}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => {
                  if (Platform.OS === 'android') {
                    if (event.type === 'set' && selectedDate) {
                      const hours = selectedDate.getHours().toString().padStart(2, '0');
                      const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
                      setMedication({ ...medication, time: `${hours}:${minutes}` });
                    }
                    setShowTimePicker(false);
                  } else {
                    if (selectedDate) {
                      const hours = selectedDate.getHours().toString().padStart(2, '0');
                      const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
                      setMedication({ ...medication, time: `${hours}:${minutes}` });
                    }
                  }
                }}
                style={{ backgroundColor: '#181A20' }}
              />
            )}
            {Platform.OS === 'ios' && showTimePicker && (
              <TouchableOpacity
                style={{
                  backgroundColor: '#1976D2',
                  padding: 12,
                  borderRadius: 8,
                  alignItems: 'center',
                  marginTop: 10,
                }}
                onPress={() => setShowTimePicker(false)}
              >
                <ThemedText style={{ color: '#fff', fontWeight: 'bold' }}>Aceptar</ThemedText>
              </TouchableOpacity>
            )}
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
                const clean = text.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ\s]/g, '');
                if (clean.length <= 100) setMedication({ ...medication, notes: clean });
              }}
              placeholder="Ej: Tomar después de las comidas"
              placeholderTextColor="#aaa"
              multiline
              numberOfLines={4}
              maxLength={100}
            />
          </View>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave} accessibilityLabel="Guardar Cambios">
            <IconSymbol size={28} name="checkmark.circle.fill" color="#FFFFFF" />
            <ThemedText style={styles.saveButtonText}>Guardar Cambios</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <IconSymbol size={28} name="trash.fill" color="#fff" />
            <ThemedText style={styles.deleteButtonText}>Eliminar Medicamento</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 18,
    marginTop: 10,
    color: '#fff',
  },
  form: {
    padding: 20,
    backgroundColor: '#181A20',
    borderRadius: 0,
  },
  inputGroup: {
    marginBottom: 22,
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#A9A9A9',
  },
  input: {
    backgroundColor: '#23272f',
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 10,
    padding: 16,
    fontSize: 20,
    marginTop: 4,
    color: '#fff',
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
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D32F2F',
    padding: 18,
    borderRadius: 14,
    marginTop: 18,
    shadowColor: '#D32F2F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  deleteButtonText: {
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
    backgroundColor: '#64b5f6',
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
  squareBackBtn: {
    width: 40,
    height: 40,
    backgroundColor: '#222',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
});