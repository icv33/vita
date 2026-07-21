/**
 * Sheet — a lightweight bottom modal (RN Modal, Expo Go friendly). Used for the
 * calendar action menu and the day picker. Respects safe areas and dismisses on
 * backdrop press.
 */

import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/ui';
import { useTheme } from '@/hooks/use-theme';

export type SheetProps = {
  visible: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
};

export function Sheet({ visible, title, onClose, children }: SheetProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={[styles.backdrop, { backgroundColor: theme.colors.overlay }]} onPress={onClose}>
        <Pressable
          // Stop propagation so taps inside the card don't dismiss.
          onPress={() => {}}
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.surface,
              borderTopLeftRadius: theme.radii.xxl,
              borderTopRightRadius: theme.radii.xxl,
              paddingBottom: Math.max(insets.bottom, theme.spacing.lg),
            },
          ]}>
          <View style={[styles.handle, { backgroundColor: theme.colors.border }]} />
          {title ? (
            <Text variant="subheading" style={styles.title}>
              {title}
            </Text>
          ) : null}
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'flex-end' },
  card: { paddingHorizontal: 16, paddingTop: 8 },
  handle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 12 },
  title: { marginBottom: 12 },
});
