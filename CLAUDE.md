# Vita — guía para agentes / contributors

Vita es una app móvil de planificación personalizada de **entrenamiento, alimentación
y horarios**. Este documento resume cómo trabajar en el proyecto. Léelo antes de
escribir código.

## ⚠️ Antes de tocar código

- **Expo ha cambiado.** Lee la documentación versionada exacta en
  <https://docs.expo.dev/versions/v54.0.0/> antes de escribir código nuevo.
- **No** subas de versión Expo ni React Native.
- Usa **`npx expo install`** (no `npm install`) para cualquier dependencia del
  ecosistema Expo/React Native, para mantener versiones compatibles.
- **Todo debe seguir funcionando en Expo Go (iPhone).** No introduzcas módulos
  nativos que requieran un build personalizado.

## Stack

- Expo SDK **54** · React Native **0.81** · React **19.1**
- Expo Router **6** (file-based routing, typed routes activadas)
- TypeScript **estricto**
- Estado: **Zustand** · Persistencia local: **AsyncStorage**
- Pruebas: **jest-expo** + Jest

## Comandos

```bash
npm start          # arranca el dev server de Expo (Metro)
npm run ios        # abre en iOS
npm run typecheck  # tsc --noEmit
npm run lint       # expo lint (ESLint)
npm test           # jest
npm run doctor     # npx expo-doctor
```

## Estructura

```
app/                 Rutas (Expo Router): index (gate), onboarding/, (tabs)/,
                     calendar-editor (modal), calendar-summary, calendar-intro
components/ui/        Kit de UI reutilizable (Screen, Text, Button, Card, Field, …)
components/onboarding/ Bloques del cuestionario (StepLayout, ChipGroup, …) + steps/
components/calendar/  Bloques del calendario (DayTimeline, WeekDaySelector, …)
components/           Componentes de mayor nivel no ligados a una ruta
theme/               Sistema de diseño (colores, tipografía, espaciado, iconos, …)
hooks/               Hooks reutilizables (useTheme, useColorScheme)
store/               Estado global (Zustand): app-store, onboarding-store, calendar-store
storage/             Wrappers tipados sobre AsyncStorage (flag, borrador, perfil, calendario)
services/            Capa de datos (mock hoy; backend en el futuro)
types/               Modelo de dominio (onboarding, calendario, …)
utils/               Utilidades puras (+ onboarding y calendar: disponibilidad; haptics)
validation/          Validadores puros (genéricos, onboarding y calendario)
data/                Datos de demostración
constants/           Constantes: claves de storage, catálogos, pasos y calendario
docs/                Documentación del producto y la arquitectura
```

Alias de importación: **`@/`** apunta a la raíz del proyecto (p. ej.
`import { Button } from '@/components/ui'`).

## Convenciones

- **UI:** los componentes leen tokens del tema vía `useTheme()`. No uses colores,
  tamaños de fuente ni espaciados "a mano"; usa los tokens de `@/theme`.
- **Texto de interfaz** en español. **Código, nombres de archivo y comentarios** en inglés.
- **Nombres de archivo** en `kebab-case`. Un barrel `index.ts` por carpeta.
- **Zonas táctiles** mínimas de 44 pt y respeto por las *safe areas* de iOS.
- **Lógica testeable** (utils, validación, storage, store) va en funciones puras o
  módulos sin dependencia de la UI, con pruebas en `__tests__/`.

## Notas del onboarding

- El **borrador** (temporal, `onboarding-store`) y el **perfil confirmado** (`app-store`)
  están separados. El borrador se persiste con escritura *debounced* + *flush* en
  navegación/segundo plano.
- El cuestionario es un **host de una sola pantalla** dirigido por `draft.currentStepId`
  (no una ruta por paso). Los pasos viven en `constants/onboarding.ts`; los catálogos de
  opciones en `constants/catalogs.ts` (fuente única, tipos derivados).
- **Rutas tipadas:** los tipos se generan al arrancar Metro. Deja que Metro **termine** de
  escribir `.expo/types` antes de cerrarlo; cerrarlo a media escritura corrompe el archivo
  y `tsc` fallará con rutas inválidas. Si pasa: `rm -rf .expo` y arranca Metro de nuevo.

## Notas del calendario

- Los tiempos se guardan como **minutos desde medianoche** (`startMinutes`/`endMinutes`),
  no como cadenas. La ventana visible es **07:00–23:00**, en franjas de 30 min.
- Toda la aritmética (orden, solapamientos, huecos, disponibilidad) vive en
  `utils/calendar.ts` (pura, testeada); la validación en `validation/calendar.ts`.
- `calendar-store` persiste de forma inmediata por acción discreta (no por pulsación);
  el horario tiene su **propio reset** y el reinicio completo también lo limpia.
- Es una **semana tipo recurrente**: el paginador de semana solo cambia las fechas
  mostradas. **Gestos** (arrastrar bloques / selección multi-franja) no implementados aún:
  mover = ajustar hora en el editor; se documenta como limitación conocida.
- **Categorías** en `constants/calendar.ts` (id, label, icono, color, fondo, descripción).

## Alcance de esta fase

Implementados el **onboarding completo** y el **calendario interactivo de disponibilidad**.
**Sin** implementar todavía: generación de dietas/entrenamientos/objetivos, backend, pagos,
APIs externas ni funciones médicas. Ver `docs/ROADMAP.md` e `docs/IMPLEMENTATION_PLAN.md`.
