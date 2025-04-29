import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { MedicamentosContext } from '../context/MedicamentosContext';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  const { theme, isDarkMode, toggleTheme } = useContext(ThemeContext);
  const { medicamentos } = useContext(MedicamentosContext);
  const [horaActual, setHoraActual] = useState(new Date());
  const [proximasDosis, setProximasDosis] = useState([]);
  const [userName, setUserName] = useState('');

  // Cargar el nombre del usuario
  useEffect(() => {
    loadUserName();
  }, []);

  const loadUserName = async () => {
    try {
      const userInfo = await AsyncStorage.getItem('userInfo');
      if (userInfo) {
        const data = JSON.parse(userInfo);
        setUserName(data.nombre || '');
      }
    } catch (error) {
      console.error('Error al cargar el nombre del usuario:', error);
    }
  };

  // Actualizar la hora actual cada minuto
  useEffect(() => {
    const intervalo = setInterval(() => {
      setHoraActual(new Date());
    }, 60000);
    return () => clearInterval(intervalo);
  }, []);

  // Calcular próximas dosis
  useEffect(() => {
    const dosisProximas = medicamentos
      .map(medicamento => {
        const horaDosis = new Date(medicamento.horaDosis);
        const ahora = new Date();
        
        // Calcular la próxima dosis
        let proximaDosis = new Date(horaDosis);
        while (proximaDosis <= ahora) {
          if (medicamento.frecuencia === 'Cada 6 horas') {
            proximaDosis.setHours(proximaDosis.getHours() + 6);
          } else if (medicamento.frecuencia === 'Cada 8 horas') {
            proximaDosis.setHours(proximaDosis.getHours() + 8);
          } else if (medicamento.frecuencia === 'Cada 12 horas') {
            proximaDosis.setHours(proximaDosis.getHours() + 12);
          } else if (medicamento.frecuencia === 'Una vez al día') {
            proximaDosis.setDate(proximaDosis.getDate() + 1);
          }
        }

        // Calcular la diferencia en horas
        const diferenciaHoras = (proximaDosis - ahora) / (1000 * 60 * 60);
        
        return {
          ...medicamento,
          proximaDosis,
          diferenciaHoras
        };
      })
      .filter(dosis => dosis.diferenciaHoras <= 8)
      .sort((a, b) => a.diferenciaHoras - b.diferenciaHoras);

    setProximasDosis(dosisProximas);
  }, [medicamentos, horaActual]);

  const formatTime = (date) => {
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  const formatTimeRemaining = (diferenciaHoras) => {
    const horas = Math.floor(diferenciaHoras);
    const minutos = Math.round((diferenciaHoras - horas) * 60);
    
    if (horas === 0) {
      return `${minutos} minutos`;
    } else if (minutos === 0) {
      return `${horas} horas`;
    } else {
      return `${horas} horas y ${minutos} minutos`;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#f0f2f5' }]}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: isDarkMode ? '#f5f5f5' : '#121212' }]}>
              Bienvenido
            </Text>
            <Text style={[styles.title, { color: isDarkMode ? '#f5f5f5' : '#121212' }]}>
              {userName}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.themeButton, { backgroundColor: isDarkMode ? '#333' : '#e0e0e0' }]}
            onPress={toggleTheme}
          >
            <Ionicons
              name={isDarkMode ? 'sunny' : 'moon'}
              size={24}
              color={isDarkMode ? '#f5f5f5' : '#000'}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? '#f5f5f5' : '#121212' }]}>
            Próximas Dosis (8 horas)
          </Text>
          {proximasDosis.length > 0 ? (
            proximasDosis.map((medicamento) => (
              <View key={medicamento.id} style={[styles.medicamentoCard, { backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff' }]}>
                <Text style={[styles.medicamentoNombre, { color: isDarkMode ? '#f5f5f5' : '#121212' }]}>
                  {medicamento.nombre}
                </Text>
                <Text style={[styles.medicamentoDetalles, { color: isDarkMode ? '#f5f5f5' : '#121212' }]}>
                  Dosis: {medicamento.dosis}
                </Text>
                <Text style={[styles.medicamentoDetalles, { color: isDarkMode ? '#f5f5f5' : '#121212' }]}>
                  Próxima dosis: {formatTime(medicamento.proximaDosis)}
                </Text>
                <Text style={[styles.medicamentoDetalles, { color: isDarkMode ? '#f5f5f5' : '#121212' }]}>
                  Faltan: {formatTimeRemaining(medicamento.diferenciaHoras)}
                </Text>
              </View>
            ))
          ) : (
            <Text style={[styles.medicamentoDetalles, { color: isDarkMode ? '#f5f5f5' : '#121212' }]}>
              No hay medicamentos programados para las próximas 8 horas
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  themeButton: {
    padding: 10,
    borderRadius: 20,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  medicamentoCard: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  medicamentoNombre: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  medicamentoDetalles: {
    fontSize: 14,
    opacity: 0.7,
  },
});

export default HomeScreen; 