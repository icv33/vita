# Vita — Plan de implementación

Registro de lo realizado por fases y cómo continuar.

## Fase 2.2 — Corrección visual: timeline diario y estadísticas ocultas

**Causa exacta de las horas cortadas:** la vista wrapping de `DayTimeline` que contiene
`TimeGrid`, los bloques (`ActivityBlockCard`) y `CurrentTimeIndicator` no tenía padding
horizontal, a diferencia del resto de la pantalla (cabecera, selector de días) que usa
`theme.spacing.lg` (16 px). Como los tres se posicionan con `position: 'absolute'` (cuyos
offsets `left`/`right` en React Native se resuelven contra el *padding box* del ancestro
posicionado más cercano), la columna de horas quedaba pegada al borde físico x=0 de la
pantalla, sin margen — de ahí el aspecto "cortado" en las capturas.

**Solución:** añadir `paddingHorizontal: theme.spacing.lg` **una sola vez**, en esa vista
compartida dentro de `day-timeline.tsx`. Al ser el ancestro posicionado común de los tres
elementos absolutos, todos quedan alineados automáticamente entre sí y con el resto de la
pantalla, sin tocar la matemática interna de `TimeGrid`, `ActivityBlockCard` ni
`CurrentTimeIndicator`.

**Qué más se hizo**

1. **Vista Día**: eliminada `DailySummaryBar` (barra inferior de ocupado/libre/próxima/nº);
   el espacio recuperado lo usa el timeline (más horas visibles, alcance cómodo a las
   23:00). FAB reposicionado a `bottom: 20` fijo (antes variaba entre vistas para esquivar
   la barra eliminada). `DayEmptyHint` reducida de tarjeta multilínea a una sola línea
   cerrable (≤ 40 px): "Día libre · toca una hora para añadir".
2. **Vista Semana** (conservada, solo simplificación de tarjetas): `WeekDayAgendaCard` ya
   no muestra "X h ocupadas"/"Mayor hueco libre"/"· X libres"; solo cabecera (día, número,
   "Hoy", chevron), actividades ordenadas o "Día libre", y una acción "Añadir actividad".
   Eliminada `WeeklySummaryCard` (tarjeta inferior de ocupado/libre/bloques/día con más
   disponibilidad) de `MobileWeekView` — la pantalla dedicada "Ver resumen semanal" (menú
   ⋯, sin tocar) sigue siendo el único lugar con ese detalle.
3. **Lógica conservada intacta**: `daySummary`, `weekTotals`, `freeGaps`, `freeWindows`,
   `longestFreeWindow`, `busyMinutes`/`freeMinutes`, detección de solapamientos — sin
   cambios, con toda su cobertura de tests previa intacta. Solo se retiró su
   **presentación visual**, nunca la lógica.
4. **Nuevos helpers puros** (`utils/calendar.ts`, testeados): `timelineHours()` (marcas de
   hora 07:00–23:00, ya no inline en `TimeGrid`), `suggestedNewBlockStart()` (decisión
   compartida del FAB y de "Añadir actividad": primer hueco libre o resguardo a media
   mañana), `shouldShowEmptyDayHint()` (visibilidad de la pista compacta).
5. **Componentes eliminados**: `components/calendar/daily-summary-bar.tsx`,
   `components/calendar/weekly-summary-card.tsx` (y sus exports en el barrel).
6. **Pruebas**: nuevas para los tres helpers puros y una prueba de sanidad geométrica
   (`GUTTER_WIDTH` reserva un ancho válido; `minuteToY`/`yToMinute` sin pérdida). Ninguna
   prueba de disponibilidad existente se tocó ni se eliminó.
7. **Documentación** actualizada (este archivo + CLAUDE, PRODUCT_SPEC, ARCHITECTURE,
   ROADMAP).

**Limitaciones:** sigue sin gestos de arrastre (documentado desde la fase anterior); iPad/
web siguen aplazados a propósito.

**Siguiente fase recomendada:** Fase 3 — generación del plan semanal, usando exactamente
la disponibilidad que ya se calcula internamente (`freeGaps`/`freeWindows`/`daySummary`)
pero que ahora no se expone en la interfaz principal del calendario.

## Fase 2.1 — Rediseño móvil del calendario (Día / Semana)

**Problemas del calendario anterior**

- Selector de días con `ScrollView` de ancho fijo → los 7 días no cabían en iPhone (domingo
  cortado); "hoy" y "seleccionado" se confundían.
- Sin vista Semana ni selector Día/Semana; sin botón Hoy.
- Día vacío reemplazaba todo el timeline por un `EmptyState` con botón central que duplicaba
  el FAB.
- La semana mostrada no se persistía; el modelo no distinguía origen (Vita vs externo).

**Qué se hizo**

1. **Modelo** (`types/schedule.ts`): `ActivitySource` (`vita|device|google|outlook`),
   `readOnly` e ids externos en `ActivityBlock`; `CalendarView` y `view`/`lastWeekOffset` en
   `CalendarMeta`. Esquema **v2** con migración (añade `source: 'vita'`, defaults de vista).
2. **Store** (`store/calendar-store.ts`): `view`/`weekOffset` persistidos, `setView`,
   `setWeekOffset`, `goToToday`, `resetVisualPreferences`; `source: 'vita'` en `addBlock`;
   guardas que **impiden** editar/eliminar/vaciar bloques `readOnly`.
3. **Lógica pura** (`utils/calendar.ts`): `daySummary`, `weekTotals`, `isBlockEditable`.
4. **UI Día** (`components/calendar/`): `CalendarHeader`, `CalendarViewToggle`,
   `WeekDaySelector` responsive, `DayEmptyHint`, `ActivityBlockCard` pulido, `DailySummaryBar`,
   `CurrentTimeIndicator` con etiqueta y refresco en primer plano.
