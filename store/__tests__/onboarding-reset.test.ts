import AsyncStorage from '@react-native-async-storage/async-storage';

import { onboardingStorage, profileStorage } from '@/storage';
import { resetEntireOnboardingFlow, useAppStore, useOnboardingStore } from '@/store';
import type { UserProfile } from '@/types';

const sampleProfile: UserProfile = {
  schemaVersion: 1,
  name: 'Ana',
  answers: { name: 'Ana', primaryGoal: 'lose_fat', weightKg: 62 },
  acknowledgedDisclaimer: true,
  createdAt: '2026-07-21T00:00:00.000Z',
  updatedAt: '2026-07-21T00:00:00.000Z',
};

/** Put the app in a "fully onboarded, with a draft" state. */
async function seedOnboardedState() {
  await useOnboardingStore.getState().startFresh();
  useOnboardingStore.getState().setAnswers({ name: 'Ana' });
  await useOnboardingStore.getState().flush();
  await useAppStore.getState().completeOnboarding(sampleProfile);
}

describe('resetEntireOnboardingFlow', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    await useOnboardingStore.getState().resetDraft();
    useOnboardingStore.setState({ isHydrated: true, returnToReview: false });
    useAppStore.setState({ isHydrating: false, hasCompletedOnboarding: false, profile: null });
  });

  it('removes the draft, the profile and the completion flag from storage', async () => {
    await seedOnboardedState();
    expect(await onboardingStorage.getDraft()).not.toBeNull();
    expect(await profileStorage.get()).not.toBeNull();
    expect(await onboardingStorage.isComplete()).toBe(true);

    await resetEntireOnboardingFlow();

    expect(await onboardingStorage.getDraft()).toBeNull();
    expect(await profileStorage.get()).toBeNull();
    expect(await onboardingStorage.isComplete()).toBe(false);
  });

  it('returns both stores to their initial values', async () => {
    await seedOnboardedState();
    await resetEntireOnboardingFlow();

    const app = useAppStore.getState();
    expect(app.hasCompletedOnboarding).toBe(false);
    expect(app.profile).toBeNull();

    const onboarding = useOnboardingStore.getState();
    expect(onboarding.draft).toBeNull();
    expect(onboarding.returnToReview).toBe(false);
    // Hydration stays "done" so there is no re-hydrate loop / blank screen.
    expect(onboarding.isHydrated).toBe(true);
    expect(app.isHydrating).toBe(false);
  });

  it('a subsequent hydration does not recover old data', async () => {
    await seedOnboardedState();
    await resetEntireOnboardingFlow();

    // Simulate an app relaunch reading from storage.
    await useAppStore.getState().hydrate();
    await useOnboardingStore.getState().hydrateDraft();

    expect(useAppStore.getState().hasCompletedOnboarding).toBe(false);
    expect(useAppStore.getState().profile).toBeNull();
    expect(useOnboardingStore.getState().draft).toBeNull();
  });

  it('leaves the navigation gate pointing at /onboarding', async () => {
    await seedOnboardedState();
    await resetEntireOnboardingFlow();

    // The gate in app/index.tsx redirects based on this flag.
    const gateTarget = useAppStore.getState().hasCompletedOnboarding ? '/(tabs)' : '/onboarding';
    expect(gateTarget).toBe('/onboarding');
  });

  it('is safe to call multiple times without errors or inconsistent state', async () => {
    await seedOnboardedState();
    await Promise.all([
      resetEntireOnboardingFlow(),
      resetEntireOnboardingFlow(),
      resetEntireOnboardingFlow(),
    ]);

    expect(await onboardingStorage.getDraft()).toBeNull();
    expect(await profileStorage.get()).toBeNull();
    expect(useAppStore.getState().profile).toBeNull();
    expect(useAppStore.getState().hasCompletedOnboarding).toBe(false);
    expect(useOnboardingStore.getState().draft).toBeNull();
  });
});
