import { Stack } from 'expo-router';

/**
 * Onboarding stack. The full questionnaire (goal, personal data, training,
 * nutrition, lifestyle) will be added as steps here in a later phase.
 */
export default function OnboardingLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
