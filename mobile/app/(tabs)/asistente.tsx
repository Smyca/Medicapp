import VirtualAssistant from '@/components/VirtualAssistant';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function AsistenteScreen() {
  return (
    <View style={styles.container}>
      <VirtualAssistant />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
}); 