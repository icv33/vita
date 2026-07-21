# Vita — Arquitectura

## Objetivo

Una base **limpia, escalable y compatible con Expo Go**, con capas bien separadas para
crecer hacia el producto completo sin reescrituras.

## Stack técnico

| Área            | Elección                          | Motivo |
|-----------------|-----------------------------------|--------|
| Runtime         | Expo SDK 54, RN 0.81, React 19.1  | Ya configurado; compatible con Expo Go. |
| Routing         | Expo Router 6 (typed routes)      | File-based, deep-linking, tipado de rutas. |
| Lenguaje        | TypeScript estricto               | Seguridad de tipos en todo el dominio. |
| Estado          | Zustand                           | Mínimo, sin boilerplate, JS puro (Expo Go OK). |
| Persistencia    | AsyncStorage                      | Almacenamiento local incluido en Expo Go. |
| Estilos         | StyleSheet + tokens propios       | Sin dependencias extra; control total del diseño. |
| Iconos          | @expo/vector-icons (Ionicons)     | Incluido, sin assets adicionales. |
| Pruebas         | jest-expo + Jest                  | Preset oficial para el ecosistema Expo. |

## Capas y flujo de datos

```
        UI (app/ + components/)
              │  usa
              ▼
   hooks/useTheme ──▶ theme/ (tokens de diseño)
              │
              ▼
        store/ (Zustand)  ◀── estado global de la app
              │  llama
              ▼
   services/ (fachada de datos)  ──▶  data/ (demo)  |  [futuro] API/backend
              │
              ▼
   storage/ (AsyncStorage tipado)  ──▶  constants/ (claves)
```

- **UI** nunca habla directamente con AsyncStorage ni con datos; pasa por `store` o
  `services`.
- **`services`** es la costura hacia el origen de datos. Hoy resuelve datos de
  `data/demo`. Cuando llegue un backend, solo cambia esta capa.
- **`storage`** centraliza serialización JSON y manejo de errores (fail-soft).
- **`utils` / `validation`** son funciones puras, sin dependencia de React ni de la UI,
  por lo que son fáciles de testear.

## Routing (Expo Router)

```
app/
  _layout.tsx        Providers globales (GestureHandler, SafeArea, ThemeProvider),
                     hidratación del store y control del splash screen.
  index.tsx          Gate: redirige a /onboarding o /(tabs) según el flag persistido.
  onboarding/
    _layout.tsx      Stack del flujo de onboarding.
    index.tsx        Bienvenida (inicia o reanuda el cuestionario).
    questionnaire.tsx  Host del cuestionario (una pantalla dirigida por estado).
  (tabs)/
    _layout.tsx      Tab bar: Inicio, Calendario, Entreno, Comidas, Progreso.
    index.tsx        Inicio
    calendar.tsx     Calendario
    training.tsx     Entreno
    meals.tsx        Comidas
    progress.tsx     Progreso
```

**Gate de onboarding:** al arrancar, `_layout` mantiene el splash mientras
`store.hydrate()` lee el flag de AsyncStorage. Después, `index.tsx` decide el destino
con un `<Redirect>`. Así se evita el parpadeo entre onboarding y la app.

## Onboarding (cuestionario)

Recopila los datos para generar (en fases posteriores) horarios, entrenamientos, nutrición
y objetivos. Esta fase **solo** recopila, valida, guarda y muestra los datos.

**Host de una sola pantalla.** En lugar de una ruta por paso, `questionnaire.tsx` renderiza
el paso actual (`draft.currentStepId`) dentro de `StepLayout`. Avanzar, retroceder y
"editar desde el resumen" son cambios de estado en el store, no navegación de rutas. Esto
hace triviales la reanudación y la edición, y evita inconsistencias de la pila.

**Pasos** (`constants/onboarding.ts` define el orden y los textos): nombre, objetivo, datos
personales, actividad, experiencia, disponibilidad, lugar y material, preferencias de
entrenamiento, limitaciones, hábitos alimentarios, restricciones, cocina y presupuesto,
rutina y sueño, y **revisión** final.

**Lógica adaptativa** (campos que aparecen/desaparecen según respuestas): peso objetivo solo
para perder grasa/ganar músculo; deporte concreto solo al "preparar una prueba";
equipamiento filtrado por el lugar elegido (`applicableEquipment`); detalle de dieta solo
para "Otra"; presupuesto y supermercado solo si el usuario quiere indicar presupuesto;
confirmación de alergias obligatoria en la revisión si hay alergias.

**Estado y persistencia:**

- `store/onboarding-store.ts` (Zustand) mantiene el **borrador temporal**. Cada cambio
  actualiza memoria al instante; la escritura a disco está **debounced** (evita una
  escritura por pulsación) y se **fuerza** en la navegación entre pasos y al pasar la app a
  segundo plano. Un único temporizador en vuelo → sin escrituras innecesarias ni carreras.
- `store/app-store.ts` guarda el **perfil confirmado** y el flag de completado.
- Al finalizar: `draftToProfile(draft)` → `appStore.completeOnboarding(profile)` (persiste
  perfil + flag) → `onboardingStore.resetDraft()` → navegación a Inicio.

**Validación** (`validation/onboarding.ts`, pura): `isStepComplete(stepId, answers)` habilita
"Continuar"; `personalFieldErrors` y `budgetError` dan mensajes inline. Se apoya en los
validadores genéricos (`validation/validators.ts`).

**UX:** barra de progreso y número de paso, título y explicación corta, botón continuar fijo,
volver y salir (con confirmación; el progreso se conserva), `KeyboardAvoidingView` + scroll,
safe areas, zonas táctiles ≥ 44 pt, feedback háptico ligero en selecciones, transiciones
suaves entre pasos y estados claros (seleccionado, error, deshabilitado). Sin emojis como
iconos: se usa el sistema de iconos (`theme/icons.ts`).

**Componentes** (`components/onboarding/`): `StepLayout`, `ChipGroup`, `Stepper`,
`TimeStepper`, `Checkbox`, `Question`, `ReviewStep` y un componente por paso en `steps/`.

## Sistema de diseño (`theme/`)

Tokens separados por responsabilidad: `palette` (valores crudos) → `colors`
(semánticos, claro/oscuro) → `spacing`, `radii`, `typography`, `shadows`, `sizes`,
`icons`. `hooks/useTheme()` es el único punto de acceso de los componentes al tema y
sigue el esquema de color del sistema (por defecto claro).

## Componentes

- `components/ui/`: primitivas reutilizables y agnósticas de dominio (Screen, Text,
  Button, Card, Field, Selector, ProgressBar, EmptyState, Header, SafeArea, Icon).
- `components/onboarding/`: bloques del cuestionario (StepLayout, ChipGroup, Stepper,
  TimeStepper, Checkbox, Question, ReviewStep) y un componente por paso en `steps/`.
- `components/`: componentes de mayor nivel (p. ej. `ComingSoon`, `HapticTab`).

## Decisiones clave

- **Sin carpeta `src/`:** se siguen las convenciones por defecto de Expo (carpetas en la
  raíz + alias `@/`), reduciendo fricción y sorpresa.
- **Zustand sobre Context:** menos re-renders y escalabilidad por _slices_ a medida que
  crezcan las funcionalidades.
- **Fachada de servicios desde el día 1:** permite introducir un backend sin tocar la UI.
- **Fuente del sistema:** cero coste de carga de fuentes → arranque rápido y fiable en
  Expo Go.

## Restricciones

Expo Go siempre verde. Sin módulos nativos custom, sin backend, pagos, APIs externas ni
funciones médicas en esta fase.