5. **UI Semana**: `MobileWeekView`, `WeekDayAgendaCard`, `CompactActivityBlock`,
   `WeeklySummaryCard` (agenda vertical, sin cuadrícula de escritorio).
6. **Pantalla** (`app/(tabs)/calendar.tsx`): reescrita con toggle Día/Semana, FAB único y
   botón Hoy; editor con **modo solo lectura** para bloques externos; menú de acciones
   ampliado (añadir, ajustes, reset dev) y ajustes con externos "Próximamente".
7. **Pruebas**: vista por defecto, persistencia de vista/día/semana, `goToToday`, `source`,
   guardas `readOnly`, `resetVisualPreferences`, migración v2, `daySummary`/`weekTotals`.
8. **Documentación** actualizada (este archivo + CLAUDE, PRODUCT_SPEC, ARCHITECTURE,
   DATA_MODEL, ROADMAP).

**Decisiones de UX:** dos vistas móviles con estado dominante claro del día seleccionado;
timeline siempre visible con pista pequeña; agenda semanal en lugar de cuadrícula estrecha;
resumen inferior compacto; colores de categoría pastel y distintos.

**Limitaciones:** sin gestos (mover = editor); **iPad/web aplazados** (solo iPhone); sin
sincronización real de calendarios externos (Apple → `expo-calendar` + development build;
Google/Outlook → OAuth y posiblemente backend). **Siguiente fase:** generación del plan
semanal usando el `UserProfile` y la disponibilidad (`freeWindows`, `daySummary`).

## Fase 2 — Campos del onboarding + calendario interactivo

**Parte 1 — Campos del onboarding**

- **Causa del exceso de espacio:** el `TextInput` de `Field` esparcía la tipografía `body`
  (con `lineHeight: 24`) sobre un input de altura fija sin resetear el padding vertical.
  Un `lineHeight` grande en un input de una línea infla la caja del texto y, con el padding
  por defecto de cada plataforma, deja mucho hueco arriba/abajo y descentra el número.
- **Solución:** variantes `default`/`compact`/`multiline` en `Field`. Las de una línea quitan
  el `lineHeight`, ponen `paddingVertical: 0`, centran con la altura + `textAlignVertical`
  y desactivan `includeFontPadding` en Android; altura 56 (mín. táctil 48), borde constante
  (solo cambia el color al enfocar → sin saltos). Multiline más alto, top-aligned y con
  crecimiento. Espaciado consistente entre sub-campos en el host del cuestionario.

**Parte 2 — Calendario de disponibilidad**

1. **Dominio** (`types/schedule.ts`): `ActivityBlock` (minutos desde medianoche), `WeekSchedule`
   (versión, timezone, blocks, timestamps), `CalendarMeta`; categorías/ubicaciones en
   `constants/calendar.ts` (id, label, icono, color, fondo, descripción).
2. **Lógica pura** (`utils/calendar.ts`): orden, solapamientos (consecutivos no solapan),
   `mergeIntervals`, huecos libres, ventanas libres, tiempo ocupado/libre, distribución por
   categoría y días con más disponibilidad. **Validación** (`validation/calendar.ts`).
3. **Persistencia** (`storage/calendar-storage.ts` + `calendar-migrations.ts`): horario + meta,
   con **migración de esquema** (v0 `HH:mm`+`kind` → v1 minutos+`category`).
4. **Estado** (`store/calendar-store.ts`): CRUD de bloques, mover, copiar a día / día a días
   (con reporte de conflictos), vaciar día, restablecer semana, `setup`, reset de calendario.
   Escrituras inmediatas por acción discreta. `resetEntireOnboardingFlow` también limpia el
   calendario; hay un reset dev solo-calendario.
5. **UI** (`components/calendar/`): `WeekDaySelector`, `DayTimeline`, `TimeGrid`,
   `ActivityBlockCard`, `CurrentTimeIndicator`, `ActivityEditor`, `CalendarActions`,
   `DayPickerSheet`, `Sheet`, `WeeklySummary`, `EmptyScheduleState`.
6. **Rutas** (`app/`): pantalla Calendario (cabecera + paginador de semana, selector, timeline/
   estado vacío, resumen inferior, FAB, menú de acciones), editor modal, resumen semanal e
   introducción de primera vez (enlazada desde el final del onboarding).
7. **Pruebas**: solapamientos, consecutivos, duración mínima, límites 07:00–23:00, orden,
   huecos, ocupado/libre, copiar bloque/día, conflictos, eliminar día, persistir/hidratar,
   migración, reset solo-calendario, reinicio completo, navegación tras onboarding.
8. **Documentación** actualizada (este archivo + CLAUDE, PRODUCT_SPEC, ARCHITECTURE,
   DATA_MODEL, ROADMAP).

**Limitación conocida:** sin gestos de arrastre (mover bloque / seleccionar multi-franja
manteniendo pulsado) para no arriesgar estabilidad/scroll en Expo Go sin dependencias
pesadas; mover = ajustar hora en el editor. Arquitectura preparada (minutos, `moveBlock`,
geometría en `components/calendar/layout.ts`) para añadir gestos con las libs ya presentes.

**Cómo continuar (Fase 3 — Generación del plan semanal):** usar `UserProfile` + la
disponibilidad del calendario (huecos y ventanas libres de `utils/calendar.ts`) para generar
`WeeklyPlan` (entrenamientos + comidas) y los objetivos diarios.

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
