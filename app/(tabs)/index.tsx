import { StyleSheet, View } from 'react-native';

import { Button, Card, Header, Icon, Screen, Text } from '@/components/ui';
import { PRIMARY_GOALS } from '@/constants';
import { useTheme } from '@/hooks/use-theme';
import { useAppStore } from '@/store';
import { todayWeekday } from '@/utils';
import { weekdayLabel } from '@/utils/date';
import { formatWeight } from '@/utils/format';

/**
 * Inicio — home dashboard. Greets the user by name and shows their real goal
 * and weight from the confirmed profile. Calorie/macro targets are intentionally
 * shown as "to be calculated" — they are computed when the plan is generated,
 * not fabricated here.
 */
export default function HomeScreen() {
  const theme = useTheme();
  const profile = useAppStore((s) => s.profile);
  const resetOnboarding = useAppStore((s) => s.resetOnboarding);

  const answers = profile?.answers;
  const name = profile?.name?.trim();
  const goalLabel = answers?.primaryGoal
    ? PRIMARY_GOALS.find((g) => g.value === answers.primaryGoal)?.label
    : undefined;

  return (
    <Screen scroll>
      <Header
        title={name ? `Hola, ${name}` : 'Hola'}
        subtitle={`Hoy es ${weekdayLabel(todayWeekday())}`}
      />

      <Card style={styles.heroCard}>
        <Text variant="label" color="textMuted">
          OBJETIVO ACTUAL
        </Text>
        <Text variant="heading">{goalLabel ?? 'Sin definir'}</Text>
        {answers?.weightKg != null ? (
          <View style={styles.heroRow}>
            <Text variant="body" color="textMuted">
              Peso actual
            </Text>
            <Text variant="bodyStrong">{formatWeight(answers.weightKg)}</Text>
          </View>
        ) : null}
      </Card>

      <Card style={styles.planCard}>
        <View style={[styles.planIcon, { backgroundColor: theme.colors.primaryMuted, borderRadius: theme.radii.lg }]}>
          <Icon name="sparkles" size={theme.sizes.iconMd} color={theme.colors.primary} />
        </View>
        <Text variant="subheading">Tu plan está casi listo</Text>
        <Text variant="body" color="textMuted">
          Tus calorías, macros y entrenamientos se calcularán al crear tu plan a partir de tus
          respuestas.
        </Text>
        <Text variant="caption" color="textSubtle">
          Próximamente: calendario y generación de tu semana.
        </Text>
      </Card>

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
  planCard: { gap: 8, marginTop: 16 },
  planIcon: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  devCard: { marginTop: 28, gap: 6 },
  devButton: { marginTop: 8 },
});
