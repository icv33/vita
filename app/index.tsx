import { Redirect } from 'expo-router';

import { useAppStore } from '@/store';

/**
 * Entry route. Sends the user to onboarding or the main app depending on the
 * (already-hydrated) onboarding flag.
 */
export default function Index() {
  const hasCompletedOnboarding = useAppStore((s) => s.hasCompletedOnboarding);
  return <Redirect href={hasCompletedOnboarding ? '/(tabs)' : '/onboarding'} />;
}
