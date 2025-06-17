import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { Platform } from 'react-native';

import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

import AsistenteScreen from './asistente';
import GPSScreen from './gps';
import PerfilScreen from './index';
import MedicamentosScreen from './medicamentos';

const Tab = createMaterialTopTabNavigator();

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tab.Navigator
      initialRouteName="Perfil"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarShowIcon: true,
        tabBarIndicatorStyle: { backgroundColor: Colors[colorScheme ?? 'light'].tint },
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
        tabBarItemStyle: { flexDirection: 'row' },
        swipeEnabled: true,
        tabBarShowLabel: true,
        tabBarPressColor: Colors[colorScheme ?? 'light'].tint,
        tabBarBounces: true,
        tabBarScrollEnabled: false,
      }}
    >
      <Tab.Screen
        name="Perfil"
        component={PerfilScreen}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
        }}
      />
      <Tab.Screen
        name="Medicamentos"
        component={MedicamentosScreen}
        options={{
          tabBarLabel: 'Medicamentos',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="pills.fill" color={color} />,
        }}
      />
      <Tab.Screen
        name="GPS"
        component={GPSScreen}
        options={{
          tabBarLabel: 'GPS',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="location.fill" color={color} />,
        }}
      />
      <Tab.Screen
        name="Asistente"
        component={AsistenteScreen}
        options={{
          tabBarLabel: 'Asistente',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="message.fill" color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
