import React from 'react';
import { StyleSheet, View } from 'react-native';

import VirtualAssistant from '@/components/VirtualAssistant';

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
    backgroundColor: '#181A20',
  },
});