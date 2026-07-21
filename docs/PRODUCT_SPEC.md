# Vita — Especificación de producto

> **Vita** · _Tu plan. Tu tiempo. Tu cambio._
>
> La aplicación que organiza tu entrenamiento, tu alimentación y tu vida en un solo lugar.

## Visión

Vita crea un plan **100% personalizado** de entrenamiento y alimentación adaptado a la
disponibilidad real del usuario. El usuario responde un cuestionario, indica sus
horarios, y la app genera y mantiene un plan semanal flexible que puede ajustar en
cualquier momento.

## Principios

- **Personalización real:** el plan nace de los datos y objetivos del usuario.
- **Adaptado al tiempo:** el calendario y la disponibilidad condicionan el plan.
- **Flexibilidad total:** cambiar comidas, entrenamientos u horarios es sencillo.
- **Móvil primero:** experiencia nativa, no una web adaptada; respeto por las safe areas.
- **Sin fricción:** menos complejidad, más acción.

## Funcionalidades (referencia de diseño)

Numeración según la imagen de referencia del producto.

1. **Cuestionario inicial inteligente** — objetivo, datos personales, entrenamiento,
   alimentación y estilo de vida. Genera el plan base.
2. **Calendario interactivo** — el usuario bloquea horarios y actividades (trabajo,
   universidad, comidas…); Vita planifica según la disponibilidad.
3. **Plan semanal personalizado** — entrenamiento + comidas por día, con objetivos
   diarios (calorías, proteínas, pasos, agua).
4. **Modifica tu plan** — editar entrenamientos y cambiar comidas por alternativas.
5. **Registro de comidas** — foto → estimación de calorías y macros, con nivel de confianza.
6. **Lista de la compra automática** — generada desde el menú semanal, por secciones y
   con precio estimado.
7. **Análisis y seguimiento** — evolución de peso y composición, adherencia y cumplimiento.
8. **Asistente inteligente** — ajustar el plan mediante lenguaje natural.

### Próximamente (fuera de alcance temprano)

Sincronización con relojes inteligentes, compra online en supermercados, planes
familiares, retos y comunidad, integración con entrenadores.

## Público y plataforma

- Usuarios que quieren organizar salud y agenda sin complicaciones.
- iOS y Android vía Expo Go durante el desarrollo. iPhone es la referencia principal.

## Estado actual

Implementados la **base técnica y visual**, el **onboarding completo** (funcionalidad 1) y
el **calendario interactivo de disponibilidad** (funcionalidad 2).

- **Onboarding:** cuestionario multi-paso, adaptativo, validado, con borrador persistente,
  resumen editable y conversión a un perfil confirmado. Inicio muestra datos reales del
  perfil y Progreso muestra estados vacíos cuidados hasta que exista un plan.
- **Calendario:** el usuario indica cuándo trabaja, estudia, se desplaza, come o no está
  disponible, con **dos vistas móviles**: **Día** (timeline 07:00–23:00 en franjas de 30 min)
  y **Semana** (agenda vertical, una tarjeta por día). Crear/editar/eliminar bloques con
  validación y conflictos, categorías con color, mover por hora, copiar/repetir horarios,
  resumen semanal de disponibilidad, botón Hoy e introducción de primera vez. La vista, el día
  y la semana elegidos se recuerdan. El modelo queda **preparado para calendarios externos**
  (Apple/Google/Outlook) como bloques de solo lectura, sin sincronización real todavía. La
  disponibilidad calculada alimentará al futuro generador de planes.

La **integración real de calendarios externos**, la **generación de planes** (entrenamientos,
dietas, objetivos de calorías/macros, listas de la compra) y el **análisis** llegan en fases
posteriores (ver `ROADMAP.md`). Las estimaciones energéticas aún **no** se calculan; las
interfaces específicas de **iPad y web** quedan aplazadas (esta fase optimiza iPhone).

## No objetivos de esta fase

Sin backend, sin pagos, sin APIs externas y **sin funciones médicas** ni consejo
clínico. Las estimaciones (calorías, macros) son orientativas.
