import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button, Icon, ProgressBar, Screen, Text } from '@/components/ui';
import { useTheme } from '@/hooks/use-theme';
import { useAppStore } from '@/store';
import { APP_NAME, APP_TAGLINE } from '@/constants';

/**
 * Onboarding welcome screen (placeholder).
 *
 * For the base phase this single step just introduces Vita and lets the user
 * complete onboarding so the rest of the app can be reviewed. The real
 * multi-step questionnaire replaces this later.
 */
export default function OnboardingWelcome() {
  const theme = useTheme();
  const router = useRouter();
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);

  const handleStart = async () => {
    await completeOnboarding();
    router.replace('/(tabs)');
  };

  const highlights: { icon: Parameters<typeof Icon>[0]['name']; label: string }[] = [
    { icon: 'sparkles', label: 'Plan 100% personalizado' },
    { icon: 'training', label: 'Entrenamientos adaptativos' },
    { icon: 'meals', label: 'Nutrición inteligente' },
    { icon: 'calendar', label: 'Calendario a tu medida' },
  ];

  return (
    <Screen contentStyle={styles.content}>
      <View style={styles.hero}>
        <View
          style={[
            styles.logo,
            { backgroundColor: theme.colors.primary, borderRadius: theme.radii.xxl },
          ]}>
          <Text variant="display" color="onPrimary">
            V
          </Text>
        </View>
        <Text variant="display">{APP_NAME}</Text>
        <Text variant="subheading" color="textMuted" center>
          {APP_TAGLINE}
        </Text>
      </View>

      <View style={styles.list}>
        {highlights.map((item) => (
          <View key={item.label} style={styles.row}>
            <View
              style={[
                styles.rowIcon,
                { backgroundColor: theme.colors.primaryMuted, borderRadius: theme.radii.md },
              ]}>
              <Icon name={item.icon} size={theme.sizes.iconSm} color={theme.colors.primary} />
            </View>
            <Text variant="body">{item.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <ProgressBar progress={0.15} />
        <Text variant="caption" color="textSubtle" center>
          Paso 1 de 5 · Cuestionario disponible próximamente
        </Text>
        <Button title="Empezar" icon="chevronRight" onPress={handleStart} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, justifyContent: 'space-between', paddingVertical: 24 },
  hero: { alignItems: 'center', gap: 12, marginTop: 24 },
  logo: { width: 88, height: 88, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  list: { gap: 16 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rowIcon: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  footer: { gap: 12 },
});
