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
    index.tsx        Pantalla de bienvenida (placeholder del cuestionario).
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

## Sistema de diseño (`theme/`)

Tokens separados por responsabilidad: `palette` (valores crudos) → `colors`
(semánticos, claro/oscuro) → `spacing`, `radii`, `typography`, `shadows`, `sizes`,
`icons`. `hooks/useTheme()` es el único punto de acceso de los componentes al tema y
sigue el esquema de color del sistema (por defecto claro).

## Componentes

- `components/ui/`: primitivas reutilizables y agnósticas de dominio (Screen, Text,
  Button, Card, Field, Selector, ProgressBar, EmptyState, Header, SafeArea, Icon).
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
