/**
 * Thin, typed wrapper around AsyncStorage.
 *
 * Centralises JSON (de)serialisation and error handling so the rest of the app
 * never touches AsyncStorage directly. All methods fail soft: on error they log
 * (in dev) and return a safe fallback rather than throwing, keeping the UI
 * resilient to storage hiccups.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

async function getItem<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch (error) {
    if (__DEV__) console.warn(`[storage] Failed to read "${key}":`, error);
    return fallback;
  }
}

async function setItem<T>(key: string, value: T): Promise<boolean> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    if (__DEV__) console.warn(`[storage] Failed to write "${key}":`, error);
    return false;
  }
}

async function removeItem(key: string): Promise<boolean> {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    if (__DEV__) console.warn(`[storage] Failed to remove "${key}":`, error);
    return false;
  }
}

async function multiRemove(keys: string[]): Promise<boolean> {
  try {
    await AsyncStorage.multiRemove(keys);
    return true;
  } catch (error) {
    if (__DEV__) console.warn('[storage] Failed multiRemove:', error);
    return false;
  }
}

export const storage = {
  getItem,
  setItem,
  removeItem,
  multiRemove,
};
