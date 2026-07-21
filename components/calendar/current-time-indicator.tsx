/**
 * CurrentTimeIndicator — a line + dot + small time label at the current time,
 * shown only when viewing today and within the visible window. Refreshes each
 * minute and when the app returns to the foreground (never every second).
 */

import { useEffect, useState } from 'react';
import { AppState, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { CALENDAR_DAY_END_MIN, CALENDAR_DAY_START_MIN } from '@/constants/calendar';
import { useTheme } from '@/hooks/use-theme';
import { minutesToTime } from '@/utils/calendar';
import { GUTTER_WIDTH, minuteToY } from './layout';

function currentMinutes(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

export function CurrentTimeIndicator() {
  const theme = useTheme();
  const [minutes, setMinutes] = useState(currentMinutes);

  useEffect(() => {
    const tick = () => setMinutes(currentMinutes());
    const id = setInterval(tick, 60 * 1000);
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') tick();
    });
    return () => {
      clearInterval(id);
      sub.remove();
    };
  }, []);

  if (minutes < CALENDAR_DAY_START_MIN || minutes > CALENDAR_DAY_END_MIN) return null;

  return (
    <View pointerEvents="none" style={[styles.row, { top: minuteToY(minutes) }]}>
      <View style={[styles.labelWrap, { width: GUTTER_WIDTH }]}>
        <View style={[styles.label, { backgroundColor: theme.colors.danger, borderRadius: theme.radii.sm }]}>
          <Text variant="caption" color="onPrimary" style={styles.labelText}>
            {minutesToTime(minutes)}
          </Text>
        </View>
      </View>
      <View style={[styles.dot, { backgroundColor: theme.colors.danger }]} />
      <View style={[styles.line, { backgroundColor: theme.colors.danger }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { position: 'absolute', left: 0, right: 6, flexDirection: 'row', alignItems: 'center' },
  labelWrap: { alignItems: 'flex-end', paddingRight: 6 },
  label: { paddingHorizontal: 5, paddingVertical: 1 },
  labelText: { fontSize: 10, lineHeight: 13 },
  dot: { width: 8, height: 8, borderRadius: 4, marginLeft: -4 },
  line: { flex: 1, height: 2, borderRadius: 1 },
});
