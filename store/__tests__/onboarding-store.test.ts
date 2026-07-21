import AsyncStorage from '@react-native-async-storage/async-storage';

import { onboardingStorage } from '@/storage';
import { isResumable, useOnboardingStore } from '@/store';

const store = () => useOnboardingStore.getState();

describe('useOnboardingStore', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    await store().resetDraft();
    useOnboardingStore.setState({ isHydrated: false, returnToReview: false });
  });

  it('startFresh creates and persists a draft at the first step', async () => {
    await store().startFresh();
    expect(store().draft?.currentStepId).toBe('name');
    const persisted = await onboardingStorage.getDraft();
    expect(persisted?.currentStepId).toBe('name');
  });

  it('setAnswers updates memory immediately and persists after flush', async () => {
    await store().startFresh();
    store().setAnswers({ name: 'Ana', primaryGoal: 'lose_fat' });
    // Memory is instant.
    expect(store().draft?.answers.name).toBe('Ana');
    // Disk is debounced until flushed.
    await store().flush();
    const persisted = await onboardingStorage.getDraft();
    expect(persisted?.answers.name).toBe('Ana');
    expect(persisted?.answers.primaryGoal).toBe('lose_fat');
  });

  it('goNext advances and records completion; goBack returns', async () => {
    await store().startFresh();
    await store().goNext();
    expect(store().draft?.currentStepId).toBe('goal');
    expect(store().draft?.completedStepIds).toContain('name');
    // Navigation persists immediately.
    expect((await onboardingStorage.getDraft())?.currentStepId).toBe('goal');

    await store().goBack();
    expect(store().draft?.currentStepId).toBe('name');
  });

  it('editStep jumps to a step and returns to review on continue', async () => {
    await store().startFresh();
    await store().editStep('personal');
    expect(store().draft?.currentStepId).toBe('personal');
    expect(store().returnToReview).toBe(true);

    await store().goNext();
    expect(store().draft?.currentStepId).toBe('review');
    expect(store().returnToReview).toBe(false);
  });

  it('hydrateDraft resumes the persisted draft from the last step', async () => {
    await store().startFresh();
    store().setAnswers({ name: 'Leo' });
    await store().goNext(); // to 'goal', persisted
    // Simulate an app relaunch: wipe memory, hydrate from disk.
    useOnboardingStore.setState({ draft: null, isHydrated: false });
    await store().hydrateDraft();
    expect(store().isHydrated).toBe(true);
    expect(store().draft?.currentStepId).toBe('goal');
    expect(store().draft?.answers.name).toBe('Leo');
  });

  it('resetDraft clears memory and storage', async () => {
    await store().startFresh();
    store().setAnswers({ name: 'Ana' });
    await store().flush();
    await store().resetDraft();
    expect(store().draft).toBeNull();
    expect(await onboardingStorage.getDraft()).toBeNull();
  });

  it('isResumable reflects real progress', () => {
    expect(isResumable(null)).toBe(false);
    expect(isResumable({ schemaVersion: 1, currentStepId: 'name', completedStepIds: [], answers: {}, createdAt: '', updatedAt: '' })).toBe(false);
    expect(isResumable({ schemaVersion: 1, currentStepId: 'name', completedStepIds: [], answers: { name: 'Ana' }, createdAt: '', updatedAt: '' })).toBe(true);
  });
});
