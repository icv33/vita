/**
 * CurrentTimeIndicator — a thin line + dot at the current time, shown only when
 * viewing today and the time is within the visible window. Updates each minute.
 */

import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { CALENDAR_DAY_END_MIN, CALENDAR_DAY_START_MIN } from '@/constants/calendar';
import { useTheme } from '@/hooks/use-theme';
import { GUTTER_WIDTH, minuteToY } from './layout';

function currentMinutes(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

export function CurrentTimeIndicator() {
  const theme = useTheme();
  const [minutes, setMinutes] = useState(currentMinutes);

  useEffect(() => {
    const id = setInterval(() => setMinutes(currentMinutes()), 60 * 1000);
    return () => clearInterval(id);
  }, []);

  if (minutes < CALENDAR_DAY_START_MIN || minutes > CALENDAR_DAY_END_MIN) return null;

  return (
    <View pointerEvents="none" style={[styles.row, { top: minuteToY(minutes), left: GUTTER_WIDTH }]}>
      <View style={[styles.dot, { backgroundColor: theme.colors.danger }]} />
      <View style={[styles.line, { backgroundColor: theme.colors.danger }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { position: 'absolute', right: 6, flexDirection: 'row', alignItems: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, marginLeft: -4 },
  line: { flex: 1, height: 2, borderRadius: 1 },
});
