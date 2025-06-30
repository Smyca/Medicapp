import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import VirtualAssistant from '@/components/VirtualAssistant';

export default function AsistenteScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconSymbol name="sparkles" size={36} color="#FFD93D" />
        <ThemedText style={styles.title}>Asistente Inteligente</ThemedText>
        <ThemedText style={styles.subtitle}>
          Tu asistente virtual con IA. ¡Hazme cualquier pregunta !
        </ThemedText>
      </View>
      <VirtualAssistant />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181A20',
    paddingTop: 80, // Espacio superior
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFD93D',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#aaa',
    textAlign: 'center',
    marginHorizontal: 24,
  },
});