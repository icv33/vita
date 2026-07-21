/**
 * ActivityBlockCard — a single block positioned on the timeline. Tapping it
 * opens the editor (edit / duplicate / delete live there). Colors come from the
 * category catalog; short blocks collapse to a single line.
 */

import { Pressable, StyleSheet, View } from 'react-native';

import { Icon, Text } from '@/components/ui';
import { categoryMeta } from '@/constants/calendar';
import { useTheme } from '@/hooks/use-theme';
import type { ActivityBlock } from '@/types';
import { formatRange } from '@/utils/calendar';
import { GUTTER_WIDTH, minuteToY } from './layout';

export type ActivityBlockCardProps = {
  block: ActivityBlock;
  onPress: (block: ActivityBlock) => void;
};

export function ActivityBlockCard({ block, onPress }: ActivityBlockCardProps) {
  const theme = useTheme();
  const meta = categoryMeta(block.category);
  const top = minuteToY(block.startMinutes);
  const height = Math.max(minuteToY(block.endMinutes) - top, 22);
  const compact = height < 48;
  const label = block.title?.trim() || meta.label;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label}, ${formatRange(block.startMinutes, block.endMinutes)}`}
      onPress={() => onPress(block)}
      style={[
        styles.card,
        {
          top,
          height,
          left: GUTTER_WIDTH + 6,
          backgroundColor: meta.bg,
          borderRadius: theme.radii.md,
        },
      ]}>
      <View style={[styles.bar, { backgroundColor: meta.color }]} />
      <View style={[styles.body, compact ? styles.bodyCompact : null]}>
        {compact ? (
          <View style={styles.compactRow}>
            <Icon name={meta.icon} size={12} color={meta.color} />
            <Text variant="caption" numberOfLines={1} style={[styles.title, { color: meta.color }]}>
              {label}
            </Text>
            <Text variant="caption" color="textMuted" numberOfLines={1}>
              {formatRange(block.startMinutes, block.endMinutes)}
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.titleRow}>
              <Icon name={meta.icon} size={14} color={meta.color} />
              <Text variant="label" numberOfLines={1} style={[styles.title, { color: meta.color }]}>
                {label}
              </Text>
            </View>
            <Text variant="caption" color="textMuted" numberOfLines={1}>
              {formatRange(block.startMinutes, block.endMinutes)}
            </Text>
          </>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { position: 'absolute', right: 6, flexDirection: 'row', overflow: 'hidden' },
  bar: { width: 4 },
  body: { flex: 1, paddingHorizontal: 8, paddingVertical: 6, gap: 2, justifyContent: 'center' },
  bodyCompact: { paddingVertical: 2, justifyContent: 'center' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  compactRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  title: { flex: 1 },
});
