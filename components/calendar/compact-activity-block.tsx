/**
 * CompactActivityBlock — a single-line coloured row for the week agenda: a
 * category icon tile, the title, the time range and a read-only lock when the
 * block is external. Tapping opens the block.
 */

import { Pressable, StyleSheet, View } from 'react-native';

import { Icon, Text } from '@/components/ui';
import { categoryMeta } from '@/constants/calendar';
import { useTheme } from '@/hooks/use-theme';
import type { ActivityBlock } from '@/types';
import { formatRange } from '@/utils/calendar';

export type CompactActivityBlockProps = {
  block: ActivityBlock;
  onPress: (block: ActivityBlock) => void;
};

export function CompactActivityBlock({ block, onPress }: CompactActivityBlockProps) {
  const theme = useTheme();
  const meta = categoryMeta(block.category);
  const label = block.title?.trim() || meta.label;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label}, ${formatRange(block.startMinutes, block.endMinutes)}`}
      onPress={() => onPress(block)}
      style={styles.row}>
      <View style={[styles.iconTile, { backgroundColor: meta.bg, borderRadius: theme.radii.sm }]}>
        <Icon name={meta.icon} size={14} color={meta.color} />
      </View>
      <Text variant="callout" numberOfLines={1} style={styles.title}>
        {label}
      </Text>
      {block.readOnly ? <Icon name="lock" size={12} color={theme.colors.textSubtle} /> : null}
      <Text variant="caption" color="textMuted" numberOfLines={1}>
        {formatRange(block.startMinutes, block.endMinutes)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 40, paddingVertical: 4 },
  iconTile: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1 },
});
