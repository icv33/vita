import AsyncStorage from '@react-native-async-storage/async-storage';

import { useAppStore } from '@/store';

const initialState = useAppStore.getState();

describe('useAppStore', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    // Reset store to a known baseline before each test.
    useAppStore.setState({ isHydrating: true, hasCompletedOnboarding: false });
  });

  it('hydrates from an empty store as not-onboarded', async () => {
    await useAppStore.getState().hydrate();
    const state = useAppStore.getState();
    expect(state.isHydrating).toBe(false);
    expect(state.hasCompletedOnboarding).toBe(false);
  });

  it('completeOnboarding sets and persists the flag', async () => {
    await useAppStore.getState().completeOnboarding();
    expect(useAppStore.getState().hasCompletedOnboarding).toBe(true);

    // A fresh hydrate reads the persisted value.
    useAppStore.setState({ hasCompletedOnboarding: false });
    await useAppStore.getState().hydrate();
    expect(useAppStore.getState().hasCompletedOnboarding).toBe(true);
  });

  it('resetOnboarding clears the flag', async () => {
    await useAppStore.getState().completeOnboarding();
    await useAppStore.getState().resetOnboarding();
    expect(useAppStore.getState().hasCompletedOnboarding).toBe(false);
    await useAppStore.getState().hydrate();
    expect(useAppStore.getState().hasCompletedOnboarding).toBe(false);
  });

  it('exposes the expected initial API', () => {
    expect(typeof initialState.hydrate).toBe('function');
    expect(typeof initialState.completeOnboarding).toBe('function');
    expect(typeof initialState.resetOnboarding).toBe('function');
  });
});
