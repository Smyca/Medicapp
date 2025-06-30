import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import * as Location from 'expo-location';
import * as Speech from 'expo-speech';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Clipboard, Dimensions, Image, Linking, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import MapView from 'react-native-maps';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

// Reemplaza esto con tu API key de LocationIQ
const LOCATIONIQ_API_KEY = 'pk.a412cbb8e12710f18b8b307bb8a5ce18';

// Coordenadas del Duoc UC Mall Plaza Oeste
const DUOC_UC_COORDS = {
  latitude: -33.4513,
  longitude: -70.7004
};

interface NearbyPlace {
  name: string;
  distance: string;
  phone: string;
  lat: number;
  lng: number;
  address: string;
  type: 'hospital' | 'clinic' | 'pharmacy' | 'medical_center' | 'landmark' | 'street';
  description: string;
  rating?: number;
  openNow?: boolean;
  photos?: string[];
}

const PLACES_EXAMPLE: NearbyPlace[] = [
  {
    name: 'Hospital El Carmen Dr. Luis Valentín Ferrada',
    distance: '1.2 km',
    phone: '+56 2 2575 7000',
    lat: -33.4542,
    lng: -70.7045,
    address: 'Av. Lo Espejo 1051, Cerrillos, Región Metropolitana',
    type: 'hospital',
    description: 'Hospital público de alta complejidad',
    rating: 4.2,
    openNow: true
  },
  {
    name: 'Farmacia Cruz Verde Mall Plaza Oeste',
    distance: '0.3 km',
    phone: '+56 600 818 9000',
    lat: -33.4507,
    lng: -70.7015,
    address: 'Av. Américo Vespucio 1501, Cerrillos, Región Metropolitana',
    type: 'pharmacy',
    description: 'Farmacia dentro del Mall Plaza Oeste',
    rating: 4.0,
    openNow: true
  },
  {
    name: 'Clínica RedSalud Santiago',
    distance: '2.5 km',
    phone: '+56 2 2914 6000',
    lat: -33.4565,
    lng: -70.6889,
    address: 'Av. Ecuador 3769, Estación Central, Región Metropolitana',
    type: 'clinic',
    description: 'Clínica privada de atención integral',
    rating: 4.1,
    openNow: true
  },
  {
    name: 'Mall Plaza Oeste',
    distance: '0.1 km',
    phone: '+56 2 2574 8000',
    lat: -33.4505,
    lng: -70.7010,
    address: 'Av. Américo Vespucio 1501, Cerrillos, Región Metropolitana',
    type: 'landmark',
    description: 'Centro comercial con tiendas, cine y restaurantes',
    rating: 4.5,
    openNow: true
  }
];

