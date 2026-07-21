/**
 * StepLayout — shared chrome for every onboarding step.
 *
 * Renders the progress bar + step counter, the step title/subtitle, a scrollable
 * (keyboard-aware) content area and a fixed footer with the primary action.
 * Reads step metadata from the registry via `stepId`, so each step screen only
 * provides its fields.
 */

import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Icon, ProgressBar, SafeArea, Text } from '@/components/ui';
import { useTheme } from '@/hooks/use-theme';
import { stepMetaById, stepNumber, stepProgress, TOTAL_DATA_STEPS } from '@/utils/onboarding';

export type StepLayoutProps = {
  stepId: string;
  onBack?: () => void;
  onExit?: () => void;
  onContinue?: () => void;
  continueLabel?: string;
  canContinue?: boolean;
  /** Replaces the default single-button footer (e.g. the review screen). */
  footer?: React.ReactNode;
  children: React.ReactNode;
};

export function StepLayout({
  stepId,
  onBack,
  onExit,
  onContinue,
  continueLabel = 'Continuar',
  canContinue = true,
  footer,
  children,
}: StepLayoutProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const meta = stepMetaById(stepId);
  const isReview = stepId === 'review';

  return (
    <SafeArea edges={['top', 'left', 'right']}>
      {/* Top bar: back + exit */}
      <View style={[styles.topBar, { paddingHorizontal: theme.spacing.lg }]}>
        {onBack ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Volver"
            onPress={onBack}
            hitSlop={12}
            style={styles.iconBtn}>
            <Icon name="chevronLeft" size={theme.sizes.iconLg} color={theme.colors.text} />
          </Pressable>
        ) : (
          <View style={styles.iconBtn} />
        )}

        {onExit ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Salir del cuestionario"
            onPress={onExit}
            hitSlop={12}>
            <Text variant="label" color="textMuted">
              Salir
            </Text>
          </Pressable>
        ) : null}
      </View>

      {/* Progress */}
      <View style={[styles.progress, { paddingHorizontal: theme.spacing.lg }]}>
        <ProgressBar progress={stepProgress(stepId)} />
        <Text variant="caption" color="textSubtle" style={styles.stepCount}>
          {isReview ? 'Último paso' : `Paso ${stepNumber(stepId)} de ${TOTAL_DATA_STEPS}`}
        </Text>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={insets.top + 8}>
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[styles.content, { paddingHorizontal: theme.spacing.lg }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {meta ? (
            <View style={styles.heading}>
              <Text variant="title">{meta.title}</Text>
              <Text variant="callout" color="textMuted">
                {meta.subtitle}
              </Text>
            </View>
          ) : null}
          {children}
        </ScrollView>

        {/* Fixed footer */}
        <View
          style={[
            styles.footer,
            {
              paddingHorizontal: theme.spacing.lg,
              paddingBottom: Math.max(insets.bottom, theme.spacing.md),
              borderTopColor: theme.colors.border,
              backgroundColor: theme.colors.background,
            },
          ]}>
          {footer ?? (
            <Button
              title={continueLabel}
              onPress={onContinue}
              disabled={!canContinue}
              icon={isReview ? undefined : 'chevronRight'}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
  },
  iconBtn: { width: 32, height: 32, alignItems: 'flex-start', justifyContent: 'center' },
  progress: { gap: 6, paddingTop: 4, paddingBottom: 12 },
  stepCount: { marginLeft: 2 },
  content: { paddingBottom: 24, gap: 20 },
  heading: { gap: 6 },
  footer: {
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
