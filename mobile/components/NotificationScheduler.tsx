import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

type ScheduleOptions = {
  name: string;
  hour: number;
  minute: number;
  frequency: number; // cada cuántas horas repetir
  channelId?: string;
};

export async function scheduleMedicationNotifications({
  name,
  hour,
  minute,
  frequency,
  channelId = 'medicamentos',
}: ScheduleOptions) {
  // Solicita permisos si no están concedidos
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    console.warn('Permiso de notificaciones no concedido.');
    return;
  }

  // Programa notificaciones para cada intervalo
  const notificationsPerDay = Math.floor(24 / frequency);

  for (let i = 0; i < notificationsPerDay; i++) {
    const notifHour = (hour + i * frequency) % 24;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Recordatorio de medicamento',
        body: `Es hora de tomar: ${name}`,
        sound: 'default',
      },
      trigger: {
        channelId,
        hour: notifHour,
        minute,
        repeats: true,
      },
    });
  }
}

// Llamar una sola vez (ej. en App.tsx o en useEffect inicial)
export async function setupNotificationChannel() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('medicamentos', {
      name: 'Medicamentos',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
    });
  }
}
