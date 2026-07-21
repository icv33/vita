/**
 * DayTimeline — the scrollable vertical timeline for one day. Composes the grid,
 * the day's blocks and the current-time indicator, and auto-scrolls near the
 * current time on mount.
 */

import { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { CALENDAR_DAY_START_MIN } from '@/constants/calendar';
import type { ActivityBlock } from '@/types';
import { ActivityBlockCard } from './activity-block-card';
import { CurrentTimeIndicator } from './current-time-indicator';
import { minuteToY, TIMELINE_HEIGHT } from './layout';
import { TimeGrid } from './time-grid';

export type DayTimelineProps = {
  blocks: ActivityBlock[];
  isToday: boolean;
  onSlotPress: (startMinutes: number) => void;
  onBlockPress: (block: ActivityBlock) => void;
};

export function DayTimeline({ blocks, isToday, onSlotPress, onBlockPress }: DayTimelineProps) {
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
      contentContainerStyle={{ height: TIMELINE_HEIGHT }}
      showsVerticalScrollIndicator={false}>
      <View style={styles.flex}>
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
