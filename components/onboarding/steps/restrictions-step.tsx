import { StyleSheet, View } from 'react-native';

import { Card, Field, Icon, Text } from '@/components/ui';
import { ChipGroup } from '@/components/onboarding/chip-group';
import { Checkbox } from '@/components/onboarding/checkbox';
import { Question } from '@/components/onboarding/question';
import {
  COMMON_ALLERGIES,
  MEALS_OUT,
  NUTRITION_PRIORITIES,
  type MealsOutRange,
  type NutritionPriority,
} from '@/constants';
import { useTheme } from '@/hooks/use-theme';
import { hasAllergies, toggleInArray } from '@/utils/onboarding';
import type { StepProps } from './types';

export function RestrictionsStep({ answers, update }: StepProps) {
  const theme = useTheme();

  return (
    <>
      <Question label="Alergias e intolerancias" optional hint="Es un dato importante para tu plan.">
        <ChipGroup
          options={COMMON_ALLERGIES}
          value={answers.allergies ?? []}
          onChange={(a) => update({ allergies: toggleInArray(answers.allergies, a) })}
        />
        <Field
          placeholder="Otras alergias o intolerancias"
          value={answers.otherAllergies ?? ''}
          onChangeText={(otherAllergies) => update({ otherAllergies })}
          maxLength={120}
          style={styles.otherField}
        />
      </Question>

      {hasAllergies(answers) ? (
        <Card elevation="none" style={[styles.note, { backgroundColor: theme.colors.dangerMuted }]}>
          <Icon name="warning" size={theme.sizes.iconSm} color={theme.colors.danger} />
          <Text variant="caption" color="textMuted" style={styles.noteText}>
            Tendremos muy en cuenta tus alergias. Te pediremos confirmarlas antes de crear tu plan.
          </Text>
        </Card>
      ) : null}

      <Question label="Alimentos que no te gustan" optional>
        <Field
          placeholder="Ej. brócoli, hígado…"
          value={answers.dislikedFoods ?? ''}
          onChangeText={(dislikedFoods) => update({ dislikedFoods })}
          maxLength={150}
        />
      </Question>

      <Question label="Alimentos favoritos" optional>
        <Field
          placeholder="Ej. pollo, arroz, fruta…"
          value={answers.favoriteFoods ?? ''}
          onChangeText={(favoriteFoods) => update({ favoriteFoods })}
          maxLength={150}
        />
      </Question>

      <Question label="¿Comes fuera de casa?" optional>
        <ChipGroup
          options={MEALS_OUT}
          value={answers.mealsOutPerWeek ?? null}
          onChange={(mealsOutPerWeek: MealsOutRange) => update({ mealsOutPerWeek })}
        />
      </Question>

      <View>
        <Checkbox
          label="Me gusta repetir platos durante la semana"
          checked={answers.repeatMeals ?? false}
          onChange={(repeatMeals) => update({ repeatMeals })}
        />
      </View>

      <Question label="¿Qué priorizas en tus comidas?" optional>
        <ChipGroup
          options={NUTRITION_PRIORITIES}
          value={answers.nutritionPriority ?? null}
          onChange={(nutritionPriority: NutritionPriority) => update({ nutritionPriority })}
        />
      </Question>
    </>
  );
}

const styles = StyleSheet.create({
  otherField: { marginTop: 4 },
  note: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  noteText: { flex: 1 },
});
