/**
 * Pure validation for activity blocks: time ordering, minimum duration, the
 * 07:00–23:00 window and overlap conflicts. Returns a typed result so the editor
 * can show a clear, specific message and keep the modal open on error.
 */

import { CALENDAR_DAY_END_MIN, CALENDAR_DAY_START_MIN, CALENDAR_MIN_BLOCK_MIN } from '@/constants/calendar';
import type { ActivityBlock } from '@/types';
import { findConflicts, minutesToTime } from '@/utils/calendar';

export type BlockTimes = { startMinutes: number; endMinutes: number };

export type BlockValidationCode =
  | 'order'
  | 'min_duration'
  | 'before_start'
  | 'after_end'
  | 'conflict';

export type BlockValidationResult =
  | { valid: true }
  | { valid: false; code: BlockValidationCode; message: string; conflicts?: ActivityBlock[] };

const OK: BlockValidationResult = { valid: true };

/**
 * Validate a block's times against the day window, minimum duration and the
 * other blocks of the same day (`ignoreId` skips the block being edited).
 */
export function validateBlock(
  times: BlockTimes,
  sameDayBlocks: readonly ActivityBlock[] = [],
  ignoreId?: string,
): BlockValidationResult {
  const { startMinutes, endMinutes } = times;

  if (startMinutes >= endMinutes) {
    return { valid: false, code: 'order', message: 'La hora de inicio debe ser anterior a la de fin.' };
  }
  if (startMinutes < CALENDAR_DAY_START_MIN) {
    return {
      valid: false,
      code: 'before_start',
      message: `No puede empezar antes de las ${minutesToTime(CALENDAR_DAY_START_MIN)}.`,
    };
  }
  if (endMinutes > CALENDAR_DAY_END_MIN) {
    return {
      valid: false,
      code: 'after_end',
      message: `No puede terminar después de las ${minutesToTime(CALENDAR_DAY_END_MIN)}.`,
    };
  }
  if (endMinutes - startMinutes < CALENDAR_MIN_BLOCK_MIN) {
    return {
      valid: false,
      code: 'min_duration',
      message: `La duración mínima es de ${CALENDAR_MIN_BLOCK_MIN} minutos.`,
    };
  }

  const conflicts = findConflicts(times, sameDayBlocks, ignoreId);
  if (conflicts.length > 0) {
    return {
      valid: false,
      code: 'conflict',
      message: 'Se solapa con otra actividad de este día.',
      conflicts,
    };
  }

  return OK;
}
