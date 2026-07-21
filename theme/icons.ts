/**
 * Central icon registry for Vita.
 *
 * We standardise on Ionicons (bundled with @expo/vector-icons, so no extra
 * assets and full Expo Go support) and expose a semantic map. Screens and
 * components reference icons by intent (e.g. `home`, `training`) so the
 * underlying icon set can change in one place. No emojis are used as UI icons.
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
  remove: 'remove',
  settings: 'settings-outline',
  camera: 'camera-outline',
  water: 'water-outline',
  flame: 'flame',
  time: 'time-outline',
  timer: 'timer-outline',
  cart: 'cart-outline',
  sparkles: 'sparkles',
  refresh: 'refresh',
  warning: 'alert-circle-outline',
  info: 'information-circle-outline',
  edit: 'create-outline',
  logOut: 'log-out-outline',
  empty: 'file-tray-outline',
  shield: 'shield-checkmark-outline',
  trash: 'trash-outline',
  copy: 'copy-outline',
  duplicate: 'duplicate-outline',
  move: 'swap-vertical',
  location: 'location-outline',
  ellipsis: 'ellipsis-horizontal',
  ellipsisVertical: 'ellipsis-vertical',
  today: 'today-outline',
  car: 'car',
  ban: 'ban',
  easel: 'easel',
  addCircle: 'add-circle',
  chevronUp: 'chevron-up',

  // People / body
  person: 'person',
  personOutline: 'person-outline',
  people: 'people-outline',
  body: 'body-outline',

  // Goals & training intent
  trophy: 'trophy',
  trendingUp: 'trending-up',
  leaf: 'leaf',
  flash: 'flash',
  heart: 'heart',
  pulse: 'pulse',
  fitness: 'fitness',
  barbell: 'barbell',
  speedometer: 'speedometer',
  infinite: 'infinite',
  football: 'football',
  bicycle: 'bicycle',
  walk: 'walk',
  footsteps: 'footsteps',
  hand: 'hand-left',

  // Places / occupation
  business: 'business',
  school: 'school',
  book: 'book',
  briefcase: 'briefcase',
  construct: 'construct',
  hammer: 'hammer',
  sunny: 'sunny',
  shuffle: 'shuffle',
  repeat: 'repeat',

  // Nutrition
  nutrition: 'nutrition',
  fish: 'fish',
  cafe: 'cafe',
  fastFood: 'fast-food',
  cash: 'cash',
  wallet: 'wallet',
  snow: 'snow',
  restaurantAlt: 'restaurant-outline',

  // Lifestyle / sleep
  moon: 'moon',
  partlySunny: 'partly-sunny',
  cloud: 'cloudy',
  bed: 'bed',
  alarm: 'alarm',
  star: 'star',
  happy: 'happy',
  sad: 'sad',
} as const satisfies Record<string, IoniconName>;

export type IconName = keyof typeof icons;
