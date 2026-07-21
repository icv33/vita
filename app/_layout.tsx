import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { AppState } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAppStore, useCalendarStore, useOnboardingStore } from '@/store';
import { navDarkTheme, navLightTheme } from '@/theme/navigation';

// Keep the splash screen up until the store has hydrated from storage.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const hydrate = useAppStore((s) => s.hydrate);
  const isHydrating = useAppStore((s) => s.isHydrating);
  const hydrateDraft = useOnboardingStore((s) => s.hydrateDraft);
  const hydrateCalendar = useCalendarStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
    hydrateDraft();
    hydrateCalendar();
  }, [hydrate, hydrateDraft, hydrateCalendar]);

  // Persist any pending onboarding edits when the app is backgrounded.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state !== 'active') {
        void useOnboardingStore.getState().flush();
      }
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (!isHydrating) {
      SplashScreen.hideAsync();
    }
  }, [isHydrating]);

  // Avoid a flash of the wrong route while we read the onboarding flag.
  if (isHydrating) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider value={colorScheme === 'dark' ? navDarkTheme : navLightTheme}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="(tabs)" />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
