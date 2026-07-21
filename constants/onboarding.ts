/**
 * Onboarding step registry — the ordered list of questionnaire steps and their
 * copy. This is the single source of truth for step order, titles and the
 * section each belongs to (used by the review screen and progress indicator).
 */

import type { IconName } from '@/theme';
import type { OnboardingSection } from '@/types';

/** Bump when the shape of `OnboardingAnswers` / draft changes (for migrations). */
export const ONBOARDING_SCHEMA_VERSION = 1;

export type OnboardingStepMeta = {
  readonly id: string;
  readonly title: string;
  readonly subtitle: string;
  readonly section: OnboardingSection;
  readonly icon: IconName;
};

/**
 * Ordered questionnaire steps. The final `review` step is special (it has no
 * data of its own and uses a custom footer), but lives here so navigation and
 * the store treat it uniformly.
 */
export const ONBOARDING_STEPS = [
  { id: 'name', title: '¿Cómo te llamas?', subtitle: 'Usaremos tu nombre para personalizar la app.', section: 'profile', icon: 'person' },
  { id: 'goal', title: 'Tu objetivo principal', subtitle: 'Elige la meta que mejor te representa hoy.', section: 'goal', icon: 'trophy' },
  { id: 'personal', title: 'Datos personales', subtitle: 'Nos ayudan a estimar tus necesidades.', section: 'profile', icon: 'body' },
  { id: 'activity', title: 'Tu actividad diaria', subtitle: 'Cómo es tu día a día fuera del entrenamiento.', section: 'activity', icon: 'walk' },
  { id: 'experience', title: 'Experiencia deportiva', subtitle: 'Tu nivel actual entrenando.', section: 'training', icon: 'trendingUp' },
  { id: 'availability', title: 'Disponibilidad para entrenar', subtitle: 'Cuántos días y cuánto tiempo.', section: 'training', icon: 'time' },
  { id: 'place', title: 'Lugar y material', subtitle: 'Dónde entrenas y con qué cuentas.', section: 'training', icon: 'home' },
  { id: 'training', title: 'Preferencias de entrenamiento', subtitle: 'Lo que te gusta y lo que no.', section: 'training', icon: 'barbell' },
  { id: 'limitations', title: 'Limitaciones físicas', subtitle: 'Opcional. Nos ayuda a adaptar el plan.', section: 'training', icon: 'shield' },
  { id: 'nutrition', title: 'Hábitos alimentarios', subtitle: 'Cómo comes habitualmente.', section: 'nutrition', icon: 'restaurantAlt' },
  { id: 'restrictions', title: 'Restricciones y preferencias', subtitle: 'Alergias, gustos y comidas fuera de casa.', section: 'nutrition', icon: 'nutrition' },
  { id: 'cooking', title: 'Cocina y presupuesto', subtitle: 'Tiempo, medios y presupuesto.', section: 'nutrition', icon: 'cash' },
  { id: 'lifestyle', title: 'Rutina y descanso', subtitle: 'Tus horarios y tu descanso.', section: 'lifestyle', icon: 'moon' },
  { id: 'review', title: 'Revisa tus datos', subtitle: 'Comprueba que todo es correcto antes de crear tu plan.', section: 'profile', icon: 'checkCircle' },
] as const satisfies readonly OnboardingStepMeta[];

export type OnboardingStepId = (typeof ONBOARDING_STEPS)[number]['id'];

/** The final step id — has no answer data and a custom footer. */
export const REVIEW_STEP_ID: OnboardingStepId = 'review';

/** Data-collecting steps (everything except the review). */
export const DATA_STEP_IDS = ONBOARDING_STEPS.filter((s) => s.id !== REVIEW_STEP_ID).map(
  (s) => s.id,
) as OnboardingStepId[];

/** The first step of the questionnaire. */
export const FIRST_STEP_ID: OnboardingStepId = ONBOARDING_STEPS[0].id;
