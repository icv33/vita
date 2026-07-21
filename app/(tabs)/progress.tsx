import { StyleSheet, View } from 'react-native';

import { Card, Header, ProgressBar, Screen, Text } from '@/components/ui';
import { demoProgress } from '@/data';
import { formatSignedKg, formatWeight, toPercent } from '@/utils/format';

/**
 * Progreso — analysis & tracking. Renders demo weekly summary so the layout
 * and design system can be reviewed. Charts and history arrive later.
 */
export default function ProgressScreen() {
  const p = demoProgress;
  const workoutRatio = p.workoutsPlanned ? p.workoutsCompleted / p.workoutsPlanned : 0;

  return (
    <Screen scroll>
      <Header title="Progreso" subtitle="Tu evolución esta semana" />

      <Card style={styles.card}>
        <Text variant="label" color="textMuted">
          PESO ACTUAL
        </Text>
        <View style={styles.weightRow}>
          <Text variant="display">{formatWeight(p.currentWeightKg)}</Text>
          <Text variant="bodyStrong" color={p.weightDeltaKg <= 0 ? 'success' : 'danger'}>
            {formatSignedKg(p.weightDeltaKg)}
          </Text>
        </View>
      </Card>

      <View style={styles.row}>
        <Card style={styles.half}>
          <Text variant="caption" color="textMuted">
            Entrenamientos
          </Text>
          <Text variant="heading">
            {p.workoutsCompleted}
            <Text variant="body" color="textMuted">
              {' '}
              / {p.workoutsPlanned}
            </Text>
          </Text>
          <ProgressBar progress={workoutRatio} color={undefined} style={styles.bar} />
        </Card>

        <Card style={styles.half}>
          <Text variant="caption" color="textMuted">
            Adherencia nutrición
          </Text>
          <Text variant="heading" color="success">
            {p.nutritionAdherencePct}%
          </Text>
          <ProgressBar
            progress={toPercent(p.nutritionAdherencePct / 100) / 100}
            style={styles.bar}
          />
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { gap: 4, marginTop: 4 },
  weightRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  row: { flexDirection: 'row', gap: 12, marginTop: 12 },
  half: { flex: 1, gap: 6 },
  bar: { marginTop: 8 },
});
