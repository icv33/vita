/**
 * ActivityBlockCard — a single block positioned on the timeline. Colors come from
 * the category catalog (pastel fill + strong accent bar). Content adapts to the
 * available height: very short blocks show only icon + title; taller blocks add
 * the time range and location. Read-only (external) blocks show a lock and can
 * be viewed but not edited.
 */

import { Pressable, StyleSheet, View } from 'react-native';

import { Icon, Text } from '@/components/ui';
import { categoryMeta, locationMeta } from '@/constants/calendar';
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
  const label = block.title?.trim() || meta.label;
  const readOnly = Boolean(block.readOnly);

  // Height tiers decide how much detail fits without overflow.
  const tier = height < 40 ? 'tiny' : height < 58 ? 'compact' : 'full';
  const showTime = tier !== 'tiny';
  const showLocation = tier === 'full' && Boolean(block.location) && height >= 74;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label}, ${formatRange(block.startMinutes, block.endMinutes)}${readOnly ? ', externo, solo lectura' : ''}`}
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
      <View style={[styles.body, tier === 'tiny' ? styles.bodyTiny : null]}>
        <View style={styles.titleRow}>
          <Icon name={meta.icon} size={tier === 'tiny' ? 12 : 14} color={meta.color} />
          <Text
            variant={tier === 'tiny' ? 'caption' : 'label'}
            numberOfLines={1}
            style={[styles.title, { color: meta.color }]}>
            {label}
          </Text>
          {readOnly ? <Icon name="lock" size={11} color={meta.color} /> : null}
          {tier === 'tiny' && showTime ? (
            <Text variant="caption" color="textMuted" numberOfLines={1}>
              {formatRange(block.startMinutes, block.endMinutes)}
            </Text>
          ) : null}
        </View>

        {tier !== 'tiny' && showTime ? (
          <Text variant="caption" color="textMuted" numberOfLines={1}>
            {formatRange(block.startMinutes, block.endMinutes)}
          </Text>
        ) : null}

        {showLocation && block.location ? (
          <View style={styles.locationRow}>
            <Icon name={locationMeta(block.location).icon} size={11} color={theme.colors.textSubtle} />
            <Text variant="caption" color="textSubtle" numberOfLines={1}>
              {locationMeta(block.location).label}
            </Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { position: 'absolute', right: 6, flexDirection: 'row', overflow: 'hidden' },
  bar: { width: 4 },
  body: { flex: 1, paddingHorizontal: 8, paddingVertical: 6, gap: 2, justifyContent: 'center' },
  bodyTiny: { paddingVertical: 2, justifyContent: 'center' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  title: { flex: 1 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});
