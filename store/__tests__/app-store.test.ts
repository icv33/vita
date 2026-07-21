import AsyncStorage from '@react-native-async-storage/async-storage';

import { useAppStore } from '@/store';
import type { UserProfile } from '@/types';

const initialState = useAppStore.getState();

const sampleProfile: UserProfile = {
  schemaVersion: 1,
  name: 'Ana',
  answers: { name: 'Ana', primaryGoal: 'lose_fat' },
  acknowledgedDisclaimer: true,
  createdAt: '2026-07-21T00:00:00.000Z',
  updatedAt: '2026-07-21T00:00:00.000Z',
};

describe('useAppStore', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    useAppStore.setState({ isHydrating: true, hasCompletedOnboarding: false, profile: null });
  });

  it('hydrates from an empty store as not-onboarded', async () => {
    await useAppStore.getState().hydrate();
    const state = useAppStore.getState();
    expect(state.isHydrating).toBe(false);
    expect(state.hasCompletedOnboarding).toBe(false);
    expect(state.profile).toBeNull();
  });

  it('completeOnboarding persists the flag and profile', async () => {
    await useAppStore.getState().completeOnboarding(sampleProfile);
    expect(useAppStore.getState().hasCompletedOnboarding).toBe(true);
    expect(useAppStore.getState().profile?.name).toBe('Ana');

    // A fresh hydrate reads the persisted values.
    useAppStore.setState({ hasCompletedOnboarding: false, profile: null });
    await useAppStore.getState().hydrate();
    expect(useAppStore.getState().hasCompletedOnboarding).toBe(true);
    expect(useAppStore.getState().profile?.name).toBe('Ana');
  });

  it('resetOnboarding clears the flag and profile', async () => {
    await useAppStore.getState().completeOnboarding(sampleProfile);
    await useAppStore.getState().resetOnboarding();
    expect(useAppStore.getState().hasCompletedOnboarding).toBe(false);
    expect(useAppStore.getState().profile).toBeNull();
    await useAppStore.getState().hydrate();
    expect(useAppStore.getState().hasCompletedOnboarding).toBe(false);
    expect(useAppStore.getState().profile).toBeNull();
  });

  it('exposes the expected initial API', () => {
    expect(typeof initialState.hydrate).toBe('function');
    expect(typeof initialState.completeOnboarding).toBe('function');
    expect(typeof initialState.resetOnboarding).toBe('function');
  });
});
