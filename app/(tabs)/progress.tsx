import { StyleSheet, View } from 'react-native';

import { Card, EmptyState, Header, Screen, Text } from '@/components/ui';
import { useAppStore } from '@/store';
import { formatWeight } from '@/utils/format';

/**
 * Progreso — analysis & tracking. Until there's real plan/tracking data, we show
 * cared-for empty states instead of fabricated numbers. The starting weight (a
 * real value entered during onboarding) is shown as the only genuine data point.
 */
export default function ProgressScreen() {
  const profile = useAppStore((s) => s.profile);
  const startingWeight = profile?.answers?.weightKg;

  return (
    <Screen scroll contentStyle={styles.screen}>
      <Header title="Progreso" subtitle="Tu evolución aparecerá aquí" />

      {startingWeight != null ? (
        <Card style={styles.card}>
          <Text variant="label" color="textMuted">
            PESO INICIAL
          </Text>
          <View style={styles.weightRow}>
            <Text variant="display">{formatWeight(startingWeight)}</Text>
            <Text variant="caption" color="textSubtle">
              registrado en tu perfil
            </Text>
          </View>
        </Card>
      ) : null}

      <View style={styles.empty}>
        <EmptyState
          icon="progress"
          title="Todavía no hay suficiente información"
          description="Tu evolución de peso, entrenamientos y adherencia aparecerá cuando comiences tu plan."
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { flexGrow: 1 },
  card: { gap: 4, marginTop: 4 },
  weightRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 },
  empty: { flex: 1, minHeight: 280 },
});
