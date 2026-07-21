import { useRouter } from 'expo-router';
import { Alert, StyleSheet, View } from 'react-native';

import { Button, Card, Icon, Screen, Text } from '@/components/ui';
import { APP_NAME } from '@/constants';
import { useTheme } from '@/hooks/use-theme';
import { isResumable, useOnboardingStore } from '@/store';
import type { IconName } from '@/theme';
import { stepNumber } from '@/utils/onboarding';

/**
 * Onboarding welcome — introduces Vita and starts (or resumes) the questionnaire.
 */
export default function OnboardingWelcome() {
  const theme = useTheme();
  const router = useRouter();
  const draft = useOnboardingStore((s) => s.draft);
  const startFresh = useOnboardingStore((s) => s.startFresh);
  const ensureDraft = useOnboardingStore((s) => s.ensureDraft);

  const resumable = isResumable(draft);

  const goToQuestionnaire = () => router.push('/onboarding/questionnaire');

  const handleStart = async () => {
    if (resumable) {
      Alert.alert(
        'Empezar de nuevo',
        'Ya tienes un cuestionario guardado. ¿Quieres empezar desde cero? Perderás el progreso actual.',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Empezar de nuevo',
            style: 'destructive',
            onPress: async () => {
              await startFresh();
              goToQuestionnaire();
            },
          },
        ],
      );
      return;
    }
    await ensureDraft();
    goToQuestionnaire();
  };

  const highlights: { icon: IconName; label: string }[] = [
    { icon: 'barbell', label: 'Entrenamiento adaptado a tu tiempo' },
    { icon: 'nutrition', label: 'Alimentación según tus gustos' },
    { icon: 'calendar', label: 'Planificación en tu vida real' },
  ];

  return (
    <Screen contentStyle={styles.content}>
      <View style={styles.hero}>
        <View
          style={[styles.logo, { backgroundColor: theme.colors.primary, borderRadius: theme.radii.xxl }]}>
          <Text variant="display" color="onPrimary">
            V
          </Text>
        </View>
        <Text variant="display" center>
          Bienvenido a {APP_NAME}
        </Text>
        <Text variant="body" color="textMuted" center>
          Vita adapta tu entrenamiento, tu alimentación y tu planificación a tu vida real.
          Responde unas preguntas y crearemos después tu plan personalizado.
        </Text>
      </View>

      <View style={styles.list}>
        {highlights.map((item) => (
          <View key={item.label} style={styles.row}>
            <View
              style={[styles.rowIcon, { backgroundColor: theme.colors.primaryMuted, borderRadius: theme.radii.md }]}>
              <Icon name={item.icon} size={theme.sizes.iconSm} color={theme.colors.primary} />
            </View>
            <Text variant="body" style={styles.rowText}>
              {item.label}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Card elevation="none" style={[styles.timeCard, { backgroundColor: theme.colors.surfaceAlt }]}>
          <Icon name="time" size={theme.sizes.iconSm} color={theme.colors.textMuted} />
          <Text variant="caption" color="textMuted">
            Solo te llevará 3–5 minutos.
          </Text>
        </Card>

        <Button title="Crear mi plan" icon="chevronRight" onPress={handleStart} />

        {resumable && draft ? (
          <Button
            title={`Continuar donde lo dejaste · Paso ${stepNumber(draft.currentStepId)}`}
            variant="ghost"
            onPress={goToQuestionnaire}
          />
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, justifyContent: 'space-between', paddingVertical: 16 },
  hero: { alignItems: 'center', gap: 12, marginTop: 16 },
  logo: { width: 84, height: 84, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  list: { gap: 14 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rowIcon: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  rowText: { flex: 1 },
  footer: { gap: 12 },
  timeCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 10 },
});
