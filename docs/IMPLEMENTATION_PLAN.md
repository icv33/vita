# Vita — Plan de implementación

Registro de lo realizado por fases y cómo continuar.

## Fase 1 — Onboarding y cuestionario inicial

**Qué se hizo**

1. **Modelo de dominio** (`types/onboarding.ts`): `OnboardingAnswers` (todos los campos
   opcionales), `OnboardingDraft` (temporal) y `UserProfile` (confirmado), con
   `schemaVersion` para migraciones. Uniones derivadas de los catálogos.
2. **Catálogos y registro de pasos** (`constants/catalogs.ts`, `constants/onboarding.ts`):
   fuente única de opciones (`as const` + tipos derivados) y orden/textos de los 14 pasos.
3. **Lógica pura** (`utils/onboarding.ts`, `utils/onboarding-summary.ts`): crear borrador,
   navegación de pasos, progreso, `applicableEquipment`, `sleepHoursBetween` (derivado),
   `draftToProfile` y el generador de filas del resumen.
4. **Validación** (`validation/onboarding.ts` + validadores `validateName`/`validateBudget`):
   `isStepComplete` por paso y errores inline de datos personales/presupuesto.
5. **Persistencia** (`storage/`): borrador (`onboardingStorage`) y perfil (`profileStorage`)
   separados, con nuevas claves namespaced.
6. **Estado** (`store/onboarding-store.ts`): borrador con escritura *debounced* + *flush*
   inmediato en navegación y en segundo plano (`AppState`); `app-store` amplía el perfil.
7. **UI** (`components/onboarding/`): `StepLayout`, `ChipGroup`, `Stepper`, `TimeStepper`,
   `Checkbox`, `Question`, `ReviewStep` y un componente por paso; `Selector` admite icono.
8. **Pantallas** (`app/onboarding/`): bienvenida (crear/continuar) y host del cuestionario
   (una pantalla dirigida por estado, con transiciones y lógica adaptativa).
9. **Inicio/Progreso**: Inicio usa el perfil real; Progreso muestra estados vacíos.
10. **Pruebas**: navegación, validación por paso, campos condicionales, persistencia y
    reanudación del borrador, conversión a perfil y reset del store.
11. **Documentación** actualizada.

**Cómo continuar (Fase 2 — Calendario interactivo)**

1. Nuevo grupo de rutas/estado para la cuadrícula semanal (`WeekSchedule`, `ActivityBlock`).
2. Reutilizar el sistema de diseño y el kit de UI; añadir gestos para bloques.
3. Alimentar el futuro generador de plan con la disponibilidad y el `UserProfile`.

---

# Fase 0 — Base del proyecto

Registro de lo realizado en la fase base y cómo continuar.

## Qué se hizo

1. **Inspección y limpieza.** Se partió de la plantilla estándar de Expo Router
   (SDK 54). Se eliminaron pantallas y componentes de demostración (`explore`, `modal`,
   `hello-wave`, `parallax-scroll-view`, `themed-*`, `collapsible`, `icon-symbol`,
   logos de React) y el script `reset-project`.
2. **Sistema de diseño** en `theme/`: `palette` → `colors` (claro/oscuro) + `spacing`,
   `radii`, `typography`, `shadows`, `sizes`, `icons`, con `hooks/useTheme()`.
3. **Kit de UI** en `components/ui/`: primitivas accesibles con tokens del tema.
4. **Arquitectura por capas**: `types`, `store` (Zustand), `storage` (AsyncStorage),
   `services` (fachada), `utils`, `validation`, `data` (demo), `constants`.
5. **Navegación**: gate de onboarding en `app/index.tsx`; flujo `onboarding/`; grupo
   `(tabs)/` con Inicio, Calendario, Entreno, Comidas y Progreso.
6. **Persistencia**: flag de onboarding en AsyncStorage vía `store` + botón de reinicio
   visible solo en `__DEV__` en la pantalla de Inicio.
7. **Config**: TypeScript estricto con alias `@/`; Jest (`jest-expo`) con mock de
   AsyncStorage y `moduleNameMapper` para el alias; scripts `typecheck`, `test`, `doctor`.
8. **Pruebas**: 23 tests sobre `utils`, `validation`, `storage` y `store`.
9. **Documentación**: `CLAUDE.md` + `docs/`.
10. **Verificación**: `tsc`, `expo lint`, `jest` y `expo-doctor` en verde; Metro arranca.

## Comandos de verificación

```bash
npm run typecheck   # 0 errores
npm run lint        # 0 errores
npm test            # 23 passed
npm run doctor      # 18/18 checks passed
npm start           # Metro arranca (probar en Expo Go)
```

## Cómo continuar (Fase 1 — Onboarding)

1. Añadir pasos como rutas dentro de `app/onboarding/` (p. ej. `goal.tsx`,
   `personal.tsx`, `training.tsx`, `nutrition.tsx`, `lifestyle.tsx`).
2. Reutilizar `Selector`, `Field`, `ProgressBar`, `Header` y `Button` del kit.
3. Guardar respuestas en un _slice_ nuevo del store y validarlas con `@/validation`
   (extender los validadores existentes).
4. Al finalizar el último paso, persistir `UserProfile` y llamar a
   `completeOnboarding()`.
5. Añadir pruebas de los nuevos validadores y de la lógica del slice.

## Notas y decisiones

- **Typed routes**: los tipos de rutas se generan al arrancar Metro (`.expo/types`). Si
  cambian las rutas y `tsc` marca hrefs inválidos, arranca Metro una vez para
  regenerarlos.
- **No** se añadió `babel.config.js`: `babel-preset-expo` (vía jest-expo y Metro) ya
  cubre Reanimated/worklets y el alias.
- **Compatibilidad Expo Go**: todas las dependencias añadidas son JS puro
  (`zustand`) o módulos incluidos en Expo Go (`@react-native-async-storage/async-storage`).
