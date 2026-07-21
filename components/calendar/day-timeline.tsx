/**
 * DayTimeline — the scrollable vertical timeline for one day. Composes the grid,
 * the day's blocks and the current-time indicator, and auto-scrolls near the
 * current time on mount.
 *
 * Horizontal padding is applied ONCE here, on the shared wrapping view that
 * contains TimeGrid, the blocks and the current-time indicator. All three are
 * absolutely positioned, and in React Native absolute `left`/`right` offsets
 * resolve against the *padding box* of the nearest positioned ancestor — so a
 * single `paddingHorizontal` here keeps every layer aligned automatically,
 * matching the padding used by the header and day selector above it. Previously
 * this view had no padding, so the hour column sat flush against the literal
 * screen edge (x=0) — the exact cause of the "cut off" hour labels.
 */

import { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { CALENDAR_DAY_START_MIN } from '@/constants/calendar';
import { useTheme } from '@/hooks/use-theme';
import type { ActivityBlock } from '@/types';
import { ActivityBlockCard } from './activity-block-card';
import { CurrentTimeIndicator } from './current-time-indicator';
import { minuteToY, TIMELINE_HEIGHT } from './layout';
import { TimeGrid } from './time-grid';

/** Extra scroll room so the 22:00–23:00 range clears the FAB / screen edge. */
const BOTTOM_SPACER = 48;

export type DayTimelineProps = {
  blocks: ActivityBlock[];
  isToday: boolean;
  onSlotPress: (startMinutes: number) => void;
  onBlockPress: (block: ActivityBlock) => void;
};

export function DayTimeline({ blocks, isToday, onSlotPress, onBlockPress }: DayTimelineProps) {
  const theme = useTheme();
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const target = isToday ? Math.max(minuteToY(nowMin) - 120, 0) : Math.max(minuteToY(CALENDAR_DAY_START_MIN + 60) - 40, 0);
    const id = setTimeout(() => scrollRef.current?.scrollTo({ y: target, animated: false }), 60);
    return () => clearTimeout(id);
  }, [isToday]);

  return (
    <ScrollView
      ref={scrollRef}
      style={styles.flex}
      contentContainerStyle={{ height: TIMELINE_HEIGHT + BOTTOM_SPACER }}
      showsVerticalScrollIndicator={false}>
      <View style={[styles.flex, { paddingHorizontal: theme.spacing.lg }]}>
        <TimeGrid onSlotPress={onSlotPress} />
        {blocks.map((block) => (
          <ActivityBlockCard key={block.id} block={block} onPress={onBlockPress} />
        ))}
        {isToday ? <CurrentTimeIndicator /> : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
