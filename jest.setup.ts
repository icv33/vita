/**
 * Jest setup — runs before each test file.
 *
 * Provides an in-memory mock of AsyncStorage so storage and store logic can be
 * tested without a native module.
 */

import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);
