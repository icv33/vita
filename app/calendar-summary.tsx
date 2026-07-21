import { useRouter } from 'expo-router';

import { WeeklySummary } from '@/components/calendar';
import { Header, Screen } from '@/components/ui';
import { useCalendarStore } from '@/store';

/** Weekly availability summary (pushed screen). */
export default function CalendarSummaryScreen() {
  const router = useRouter();
  const schedule = useCalendarStore((s) => s.schedule);

  return (
    <Screen scroll>
      <Header title="Resumen semanal" subtitle="Tu disponibilidad" onBack={() => router.back()} />
      <WeeklySummary schedule={schedule} />
    </Screen>
  );
}