export function GPSTab() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [address, setAddress] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [muted, setMuted] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const locationSubscription = useRef<Location.LocationSubscription | null>(null);
  const mapRef = useRef<MapView>(null);
  const [userName, setUserName] = useState('Usuario');

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permiso de ubicación denegado');
        setLoading(false);
        return;
      }

      try {
        // Usar ubicación fija cerca del Duoc UC
        const initialLocation = {
          coords: {
            latitude: DUOC_UC_COORDS.latitude,
            longitude: DUOC_UC_COORDS.longitude,
            altitude: null,
            accuracy: 5,
            altitudeAccuracy: null,
            heading: null,
            speed: null
          },
          timestamp: Date.now()
        };
        
        await updateLocation(initialLocation);

        // Configurar actualización en tiempo real
        locationSubscription.current = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 5000,
            distanceInterval: 10,
          },
          async (newLocation) => {
            await updateLocation(newLocation);
          }
        );
      } catch (error) {
        setErrorMsg('Error al obtener la ubicación');
      }
      setLoading(false);
    })();

    // Obtener el nombre del usuario desde AsyncStorage
    (async () => {
      try {
        const userDataStr = await AsyncStorage.getItem('userData');
        if (userDataStr) {
          const userData = JSON.parse(userDataStr);
          setUserName(userData.name || 'Usuario');
        }
      } catch (e) {
        setUserName('Usuario');
      }
    })();

    return () => {
      if (locationSubscription.current) {
        // locationSubscription.current.remove();
      }
    };
  }, []);

  const updateLocation = async (newLocation: Location.LocationObject) => {
    setLocation(newLocation);
    
    try {
      const geo = await Location.reverseGeocodeAsync({
        latitude: newLocation.coords.latitude,
        longitude: newLocation.coords.longitude
      });

      if (geo && geo.length > 0) {
        const g = geo[0];
        const dir = `${g.street ? g.street + ' ' : ''}${g.name ? g.name + ', ' : ''}${g.district ? g.district + ', ' : ''}${g.city ? g.city + ', ' : ''}${g.region ? g.region + ', ' : ''}${g.country ? g.country : ''}`;
        setAddress(dir);
        
        // Animar el mapa a la nueva ubicación
        mapRef.current?.animateToRegion({
          latitude: newLocation.coords.latitude,
          longitude: newLocation.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }, 1000);
        
        await analyzeSurroundings(newLocation.coords.latitude, newLocation.coords.longitude);
      } else {
        setAddress('Dirección no disponible');
      }
    } catch (error) {
      console.error('Error al actualizar la dirección:', error);
    }
  };

  const analyzeSurroundings = async (lat: number, lng: number) => {
    setAnalyzing(true);
    try {
      // Buscar lugares médicos cercanos con un radio más amplio
      const medicalResponse = await fetch(
        `https://us1.locationiq.com/v1/nearby?key=${LOCATIONIQ_API_KEY}&lat=${lat}&lon=${lng}&radius=1000&tag=amenity=hospital,amenity=clinic,amenity=pharmacy,amenity=doctors&format=json`
      );
      
      if (!medicalResponse.ok) {
        throw new Error('Error al obtener datos de LocationIQ');
      }

      const medicalData = await medicalResponse.json();
      const places: NearbyPlace[] = [];

      // Procesar lugares médicos
      for (const place of medicalData) {
        try {
          const detailsResponse = await fetch(
            `https://us1.locationiq.com/v1/place_details?key=${LOCATIONIQ_API_KEY}&place_id=${place.place_id}&format=json`
          );
          
          if (!detailsResponse.ok) continue;
          
          const details = await detailsResponse.json();
          const distance = calculateDistance(lat, lng, place.lat, place.lon);
          const type = place.tags?.amenity === 'hospital' ? 'hospital' :
                      place.tags?.amenity === 'clinic' ? 'clinic' :
                      place.tags?.amenity === 'pharmacy' ? 'pharmacy' :
                      place.tags?.amenity === 'doctors' ? 'medical_center' : 'medical_center';

          const placeInfo: NearbyPlace = {
            name: place.tags?.name || details.name || 'Lugar sin nombre',
            distance: `${distance.toFixed(1)} km`,
            phone: place.tags?.phone || details.phone || 'No disponible',
            lat: place.lat,
            lng: place.lon,
            address: place.tags?.['addr:street'] ? 
              `${place.tags['addr:street']} ${place.tags['addr:housenumber'] || ''}, ${place.tags['addr:city'] || ''}` : 
              details.address || 'Dirección no disponible',
            type: type,
            description: `${type === 'hospital' ? 'Hospital' : 
                         type === 'clinic' ? 'Clínica' : 
                         type === 'pharmacy' ? 'Farmacia' : 
                         type === 'medical_center' ? 'Centro Médico' : 'Centro Médico'} ${place.tags?.opening_hours ? 
                         (place.tags.opening_hours.includes('open') ? 'abierto' : 'cerrado') : ''}`,
            openNow: place.tags?.opening_hours?.includes('open')
          };

          places.push(placeInfo);
        } catch (error) {
          console.error('Error procesando lugar médico:', error);
          continue;
        }
      }

      // Si no hay lugares médicos, buscar puntos de referencia
      if (places.length === 0) {
        const landmarksResponse = await fetch(
          `https://us1.locationiq.com/v1/nearby?key=${LOCATIONIQ_API_KEY}&lat=${lat}&lon=${lng}&radius=500&tag=highway=residential,highway=primary,highway=secondary,amenity=place_of_worship,historic=monument,leisure=park,shop=mall&format=json`
        );

        if (landmarksResponse.ok) {
          const landmarksData = await landmarksResponse.json();
          
          for (const landmark of landmarksData) {
            try {
              const distance = calculateDistance(lat, lng, landmark.lat, landmark.lon);
              const type = landmark.tags?.highway ? 'street' : 
                          landmark.tags?.shop === 'mall' ? 'landmark' : 'landmark';
              const name = landmark.tags?.name || 
                          (landmark.tags?.highway ? `${landmark.tags.highway} ${landmark.tags.ref || ''}`.trim() : 'Punto de referencia');

              const landmarkInfo: NearbyPlace = {
                name: name,
                distance: `${distance.toFixed(1)} km`,
                phone: 'No disponible',
                lat: landmark.lat,
                lng: landmark.lon,
                address: landmark.tags?.['addr:street'] ? 
                  `${landmark.tags['addr:street']} ${landmark.tags['addr:housenumber'] || ''}, ${landmark.tags['addr:city'] || ''}` : 
                  'Dirección no disponible',
                type: type,
                description: type === 'street' ? 
                  `Calle ${landmark.tags?.highway === 'residential' ? 'residencial' : 
                           landmark.tags?.highway === 'primary' ? 'principal' : 'secundaria'}` :
                  landmark.tags?.shop === 'mall' ? 'Centro Comercial' :
                  landmark.tags?.historic ? 'Monumento histórico' :
                  landmark.tags?.leisure === 'park' ? 'Parque o plaza' :
                  landmark.tags?.amenity === 'place_of_worship' ? 'Lugar de culto' : 'Punto de referencia'
              };

              places.push(landmarkInfo);
            } catch (error) {
              console.error('Error procesando punto de referencia:', error);
              continue;
            }
          }
        }
      }

      setNearbyPlaces(places.length > 0 ? places : PLACES_EXAMPLE);
      provideSurroundingsAnalysis(places.length > 0 ? places : PLACES_EXAMPLE);
    } catch (error) {
      console.error('Error analizando alrededores:', error);
    }
    setAnalyzing(false);
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const provideSurroundingsAnalysis = (places: NearbyPlace[]) => {
    if (muted) return;

    if (places.length === 0) {
      // No mostrar mensaje si no hay lugares cercanos
      return;
    }

    const hospital = places.find(p => p.type === 'hospital');
    const pharmacy = places.find(p => p.type === 'pharmacy');
    const clinic = places.find(p => p.type === 'clinic');
    const streets = places.filter(p => p.type === 'street');
    const landmarks = places.filter(p => p.type === 'landmark');

    let message = 'Análisis de tu ubicación actual:\n\n';
    
    if (hospital) {
      message += `Hay un hospital a ${hospital.distance} de tu ubicación. ${hospital.description}\n\n`;
    }
    
    if (pharmacy) {
      message += `La farmacia más cercana está a ${pharmacy.distance}. ${pharmacy.description}\n\n`;
    }
    
    if (clinic) {
      message += `También hay una clínica a ${clinic.distance}. ${clinic.description}\n\n`;
    }

    if (places.length === 0) {
      message += 'No se encontraron lugares cercanos en un radio de 2 kilómetros.';
    } else if (!hospital && !pharmacy && !clinic) {
      message += 'Puntos de referencia cercanos:\n\n';
      
      if (streets.length > 0) {
        message += 'Calles cercanas:\n';
        streets.slice(0, 3).forEach(street => {
          message += `- ${street.name} (a ${street.distance})\n`;
        });
        message += '\n';
      }

      if (landmarks.length > 0) {
        message += 'Puntos de referencia:\n';
        landmarks.slice(0, 3).forEach(landmark => {
          message += `- ${landmark.name} (${landmark.description}, a ${landmark.distance})\n`;
        });
      }
    }

    message += '\n¿Necesitas más información sobre algún lugar cercano?';

    Alert.alert('Análisis de Alrededores', message);
  };

  useFocusEffect(
    React.useCallback(() => {
      if (!muted && address) {
        speakAssistant(address);
      }
      return () => {
        Speech.stop();
      };
    }, [muted, address])
  );

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        try {
          const userDataStr = await AsyncStorage.getItem('userData');
          if (userDataStr) {
            const userData = JSON.parse(userDataStr);
            setUserName(userData.name || 'Usuario');
          }
        } catch (e) {
          setUserName('Usuario');
        }
      })();
      return () => {};
    }, [])
  );

  const placesToShow = nearbyPlaces.length > 0 ? nearbyPlaces : PLACES_EXAMPLE;

  const speakAssistant = (direccion: string) => {
    if (muted) return;
    const horaActual = new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
    let message = `Hola, ${userName}. La hora actual es ${horaActual}. `;
    if (direccion) {
      message += `Te encuentras en: ${direccion}. `;
      const hospital = placesToShow.find(p => p.type === 'hospital');
      const pharmacy = placesToShow.find(p => p.type === 'pharmacy');
      const clinic = placesToShow.find(p => p.type === 'clinic');
      const streets = placesToShow.filter(p => p.type === 'street');
      const landmarks = placesToShow.filter(p => p.type === 'landmark');
      if (hospital) {
        message += `Hay un hospital llamado ${hospital.name} a ${hospital.distance}. `;
      }
      if (pharmacy) {
        message += `La farmacia más cercana es ${pharmacy.name} a ${pharmacy.distance}. `;
      }
      if (clinic) {
        message += `También hay una clínica llamada ${clinic.name} a ${clinic.distance}. `;
      }
      if (placesToShow.length === 0) {
        message += 'No se encontraron lugares cercanos.';
      } else if (!hospital && !pharmacy && !clinic) {
        if (streets.length > 0) {
          message += `Estás cerca de ${streets[0].name}. `;
        }
        if (landmarks.length > 0) {
          message += `Hay un ${landmarks[0].description.toLowerCase()} llamado ${landmarks[0].name} a ${landmarks[0].distance}. `;
        }
      }
      // Solo agregar la frase si hay lugares reales
      if (nearbyPlaces.length > 0) {
        message += '¿Necesitas más información sobre los lugares cercanos?';
      }
    } else {
      message += 'No se pudo obtener tu dirección.';
    }
    Speech.speak(message, { rate: 0.95, pitch: 1.1, volume: 1.0, language: 'es' });
  };

  const getStaticMapUrl = () => {
    if (!location) return '';
    const { latitude, longitude } = location.coords;
    return `https://maps.locationiq.com/v3/staticmap?key=${LOCATIONIQ_API_KEY}&center=${latitude},${longitude}&zoom=15&size=600x300&markers=icon:small-red|${latitude},${longitude}`;
  };

  const handleMute = () => {
    setMuted(!muted);
    Speech.stop();
    if (!muted && address) {
      setTimeout(() => speakAssistant(address), 500);
    }
  };

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleRoute = (lat: number, lng: number) => {
    if (!location) return;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${location.coords.latitude},${location.coords.longitude}&destination=${lat},${lng}&travelmode=walking`;
    Linking.openURL(url);
  };

  const handleShare = () => {
    if (!location) return;
    const message = `Mi ubicación actual es: https://maps.google.com/?q=${location.coords.latitude},${location.coords.longitude}`;
    Clipboard.setString(message);
    Alert.alert('Ubicación copiada', 'Tu ubicación ha sido copiada al portapapeles. Puedes pegarla en WhatsApp u otra app.');
  };

  const handlePlaceInfo = (place: NearbyPlace) => {
    let infoMessage = `${place.description}\n\n`;
    infoMessage += `Distancia: ${place.distance}\n`;
    infoMessage += `Dirección: ${place.address}\n`;
    if (place.rating) {
      infoMessage += `Calificación: ${place.rating}/5\n`;
    }
    infoMessage += `Estado: ${place.openNow ? 'Abierto' : 'Cerrado'}\n\n`;
    infoMessage += '¿Qué deseas hacer?';

    Alert.alert(
      place.name,
      infoMessage,
      [
        {
          text: 'Llamar',
          onPress: () => handleCall(place.phone)
        },
        {
          text: 'Ver Ruta',
          onPress: () => handleRoute(place.lat, place.lng)
        },
        {
          text: 'Cerrar',
          style: 'cancel'
        }
      ]
    );
  };

  return (
    <ThemedView style={{ flex: 1, paddingTop: 0, marginTop: 0 }}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.headerRow}>
          <ThemedText style={styles.assistantText}>Asistente ubicación</ThemedText>
          <TouchableOpacity onPress={handleMute} style={styles.muteButton}>
            <Ionicons name={muted ? 'volume-mute' : 'volume-high'} size={28} color={muted ? 'gray' : '#007AFF'} />
          </TouchableOpacity>
        </View>

        {!LOCATIONIQ_API_KEY || LOCATIONIQ_API_KEY === 'TU_API_KEY_AQUI' ? (
          <View style={styles.apiWarningContainer}>
            <Ionicons name="warning" size={24} color="#FFA500" />
            <ThemedText style={styles.apiWarningText}>
              Para obtener información real de lugares cercanos, necesitas una API key de LocationIQ.
              Actualmente se muestran datos de ejemplo.
            </ThemedText>
          </View>
        ) : null}

        <View style={styles.mapContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#007AFF" />
          ) : errorMsg ? (
            <ThemedText style={styles.errorText}>{errorMsg}</ThemedText>
          ) : location ? (
            <Image
              source={{ uri: getStaticMapUrl() }}
              style={styles.map}
              resizeMode="cover"
            />
          ) : (
            <ThemedText>Cargando ubicación...</ThemedText>
          )}
        </View>

        {address && (
          <View style={styles.locationContainer}>
            <ThemedText style={styles.locationText}>
              Dirección: {address}
            </ThemedText>
          </View>
        )}

        <View style={styles.placesContainer}>
          <ThemedText style={styles.placesTitle}>Lugares cercanos:</ThemedText>
          {analyzing ? (
            <ActivityIndicator size="small" color="#007AFF" style={styles.analyzingIndicator} />
          ) : (
            placesToShow.map((place, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.placeItem}
                onPress={() => handlePlaceInfo(place)}
              >
                <View style={styles.placeHeader}>
                  <ThemedText style={styles.placeName}>{place.name}</ThemedText>
                  <ThemedText style={styles.placeDistance}>{place.distance}</ThemedText>
                </View>
                <ThemedText style={styles.placeDescription}>{place.description}</ThemedText>
                {place.rating && (
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <ThemedText style={styles.ratingText}>{place.rating}/5</ThemedText>
                  </View>
                )}
                <View style={styles.optionsRow}>
                  <TouchableOpacity style={styles.optionButton} onPress={() => handleCall(place.phone)}>
                    <Ionicons name="call" size={22} color="#007AFF" />
                    <ThemedText style={styles.optionText}>Llamar</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.optionButton} onPress={() => handleRoute(place.lat, place.lng)}>
                    <Ionicons name="navigate" size={22} color="#007AFF" />
                    <ThemedText style={styles.optionText}>Ruta</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.optionButton} onPress={handleShare}>
                    <Ionicons name="share-social" size={22} color="#007AFF" />
                    <ThemedText style={styles.optionText}>Compartir</ThemedText>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#181A20', // Fondo oscuro
    zIndex: 1,
  },
  assistantText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#64b5f6', // Azul claro
  },
  muteButton: {
    padding: 6,
  },
  mapContainer: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.4,
    marginBottom: 10,
  },
  map: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  locationContainer: {
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#23272f', // Fondo oscuro
    borderRadius: 8,
  },
  locationText: {
    fontSize: 16,
    marginVertical: 2,
    color: '#fff', // Texto blanco
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  placesContainer: {
    marginBottom: 10,
  },
  placesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  analyzingIndicator: {
    marginVertical: 20,
  },
  placeItem: {
    backgroundColor: '#23272f', // Fondo oscuro
    padding: 15,
    borderRadius: 10,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  placeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  placeName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    color: '#fff', // Texto blanco
  },
  placeDistance: {
    fontSize: 14,
    color: '#64b5f6', // Azul claro
    marginLeft: 8,
  },
  placeDescription: {
    fontSize: 14,
    color: '#A9A9A9', // Gris claro
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#A9A9A9', // Gris claro
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
  },
  optionButton: {
    alignItems: 'center',
    padding: 8,
  },
  optionText: {
    fontSize: 12,
    color: '#64b5f6', // Azul claro
    marginTop: 4,
  },
  apiWarningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#23272f', // Fondo oscuro
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  apiWarningText: {
    marginLeft: 8,
    flex: 1,
    color: '#FFA500',
    fontSize: 14,
  },
});