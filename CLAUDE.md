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
app/                 Rutas (Expo Router): index (gate), onboarding/, (tabs)/
components/ui/        Kit de UI reutilizable (Screen, Text, Button, Card, …)
components/onboarding/ Bloques del cuestionario (StepLayout, ChipGroup, …) + steps/
components/           Componentes de mayor nivel no ligados a una ruta
theme/               Sistema de diseño (colores, tipografía, espaciado, iconos, …)
hooks/               Hooks reutilizables (useTheme, useColorScheme)
store/               Estado global (Zustand): app-store, onboarding-store (borrador)
storage/             Wrappers tipados sobre AsyncStorage (flag, borrador, perfil)
services/            Capa de datos (mock hoy; backend en el futuro)
types/               Modelo de dominio (incluye onboarding)
utils/               Utilidades puras (+ onboarding: navegación, resumen; haptics)
validation/          Validadores puros (genéricos + por paso del onboarding)
data/                Datos de demostración
constants/           Constantes: claves de storage, catálogos y registro de pasos
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

## Alcance de esta fase

Implementado el **onboarding completo**. **Sin** implementar todavía: calendario
interactivo, generación de dietas/entrenamientos/objetivos, backend, pagos, APIs externas
ni funciones médicas. Ver `docs/ROADMAP.md` e `docs/IMPLEMENTATION_PLAN.md`.
