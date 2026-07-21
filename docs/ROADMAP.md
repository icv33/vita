# Vita — Roadmap

Estado por fases. Esta entrega cubre la **Fase 0**.

## ✅ Fase 0 — Base del proyecto (actual)

- [x] Limpieza de la plantilla de Expo.
- [x] Sistema de diseño (colores, tipografía, espaciado, radios, sombras, tamaños, iconos; claro + oscuro).
- [x] Kit de UI reutilizable (Screen, Text, Button, Card, Field, Selector, ProgressBar, EmptyState, Header, SafeArea, Icon).
- [x] Arquitectura por capas (types, store, storage, services, utils, validation, data, constants).
- [x] Navegación: gate de onboarding + 5 pestañas.
- [x] Persistencia del estado de onboarding + reinicio en modo desarrollo.
- [x] Pruebas de utilidades, validación, storage y store.
- [x] Documentación (product spec, arquitectura, modelo de datos, roadmap, plan).
- [x] Verificación: lint, typecheck, tests, expo-doctor.

## 🔜 Fase 1 — Onboarding real

- [ ] Cuestionario multi-paso (objetivo, datos personales, entrenamiento, alimentación, estilo de vida).
- [ ] Validación por paso e indicador de progreso.
- [ ] Persistir `UserProfile` completo.

## Fase 2 — Calendario interactivo

- [ ] Vista semanal con bloques por día.
- [ ] Crear / mover / eliminar bloques de actividad.
- [ ] Disponibilidad como entrada del generador de plan.

## Fase 3 — Plan semanal

- [ ] Generación del `WeeklyPlan` (entrenamientos + comidas) a partir del perfil y el calendario.
- [ ] Objetivos diarios y vista por día.
- [ ] Editar entrenamientos y cambiar comidas por alternativas.

## Fase 4 — Nutrición

- [ ] Registro de comidas (foto → estimación de calorías/macros).
- [ ] Lista de la compra automática por secciones con precio estimado.

## Fase 5 — Progreso y asistente

- [ ] Seguimiento de peso, composición y adherencia con gráficas.
- [ ] Asistente en lenguaje natural para ajustar el plan.

## Más adelante

Relojes inteligentes, compra online, planes familiares, retos y comunidad, integración
con entrenadores. **Backend, pagos y sincronización en la nube** se evaluarán cuando el
producto local esté maduro.

## Deuda técnica / pendientes conocidos

- Tema oscuro preparado pero sin conmutador manual en la UI (sigue el sistema).
- La capa `services` devuelve datos demo; falta el origen real.
- Faltan iconos de app / splash definitivos de marca (se usan los placeholder de Expo).
