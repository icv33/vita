/**
 * Central icon registry for Vita.
 *
 * We standardise on Ionicons (bundled with @expo/vector-icons, so no extra
 * assets and full Expo Go support) and expose a semantic map. Screens and
 * components reference icons by intent (e.g. `home`, `training`) so the
 * underlying icon set can change in one place.
 */

import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

export const icons = {
  // Tab bar
  home: 'home',
  homeOutline: 'home-outline',
  calendar: 'calendar',
  calendarOutline: 'calendar-outline',
  training: 'barbell',
  trainingOutline: 'barbell-outline',
  meals: 'restaurant',
  mealsOutline: 'restaurant-outline',
  progress: 'stats-chart',
  progressOutline: 'stats-chart-outline',

  // Generic UI
  chevronRight: 'chevron-forward',
  chevronLeft: 'chevron-back',
  chevronDown: 'chevron-down',
  check: 'checkmark',
  checkCircle: 'checkmark-circle',
  close: 'close',
  add: 'add',
  settings: 'settings-outline',
  camera: 'camera-outline',
  water: 'water-outline',
  flame: 'flame-outline',
  time: 'time-outline',
  cart: 'cart-outline',
  sparkles: 'sparkles-outline',
  refresh: 'refresh',
  warning: 'alert-circle-outline',
  empty: 'file-tray-outline',
} as const satisfies Record<string, IoniconName>;

export type IconName = keyof typeof icons;
