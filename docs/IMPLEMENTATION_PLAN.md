# Vita — Plan de implementación (Fase 0)

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
