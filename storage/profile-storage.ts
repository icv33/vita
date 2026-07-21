/**
 * Persistence for the confirmed user profile (written on onboarding finish).
 */

import { STORAGE_KEYS } from '@/constants';
import type { UserProfile } from '@/types';
import { storage } from './storage';

export const profileStorage = {
  async get(): Promise<UserProfile | null> {
    return storage.getItem<UserProfile | null>(STORAGE_KEYS.userProfile, null);
  },

  async set(profile: UserProfile): Promise<boolean> {
    return storage.setItem(STORAGE_KEYS.userProfile, profile);
  },

  async clear(): Promise<boolean> {
    return storage.removeItem(STORAGE_KEYS.userProfile);
  },
};
