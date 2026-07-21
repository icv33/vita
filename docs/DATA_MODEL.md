# Vita — Modelo de datos

Tipos de dominio definidos en `types/` (barrel en `@/types`). Modelan las pantallas de
la referencia de producto. En esta fase son **tipos** (contratos); su generación real
llega con las funcionalidades correspondientes.

## Común (`types/common.ts`)

- `ISODate` — fecha `YYYY-MM-DD`.
- `TimeString` — hora `HH:mm` (24h).
- `Weekday` — día de la semana, **empezando en lunes**; `WEEKDAYS` es el array ordenado.
- `ID` — alias de `string` para identificadores.

## Onboarding, borrador y perfil (`types/onboarding.ts`)

Las **uniones de valores** (objetivo, sexo, ocupación, equipamiento, dieta, etc.) se
derivan de los catálogos en `constants/catalogs.ts` (fuente única de verdad, `as const`),
de modo que el modelo de datos y las opciones de la UI no pueden divergir.

- `OnboardingAnswers` — todas las respuestas del cuestionario. **Todos los campos son
  opcionales**: el borrador se rellena progresivamente y algunas preguntas son adaptativas.
  Agrupa: identidad (`name`), objetivo (`primaryGoal`, `secondaryGoals`, `targetSport`),
  datos personales (`age`, `sex`, `heightCm`, `weightKg`, `targetWeightKg`), actividad
  (`occupation`, `activityType`, `dailySteps`), entrenamiento (`trainingLevel`,
  `trainingDaysPerWeek`, `sessionDuration`, `trainingPlaces`, `equipment`, `trainingTypes`,
  `currentSports`, `dislikedExercises`, `physicalLimitations`), nutrición (`mealsPerDay`,
  `dietType`, `dietTypeOther`, `allergies`, `otherAllergies`, `dislikedFoods`,
  `favoriteFoods`, `mealsOutPerWeek`, `repeatMeals`, `nutritionPriority`), cocina y
  presupuesto (`cookingTime`, `cookingLevel`, `peopleToCookFor`, `wantsBudget`,
  `weeklyBudgetEuros`, `supermarket`, `appliances`) y estilo de vida (`wakeUpTime`,
  `bedTime`, `sleepQuality`, `stressLevel`, `preferredTrainingTime`, `noTrainingDays`).
- `OnboardingSection` — agrupación lógica para el resumen: `profile | goal | activity |
  training | nutrition | lifestyle`.
- `OnboardingDraft` — estado **temporal** del cuestionario (persistido para reanudar):
  `schemaVersion`, `currentStepId`, `completedStepIds`, `answers`, `createdAt`, `updatedAt`.
- `UserProfile` — perfil **confirmado**, escrito solo al finalizar la revisión y aceptar
  el aviso: `schemaVersion`, `name`, `answers`, `acknowledgedDisclaimer`, timestamps.

### Campos derivados (no se guardan)

Se calculan a partir de los datos originales y **no** se persisten: la duración estimada
de sueño (de `bedTime`/`wakeUpTime`, vía `sleepHoursBetween`) y, en el futuro, calorías y
macros.

### Catálogos (`constants/catalogs.ts`)

Cada catálogo es una tupla `as const` de `Option<T>` (`value`, `label`, `description?`,
`icon?`) y exporta su tipo unión derivado. Incluye: `PRIMARY_GOALS`, `SECONDARY_GOALS`,
`SEXES`, `OCCUPATIONS`, `ACTIVITY_TYPES`, `DAILY_STEPS`, `TRAINING_LEVELS`,
`SESSION_DURATIONS`, `TRAINING_PLACES`, `EQUIPMENT` (+ `EQUIPMENT_BY_PLACE`),
`TRAINING_TYPES`, `DIET_TYPES`, `MEALS_OUT`, `NUTRITION_PRIORITIES`, `COOKING_TIMES`,
`COOKING_LEVELS`, `APPLIANCES`, `SLEEP_QUALITIES`, `STRESS_LEVELS`,
`PREFERRED_TRAINING_TIMES`, `COMMON_ALLERGIES`.

## Nutrición (`types/nutrition.ts`)

- `Macros` — proteínas, carbohidratos y grasas (g).
- `Meal` — comida de un plan (tipo, nombre, hora, calorías, macros).
- `LoggedMeal` — comida registrada por el usuario (p. ej. por foto), con `confidence` 0–1.
- `ShoppingItem` / `ShoppingList` — lista de la compra por categorías con precio estimado.

## Entrenamiento (`types/training.ts`)

- `Exercise` — ejercicio (intensidad, series, repeticiones, carga opcional).
- `WorkoutFocus` — `rest | strength | cardio | upper_body | lower_body | full_body | mobility`.
- `Workout` — sesión (título, foco, hora, duración, ejercicios).

## Calendario (`types/schedule.ts`)

- `ActivityKind` — `work | university | training | meal | commute | class | free | sleep`.
- `ActivityBlock` — bloque de tiempo (día, inicio, fin, ubicación opcional).
- `WeekSchedule` — semana de bloques, indexada por el lunes (`weekStart`).

## Plan semanal (`types/plan.ts`)

- `DailyTargets` — objetivos diarios (calorías, proteínas, pasos, agua).
- `PlanDay` — un día del plan (entrenamientos + comidas).
- `WeeklyPlan` — plan semanal completo con `targets` y fecha de generación.

## Progreso (`types/progress.ts`)

- `ProgressPoint` — medición puntual (fecha, peso, músculo, % grasa).
- `ProgressSummary` — resumen semanal (peso actual y delta, entrenamientos
  completados/planificados, adherencia nutricional y serie temporal).

## Persistencia

Claves centralizadas en `constants/app.ts` (`STORAGE_KEYS`), namespaced con el prefijo
`vita:`:

| Clave                        | Contenido                                  |
|------------------------------|--------------------------------------------|
| `vita:onboarding:complete`   | `boolean` — onboarding finalizado          |
| `vita:onboarding:draft`      | `OnboardingDraft` — borrador en curso      |
| `vita:user:profile`          | `UserProfile` — perfil confirmado          |

El acceso pasa siempre por `storage/` (wrapper tipado, fail-soft con JSON):
`onboardingStorage` (flag + borrador) y `profileStorage` (perfil). El **borrador** y el
**perfil confirmado** se mantienen separados a propósito (estado temporal vs. definitivo).
`schemaVersion` en ambos permite futuras migraciones.
