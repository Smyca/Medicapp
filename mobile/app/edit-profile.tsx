import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { API_URL } from '@env';

export default function EditProfileScreen() {
  // Estados para cada grupo de datos
  const [emergencyData, setEmergencyData] = useState({
    address: '',
    medicalNotes: '',
  });
  const [medicalData, setMedicalData] = useState({
    bloodType: '',
    allergies: '',
    chronicDiseases: '',
    importantMedication: '',
  });
  const [emergencyContacts, setEmergencyContacts] = useState([
    { name: '', phone: '', relation: '' },
    { name: '', phone: '', relation: '' }
  ]);
  const [age, setAge] = useState(''); // Nuevo estado para la edad
  const [name, setName] = useState(''); // Nuevo estado para el nombre

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const usuarioId = await AsyncStorage.getItem('usuarioId');
      if (!usuarioId) return;

      // Info de emergencia
      const infoEmergenciaRes = await fetch(`${API_URL}/info-emergencia/usuario/${usuarioId}`);
      if (infoEmergenciaRes.ok) {
        const data = await infoEmergenciaRes.json();
        setEmergencyData({
          address: data.zonaDireccion || '',
          medicalNotes: data.notasGenerales || '',
        });
        setAge(data.edad ? String(data.edad) : ''); // Cargar edad si viene del backend
      }

      // Info médica
      const infoMedicaRes = await fetch(`${API_URL}/info-medica/usuario/${usuarioId}`);
      if (infoMedicaRes.ok) {
        const data = await infoMedicaRes.json();
        setMedicalData({
          bloodType: data.tipoSangre || '',
          allergies: data.alergias || '',
          chronicDiseases: data.enfermedadesCronicas || '',
          importantMedication: data.medicacionImportante || '',
        });
      }

      // Contactos de emergencia
      const contactosRes = await fetch(`${API_URL}/contactos-emergencia/usuario/${usuarioId}`);
      if (contactosRes.ok) {
        const data = await contactosRes.json();
        // Siempre tener 2 contactos (rellenar con vacíos si faltan)
        let contacts = data.length > 0
          ? data.map((c: any) => ({
              name: c.nombre || '',
              phone: c.telefono || '',
              relation: c.relacion || '',
            }))
          : [];
        while (contacts.length < 2) {
          contacts.push({ name: '', phone: '', relation: '' });
        }
        setEmergencyContacts(contacts.slice(0, 2));
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar la información');
    }
  };

  // Handlers para los campos
  const handleEmergencyChange = (field: string, value: string) => {
    setEmergencyData({ ...emergencyData, [field]: value });
  };
  const handleMedicalChange = (field: string, value: string) => {
    setMedicalData({ ...medicalData, [field]: value });
  };
  const handleContactChange = (index: number, field: 'name' | 'phone' | 'relation', value: string) => {
    const updatedContacts = [...emergencyContacts];
    updatedContacts[index][field] = value;
    setEmergencyContacts(updatedContacts);
  };

  // Guardar cambios
  const handleSave = async () => {
    try {
      const usuarioId = await AsyncStorage.getItem('usuarioId');
      if (!usuarioId) return;

      // Actualizar info de emergencia
      await fetch(`${API_URL}/info-emergencia/usuario/${usuarioId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          zonaDireccion: emergencyData.address,
          notasGenerales: emergencyData.medicalNotes,
          edad: age, // Guardar edad
        }),
      });

      // Actualizar info médica
      await fetch(`${API_URL}/info-medica/usuario/${usuarioId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipoSangre: medicalData.bloodType,
          alergias: medicalData.allergies,
          enfermedadesCronicas: medicalData.chronicDiseases,
          medicacionImportante: medicalData.importantMedication,
        }),
      });

      // Actualizar contactos de emergencia
      await fetch(`${API_URL}/contactos-emergencia/usuario/${usuarioId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          emergencyContacts
            .filter(c => c.name.trim() !== '' || c.phone.trim() !== '' || c.relation.trim() !== '')
            .map(c => ({
              nombre: c.name,
              telefono: c.phone,
              relacion: c.relation,
            }))
        ),
      });

      Alert.alert('Perfil actualizado', 'Los datos se guardaron correctamente.');
      router.back();
    } catch (error) {
      Alert.alert('Error', 'No se pudieron guardar los datos.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={60}
    >
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <LinearGradient
          colors={["#23272f", "#23272f", "#23272f"]}
          style={styles.gradientHeader}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          {/* FOTO Y NOMBRE */}
          <View style={{ alignItems: 'center', marginTop: 10 }}>
            {/* Aquí iría el avatar/foto */}
            {/* <Image ... /> */}
            <ThemedText
              style={{
                color: '#2196F3',
                textDecorationLine: 'underline',
                marginTop: 8,
                marginBottom: 2,
                fontSize: 15,
              }}
            >
              Editar foto
            </ThemedText>
            <ThemedText
              style={{
                color: '#fff',
                fontWeight: 'bold',
                fontSize: 28,
                marginTop: 6,
                textShadowColor: '#000',
                textShadowOffset: { width: 0, height: 2 },
                textShadowRadius: 6,
              }}
            >
              Usuario
            </ThemedText>
            <ThemedText
              style={{
                color: '#ccc',
                fontSize: 16,
                marginTop: 2,
                marginBottom: 8,
              }}
            >
              {age ? `Edad: ${age}` : 'Edad no especificada'}
            </ThemedText>
          </View>
        </LinearGradient>

        {/* Información de emergencia */}
        <View style={styles.formCard}>
          <ThemedText style={styles.sectionTitle}>Información de Emergencia</ThemedText>
          <ThemedText style={styles.label}>Dirección o zona</ThemedText>
          <TextInput
            style={styles.input}
            value={emergencyData.address}
            onChangeText={text => {
              const clean = text.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ\s]/g, '');
              handleEmergencyChange('address', clean);
            }}
            placeholder="Dirección o zona de residencia"
            placeholderTextColor="#888"
          />
          <ThemedText style={styles.label}>Notas generales</ThemedText>
          <TextInput
            style={styles.input}
            value={emergencyData.medicalNotes}
            onChangeText={text => {
              const clean = text.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ\s]/g, '');
              handleEmergencyChange('medicalNotes', clean);
            }}
            placeholder="Notas relevantes para emergencias"
            placeholderTextColor="#888"
          />

          {/* CAMPO DE EDAD */}
          <ThemedText style={styles.label}>Edad</ThemedText>
          <TextInput
            style={styles.input}
            value={age}
            onChangeText={text => {
              const clean = text.replace(/[^0-9]/g, '');
              setAge(clean);
            }}
            placeholder="Edad"
            keyboardType="numeric"
            maxLength={3}
            placeholderTextColor="#888"
          />

          {/* Información médica */}
          <ThemedText style={styles.sectionTitle}>Información Médica</ThemedText>
          <ThemedText style={styles.label}>Tipo de sangre</ThemedText>
          <TextInput
            style={styles.input}
            value={medicalData.bloodType}
            onChangeText={text => {
              const clean = text.replace(/[^a-zA-Z+\-*/]/g, '').slice(0, 5);
              handleMedicalChange('bloodType', clean);
            }}
            placeholder="Ej: O+, A-, etc."
            maxLength={5}
            placeholderTextColor="#888"
          />
          <ThemedText style={styles.label}>Alergias</ThemedText>
          <TextInput
            style={styles.input}
            value={medicalData.allergies}
            onChangeText={text => {
              const clean = text.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/g, '');
              handleMedicalChange('allergies', clean);
            }}
            placeholder="Alergias importantes"
            placeholderTextColor="#888"
          />
          <ThemedText style={styles.label}>Enfermedades crónicas</ThemedText>
          <TextInput
            style={styles.input}
            value={medicalData.chronicDiseases}
            onChangeText={text => {
              const clean = text.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/g, '');
              handleMedicalChange('chronicDiseases', clean);
            }}
            placeholder="Ej: Diabetes, hipertensión, etc."
            placeholderTextColor="#888"
          />
          <ThemedText style={styles.label}>Medicamento importante</ThemedText>
          <TextInput
            style={styles.input}
            value={medicalData.importantMedication}
            onChangeText={text => {
              const clean = text.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/g, '');
              handleMedicalChange('importantMedication', clean);
            }}
            placeholder="Nombre del medicamento"
            placeholderTextColor="#888"
          />

          {/* Contactos de emergencia */}
          <ThemedText style={styles.sectionTitle}>Contactos de Emergencia</ThemedText>
          {emergencyContacts.map((contact, idx) => (
            <View key={idx} style={styles.contactCard}>
              {/* NOMBRE: solo letras y tildes */}
              <TextInput
                style={styles.input}
                value={contact.name}
                onChangeText={text => {
                  const clean = text.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/g, '');
                  handleContactChange(idx, 'name', clean);
                }}
                placeholder="Nombre"
                placeholderTextColor="#888"
              />
              {/* TELÉFONO: solo números */}
              <TextInput
                style={styles.input}
                value={contact.phone}
                onChangeText={text => {
                  const clean = text.replace(/[^0-9]/g, '');
                  handleContactChange(idx, 'phone', clean);
                }}
                placeholder="Teléfono"
                keyboardType="phone-pad"
                placeholderTextColor="#888"
              />
              {/* RELACIÓN: solo letras */}
              <TextInput
                style={styles.input}
                value={contact.relation}
                onChangeText={text => {
                  const clean = text.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/g, '');
                  handleContactChange(idx, 'relation', clean);
                }}
                placeholder="Relación (hijo, vecino, etc.)"
                placeholderTextColor="#888"
              />
            </View>
          ))}
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <IconSymbol size={22} name="checkmark.circle.fill" color="#fff" />
            <ThemedText style={styles.saveBtnText}>Guardar cambios</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <ThemedText style={styles.backBtnText}>Volver</ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181A20', // Igual que index.tsx
  },
  gradientHeader: {
    paddingTop: 70, // antes 40, ahora 70 para dejar espacio al banner
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
    backgroundColor: '#23272f', // Igual que index.tsx
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff', // blanco
    marginBottom: 10,
    textShadowColor: '#6DD5FA',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  formCard: {
    backgroundColor: '#23272f', // Igual que las tarjetas de index.tsx
    marginHorizontal: 16,
    marginVertical: 16,
    padding: 18,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  label: {
    fontWeight: 'bold',
    color: '#A9A9A9',
    marginTop: 10,
    marginBottom: 2,
    fontSize: 15,
  },
  input: {
    backgroundColor: '#181A20',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#444',
    fontSize: 15,
    color: '#fff',
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#2196F3',
    fontSize: 16,
    marginTop: 18,
    marginBottom: 6,
  },
  contactCard: {
    backgroundColor: '#23272f',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#181A20',
  },
  addContactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e3f1fc',
    padding: 10,
    borderRadius: 10,
    marginBottom: 16,
  },
  addContactText: {
    color: '#2196F3',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 15,
  },
  removeContactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  removeContactText: {
    color: '#FF6B6B',
    marginLeft: 6,
    fontSize: 14,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    padding: 14,
    borderRadius: 12,
    marginTop: 18,
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10,
    fontSize: 16,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#444950', // Gris intermedio
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
  },
  backBtnText: {
    color: '#2196F3',
    fontWeight: 'bold',
    fontSize: 16,
  },
});