/**
 * EmptyScheduleState — shown when the whole week has no blocks yet. Explains the
 * point of the calendar and offers a primary call to action.
 */

import { EmptyState } from '@/components/ui';

export type EmptyScheduleStateProps = {
  onAdd: () => void;
};

export function EmptyScheduleState({ onAdd }: EmptyScheduleStateProps) {
  return (
    <EmptyState
      icon="calendar"
      title="Tu semana está vacía"
      description="Añade cuándo trabajas, estudias o no estás disponible. Vita usará el tiempo restante para organizar tus entrenamientos y comidas."
      actionLabel="Añadir actividad"
      onAction={onAdd}
    />
  );
}
