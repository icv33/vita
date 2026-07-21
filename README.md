# Vita

> _Tu plan. Tu tiempo. Tu cambio._

App móvil de planificación personalizada de **entrenamiento, alimentación y horarios**,
construida con Expo + React Native + Expo Router.

## Requisitos

- Node 20+ y npm
- La app **Expo Go** en tu iPhone/Android (o un simulador iOS)

## Puesta en marcha

```bash
npm install
npm start        # arranca Metro; escanea el QR con Expo Go
```

Otros comandos:

```bash
npm run ios        # abrir en simulador iOS
npm run typecheck  # comprobación de TypeScript
npm run lint       # ESLint
npm test           # pruebas (Jest)
npm run doctor     # npx expo-doctor
```

## Estructura

Rutas en `app/` (Expo Router). Código compartido en carpetas de la raíz con alias `@/`
(`components/ui`, `theme`, `store`, `storage`, `services`, `types`, `utils`,
`validation`, `data`, `constants`).

## Documentación

- [`CLAUDE.md`](CLAUDE.md) — guía de trabajo y convenciones
- [`docs/PRODUCT_SPEC.md`](docs/PRODUCT_SPEC.md) — visión y funcionalidades
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — arquitectura técnica
- [`docs/DATA_MODEL.md`](docs/DATA_MODEL.md) — modelo de dominio
- [`docs/ROADMAP.md`](docs/ROADMAP.md) — fases del producto
- [`docs/IMPLEMENTATION_PLAN.md`](docs/IMPLEMENTATION_PLAN.md) — plan de implementación

## Estado

Fase 0 (base) completada: sistema de diseño, kit de UI, navegación (onboarding + 5
pestañas), persistencia del onboarding y pantallas provisionales. Ver el roadmap para lo
que viene.
