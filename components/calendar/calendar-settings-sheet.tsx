/**
 * CalendarSettingsSheet — calendar settings. For now it only surfaces the future
 * external-calendar integration as a disabled "Próximamente" row (no connection,
 * OAuth or native permissions in this phase). Kept minimal so it doesn't distract.
 */

import { StyleSheet, View } from 'react-native';

import { Icon, Text } from '@/components/ui';
import { useTheme } from '@/hooks/use-theme';
import { Sheet } from './sheet';

export type CalendarSettingsSheetProps = {
  visible: boolean;
  onClose: () => void;
};

export function CalendarSettingsSheet({ visible, onClose }: CalendarSettingsSheetProps) {
  const theme = useTheme();

  return (
    <Sheet visible={visible} title="Ajustes del calendario" onClose={onClose}>
      <View
        style={[
          styles.row,
          { borderColor: theme.colors.border, borderRadius: theme.radii.lg, opacity: 0.6 },
        ]}
        accessibilityState={{ disabled: true }}>
        <Icon name="link" size={theme.sizes.iconMd} color={theme.colors.textMuted} />
        <View style={styles.texts}>
          <Text variant="body">Conectar un calendario externo</Text>
          <Text variant="caption" color="textSubtle">
            Apple, Google u Outlook para bloquear tu disponibilidad.
          </Text>
        </View>
        <View style={[styles.badge, { backgroundColor: theme.colors.surfaceAlt, borderRadius: theme.radii.pill }]}>
          <Text variant="caption" color="textMuted">
            Próximamente
          </Text>
        </View>
      </View>

      <Text variant="caption" color="textSubtle" style={styles.note}>
        Cuando esté disponible, los eventos externos solo bloquearán tu tiempo; no se
        convertirán en actividades editables de Vita.
      </Text>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    padding: 12,
  },
  texts: { flex: 1, gap: 2 },
  badge: { paddingHorizontal: 8, paddingVertical: 3 },
  note: { marginTop: 12 },
});
