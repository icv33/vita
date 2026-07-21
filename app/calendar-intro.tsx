import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button, Icon, Screen, Text } from '@/components/ui';
import { useTheme } from '@/hooks/use-theme';
import { useCalendarStore } from '@/store';
import type { IconName } from '@/theme';

/**
 * First-run calendar intro, shown right after finishing onboarding. Explains why
 * the calendar matters and lets the user set it up now or later. Either choice
 * marks the intro as seen so it won't show again.
 */
export default function CalendarIntroScreen() {
  const theme = useTheme();
  const router = useRouter();
  const ensureSchedule = useCalendarStore((s) => s.ensureSchedule);
  const completeSetup = useCalendarStore((s) => s.completeSetup);

  const configureNow = async () => {
    await ensureSchedule();
    await completeSetup();
    router.replace('/(tabs)/calendar');
  };

  const later = async () => {
    await completeSetup();
    router.replace('/(tabs)');
  };

  const points: { icon: IconName; label: string }[] = [
    { icon: 'briefcase', label: 'Marca cuándo trabajas o estudias' },
    { icon: 'time', label: 'Bloquea tus horas no disponibles' },
    { icon: 'sparkles', label: 'Vita organiza el resto por ti' },
  ];

  return (
    <Screen contentStyle={styles.content}>
      <View style={styles.hero}>
        <View style={[styles.badge, { backgroundColor: theme.colors.primaryMuted, borderRadius: theme.radii.xxl }]}>
          <Icon name="calendar" size={theme.sizes.iconXl} color={theme.colors.primary} />
        </View>
        <Text variant="title" center>
          Tu semana, a tu medida
        </Text>
        <Text variant="body" color="textMuted" center>
          Dinos cuándo estás ocupado. Vita utilizará el tiempo restante para organizar tus
          entrenamientos y comidas.
        </Text>
      </View>

      <View style={styles.list}>
        {points.map((p) => (
          <View key={p.label} style={styles.row}>
            <View style={[styles.rowIcon, { backgroundColor: theme.colors.surfaceAlt, borderRadius: theme.radii.md }]}>
              <Icon name={p.icon} size={theme.sizes.iconSm} color={theme.colors.primary} />
            </View>
            <Text variant="body" style={styles.flex}>
              {p.label}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Button title="Configurar mi horario" icon="chevronRight" onPress={configureNow} />
        <Button title="Lo haré más tarde" variant="ghost" onPress={later} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, justifyContent: 'space-between', paddingVertical: 16 },
  hero: { alignItems: 'center', gap: 12, marginTop: 24 },
  badge: { width: 84, height: 84, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  list: { gap: 14 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rowIcon: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  flex: { flex: 1 },
  footer: { gap: 8 },
});
