import { StyleSheet, View } from 'react-native';

import { Button, Card, Header, Icon, Screen, Text } from '@/components/ui';
import { useTheme } from '@/hooks/use-theme';
import { useAppStore } from '@/store';
import { demoTargets } from '@/data';
import { todayWeekday } from '@/utils';
import { weekdayLabel } from '@/utils/date';
import { formatCalories, formatGrams, formatWeight } from '@/utils/format';
import type { IconName } from '@/theme';

/**
 * Inicio — home dashboard. Shows today's targets from demo data and (in dev)
 * a control to reset onboarding. Real "today" content arrives with the plan
 * generator.
 */
export default function HomeScreen() {
  const theme = useTheme();
  const resetOnboarding = useAppStore((s) => s.resetOnboarding);

  const targets: { icon: IconName; label: string; value: string; tint: string }[] = [
    { icon: 'flame', label: 'Calorías', value: formatCalories(demoTargets.calories), tint: theme.colors.primary },
    { icon: 'meals', label: 'Proteínas', value: formatGrams(demoTargets.proteinG), tint: theme.colors.accent },
    { icon: 'progress', label: 'Pasos', value: demoTargets.steps.toLocaleString('es-ES'), tint: theme.colors.warning },
    { icon: 'water', label: 'Agua', value: `${demoTargets.waterL.toLocaleString('es-ES')} L`, tint: theme.colors.primary },
  ];

  return (
    <Screen scroll>
      <Header title="Hola 👋" subtitle={`Tu plan para hoy · ${weekdayLabel(todayWeekday())}`} />

      <Card style={styles.heroCard}>
        <Text variant="label" color="textMuted">
          OBJETIVO ACTUAL
        </Text>
        <Text variant="heading">Perder grasa</Text>
        <View style={styles.heroRow}>
          <Text variant="body" color="textMuted">
            Peso actual
          </Text>
          <Text variant="bodyStrong">{formatWeight(62)}</Text>
        </View>
      </Card>

      <Text variant="subheading" style={styles.sectionTitle}>
        Objetivos diarios
      </Text>
      <View style={styles.grid}>
        {targets.map((t) => (
          <Card key={t.label} style={styles.statCard}>
            <View
              style={[styles.statIcon, { backgroundColor: theme.colors.surfaceAlt, borderRadius: theme.radii.md }]}>
              <Icon name={t.icon} size={theme.sizes.iconSm} color={t.tint} />
            </View>
            <Text variant="caption" color="textMuted">
              {t.label}
            </Text>
            <Text variant="bodyStrong">{t.value}</Text>
          </Card>
        ))}
      </View>

      {__DEV__ ? (
        <Card style={styles.devCard} elevation="none">
          <Text variant="label" color="textMuted">
            HERRAMIENTAS DE DESARROLLO
          </Text>
          <Text variant="caption" color="textSubtle">
            Solo visible en modo desarrollo.
          </Text>
          <Button
            title="Reiniciar onboarding"
            variant="outline"
            size="sm"
            icon="refresh"
            onPress={resetOnboarding}
            style={styles.devButton}
          />
        </Card>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  heroCard: { gap: 4, marginTop: 4 },
  heroRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  sectionTitle: { marginTop: 24, marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: { width: '47%', flexGrow: 1, gap: 6 },
  statIcon: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  devCard: { marginTop: 28, gap: 6 },
  devButton: { marginTop: 8 },
});
