import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { ThemedText } from './ThemedText';

export function WelcomeMessage() {
  const [isVisible, setIsVisible] = useState(true);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    // Entrada suave
    opacity.value = withTiming(1, {
      duration: 500,
      easing: Easing.out(Easing.ease),
    });
    translateY.value = withTiming(0, {
      duration: 500,
      easing: Easing.out(Easing.ease),
    });

    // Salida suave después de 1.5 segundos
    const timer = setTimeout(() => {
      opacity.value = withTiming(0, {
        duration: 500,
        easing: Easing.in(Easing.ease),
      });
      translateY.value = withTiming(-20, {
        duration: 500,
        easing: Easing.in(Easing.ease),
      });
      
      // Remover completamente el componente después de la animación
      setTimeout(() => {
        setIsVisible(false);
      }, 500);
    }, 1500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  if (!isVisible) return null;

  return (
    <Animated.View style={[styles.container, animatedStyle]} pointerEvents="none">
      <ThemedText style={styles.title}>¡Bienvenido a MedicApp!</ThemedText>
      <ThemedText style={styles.subtitle}>Tu salud, nuestra prioridad</ThemedText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    zIndex: 1000,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    letterSpacing: 1,
    color: '#222',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    fontWeight: '400',
    textAlign: 'center',
  },
}); 