import { useEffect, useRef } from "react";
import { Accelerometer } from "expo-sensors";

interface ShakeListenerProps {
  onShake?: () => void;
  threshold?: number; // Sensibilidad, por defecto 1.4
}

export default function ShakeListener({ onShake, threshold = 15.0 }: ShakeListenerProps) {
  const last = useRef({ x: 0, y: 0, z: 0 });
  const lastShake = useRef(Date.now());

  useEffect(() => {
    const subscription = Accelerometer.addListener(accelerometerData => {
      const { x, y, z } = accelerometerData;
      const delta =
        Math.abs(x - last.current.x) +
        Math.abs(y - last.current.y) +
        Math.abs(z - last.current.z);

      if (delta > threshold && Date.now() - lastShake.current > 1000) {
        lastShake.current = Date.now();
        if (onShake) onShake();
      }
      last.current = { x, y, z };
    });

    Accelerometer.setUpdateInterval(100); // 100ms

    return () => {
      subscription && subscription.remove();
    };
  }, [onShake, threshold]);

  return null;
}