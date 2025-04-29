import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { MedicamentosContext } from '../context/MedicamentosContext';
import { Ionicons } from '@expo/vector-icons';

const MedicamentosScreen = () => {
  const { theme, isDarkMode, toggleTheme } = useContext(ThemeContext);
  const { medicamentos, agregarMedicamento, eliminarMedicamento } = useContext(MedicamentosContext);
  const [nuevoMedicamento, setNuevoMedicamento] = useState({
    nombre: '',
    dosis: '',
    hora: '',
    frecuencia: 'Cada 8 horas',
  });

  const handleAgregarMedicamento = () => {
    if (nuevoMedicamento.nombre && nuevoMedicamento.dosis && nuevoMedicamento.hora) {
      const [horas, minutos] = nuevoMedicamento.hora.split(':');
      const horaDosis = new Date();
      horaDosis.setHours(parseInt(horas), parseInt(minutos), 0, 0);
      
      agregarMedicamento({
        ...nuevoMedicamento,
        horaDosis: horaDosis,
      });
      
      setNuevoMedicamento({
        nombre: '',
        dosis: '',
        hora: '',
        frecuencia: 'Cada 8 horas',
      });
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      padding: 20,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
    },
    themeButton: {
      padding: 10,
      borderRadius: 20,
      backgroundColor: isDarkMode ? theme.card : '#f0f0f0',
    },
    input: {
      backgroundColor: isDarkMode ? theme.card : '#f5f5f5',
      borderRadius: 10,
      padding: 15,
      marginBottom: 15,
      color: theme.text,
    },
    picker: {
      backgroundColor: isDarkMode ? theme.card : '#f5f5f5',
      borderRadius: 10,
      marginBottom: 15,
    },
    button: {
      backgroundColor: isDarkMode ? theme.accent : '#2196F3',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      marginBottom: 20,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    medicamentoCard: {
      backgroundColor: isDarkMode ? theme.card : '#f5f5f5',
      borderRadius: 10,
      padding: 15,
      marginBottom: 15,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    medicamentoInfo: {
      flex: 1,
    },
    medicamentoNombre: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 5,
    },
    medicamentoDetalles: {
      fontSize: 14,
      color: theme.text,
      opacity: 0.7,
    },
    deleteButton: {
      backgroundColor: isDarkMode ? theme.notification : '#ffebee',
      padding: 8,
      borderRadius: 5,
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    frecuenciaContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 15,
    },
    frecuenciaButton: {
      flex: 1,
      backgroundColor: isDarkMode ? theme.card : '#f5f5f5',
      padding: 10,
      borderRadius: 10,
      marginHorizontal: 5,
      alignItems: 'center',
    },
    frecuenciaButtonActive: {
      backgroundColor: isDarkMode ? theme.accent : '#2196F3',
    },
    frecuenciaButtonText: {
      color: theme.text,
    },
    frecuenciaButtonTextActive: {
      color: '#fff',
    },
  });

  const frecuencias = [
    { label: 'Cada 6h', value: 'Cada 6 horas' },
    { label: 'Cada 8h', value: 'Cada 8 horas' },
    { label: 'Cada 12h', value: 'Cada 12 horas' },
    { label: '1 vez/día', value: 'Una vez al día' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis Medicamentos</Text>
        <TouchableOpacity
          style={styles.themeButton}
          onPress={toggleTheme}
        >
          <Ionicons
            name={isDarkMode ? 'sunny' : 'moon'}
            size={24}
            color={theme.text}
          />
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Nombre del medicamento"
        placeholderTextColor={theme.text + '80'}
        value={nuevoMedicamento.nombre}
        onChangeText={(text) => setNuevoMedicamento({ ...nuevoMedicamento, nombre: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Dosis (ej: 500mg)"
        placeholderTextColor={theme.text + '80'}
        value={nuevoMedicamento.dosis}
        onChangeText={(text) => setNuevoMedicamento({ ...nuevoMedicamento, dosis: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Hora de la primera dosis (HH:MM)"
        placeholderTextColor={theme.text + '80'}
        value={nuevoMedicamento.hora}
        onChangeText={(text) => setNuevoMedicamento({ ...nuevoMedicamento, hora: text })}
      />

      <View style={styles.frecuenciaContainer}>
        {frecuencias.map((frec) => (
          <TouchableOpacity
            key={frec.value}
            style={[
              styles.frecuenciaButton,
              nuevoMedicamento.frecuencia === frec.value && styles.frecuenciaButtonActive
            ]}
            onPress={() => setNuevoMedicamento({ ...nuevoMedicamento, frecuencia: frec.value })}
          >
            <Text style={[
              styles.frecuenciaButtonText,
              nuevoMedicamento.frecuencia === frec.value && styles.frecuenciaButtonTextActive
            ]}>
              {frec.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleAgregarMedicamento}
      >
        <Text style={styles.buttonText}>Agregar Medicamento</Text>
      </TouchableOpacity>

      {medicamentos.map((medicamento) => (
        <View key={medicamento.id} style={styles.medicamentoCard}>
          <View style={styles.medicamentoInfo}>
            <Text style={styles.medicamentoNombre}>{medicamento.nombre}</Text>
            <Text style={styles.medicamentoDetalles}>
              {medicamento.dosis} - {medicamento.frecuencia}
            </Text>
            <Text style={styles.medicamentoDetalles}>
              Primera dosis: {medicamento.hora}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => eliminarMedicamento(medicamento.id)}
          >
            <Ionicons
              name="trash-outline"
              size={24}
              color={isDarkMode ? '#fff' : '#d32f2f'}
            />
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

export default MedicamentosScreen; 