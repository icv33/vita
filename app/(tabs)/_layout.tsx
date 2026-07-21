import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';

import { HapticTab } from '@/components/haptic-tab';
import { useTheme } from '@/hooks/use-theme';
import { icons } from '@/theme';

/**
 * Main app tab bar: Inicio, Calendario, Entreno, Comidas, Progreso.
 * Matches the primary navigation from the product reference.
 */
export default function TabsLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: theme.colors.tabIconSelected,
        tabBarInactiveTintColor: theme.colors.tabIconDefault,
        tabBarStyle: {
          backgroundColor: theme.colors.tabBar,
          borderTopColor: theme.colors.border,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
        sceneStyle: { backgroundColor: theme.colors.background },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? icons.home : icons.homeOutline} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendario',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? icons.calendar : icons.calendarOutline}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="training"
        options={{
          title: 'Entreno',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? icons.training : icons.trainingOutline}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="meals"
        options={{
          title: 'Comidas',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? icons.meals : icons.mealsOutline} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progreso',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? icons.progress : icons.progressOutline}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
