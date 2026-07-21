# Vita — Modelo de datos

Tipos de dominio definidos en `types/` (barrel en `@/types`). Modelan las pantallas de
la referencia de producto. En esta fase son **tipos** (contratos); su generación real
llega con las funcionalidades correspondientes.

## Común (`types/common.ts`)

- `ISODate` — fecha `YYYY-MM-DD`.
- `TimeString` — hora `HH:mm` (24h).
- `Weekday` — día de la semana, **empezando en lunes**; `WEEKDAYS` es el array ordenado.
- `ID` — alias de `string` para identificadores.

## Usuario y onboarding (`types/user.ts`)

- `Goal` — `lose_fat | gain_muscle | improve_performance | maintain | improve_habits`.
- `Sex`, `ActivityLevel`, `TrainingLocation`, `TrainingDaysPerWeek`, `MealsPerDay`,
  `CookingTime` — enumeraciones del cuestionario.
- `PersonalData` — edad, sexo, altura (cm), peso y peso objetivo (kg).
- `TrainingPreferences` — días/semana y lugar de entrenamiento.
- `NutritionPreferences` — comidas/día, tiempo para cocinar, alergias, presupuesto.
- `OnboardingAnswers` — agregado de todas las respuestas.
- `UserProfile` — perfil persistido; `onboarding` es `Partial` mientras el flujo no ha
  terminado.

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

| Clave                        | Contenido                         |
|------------------------------|-----------------------------------|
| `vita:onboarding:complete`   | `boolean` — onboarding finalizado |
| `vita:user:profile`          | `UserProfile` (futuro)            |

El acceso pasa siempre por `storage/` (wrapper tipado, fail-soft con JSON).
