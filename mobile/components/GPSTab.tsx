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

// Usa tu API key de LocationIQ
const LOCATIONIQ_API_KEY = 'pk.93f873f8ec7db86a1ced4b94efa0168b';

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

      // Ubicación en tiempo real
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
        locationSubscription.current.remove();
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
    setLoading(false);
  };

  const analyzeSurroundings = async (lat: number, lng: number) => {
    setAnalyzing(true);
    console.log('Mi latitud:', lat, 'Mi longitud:', lng); // <-- Aquí se imprime
    try {
      const queries = [
        { q: 'hospital', type: 'hospital' },
        { q: 'clinic', type: 'clinic' },
        { q: 'pharmacy', type: 'pharmacy' }
      ];
      let allResults: any[] = [];

      for (const { q } of queries) {
        const response = await fetch(
          `https://us1.locationiq.com/v1/search.php?key=${LOCATIONIQ_API_KEY}&q=${q}&lat=${lat}&lon=${lng}&format=json&addressdetails=1&extratags=1&namedetails=1`
        );
        if (response.ok) {
          const data = await response.json();
          allResults = allResults.concat(data);
        }
      }

      // Elimina duplicados por lat/lon
      const uniqueResults = allResults.filter(
        (place, index, self) =>
          index === self.findIndex((p) => p.lat === place.lat && p.lon === place.lon)
      );

      const places: NearbyPlace[] = uniqueResults
        .filter(place =>
          (place.class === 'amenity' && (
            place.type === 'hospital' ||
            place.type === 'clinic' ||
            place.type === 'pharmacy'
          ))
        )
        .map((place) => {
          const realName =
            (place.namedetails && place.namedetails.name) ||
            place.name ||
            (place.address && place.address.hospital) ||
            (place.address && place.address.clinic) ||
            (place.address && place.address.pharmacy) ||
            place.display_name?.split(',')[0] ||
            'Lugar sin nombre';

          let type: NearbyPlace['type'] = 'medical_center';
          const nameLower = realName.toLowerCase();
          if (place.type === 'pharmacy' || nameLower.includes('pharmacy') || nameLower.includes('farmacia')) type = 'pharmacy';
          else if (place.type === 'clinic' || nameLower.includes('clinic') || nameLower.includes('clínica')) type = 'clinic';
          else if (place.type === 'hospital' || nameLower.includes('hospital')) type = 'hospital';

          const distance = calculateDistance(
            lat,
            lng,
            parseFloat(place.lat),
            parseFloat(place.lon)
          );

          return {
            name: realName,
            distance: `${distance.toFixed(1)} km`,
            phone: place.extratags?.phone || 'No disponible',
            lat: parseFloat(place.lat),
            lng: parseFloat(place.lon),
            address: place.display_name,
            type,
            description:
              type === 'hospital'
                ? 'Hospital'
                : type === 'clinic'
                ? 'Clínica'
                : type === 'pharmacy'
                ? 'Farmacia'
                : 'Centro Médico',
          };
        });

      setNearbyPlaces(places);
    } catch (error) {
      console.error('Error analizando alrededores:', error);
      setNearbyPlaces([]);
    }
    setAnalyzing(false);
  };

  const searchNearby = async (lat: number, lon: number) => {
    setAnalyzing(true);
    try {
      const response = await fetch(
        `https://us1.locationiq.com/v1/search.php?key=${LOCATIONIQ_API_KEY}&q=hospital&lat=${lat}&lon=${lon}&format=json`
      );
      if (!response.ok) throw new Error('Error al obtener datos de LocationIQ');
      const data = await response.json();
      // Procesa los datos aquí...
      // ...
    } catch (error) {
      console.error('Error analizando alrededores:', error);
      setNearbyPlaces([]);
    }
    setAnalyzing(false);
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
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
    infoMessage += `Teléfono: ${place.phone}\n\n`;
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
        </View>

        <View style={[styles.mapContainer, { height: Dimensions.get('window').height * 0.7 }]}>
          {loading ? (
            <ActivityIndicator size="large" color="#007AFF" />
          ) : errorMsg ? (
            <ThemedText style={styles.errorText}>{errorMsg}</ThemedText>
          ) : location ? (
            <MapView
              ref={mapRef}
              style={styles.map}
              region={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              showsUserLocation
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

        {/* Elimina el bloque de tarjetas de lugares cercanos */}
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
    height: Dimensions.get('window').height * 0.7, // Más grande
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