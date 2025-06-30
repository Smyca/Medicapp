import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { API_URL } from '@env';
interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  notes: string;
}

export default function MedicationsScreen() {
  const [medications, setMedications] = useState<Medication[]>([]);

  const loadMedications = async () => {
    try {
      const usuarioId = await AsyncStorage.getItem('usuarioId');
      if (!usuarioId) return;
      const res = await fetch(`${API_URL}/medicamentos/usuario/${usuarioId}`);
      if (res.ok) {
        const data = await res.json();
        setMedications(
          data.map((med: any) => ({
            id: med.id,
            name: med.nombre,
            dosage: med.dosis,
            frequency: med.frecuenciaPersonalizada,
            time: med.horaPersonalizada,
            notes: med.notasAdicionales,
          }))
        );
      } else {
        setMedications([]);
      }
    } catch (error) {
      console.error('Error loading medications:', error);
      setMedications([]);
    }
  };

  useEffect(() => {
    loadMedications();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadMedications();
    }, [])
  );

  const handleDeleteMedication = async (id: string) => {
    Alert.alert(
      'Eliminar Medicamento',
      '¿Estás seguro de que deseas eliminar este medicamento?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
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
              setMedications(medications.filter(med => med.id !== id));
            } catch (error) {
              console.error('Error deleting medication:', error);
              Alert.alert('Error', 'Ocurrió un error al eliminar el medicamento');
            }
          },
        },
      ]
    );
  };

  return (
    <ThemedView style={{ flex: 1, backgroundColor: '#181A20' }}>
      <View style={{ height: 60 }} /> {/* Espacio arriba del header */}
      <View style={styles.headerDark}>
        <ThemedText type="title" style={styles.headerTitleDark}>Mis Medicamentos</ThemedText>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/add-medication')}
          activeOpacity={0.85}
        >
          <IconSymbol size={28} name="plus.circle.fill" color="#fff" />
          <ThemedText style={styles.addButtonText}>Agregar Medicamento</ThemedText>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {medications.length > 0 ? (
          medications.map((medication) => (
            <ThemedView key={medication.id} style={styles.medicationCardDark}>
              <View style={styles.medicationHeader}>
                <IconSymbol size={24} name="pills.fill" color="#4CAF50" />
                <ThemedText style={styles.medicationNameDark}>{medication.name}</ThemedText>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <TouchableOpacity
                    onPress={() => handleDeleteMedication(medication.id)}
                    style={styles.deleteButton}
                  >
                    <IconSymbol size={24} name="trash.fill" color="#FF6B6B" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => router.push({ pathname: '/edit-medication', params: { id: medication.id } })}
                    style={styles.editButton}
                  >
                    <IconSymbol size={24} name="pencil" color="#2196F3" />
                    <ThemedText style={styles.editButtonText}>Editar</ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.medicationDetails}>
                <View style={styles.detailRow}>
                  <IconSymbol size={20} name="drop.fill" color="#2196F3" />
                  <ThemedText style={styles.detailTextDark}>Dosis: {medication.dosage}</ThemedText>
                </View>
                <View style={styles.detailRow}>
                  <IconSymbol size={20} name="clock.fill" color="#FFD93D" />
                  <ThemedText style={styles.detailTextDark}>Frecuencia: cada {medication.frequency} {medication.frequency === '1' ? 'hora' : 'horas'}</ThemedText>
                </View>
                <View style={styles.detailRow}>
                  <IconSymbol size={20} name="alarm.fill" color="#FF6B6B" />
                  <ThemedText style={styles.detailTextDark}>Hora: {medication.time}</ThemedText>
                </View>
                {medication.notes && (
                  <View style={styles.detailRow}>
                    <IconSymbol size={20} name="note.text" color="#9C27B0" />
                    <ThemedText style={styles.notesTextDark}>Notas: {medication.notes}</ThemedText>
                  </View>
                )}
              </View>
            </ThemedView>
          ))
        ) : (
          <ThemedView style={styles.emptyState}>
            <IconSymbol size={64} name="pills" color="#CCCCCC" />
            <ThemedText style={styles.emptyStateTextDark}>
              No hay medicamentos registrados
            </ThemedText>
            <ThemedText style={styles.emptyStateSubtextDark}>
              Presiona el botón "Agregar Medicamento" para comenzar
            </ThemedText>
          </ThemedView>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  medicationActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  medicationDetails: {
    marginLeft: 34,
  },
  detailText: {
    marginLeft: 10,
    fontSize: 15,
  },
  notesText: {
    marginLeft: 10,
    fontSize: 15,
    fontStyle: 'italic',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginTop: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  headerDark: {
    paddingTop: 40,
    paddingBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    backgroundColor: '#23272f',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  headerTitleDark: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textShadowColor: '#181A20',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1976D2',
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 14,
    marginTop: 8,
    shadowColor: '#1976D2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
    letterSpacing: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  medicationCardDark: {
    backgroundColor: '#23272f',
    marginHorizontal: 16,
    marginVertical: 10,
    padding: 18,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  medicationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  medicationNameDark: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    flex: 1,
    color: '#fff',
  },
  deleteButton: {
    padding: 5,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    backgroundColor: '#E3F2FD',
    borderRadius: 6,
    marginLeft: 6,
  },
  editButtonText: {
    color: '#2196F3',
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  emptyStateSubtextDark: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginTop: 10,
  },
});