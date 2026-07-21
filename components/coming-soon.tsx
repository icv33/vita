/**
 * ComingSoon — a tidy placeholder for tab sections that aren't built yet.
 * Keeps the navigation reviewable while signalling what's planned.
 */

import { EmptyState, Screen, Header } from '@/components/ui';
import type { IconName } from '@/theme';

export type ComingSoonProps = {
  title: string;
  subtitle?: string;
  icon: IconName;
  description: string;
};

export function ComingSoon({ title, subtitle, icon, description }: ComingSoonProps) {
  return (
    <Screen>
      <Header title={title} subtitle={subtitle} />
      <EmptyState icon={icon} title="Próximamente" description={description} />
    </Screen>
  );
}
