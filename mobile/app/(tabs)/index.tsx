import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  notes: string;
}

interface EmergencyContact {
  name: string;
  phone: string;
  relation: string;
}

export default function ProfileScreen() {
  const [userData, setUserData] = useState({
    name: '',
    age: '',
    bloodType: '',
    allergies: '',
    chronicDiseases: '',
    importantMedication: '',
    address: '',
    medicalNotes: '',
    emergencyContacts: [] as EmergencyContact[],
    profileImage: ''
  });
  const [medications, setMedications] = useState<Medication[]>([]);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    loadUserData();
    loadMedications();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadUserData();
      loadMedications();
    }, [])
  );

  const loadUserData = async () => {
    try {
      // Obtén el usuarioId guardado en AsyncStorage (debe guardarse al hacer login)
      const usuarioId = await AsyncStorage.getItem('usuarioId');
      if (!usuarioId) return;

      // Llama al backend para obtener la info de emergencia
      const response = await fetch(`http://localhost:8080/infoEmergencia/usuario/${usuarioId}`);
      if (response.ok) {
        const data = await response.json();
        console.log(data)
        setUserData({
          name: data.nombre || '', // Ajusta según los campos que devuelva tu backend
          age: data.edad || '',
          bloodType: data.tipoSangre || '',
          allergies: data.alergias || '',
          chronicDiseases: data.enfermedadesCronicas || '',
          importantMedication: data.medicacionImportante || '',
          address: data.zonaDireccion || '',
          medicalNotes: data.notasMedicas || '',
          emergencyContacts: [], // Si tienes contactos, agrégalos aquí
          profileImage: '', // Si tienes imagen, agrégala aquí
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const saveProfileImage = async (uri: string) => {
    try {
      const updatedData = { ...userData, profileImage: uri };
      setUserData(updatedData);
      await AsyncStorage.setItem('userData', JSON.stringify(updatedData));
    } catch (error) {
      console.error('Error saving profile image:', error);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      saveProfileImage(result.assets[0].uri);
    }
  };

  const loadMedications = async () => {
    try {
      const storedMedications = await AsyncStorage.getItem('medications');
      if (storedMedications) {
        setMedications(JSON.parse(storedMedications));
      }
    } catch (error) {
      console.error('Error loading medications:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userEmail');
      router.replace('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: 0 }}>
      <LinearGradient
        colors={["#2196F3", "#6DD5FA", "#ffffff"]}
        style={[styles.gradientHeader, { paddingTop: 20 }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => setShowSettings(!showSettings)}
          activeOpacity={0.8}
        >
          <View style={styles.gearBg}>
            <IconSymbol size={32} name="ellipsis" color="#2196F3" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.profileImageContainer3D} onPress={pickImage} activeOpacity={0.85}>
          <View style={styles.profileImageShadow}>
            <View style={styles.profileImageCircle}>
              {userData.profileImage ? (
                <Image source={{ uri: userData.profileImage }} style={styles.profileImage} />
              ) : (
                <Image source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }} style={styles.profileImage} />
              )}
            </View>
          </View>
          <ThemedText style={styles.editPhotoText}>Editar foto</ThemedText>
        </TouchableOpacity>
        <ThemedText type="title" style={styles.name}>{userData.name || 'Usuario'}</ThemedText>
        <ThemedText style={styles.age}>{userData.age ? `${userData.age} años` : 'Edad no especificada'}</ThemedText>
      </LinearGradient>

      {/* Tarjeta de información de emergencia */}
      <View style={styles.emergencyCard}>
        <View style={styles.emergencyHeader}>
          <IconSymbol size={28} name="exclamationmark.triangle.fill" color="#FF3B30" />
          <ThemedText style={styles.emergencyTitle}>Información de Emergencia</ThemedText>
        </View>
        <View style={styles.emergencyRow}>
          <IconSymbol size={20} name="drop.fill" color="#2196F3" />
          <ThemedText style={styles.emergencyLabel}>Tipo de Sangre:</ThemedText>
          <ThemedText style={styles.emergencyValue}>{userData.bloodType || 'No especificado'}</ThemedText>
        </View>
        <View style={styles.emergencyRow}>
          <IconSymbol size={20} name="exclamationmark.triangle.fill" color="#FFD93D" />
          <ThemedText style={styles.emergencyLabel}>Alergias:</ThemedText>
          <ThemedText style={styles.emergencyValue}>{userData.allergies || 'Ninguna'}</ThemedText>
        </View>
        <View style={styles.emergencyRow}>
          <IconSymbol size={20} name="cross.case.fill" color="#9C27B0" />
          <ThemedText style={styles.emergencyLabel}>Enfermedades crónicas:</ThemedText>
          <ThemedText style={styles.emergencyValue}>{userData.chronicDiseases || 'Ninguna'}</ThemedText>
        </View>
        <View style={styles.emergencyRow}>
          <IconSymbol size={20} name="pills.fill" color="#4CAF50" />
          <ThemedText style={styles.emergencyLabel}>Medicamento importante:</ThemedText>
          <ThemedText style={styles.emergencyValue}>{userData.importantMedication || 'No especificado'}</ThemedText>
        </View>
        <View style={styles.emergencyRow}>
          <IconSymbol size={20} name="person.crop.circle.fill.badge.exclam" color="#FF3B30" />
          <ThemedText style={styles.emergencyLabel}>Contacto principal:</ThemedText>
          <ThemedText style={styles.emergencyValue}>{userData.emergencyContacts?.[0]?.name || 'No especificado'} {userData.emergencyContacts?.[0]?.phone ? `(${userData.emergencyContacts[0].phone})` : ''}</ThemedText>
        </View>
        <View style={styles.emergencyRow}>
          <IconSymbol size={20} name="house.fill" color="#2196F3" />
          <ThemedText style={styles.emergencyLabel}>Dirección/Zona:</ThemedText>
          <ThemedText style={styles.emergencyValue}>{userData.address || 'No especificada'}</ThemedText>
        </View>
        <View style={styles.emergencyRow}>
          <IconSymbol size={20} name="info.circle.fill" color="#2196F3" />
          <ThemedText style={styles.emergencyLabel}>Notas médicas:</ThemedText>
          <ThemedText style={styles.emergencyValue}>{userData.medicalNotes || 'Ninguna'}</ThemedText>
        </View>
      </View>

      {showSettings && (
        <ThemedView style={styles.settingsMenu}>
          <TouchableOpacity 
            style={styles.settingsOption}
            onPress={() => {
              setShowSettings(false);
              router.push('/edit-profile');
            }}
          >
            <IconSymbol size={20} name="pencil" color="#2196F3" />
            <ThemedText style={styles.settingsOptionText}>Editar Perfil</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.settingsOption}
            onPress={() => {
              setShowSettings(false);
              router.push('/panic-settings');
            }}
          >
            <IconSymbol size={20} name="exclamationmark.triangle.fill" color="#FF3B30" />
            <ThemedText style={styles.settingsOptionText}>Configurar Botón de Pánico</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.settingsOption}
            onPress={() => {
              Alert.alert(
                'Cerrar Sesión',
                '¿Estás seguro de que deseas cerrar sesión?',
                [
                  {
                    text: 'Cancelar',
                    style: 'cancel',
                    onPress: () => setShowSettings(false)
                  },
                  {
                    text: 'Cerrar Sesión',
                    style: 'destructive',
                    onPress: handleLogout
                  }
                ]
              );
            }}
          >
            <IconSymbol size={20} name="arrow.right.square.fill" color="#FF6B6B" />
            <ThemedText style={styles.settingsOptionText}>Cerrar Sesión</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      )}

      <ThemedView style={styles.card}>
        <ThemedText type="subtitle">Información Médica</ThemedText>
        <View style={styles.infoRow}>
          <IconSymbol size={24} name="heart.fill" color="#FF6B6B" />
          <ThemedText style={styles.infoText}>Tipo de Sangre: {userData.bloodType || 'No especificado'}</ThemedText>
        </View>
        <View style={styles.infoRow}>
          <IconSymbol size={24} name="exclamationmark.triangle.fill" color="#FFD93D" />
          <ThemedText style={styles.infoText}>Alergias: {userData.allergies || 'Ninguna'}</ThemedText>
        </View>
      </ThemedView>

      <ThemedView style={styles.card}>
        <ThemedText type="subtitle">Medicamentos</ThemedText>
        {medications.length > 0 ? (
          medications.map((medication) => (
            <View key={medication.id} style={styles.medicationCard}>
              <View style={styles.medicationHeader}>
                <IconSymbol size={24} name="pills.fill" color="#4CAF50" />
                <ThemedText style={styles.medicationName}>{medication.name}</ThemedText>
              </View>
              <View style={styles.medicationDetails}>
                <View style={styles.detailRow}>
                  <IconSymbol size={20} name="drop.fill" color="#2196F3" />
                  <ThemedText style={styles.detailText}>Dosis: {medication.dosage}</ThemedText>
                </View>
                <View style={styles.detailRow}>
                  <IconSymbol size={20} name="clock.fill" color="#FFD93D" />
                  <ThemedText style={styles.detailText}>Frecuencia: {medication.frequency}</ThemedText>
                </View>
                <View style={styles.detailRow}>
                  <IconSymbol size={20} name="alarm.fill" color="#FF6B6B" />
                  <ThemedText style={styles.detailText}>Hora: {medication.time}</ThemedText>
                </View>
              </View>
            </View>
          ))
        ) : (
          <ThemedText style={styles.noMedications}>No hay medicamentos registrados</ThemedText>
        )}
      </ThemedView>

      <ThemedView style={styles.card}>
        <ThemedText type="subtitle">Contactos de Emergencia</ThemedText>
        {userData.emergencyContacts && userData.emergencyContacts.length > 0 ? (
          userData.emergencyContacts.map((contact, index) => (
            <View key={index} style={styles.contactCard}>
              <IconSymbol size={24} name="person.fill" color="#4CAF50" />
              <View style={styles.contactInfo}>
                <ThemedText style={styles.contactName}>{contact.name}</ThemedText>
                <ThemedText style={styles.contactPhone}>{contact.phone}</ThemedText>
                <ThemedText style={styles.contactRelation}>{contact.relation}</ThemedText>
              </View>
            </View>
          ))
        ) : (
          <ThemedText style={styles.noContacts}>No hay contactos de emergencia registrados</ThemedText>
        )}
      </ThemedView>
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
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
    marginBottom: 10,
    position: 'relative',
  },
  settingsButton: {
    position: 'absolute',
    top: 50,
    right: 30,
    zIndex: 10,
  },
  gearBg: {
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImageContainer3D: {
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImageShadow: {
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
    borderRadius: 60,
  },
  profileImageCircle: {
    backgroundColor: '#fff',
    borderRadius: 60,
    padding: 8,
    borderWidth: 4,
    borderColor: '#6DD5FA',
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
    overflow: 'hidden',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    resizeMode: 'cover',
  },
  editPhotoText: {
    color: '#2196F3',
    fontSize: 13,
    marginTop: 4,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#222',
    textShadowColor: '#6DD5FA',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  age: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 10,
    padding: 18,
    borderRadius: 18,
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 16,
  },
  medicationCard: {
    backgroundColor: '#f8fafd',
    marginVertical: 8,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#6DD5FA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  medicationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  medicationName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  medicationDetails: {
    marginLeft: 34,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  detailText: {
    marginLeft: 10,
    fontSize: 14,
  },
  noMedications: {
    textAlign: 'center',
    color: '#666',
    marginVertical: 10,
  },
  settingsMenu: {
    position: 'absolute',
    top: 120,
    right: 30,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 10,
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 10,
    zIndex: 1000,
  },
  settingsOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  settingsOptionText: {
    marginLeft: 10,
    fontSize: 16,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  contactInfo: {
    marginLeft: 10,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactPhone: {
    fontSize: 14,
    color: '#666',
  },
  contactRelation: {
    fontSize: 14,
    color: '#888',
  },
  noContacts: {
    textAlign: 'center',
    color: '#666',
    marginVertical: 10,
  },
  emergencyCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 10,
    padding: 18,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#FF3B30',
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 10,
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginLeft: 10,
  },
  emergencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  emergencyLabel: {
    marginLeft: 8,
    fontWeight: 'bold',
    color: '#222',
    fontSize: 15,
  },
  emergencyValue: {
    marginLeft: 6,
    color: '#444',
    fontSize: 15,
    flexShrink: 1,
  },
});
