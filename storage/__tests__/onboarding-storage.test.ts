import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '@/constants';
import { onboardingStorage } from '@/storage';

describe('onboardingStorage', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('defaults to not complete', async () => {
    expect(await onboardingStorage.isComplete()).toBe(false);
  });

  it('persists completion and reads it back', async () => {
    await onboardingStorage.setComplete(true);
    expect(await onboardingStorage.isComplete()).toBe(true);
    expect(await AsyncStorage.getItem(STORAGE_KEYS.onboardingComplete)).toBe('true');
  });

  it('reset clears the completion flag', async () => {
    await onboardingStorage.setComplete(true);
    await onboardingStorage.reset();
    expect(await onboardingStorage.isComplete()).toBe(false);
  });
});
