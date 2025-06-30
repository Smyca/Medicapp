import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { API_URL } from '@env';
interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  notes: string;
}

interface EmergencyContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
  address?: string;
  notes?: string;
}

export default function ProfileScreen() {
  const [userData, setUserData] = useState({
    name: '',
    age: '',
    address: '',
    medicalNotes: '',
    bloodType: '',
    allergies: '',
    chronicDiseases: '',
    importantMedication: '',
    profileImage: '',
  });
  const [medications, setMedications] = useState<Medication[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    loadAllUserData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadAllUserData();
    }, [])
  );

  const loadAllUserData = async () => {
    try {
      const usuarioId = await AsyncStorage.getItem('usuarioId');
      if (!usuarioId) return;

      // Obtener datos del usuario
      const usuarioRes = await fetch(`${API_URL}/usuarios/${usuarioId}`);
      let name = '', age = '';
      if (usuarioRes.ok) {
        const data = await usuarioRes.json();
        name = data.nombre || '';
        if (data.fechaNacimiento) {
          // Calcular edad
          const birthDate = new Date(data.fechaNacimiento);
          const today = new Date();
          let years = today.getFullYear() - birthDate.getFullYear();
          const m = today.getMonth() - birthDate.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            years--;
          }
          age = years.toString();
        }
      }

      // Info de emergencia
      const infoEmergenciaRes = await fetch(`${API_URL}/info-emergencia/usuario/${usuarioId}`);
      let address = '', medicalNotes = '';
      if (infoEmergenciaRes.ok) {
        const data = await infoEmergenciaRes.json();
        address = data.zonaDireccion || '';
        medicalNotes = data.notasGenerales || '';
      }

      // Info médica
      const infoMedicaRes = await fetch(`${API_URL}/info-medica/usuario/${usuarioId}`);
      let bloodType = '', allergies = '', chronicDiseases = '', importantMedication = '';
      if (infoMedicaRes.ok) {
        const data = await infoMedicaRes.json();
        bloodType = data.tipoSangre || '';
        allergies = data.alergias || '';
        chronicDiseases = data.enfermedadesCronicas || '';
        importantMedication = data.medicacionImportante || '';
      }

      // Medicamentos
      const medicamentosRes = await fetch(`${API_URL}/medicamentos/usuario/${usuarioId}`);
      let meds: Medication[] = [];
      if (medicamentosRes.ok) {
        const data = await medicamentosRes.json();
        meds = data.map((m: any) => ({
          id: m.idMedicamento?.toString() || m.id?.toString() || '',
          name: m.nombre,
          dosage: m.dosis,
          frequency: m.frecuenciaPersonalizada || '',
          time: m.horaPersonalizada || '',
          notes: m.notasAdicionales || '',
        }));
      }

      // Contactos de emergencia
      const contactosRes = await fetch(`${API_URL}/contactos-emergencia/usuario/${usuarioId}`);
      let contacts: EmergencyContact[] = [];
      if (contactosRes.ok) {
        const data = await contactosRes.json();
        contacts = data.map((c: any) => ({
          id: c.idContacto?.toString() || c.id?.toString() || '',
          name: c.nombre,
          relation: c.relacion || '',
          phone: c.telefono || '',
          address: c.direccion || '',
          notes: c.observaciones || '',
        }));
      }

      setUserData({
        ...userData,
        name,
        age,
        address,
        medicalNotes,
        bloodType,
        allergies,
        chronicDiseases,
        importantMedication,
        profileImage: '', // Puedes cargarla si la tienes guardada
      });
      setMedications(meds);
      setEmergencyContacts(contacts);
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

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userEmail');
      await AsyncStorage.removeItem('usuarioId');
      router.replace('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingTop: 60 }} // 140 (top del botón) + 60 (alto del botón)
    >
      <LinearGradient
        colors={["#23272f", "#23272f", "#23272f"]} // Fondo gris oscuro uniforme
        style={[styles.gradientHeader, { paddingTop: 20 }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        {/* Botón de opciones */}
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => setShowSettings(!showSettings)}
          activeOpacity={0.8}
        >
          <View style={styles.gearBg}>
            <IconSymbol size={32} name="ellipsis" color="#2196F3" />
          </View>
        </TouchableOpacity>

        {/* Menú de opciones */}
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
              <IconSymbol size={20} name="exclamationmark.triangle.fill" color="#FFD93D" />
              <ThemedText style={styles.settingsOptionText}>Configurar Botón de Pánico</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.settingsOption}
              onPress={() => {
                setShowSettings(false);
                handleLogout();
              }}
            >
              <IconSymbol size={20} name="arrow.right.square.fill" color="#FF6B6B" />
              <ThemedText style={styles.settingsOptionText}>Cerrar Sesión</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.settingsOption}
              onPress={() => {
                setShowSettings(false);
                Alert.alert('Funciona', 'El botón fue presionado');
              }}
            >
              <IconSymbol size={20} name="info.circle.fill" color="#4CAF50" />
              <ThemedText style={styles.settingsOptionText}>Opción Adicional</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        )}

        {/* <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => setShowSettings(!showSettings)}
          activeOpacity={0.8}
        >
          <View style={styles.gearBg}>
            <IconSymbol size={32} name="ellipsis" color="#2196F3" />
          </View>
        </TouchableOpacity> */}
        <TouchableOpacity style={styles.profileImageContainer3D} onPress={pickImage} activeOpacity={0.85}>
          <View style={styles.profileImageShadow}>
            <View style={styles.profileImageCircle}>
              {userData.profileImage ? (
                <Image source={{ uri: userData.profileImage }} style={styles.profileImage} />
              ) : (
                <Image source={require('../../assets/images/user-icon.png')} style={styles.profileImage} />
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
          <IconSymbol size={20} name="house.fill" color="#2196F3" />
          <ThemedText style={styles.emergencyLabel}>Dirección/Zona:</ThemedText>
          <ThemedText style={styles.emergencyValue}>{userData.address || 'No especificada'}</ThemedText>
        </View>
        <View style={styles.emergencyRow}>
          <IconSymbol size={20} name="info.circle.fill" color="#2196F3" />
          <ThemedText style={styles.emergencyLabel}>Notas generales:</ThemedText>
          <ThemedText style={styles.emergencyValue}>{userData.medicalNotes || 'Ninguna'}</ThemedText>
        </View>
      </View>

      {/* Tarjeta de información médica */}
      <ThemedView style={styles.card}>
        <ThemedText type="subtitle">Información Médica</ThemedText>
        <View style={styles.infoRow}>
          <IconSymbol size={20} name="drop.fill" color="#2196F3" />
          <ThemedText style={styles.infoText}>Tipo de Sangre: {userData.bloodType || 'No especificado'}</ThemedText>
        </View>
        <View style={styles.infoRow}>
          <IconSymbol size={20} name="exclamationmark.triangle.fill" color="#FFD93D" />
          <ThemedText style={styles.infoText}>Alergias: {userData.allergies || 'Ninguna'}</ThemedText>
        </View>
        <View style={styles.infoRow}>
          <IconSymbol size={20} name="cross.case.fill" color="#9C27B0" />
          <ThemedText style={styles.infoText}>Enfermedades crónicas: {userData.chronicDiseases || 'Ninguna'}</ThemedText>
        </View>
        <View style={styles.infoRow}>
          <IconSymbol size={20} name="pills.fill" color="#4CAF50" />
          <ThemedText style={styles.infoText}>Medicamento importante: {userData.importantMedication || 'No especificado'} </ThemedText>
        </View>
      </ThemedView>

      {/* Tarjeta de medicamentos */}
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
                  <ThemedText style={styles.detailText}>Frecuencia: cada {medication.frequency} {medication.frequency == "1" ? "hora" : "horas" }</ThemedText>
                </View>
                <View style={styles.detailRow}>
                  <IconSymbol size={20} name="alarm.fill" color="#FF6B6B" />
                  <ThemedText style={styles.detailText}>Hora: {medication.time}</ThemedText>
                </View>
                <View style={styles.detailRow}>
                  <IconSymbol size={20} name="info.circle.fill" color="#2196F3" />
                  <ThemedText style={styles.detailText}>Notas: {medication.notes}</ThemedText>
                </View>
              </View>
            </View>
          ))
        ) : (
          <ThemedText style={styles.noMedications}>No hay medicamentos registrados</ThemedText>
        )}
      </ThemedView>

      {/* Tarjeta de contactos de emergencia */}
      <ThemedView style={styles.card}>
        <ThemedText type="subtitle">Contactos de Emergencia</ThemedText>
        {emergencyContacts.length > 0 ? (
          emergencyContacts.map((contact, index) => (
            <View key={contact.id || index} style={styles.contactCard}>
              <IconSymbol size={24} name="person.fill" color="#4CAF50" />
              <View style={styles.contactInfo}>
                <ThemedText style={styles.contactName}>{contact.name}</ThemedText>
                <ThemedText style={styles.contactPhone}>{contact.phone}</ThemedText>
                <ThemedText style={styles.contactRelation}>{contact.relation}</ThemedText>
                {contact.address ? <ThemedText style={styles.contactRelation}>{contact.address}</ThemedText> : null}
                {contact.notes ? <ThemedText style={styles.contactRelation}>{contact.notes}</ThemedText> : null}
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
    backgroundColor: '#181A20', // Fondo general gris oscuro
  },
  gradientHeader: {
    paddingTop: 40,
    paddingBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
    marginBottom: 10,
    position: 'relative',
    backgroundColor: '#23272f', // Fondo header gris oscuro
  },
  settingsButton: {
    position: 'absolute',
    top: 50,
    right: 30,
    zIndex: 10,
  },
  gearBg: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
    borderRadius: 60,
  },
  profileImageCircle: {
    backgroundColor: '#23272f',
    borderRadius: 60,
    padding: 8,
    borderWidth: 4,
    borderColor: '#23272f',
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
    color: '#aaa',
    fontSize: 13,
    marginTop: 4,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#fff',
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  age: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#23272f', // Tarjetas gris oscuro
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
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#fff',
  },
  medicationCard: {
    backgroundColor: '#23272f',
    marginVertical: 8,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#23272f',
    shadowColor: '#000',
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
    color: '#fff',
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
    color: '#fff',
  },
  noMedications: {
    textAlign: 'center',
    color: '#aaa',
    marginVertical: 10,
  },
  settingsMenu: {
    position: 'absolute',
    top: 120,
    right: 30,
    backgroundColor: '#23272f',
    borderRadius: 14,
    padding: 10,
    shadowColor: '#000',
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
    borderBottomColor: '#181A20',
  },
  settingsOptionText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#fff',
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#181A20',
  },
  contactInfo: {
    marginLeft: 10,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  contactPhone: {
    fontSize: 14,
    color: '#aaa',
  },
  contactRelation: {
    fontSize: 14,
    color: '#aaa',
  },
  noContacts: {
    textAlign: 'center',
    color: '#aaa',
    marginVertical: 10,
  },
  emergencyCard: {
    backgroundColor: '#23272f',
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
    color: '#fff',
    fontSize: 15,
  },
  emergencyValue: {
    marginLeft: 6,
    color: '#aaa',
    fontSize: 15,
    flexShrink: 1,
  },
});
