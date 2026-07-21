/**
 * ReviewStep — the final onboarding screen: an editable summary of every answer
 * grouped by section, plus the mandatory disclaimer (and allergy confirmation
 * when relevant) before creating the plan.
 */

import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, Card, Icon, Text } from '@/components/ui';
import { ONBOARDING_STEPS, REVIEW_STEP_ID } from '@/constants';
import { useTheme } from '@/hooks/use-theme';
import type { OnboardingAnswers } from '@/types';
import { hasAllergies } from '@/utils/onboarding';
import {
  buildStepSummary,
  SECTION_TITLES,
  STEP_REVIEW_TITLES,
} from '@/utils/onboarding-summary';
import { Checkbox } from './checkbox';
import { StepLayout } from './step-layout';

export type ReviewStepProps = {
  answers: OnboardingAnswers;
  onBack: () => void;
  onExit: () => void;
  onEdit: (stepId: string) => void;
  onFinish: () => void;
};

type SectionGroup = { section: string; stepIds: string[] };

/** Group data steps by section, preserving first-appearance order. */
function buildGroups(): SectionGroup[] {
  const groups: SectionGroup[] = [];
  for (const step of ONBOARDING_STEPS) {
    if (step.id === REVIEW_STEP_ID) continue;
    let group = groups.find((g) => g.section === step.section);
    if (!group) {
      group = { section: step.section, stepIds: [] };
      groups.push(group);
    }
    group.stepIds.push(step.id);
  }
  return groups;
}

export function ReviewStep({ answers, onBack, onExit, onEdit, onFinish }: ReviewStepProps) {
  const theme = useTheme();
  const groups = useMemo(buildGroups, []);
  const [disclaimer, setDisclaimer] = useState(false);
  const [allergyConfirmed, setAllergyConfirmed] = useState(false);

  const needsAllergyConfirm = hasAllergies(answers);
  const canFinish = disclaimer && (!needsAllergyConfirm || allergyConfirmed);

  return (
    <StepLayout
      stepId="review"
      onBack={onBack}
      onExit={onExit}
      footer={
        <Button title="Crear mi semana" onPress={onFinish} disabled={!canFinish} />
      }>
      {answers.name ? (
        <Text variant="subheading" color="textMuted">
          {`Todo listo, ${answers.name.trim()}.`}
        </Text>
      ) : null}

      {groups.map((group) => (
        <View key={group.section} style={styles.group}>
          <Text variant="label" color="textMuted" style={styles.sectionTitle}>
            {(SECTION_TITLES[group.section] ?? group.section).toUpperCase()}
          </Text>

          {group.stepIds.map((stepId) => {
            const rows = buildStepSummary(stepId, answers);
            return (
              <Card key={stepId} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text variant="bodyStrong">{STEP_REVIEW_TITLES[stepId] ?? stepId}</Text>
                  <Button
                    title="Editar"
                    variant="ghost"
                    size="sm"
                    icon="edit"
                    fullWidth={false}
                    onPress={() => onEdit(stepId)}
                  />
                </View>

                {rows.length > 0 ? (
                  <View style={styles.rows}>
                    {rows.map((r) => (
                      <View key={r.label} style={styles.row}>
                        <Text variant="caption" color="textMuted" style={styles.rowLabel}>
                          {r.label}
                        </Text>
                        <Text variant="caption" style={styles.rowValue}>
                          {r.value}
                        </Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <Text variant="caption" color="textSubtle">
                    Sin completar
                  </Text>
                )}
              </Card>
            );
          })}
        </View>
      ))}

      {/* Confirmations */}
      <View style={styles.confirmations}>
        {needsAllergyConfirm ? (
          <Card elevation="none" style={[styles.allergyCard, { backgroundColor: theme.colors.dangerMuted }]}>
            <View style={styles.allergyHeader}>
              <Icon name="warning" size={theme.sizes.iconSm} color={theme.colors.danger} />
              <Text variant="label" color="text">
                Alergias e intolerancias
              </Text>
            </View>
            <Checkbox
              label="Confirmo que mis alergias e intolerancias son correctas."
              checked={allergyConfirmed}
              onChange={setAllergyConfirmed}
            />
          </Card>
        ) : null}

        <Checkbox
          label="He revisado mis datos y entiendo que Vita es una herramienta de planificación y bienestar, no un servicio médico."
          checked={disclaimer}
          onChange={setDisclaimer}
        />
      </View>
    </StepLayout>
  );
}

const styles = StyleSheet.create({
  group: { gap: 10 },
  sectionTitle: { marginTop: 4 },
  card: { gap: 10 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rows: { gap: 6 },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 16 },
  rowLabel: { flexShrink: 0 },
  rowValue: { flex: 1, textAlign: 'right' },
  confirmations: { gap: 12, marginTop: 4 },
  allergyCard: { gap: 8 },
  allergyHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});
