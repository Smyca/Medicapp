import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Switch, TextInput, TouchableOpacity, View } from 'react-native';

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

  const FREQUENCY_OPTIONS = [
    'Cada 8 horas',
    'Cada 12 horas',
    'Cada 24 horas',
  ];
  const TIME_OPTIONS = [
    'Mañana',
    'Tarde',
    'Noche',
  ];

  useEffect(() => {
    loadMedication();
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
      const storedMedications = await AsyncStorage.getItem('medications');
      if (storedMedications) {
        const meds = JSON.parse(storedMedications);
        const med = meds.find((m: any) => m.id === id);
        if (med) {
          setMedication(med);
        }
      }
    } catch (error) {
      console.error('Error loading medication:', error);
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
      const storedMedications = await AsyncStorage.getItem('medications');
      let medications = storedMedications ? JSON.parse(storedMedications) : [];
      medications = medications.map((m: any) => m.id === id ? { ...m, ...medication } : m);
      await AsyncStorage.setItem('medications', JSON.stringify(medications));
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
            hour: 8, // Aquí puedes mejorar para usar la hora seleccionada
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
              const storedMedications = await AsyncStorage.getItem('medications');
              let medications = storedMedications ? JSON.parse(storedMedications) : [];
              medications = medications.filter((m: any) => m.id !== id);
              await AsyncStorage.setItem('medications', JSON.stringify(medications));
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
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol size={24} name="chevron.left" color="#2196F3" />
        </TouchableOpacity>
        <ThemedText type="title">Editar Medicamento</ThemedText>
      </ThemedView>

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
            maxLength={25}
          />
        </View>

        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Hora *</ThemedText>
          <View style={styles.optionsRow}>
            {TIME_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt}
                style={[styles.optionBtn, medication.time === opt && styles.optionBtnSelected]}
                onPress={() => setMedication({ ...medication, time: opt })}
              >
                <ThemedText style={[styles.optionBtnText, medication.time === opt && styles.optionBtnTextSelected]}>{opt}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>
          <TextInput
            style={styles.input}
            value={medication.time}
            onChangeText={(text) => {
              if (text.length <= 20) setMedication({ ...medication, time: text });
            }}
            placeholder="Ej: 8:00 AM"
            maxLength={20}
          />
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
            multiline
            numberOfLines={4}
            maxLength={100}
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <IconSymbol size={28} name="checkmark.circle.fill" color="#FFFFFF" />
          <ThemedText style={styles.saveButtonText}>Guardar Cambios</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <IconSymbol size={28} name="trash.fill" color="#fff" />
          <ThemedText style={styles.deleteButtonText}>Eliminar Medicamento</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 15,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
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
});