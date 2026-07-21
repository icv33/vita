import { Text } from '@/components/ui';
import { ChipGroup } from '@/components/onboarding/chip-group';
import { Question } from '@/components/onboarding/question';
import {
  EQUIPMENT,
  TRAINING_PLACES,
  type Equipment,
  type TrainingPlace,
} from '@/constants';
import { applicableEquipment, toggleInArray } from '@/utils/onboarding';
import type { StepProps } from './types';

export function PlaceStep({ answers, update }: StepProps) {
  const places = answers.trainingPlaces ?? [];
  const allowed = applicableEquipment(places);
  const equipmentOptions = EQUIPMENT.filter((e) => allowed.includes(e.value));

  const togglePlace = (place: TrainingPlace) => {
    const nextPlaces = toggleInArray(answers.trainingPlaces, place);
    // Drop any selected equipment no longer available for the chosen places.
    const nextAllowed = applicableEquipment(nextPlaces);
    const nextEquipment = (answers.equipment ?? []).filter((e) => nextAllowed.includes(e));
    update({ trainingPlaces: nextPlaces, equipment: nextEquipment });
  };

  return (
    <>
      <Question label="¿Dónde entrenas?" hint="Puedes elegir varios lugares.">
        <ChipGroup options={TRAINING_PLACES} value={places} onChange={togglePlace} />
      </Question>

      {equipmentOptions.length > 0 ? (
        <Question label="¿Con qué material cuentas?" optional>
          <ChipGroup
            options={equipmentOptions}
            value={answers.equipment ?? []}
            onChange={(e: Equipment) => update({ equipment: toggleInArray(answers.equipment, e) })}
          />
        </Question>
      ) : (
        <Text variant="caption" color="textSubtle">
          Elige un lugar para indicar el material disponible.
        </Text>
      )}
    </>
  );
}
