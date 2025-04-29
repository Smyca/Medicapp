import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, TextInput, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const InformacionScreen = ({ navigation }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [isEditing, setIsEditing] = useState(false);
  const [nombre, setNombre] = useState('');
  const [rut, setRut] = useState('12345678-9');
  const [emergencyNumbers, setEmergencyNumbers] = useState('Hija: 1234 1234    //    Hijo: 1234 1234');
  const [age, setAge] = useState('');
  const [imageUri, setImageUri] = useState(null);

  // Cargar datos guardados al iniciar
  useEffect(() => {
    loadData();
  }, []);

  // Guardar datos cuando cambien
  useEffect(() => {
    if (!isEditing) {
      saveData();
    }
  }, [isEditing, nombre, rut, emergencyNumbers, age, imageUri]);

  const loadData = async () => {
    try {
      const savedData = await AsyncStorage.getItem('userInfo');
      if (savedData) {
        const data = JSON.parse(savedData);
        setNombre(data.nombre || '');
        setRut(data.rut || '');
        setEmergencyNumbers(data.emergencyNumbers || 'Hija:     //    Hijo: ');
        setAge(data.age || '');
        setImageUri(data.imageUri || null);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  };

  const saveData = async () => {
    try {
      const dataToSave = {
        nombre,
        rut,
        emergencyNumbers,
        age,
        imageUri,
      };
      await AsyncStorage.setItem('userInfo', JSON.stringify(dataToSave));
      console.log('Datos guardados:', dataToSave);
    } catch (error) {
      console.error('Error al guardar datos:', error);
    }
  };

  const getEmergencyNumber = (index) => {
    const numbers = emergencyNumbers ? emergencyNumbers.split('    //    ') : ['Hija: ', 'Hijo: '];
    return numbers[index] ? numbers[index].split(': ')[1] : '';
  };

  const setEmergencyNumber = (index, text) => {
    const numbers = emergencyNumbers ? emergencyNumbers.split('    //    ') : ['Hija: ', 'Hijo: '];
    numbers[index] = index === 0 ? `Hija: ${text}` : `Hijo: ${text}`;
    setEmergencyNumbers(numbers.join('    //    '));
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const aumentarFuente = () => setFontSize((prev) => Math.min(prev + 2, 28));
  const disminuirFuente = () => setFontSize((prev) => Math.max(prev - 2, 12));

  const toggleEditing = () => {
    if (isEditing) {
      saveData(); // Guardar datos cuando se desactiva el modo edición
    }
    setIsEditing(!isEditing);
  };

  const selectImage = async () => {
    console.log('Intentando seleccionar imagen...');
    try {
      // Solicitar permisos
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log('Estado de permisos:', status);
      
      if (status !== 'granted') {
        alert('Se requieren permisos para acceder a la galería.');
        return;
      }

      // Abrir la galería con configuración mínima
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 1,
      });
      console.log('Resultado de la selección:', result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
        console.log('Imagen seleccionada:', result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error al seleccionar imagen:', error);
      alert('Error al seleccionar la imagen');
    }
  };

  return (
    <SafeAreaView style={[styles.container, darkMode && styles.containerDark]}>
      <View style={styles.darkModeContainer}>
        <TouchableOpacity onPress={toggleEditing} style={styles.editButton}>
          <Text style={styles.editButtonText}>{isEditing ? 'Guardar' : 'Editar'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleDarkMode} style={styles.darkModeButton}>
          <MaterialCommunityIcons 
            name={darkMode ? "white-balance-sunny" : "moon-waning-crescent"} 
            size={24} 
            color={darkMode ? "#f5f5f5" : "#000"} 
          />
        </TouchableOpacity>
      </View>
      
      <ScrollView>
        <View style={[styles.content, darkMode && styles.contentDark]}>
          <View style={[styles.card, darkMode && styles.cardDark]}>
            <Text style={[styles.cardTitle, darkMode && styles.cardTitleDark]}>Detalles</Text>
            
            <View style={styles.fontSizeControls}>
              <TouchableOpacity onPress={disminuirFuente} style={[styles.fontButton, darkMode && styles.fontButtonDark]}>
                <Text style={[styles.fontButtonText, darkMode && styles.fontButtonTextDark]}>A-</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={aumentarFuente} style={[styles.fontButton, darkMode && styles.fontButtonDark]}>
                <Text style={[styles.fontButtonText, darkMode && styles.fontButtonTextDark]}>A+</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.infoContainer}>
              <View style={styles.imageContainer}>
                {!isEditing && imageUri ? (
                  <Image source={{ uri: imageUri }} style={styles.image} />
                ) : (
                  <TouchableOpacity onPress={selectImage} style={[styles.imagePlaceholder, darkMode && styles.imagePlaceholderDark]}>
                    <Text style={[styles.imageText, darkMode && styles.imageTextDark]}>
                      {isEditing ? 'Editar foto' : 'Imagen carnet'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={[styles.label, darkMode && styles.labelDark]}>Nombre completo</Text>
                <TextInput
                  style={[styles.input, darkMode && styles.inputDark, { fontSize }]} 
                  placeholder="Nombre completo"
                  placeholderTextColor={darkMode ? '#888' : '#999'}
                  value={nombre}
                  onChangeText={setNombre}
                  editable={isEditing}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.label, darkMode && styles.labelDark]}>Edad</Text>
                <TextInput
                  style={[styles.input, darkMode && styles.inputDark, { fontSize }]} 
                  placeholder="Edad"
                  placeholderTextColor={darkMode ? '#888' : '#999'}
                  value={age}
                  onChangeText={setAge}
                  editable={isEditing}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.label, darkMode && styles.labelDark]}>RUT</Text>
                <TextInput
                  style={[styles.input, darkMode && styles.inputDark, { fontSize }]} 
                  placeholder="12345678-9"
                  placeholderTextColor={darkMode ? '#888' : '#999'}
                  value={rut}
                  onChangeText={setRut}
                  editable={isEditing}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.label, darkMode && styles.labelDark]}>Número de emergencia - 1</Text>
                <TextInput
                  style={[styles.input, darkMode && styles.inputDark, { fontSize }]} 
                  placeholder="1234 1234"
                  placeholderTextColor={darkMode ? '#888' : '#999'}
                  value={getEmergencyNumber(0)}
                  onChangeText={(text) => setEmergencyNumber(0, text)}
                  editable={isEditing}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.label, darkMode && styles.labelDark]}>Número de emergencia - 2</Text>
                <TextInput
                  style={[styles.input, darkMode && styles.inputDark, { fontSize }]} 
                  placeholder="1234 1234"
                  placeholderTextColor={darkMode ? '#888' : '#999'}
                  value={getEmergencyNumber(1)}
                  onChangeText={(text) => setEmergencyNumber(1, text)}
                  editable={isEditing}
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  darkModeContainer: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  darkModeButton: {
    padding: 10,
  },
  content: {
    padding: 20,
  },
  contentDark: {
    backgroundColor: '#121212',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardDark: {
    backgroundColor: '#1e1e1e',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  cardTitleDark: {
    color: '#f5f5f5',
  },
  fontSizeControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
  },
  fontButton: {
    padding: 14,
    backgroundColor: '#007bff',
    borderRadius: 8,
  },
  fontButtonDark: {
    backgroundColor: '#2c2c2c',
  },
  fontButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  fontButtonTextDark: {
    color: '#f5f5f5',
  },
  infoContainer: {
    gap: 20,
  },
  imageContainer: {
    alignItems: 'center',
  },
  imagePlaceholder: {
    width: 350,
    height: 180,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#bbb',
  },
  imagePlaceholderDark: {
    backgroundColor: '#2c2c2c',
    borderColor: '#444',
  },
  imageText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  imageTextDark: {
    color: '#f5f5f5',
  },
  inputContainer: {
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  labelDark: {
    color: '#f5f5f5',
  },
  input: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fff',
    color: '#000',
    minHeight: 50,
    flexGrow: 1,
  },
  inputDark: {
    backgroundColor: '#2c2c2c',
    borderColor: '#444',
    color: '#f5f5f5',
    minHeight: 50,
    flexGrow: 1,
  },
  editButton: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 8,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  image: {
    width: 350,
    height: 180,
    borderRadius: 10,
  },
});

export default InformacionScreen; 