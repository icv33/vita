import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { ChipGroup } from '@/components/onboarding/chip-group';
import { Question } from '@/components/onboarding/question';
import { TimeStepper } from '@/components/onboarding/time-stepper';
import {
  PREFERRED_TRAINING_TIMES,
  SLEEP_QUALITIES,
  STRESS_LEVELS,
  type PreferredTrainingTime,
  type SleepQuality,
  type StressLevel,
} from '@/constants';
import { WEEKDAYS, type Weekday } from '@/types';
import { sleepHoursBetween, toggleInArray } from '@/utils/onboarding';
import { weekdayShort } from '@/utils/date';
import type { StepProps } from './types';

const WEEKDAY_OPTIONS = WEEKDAYS.map((d) => ({ value: d, label: weekdayShort(d) }));

export function LifestyleStep({ answers, update }: StepProps) {
  const hours = sleepHoursBetween(answers.bedTime, answers.wakeUpTime);

  return (
    <>
      <Question label="¿A qué hora sueles despertarte?">
        <TimeStepper
          value={answers.wakeUpTime}
          defaultValue="07:00"
          onChange={(wakeUpTime) => update({ wakeUpTime })}
        />
      </Question>

      <Question label="¿A qué hora sueles acostarte?">
        <TimeStepper
          value={answers.bedTime}
          defaultValue="23:00"
          onChange={(bedTime) => update({ bedTime })}
        />
      </Question>

      {hours != null ? (
        <View style={styles.sleep}>
          <Text variant="caption" color="textMuted">
            Duración estimada de sueño:{' '}
            <Text variant="caption" color="text">{`≈ ${hours.toLocaleString('es-ES')} h`}</Text>
          </Text>
        </View>
      ) : null}

      <Question label="Calidad del sueño">
        <ChipGroup
          options={SLEEP_QUALITIES}
          value={answers.sleepQuality ?? null}
          onChange={(sleepQuality: SleepQuality) => update({ sleepQuality })}
        />
      </Question>

      <Question label="Nivel de estrés">
        <ChipGroup
          options={STRESS_LEVELS}
          value={answers.stressLevel ?? null}
          onChange={(stressLevel: StressLevel) => update({ stressLevel })}
        />
      </Question>

      <Question label="¿Cuándo prefieres entrenar?">
        <ChipGroup
          options={PREFERRED_TRAINING_TIMES}
          value={answers.preferredTrainingTime ?? null}
          onChange={(preferredTrainingTime: PreferredTrainingTime) => update({ preferredTrainingTime })}
        />
      </Question>

      <Question label="Días en los que normalmente no quieres entrenar" optional>
        <ChipGroup
          options={WEEKDAY_OPTIONS}
          value={answers.noTrainingDays ?? []}
          onChange={(d: Weekday) => update({ noTrainingDays: toggleInArray(answers.noTrainingDays, d) })}
        />
      </Question>
    </>
  );
}

const styles = StyleSheet.create({
  sleep: { marginTop: -8 },
});
