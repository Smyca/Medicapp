import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function EditProfileScreen() {
  const [userData, setUserData] = useState({
    name: '',
    age: '',
    bloodType: '',
    allergies: '',
    chronicDiseases: '',
    importantMedication: '',
    address: '',
    medicalNotes: '',
    emergencyContacts: [{ name: '', phone: '', relation: '' }],
    profileImage: ''
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('userData');
      if (storedData) {
        setUserData(JSON.parse(storedData));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleChange = (field: string, value: string) => {
    setUserData({ ...userData, [field]: value });
  };

  const handleContactChange = (index: number, field: 'name' | 'phone' | 'relation', value: string) => {
    const updatedContacts = [...userData.emergencyContacts];
    updatedContacts[index][field] = value;
    setUserData({ ...userData, emergencyContacts: updatedContacts });
  };

  const addContact = () => {
    setUserData({
      ...userData,
      emergencyContacts: [...userData.emergencyContacts, { name: '', phone: '', relation: '' }],
    });
  };

  const removeContact = (index: number) => {
    const updatedContacts = userData.emergencyContacts.filter((_, i) => i !== index);
    setUserData({ ...userData, emergencyContacts: updatedContacts });
  };

  const handleSave = async () => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      Alert.alert('Perfil actualizado', 'Los datos se guardaron correctamente.');
      router.back();
    } catch (error) {
      Alert.alert('Error', 'No se pudieron guardar los datos.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={["#2196F3", "#6DD5FA", "#ffffff"]}
        style={styles.gradientHeader}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <ThemedText type="title" style={styles.headerTitle}>Editar Perfil</ThemedText>
      </LinearGradient>
      <View style={styles.formCard}>
        <ThemedText style={styles.label}>Nombre completo</ThemedText>
        <TextInput
          style={styles.input}
          value={userData.name}
          onChangeText={text => handleChange('name', text)}
          placeholder="Nombre completo"
        />
        <ThemedText style={styles.label}>Edad</ThemedText>
        <TextInput
          style={styles.input}
          value={userData.age}
          onChangeText={text => handleChange('age', text)}
          placeholder="Edad"
          keyboardType="numeric"
        />
        <ThemedText style={styles.label}>Tipo de sangre</ThemedText>
        <TextInput
          style={styles.input}
          value={userData.bloodType}
          onChangeText={text => handleChange('bloodType', text)}
          placeholder="Ej: O+, A-, etc."
        />
        <ThemedText style={styles.label}>Alergias</ThemedText>
        <TextInput
          style={styles.input}
          value={userData.allergies}
          onChangeText={text => handleChange('allergies', text)}
          placeholder="Alergias importantes"
        />
        <ThemedText style={styles.label}>Enfermedades crónicas</ThemedText>
        <TextInput
          style={styles.input}
          value={userData.chronicDiseases}
          onChangeText={text => handleChange('chronicDiseases', text)}
          placeholder="Ej: Diabetes, hipertensión, etc."
        />
        <ThemedText style={styles.label}>Medicamento importante</ThemedText>
        <TextInput
          style={styles.input}
          value={userData.importantMedication}
          onChangeText={text => handleChange('importantMedication', text)}
          placeholder="Nombre del medicamento"
        />
        <ThemedText style={styles.label}>Dirección o zona</ThemedText>
        <TextInput
          style={styles.input}
          value={userData.address}
          onChangeText={text => handleChange('address', text)}
          placeholder="Dirección o zona de residencia"
        />
        <ThemedText style={styles.label}>Notas médicas</ThemedText>
        <TextInput
          style={styles.input}
          value={userData.medicalNotes}
          onChangeText={text => handleChange('medicalNotes', text)}
          placeholder="Notas relevantes para emergencias"
        />
        <ThemedText style={styles.sectionTitle}>Contactos de emergencia</ThemedText>
        {userData.emergencyContacts.map((contact, idx) => (
          <View key={idx} style={styles.contactCard}>
            <TextInput
              style={styles.input}
              value={contact.name}
              onChangeText={text => handleContactChange(idx, 'name', text)}
              placeholder="Nombre"
            />
            <TextInput
              style={styles.input}
              value={contact.phone}
              onChangeText={text => handleContactChange(idx, 'phone', text)}
              placeholder="Teléfono"
              keyboardType="phone-pad"
            />
            <TextInput
              style={styles.input}
              value={contact.relation}
              onChangeText={text => handleContactChange(idx, 'relation', text)}
              placeholder="Relación (hijo, vecino, etc.)"
            />
            {userData.emergencyContacts.length > 1 && (
              <TouchableOpacity style={styles.removeContactBtn} onPress={() => removeContact(idx)}>
                <IconSymbol size={18} name="trash.fill" color="#FF6B6B" />
                <ThemedText style={styles.removeContactText}>Eliminar</ThemedText>
              </TouchableOpacity>
            )}
          </View>
        ))}
        <TouchableOpacity style={styles.addContactBtn} onPress={addContact}>
          <IconSymbol size={20} name="plus.circle.fill" color="#2196F3" />
          <ThemedText style={styles.addContactText}>Agregar contacto</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <IconSymbol size={22} name="checkmark.circle.fill" color="#fff" />
          <ThemedText style={styles.saveBtnText}>Guardar cambios</ThemedText>
        </TouchableOpacity>
      </View>
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
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 10,
    textShadowColor: '#6DD5FA',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  formCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 16,
    padding: 18,
    borderRadius: 18,
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  label: {
    fontWeight: 'bold',
    color: '#222',
    marginTop: 10,
    marginBottom: 2,
    fontSize: 15,
  },
  input: {
    backgroundColor: '#f8fafd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontSize: 15,
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#2196F3',
    fontSize: 16,
    marginTop: 18,
    marginBottom: 6,
  },
  contactCard: {
    backgroundColor: '#f8fafd',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
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
}); 