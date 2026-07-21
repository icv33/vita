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

## ✅ Fase 1 — Onboarding y cuestionario inicial

- [x] Cuestionario multi-paso (nombre, objetivo, datos personales, actividad, experiencia,
  disponibilidad, lugar y material, preferencias, limitaciones, alimentación, restricciones,
  cocina y presupuesto, rutina y sueño).
- [x] Lógica adaptativa (peso objetivo, deporte, equipamiento por lugar, dieta "otra",
  presupuesto/supermercado, confirmación de alergias).
- [x] Validación por paso, indicador de progreso y número de paso.
- [x] Borrador persistente (reanudar, volver atrás, salir y continuar) separado del perfil.
- [x] Pantalla de revisión editable + aviso obligatorio; conversión borrador → `UserProfile`.
- [x] Inicio con datos reales; Progreso con estados vacíos (sin datos ficticios).
- [x] Pruebas de validación, navegación, persistencia y conversión.

## ✅ Fase 2 — Calendario interactivo de disponibilidad

- [x] Mejora visual de los campos del onboarding (variantes default/compact/multiline).
- [x] Timeline diario interactivo (07:00–23:00, franjas de 30 min) + selector de días.
- [x] Crear / editar / eliminar bloques con validación (ventana, duración, solapamientos).
- [x] Categorías con color e icono; ubicación, notas y repetición semanal.
- [x] Copiar bloque/día, aplicar lunes–viernes, vaciar día, restablecer semana (con conflictos).
- [x] Resumen semanal (ocupado/libre, distribución, días con más disponibilidad, huecos).
- [x] Persistencia con versión + migración; reset de calendario y reset completo.
- [x] Introducción de primera vez tras el onboarding.
- [x] Lógica pura de disponibilidad (huecos, ventanas libres) lista para el generador.

## ✅ Fase 2.1 — Rediseño móvil del calendario (Día / Semana)

- [x] Selector segmentado **Día / Semana** con persistencia de la vista, el día y la semana.
- [x] Cabecera rediseñada (título + acciones, paginador de semana, botón **Hoy**, toggle).
- [x] Selector de días responsive (los 7 caben sin scroll; "hoy" vs "seleccionado" claros).
- [x] Vista Día: timeline siempre visible, pista pequeña de día vacío, hora actual con
  etiqueta, barra de resumen compacta, bloques pulidos (ubicación, readOnly).
- [x] **Vista Semana móvil**: agenda vertical de tarjetas por día + tarjeta de resumen.
- [x] Menú de acciones ampliado (añadir, ajustes, reset dev) y ajustes con externos
  "Próximamente".
- [x] Modelo **preparado para calendarios externos** (`source`, `readOnly`, ids) + migración
  v2; bloques externos de solo lectura no editables.
- [x] iPad/web aplazados a propósito; arquitectura desacoplada del ancho.

## ✅ Fase 2.2 — Corrección visual: timeline diario y estadísticas ocultas

- [x] Corregido el bug de las horas cortadas (padding horizontal ausente en el timeline;
  causaba que la columna de horas quedara pegada al borde físico de la pantalla).
- [x] Vista Día rediseñada: sin barra inferior de estadísticas, más horas visibles, FAB
  reposicionado (`bottom: 20`, igual en Día y Semana).
- [x] Pista de día vacío reducida a una línea (≤ 40 px), sin desplazar el timeline.
- [x] Eliminadas de la interfaz principal las estadísticas de ocupado/libre/disponible:
  `DailySummaryBar` y `WeeklySummaryCard` eliminados; `WeekDayAgendaCard` simplificada
  (solo cabecera, actividades y "Añadir actividad", sin duración ni "Mayor hueco libre").
- [x] Toda la lógica de disponibilidad (`daySummary`, `weekTotals`, `freeGaps`,
  `freeWindows`, solapamientos) se **conserva íntegra y testeada** — solo se retiró su
  presentación visual; la pantalla "Ver resumen semanal" sigue disponible sin cambios.
- [x] Nuevos helpers puros y testeados: `timelineHours`, `suggestedNewBlockStart`,
  `shouldShowEmptyDayHint`.

## 🔜 Fase 3 — Generación del plan semanal

- [ ] Generar `WeeklyPlan` (entrenamientos + comidas) a partir del `UserProfile` y la
  disponibilidad del calendario (huecos y ventanas libres).
- [ ] Objetivos diarios (calorías/macros) y vista por día.
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

**Calendarios externos (fase propia):** el modelo ya está preparado (`source`, `readOnly`,
ids externos). La integración real requerirá: **Apple Calendar** → `expo-calendar` +
*development build* (no cabe en Expo Go); **Google/Outlook** → OAuth y probablemente
backend. Los eventos externos solo bloquearán disponibilidad (solo lectura), sin
convertirse en actividades editables.

## Deuda técnica / pendientes conocidos

- Tema oscuro preparado pero sin conmutador manual en la UI (sigue el sistema).
- La capa `services` devuelve datos demo; falta el origen real.
- Faltan iconos de app / splash definitivos de marca (se usan los placeholder de Expo).
- **Gestos del calendario** (arrastrar bloques / selección multi-franja) e interfaces de
  **iPad/web** pendientes; mover un bloque se hace ajustando la hora en el editor.
