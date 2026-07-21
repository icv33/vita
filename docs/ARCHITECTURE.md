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
    calendar.tsx     Calendario (timeline interactivo)
    training.tsx     Entreno
    meals.tsx        Comidas
    progress.tsx     Progreso
  calendar-editor.tsx   Editor de actividad (modal)
  calendar-summary.tsx  Resumen semanal de disponibilidad
  calendar-intro.tsx    Introducción del calendario (primera vez)
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

## Calendario de disponibilidad

Calendario semanal interactivo donde el usuario indica cuándo trabaja, estudia, se
desplaza, come o no está disponible. Esta fase **solo** recopila la disponibilidad; la
colocación automática de entrenamientos/comidas llega después.

**Dos vistas móviles (Día / Semana)** con un selector segmentado en la cabecera; la vista
elegida se **persiste** (valor inicial: Día). La cabecera se distribuye en filas (título +
acciones, paginador de semana + botón **Hoy**, y el toggle) para no saturar.

- **Vista Día:** selector semanal responsive (los 7 días caben sin scroll horizontal; "hoy"
  y "seleccionado" no compiten), **timeline vertical** (07:00–23:00, franjas de 30 min),
  bloques por categoría, indicador de hora actual con etiqueta, barra de resumen compacta
  (ocupado/libre/próxima/nº) y FAB. Día vacío → el timeline permanece y aparece una **pista
  pequeña y cerrable** (nunca una pantalla vacía con botón central duplicado).
- **Vista Semana (agenda móvil):** lista **vertical** de una tarjeta por día (no una
  cuadrícula de 7 columnas de escritorio); cada tarjeta muestra cabecera (día/número/hoy),
  ocupado/libre, actividades compactas ordenadas, mayor hueco libre y un botón de añadir.
  Tocar la cabecera abre ese día en la vista Día; una tarjeta de resumen semanal cierra la
  lista. Semana vacía → se muestran los 7 días (todos disponibles) con una nota breve.

**Preferencias de interfaz** (persistidas en `CalendarMeta`): vista día/semana, día
seleccionado y semana mostrada (`lastWeekOffset`). El botón **Hoy** vuelve a la semana
actual y selecciona hoy manteniendo la vista.

**Crear/editar:** tocar una franja vacía (usa esa hora, propone 1 h) o el FAB abre el
editor modal; tocar un bloque lo edita. El editor valida en vivo (ventana 07:00–23:00,
duración mínima 30 min, solapamientos) y **no** deja guardar ni se cierra con errores.

**Copiar/repetir:** copiar un bloque a otro día, copiar un día a varios, aplicar de lunes a
viernes, vaciar un día, restablecer la semana. Las copias **detectan conflictos** y reportan
los bloques omitidos (nunca sobrescriben en silencio); las acciones destructivas piden
confirmación.

**Capas:** dominio (`types/schedule.ts`), catálogos/constantes (`constants/calendar.ts`),
lógica pura (`utils/calendar.ts`), validación (`validation/calendar.ts`), persistencia con
migración (`storage/calendar-storage.ts`, `storage/calendar-migrations.ts`), estado
(`store/calendar-store.ts`, escrituras inmediatas por acción discreta) y componentes
(`components/calendar/`: `CalendarHeader`, `CalendarViewToggle`, `WeekDaySelector`,
`DayTimeline`, `TimeGrid`, `ActivityBlockCard`, `CompactActivityBlock`, `CurrentTimeIndicator`,
`DayEmptyHint`, `DailySummaryBar`, `MobileWeekView`, `WeekDayAgendaCard`, `ActivityEditor`,
`CalendarActions`, `CalendarSettingsSheet`, `DayPickerSheet`, `Sheet`, `WeeklySummary`,
`WeeklySummaryCard`, `EmptyScheduleState`). La geometría del timeline vive en
`components/calendar/layout.ts` (conversión minutos↔píxeles).

**Fuentes externas (preparación, sin sincronización):** el modelo incluye `source`
(`vita`/`device`/`google`/`outlook`), `readOnly` e ids externos. Los bloques de Vita llevan
`source: 'vita'` y son editables; los futuros externos serán `readOnly` (solo bloquean
disponibilidad, se muestran como detalle, no se editan/eliminan). El menú de ajustes muestra
"Conectar un calendario externo" como opción **deshabilitada ("Próximamente")**. La
integración real (Apple `expo-calendar` + development build; Google/Outlook con OAuth y
posiblemente backend) queda para una fase posterior; **no** se han añadido credenciales ni
dependencias nativas.

**Primera vez:** al terminar el onboarding y pulsar "Crear mi semana", si el calendario aún
no está configurado se muestra `calendar-intro` ("Configurar mi horario" / "Lo haré más
tarde"); ambas marcan la intro como vista para no repetirla. Más tarde se accede desde la
pestaña Calendario.

**Limitación de gestos (documentada):** el arrastre para mover bloques o para seleccionar
varias franjas manteniendo pulsado no se implementa aún, porque un drag fiable en Expo Go
sin dependencias pesadas es arriesgado y puede bloquear el scroll. En su lugar: mover =
ajustar la hora en el editor; crear un rango = elegir hora inicial (franja) + hora final en
el formulario. La arquitectura (minutos, `moveBlock`, geometría en `components/calendar/
layout.ts`) queda preparada para añadir gestos con `react-native-gesture-handler` /
`reanimated` (ya presentes) en una iteración futura.

**Semana:** el horario es una **semana tipo recurrente** (`isRecurringWeekly`). El paginador
de semana de la cabecera cambia solo las fechas mostradas; los bloques se repiten. Por eso
no hay "duplicar semana": no aplica a una única semana recurrente.

**iPad y web aplazados (a propósito):** esta fase optimiza **solo iPhone**. No se han
construido barra lateral de escritorio, cuadrícula semanal de 7 columnas ni paneles de
iPad, para no mantener layouts que aún no se usan. La arquitectura queda preparada: la
lógica de disponibilidad es pura e independiente del layout, los componentes están
desacoplados y evitan anchuras fijas innecesarias (flexbox), y las vistas Día/Semana se
componen desde piezas reutilizables. Añadir composiciones para tablet/escritorio en el
futuro no requerirá tocar dominio, store ni cálculos.

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
