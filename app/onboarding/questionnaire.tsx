import { Redirect, useRouter } from 'expo-router';
import { Alert } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { ReviewStep, StepLayout } from '@/components/onboarding';
import { STEP_COMPONENTS } from '@/components/onboarding/steps';
import { REVIEW_STEP_ID } from '@/constants';
import { useAppStore, useOnboardingStore } from '@/store';
import { hapticImpact } from '@/utils/haptics';
import { draftToProfile, prevStepId } from '@/utils/onboarding';
import { isStepComplete } from '@/validation';

/**
 * Questionnaire host — a single screen driven by the draft's `currentStepId`.
 * Rendering one step at a time (instead of one route per step) keeps navigation,
 * resume and "edit from review" trivial: they are just state changes. The store
 * owns step order and persistence.
 */
export default function Questionnaire() {
  const router = useRouter();
  const draft = useOnboardingStore((s) => s.draft);
  const isHydrated = useOnboardingStore((s) => s.isHydrated);
  const returnToReview = useOnboardingStore((s) => s.returnToReview);
  const setAnswers = useOnboardingStore((s) => s.setAnswers);
  const goNext = useOnboardingStore((s) => s.goNext);
  const goBack = useOnboardingStore((s) => s.goBack);
  const editStep = useOnboardingStore((s) => s.editStep);
  const resetDraft = useOnboardingStore((s) => s.resetDraft);
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);

  // Wait for hydration; if there's genuinely no draft, return to welcome.
  if (!isHydrated) return null;
  if (!draft) return <Redirect href="/onboarding" />;

  const stepId = draft.currentStepId;
  const answers = draft.answers;

  const exit = () => {
    Alert.alert(
      'Salir del cuestionario',
      'Guardaremos tu progreso para que puedas continuar más tarde.',
      [
        { text: 'Seguir aquí', style: 'cancel' },
        { text: 'Salir', style: 'destructive', onPress: () => router.replace('/onboarding') },
      ],
    );
  };

  const handleBack = () => {
    if (returnToReview || prevStepId(stepId)) {
      void goBack();
    } else {
      router.replace('/onboarding');
    }
  };

  const finish = async () => {
    hapticImpact();
    const profile = draftToProfile(draft, true);
    await completeOnboarding(profile);
    await resetDraft();
    router.replace('/(tabs)');
  };

  if (stepId === REVIEW_STEP_ID) {
    return (
      <ReviewStep
        answers={answers}
        onBack={handleBack}
        onExit={exit}
        onEdit={(id) => void editStep(id)}
        onFinish={finish}
      />
    );
  }

  const StepComponent = STEP_COMPONENTS[stepId];
  if (!StepComponent) return <Redirect href="/onboarding" />;

  return (
    <StepLayout
      stepId={stepId}
      onBack={handleBack}
      onExit={exit}
      onContinue={() => void goNext()}
      continueLabel={returnToReview ? 'Guardar' : 'Continuar'}
      canContinue={isStepComplete(stepId, answers)}>
      <Animated.View key={stepId} entering={FadeIn.duration(200)}>
        <StepComponent answers={answers} update={setAnswers} />
      </Animated.View>
    </StepLayout>
  );
}
