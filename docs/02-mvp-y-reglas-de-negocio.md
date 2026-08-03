# GymFlow — MVP y reglas de negocio

> Estado: documento de análisis funcional. No contiene implementación ni inicializa el proyecto.

## 1. Objetivo del producto

GymFlow será una plataforma de gestión de gimnasios con dos experiencias principales:

- Un portal administrativo para gestionar la operación.
- Un portal para que los miembros consulten su información y actividades.

El objetivo del MVP no es reproducir todo el funcionamiento de un gimnasio. Debe demostrar un flujo completo, coherente y técnicamente sólido que incluya:

- Autenticación.
- Autorización mediante roles y permisos.
- Gestión de miembros.
- Planes y membresías.
- Registro de asistencias.
- Catálogo de ejercicios.
- Creación y asignación de rutinas.
- Pruebas automatizadas.
- Documentación de API.
- CI/CD.

## 2. Usuarios del sistema

### Administrador

Responsable de la operación general del gimnasio.

Necesita:

- Gestionar miembros.
- Gestionar entrenadores.
- Crear y actualizar planes.
- Asignar membresías.
- Registrar asistencias.
- Consultar indicadores básicos.
- Consultar y administrar el catálogo de ejercicios.
- Revisar rutinas creadas por entrenadores.

### Entrenador

Responsable del acompañamiento deportivo.

Necesita:

- Consultar miembros asignados.
- Consultar el catálogo de ejercicios.
- Crear rutinas.
- Asignar rutinas a miembros.
- Registrar o revisar el progreso.
- Consultar información limitada de asistencia y membresía.

### Miembro

Usuario que recibe los servicios del gimnasio.

Necesita:

- Iniciar sesión.
- Consultar su perfil.
- Consultar su membresía.
- Consultar su historial de asistencias.
- Consultar sus rutinas.
- Revisar instrucciones de ejercicios.
- Registrar su progreso cuando esa funcionalidad esté habilitada.

## 3. Roles iniciales

```text
ADMIN
TRAINER
MEMBER
```

Los roles agrupan permisos, pero las reglas de autorización se aplican en el backend.

Ocultar un botón en el frontend mejora la experiencia de usuario, pero no sustituye una validación de permisos en la API.

## 4. Alcance del MVP

### Incluido

#### Acceso

- Inicio de sesión.
- Cierre de sesión.
- Renovación controlada de sesión.
- Consulta del usuario autenticado.
- Protección de rutas.
- Restricción de acciones según permisos.

#### Miembros

- Listado paginado.
- Búsqueda.
- Creación.
- Consulta de detalle.
- Actualización.
- Activación y desactivación.

#### Planes

- Listado.
- Creación.
- Actualización.
- Activación y desactivación.

#### Membresías

- Asignación de un plan a un miembro.
- Consulta de membresía actual.
- Historial de membresías.
- Estados de membresía.
- Fecha de inicio y expiración.

#### Asistencias

- Registro de entrada.
- Historial por miembro.
- Consulta por rango de fechas.
- Prevención de registros duplicados inválidos.

#### Ejercicios

- Catálogo inicial importado desde una fuente abierta.
- Búsqueda por nombre.
- Filtros por parte del cuerpo, músculo objetivo y equipamiento.
- Consulta de detalle.
- Instrucciones en español e inglés.
- Activación o desactivación local sin alterar la fuente original.

#### Rutinas

- Creación de una rutina.
- Adición y ordenamiento de ejercicios.
- Configuración de series, repeticiones, descanso y notas.
- Asignación de una rutina a un miembro.
- Consulta de rutina asignada desde el portal del miembro.

### Fuera del MVP

- Cobros con tarjeta.
- Facturación electrónica.
- Nómina.
- Control biométrico.
- Integración con torniquetes.
- Aplicación móvil nativa.
- Chat en tiempo real.
- Notificaciones push.
- Recomendaciones médicas.
- Generación automática de rutinas mediante IA.
- Marketplace de entrenadores.
- Operación completa de múltiples gimnasios.
- Clases grupales y reservas.
- Analítica avanzada.

Estas funcionalidades pueden considerarse después de completar y estabilizar el primer flujo vertical.

## 5. Primer flujo vertical

El primer incremento funcional debe recorrer todas las capas:

```text
Administrador inicia sesión
  ↓
Crea un miembro
  ↓
Crea o selecciona un plan
  ↓
Asigna una membresía
  ↓
Registra una asistencia
  ↓
El miembro inicia sesión
  ↓
Consulta su membresía y asistencia
```

Este flujo valida:

- Frontend administrativo.
- Frontend del miembro.
- API.
- Base de datos.
- Autenticación.
- RBAC.
- Validaciones.
- Pruebas E2E.

El catálogo de ejercicios y las rutinas pueden incorporarse como el segundo flujo vertical.

## 6. Matriz inicial de permisos

| Recurso o acción | Admin | Trainer | Member |
| --- | ---: | ---: | ---: |
| Consultar dashboard administrativo | Sí | Limitado | No |
| Crear miembros | Sí | No | No |
| Consultar miembros | Sí | Asignados | Solo perfil propio |
| Actualizar miembros | Sí | Limitado | Solo datos propios permitidos |
| Desactivar miembros | Sí | No | No |
| Gestionar entrenadores | Sí | No | No |
| Gestionar planes | Sí | No | No |
| Asignar membresías | Sí | No | No |
| Consultar membresías | Sí | Limitado | Solo propias |
| Registrar asistencias | Sí | Sí | No en el MVP |
| Consultar asistencias | Sí | Limitado | Solo propias |
| Consultar ejercicios | Sí | Sí | Sí |
| Administrar disponibilidad de ejercicios | Sí | No | No |
| Crear rutinas | Sí | Sí | No |
| Actualizar rutinas | Sí | Propias | No |
| Asignar rutinas | Sí | Sí | No |
| Consultar rutinas | Sí | Sí | Solo asignadas |
| Registrar progreso | Sí | Sí | Propio |

La expresión “limitado” debe convertirse después en permisos concretos. No debe quedar como una condición ambigua dentro del código.

## 7. Reglas de usuario y acceso

### Identidad

- Cada usuario debe tener un identificador interno único.
- El correo utilizado para autenticación debe ser único.
- El correo debe normalizarse antes de comprobar duplicados.
- Un usuario puede tener un rol inicial.
- La arquitectura puede admitir múltiples roles en el futuro, pero no es obligatorio para el MVP.
- Desactivar un usuario impide nuevos inicios de sesión.
- La desactivación no elimina su historial.

### Credenciales

- Las contraseñas nunca se almacenan en texto plano.
- El sistema no devuelve hashes ni datos de sesión en respuestas públicas.
- Los errores de login no deben revelar si un correo existe.
- Los intentos repetidos deben estar protegidos mediante rate limiting.

### Sesiones

- El access token debe tener una duración corta.
- La sesión renovable debe poder revocarse.
- Cerrar sesión invalida la sesión correspondiente.
- Un cambio de contraseña debe permitir revocar sesiones existentes.

## 8. Reglas de miembros

- Un miembro está asociado a un usuario.
- El perfil del miembro y las credenciales son conceptos separados.
- El número o código de miembro debe ser único dentro del gimnasio.
- Un miembro desactivado conserva membresías, rutinas y asistencias históricas.
- Un miembro desactivado no puede registrar nuevas asistencias.
- La información sensible debe limitarse según el rol.
- El miembro solo puede modificar campos expresamente autorizados de su perfil.
- Los campos administrativos no se actualizan desde el portal del miembro.

### Estados sugeridos

```text
ACTIVE
INACTIVE
SUSPENDED
```

La suspensión y la inactividad deben tener significados diferentes:

- `INACTIVE`: el miembro ya no participa de la operación normal.
- `SUSPENDED`: existe una restricción temporal.

Para simplificar el MVP se puede comenzar con `ACTIVE` e `INACTIVE`, dejando `SUSPENDED` para una iteración posterior.

## 9. Reglas de planes

Un plan representa una oferta reutilizable.

Campos conceptuales:

- Nombre.
- Descripción.
- Duración.
- Unidad de duración.
- Precio.
- Moneda.
- Estado.

Reglas:

- El nombre debe ser reconocible y no vacío.
- La duración debe ser mayor que cero.
- El precio no puede ser negativo.
- Un plan inactivo no se puede asignar a nuevas membresías.
- Desactivar un plan no cancela membresías existentes.
- Cambiar el precio del plan no modifica el precio histórico de membresías ya creadas.

## 10. Reglas de membresías

Una membresía representa el acuerdo concreto entre un miembro y un plan.

### Estados sugeridos

```text
PENDING
ACTIVE
EXPIRED
CANCELLED
```

### Reglas

- Una membresía pertenece a un miembro.
- Una membresía referencia el plan utilizado.
- Debe conservar una copia del precio contratado.
- La fecha de expiración no debe ser anterior a la fecha de inicio.
- Una membresía futura puede permanecer en estado `PENDING`.
- Una membresía entra en estado `ACTIVE` cuando inicia su vigencia.
- Una membresía vencida pasa a `EXPIRED`.
- Una membresía cancelada no vuelve a activarse; se crea una nueva si es necesario.
- El historial no debe eliminarse.
- La asignación debe registrar quién realizó la operación.

### Solapamiento

Para el MVP se recomienda no permitir dos membresías activas que se solapen para el mismo miembro.

Una renovación puede:

1. Iniciar después de que termine la membresía actual.
2. Quedar pendiente hasta su fecha de inicio.

Esta regla evita ambigüedades en asistencias, precios y reportes.

## 11. Reglas de asistencia

- Una asistencia pertenece a un miembro.
- Debe registrar fecha y hora.
- Debe indicar el origen del registro.
- Debe registrar al usuario que ejecutó la acción cuando corresponda.
- Un miembro inactivo no puede registrar una nueva asistencia.
- Un miembro sin membresía activa no puede registrar asistencia, salvo una excepción administrativa explícita.
- No deben existir dos entradas idénticas generadas accidentalmente.
- Las asistencias históricas no deben eliminarse físicamente desde operaciones normales.

### Duplicados

Para el MVP se puede impedir una segunda entrada dentro de una ventana corta configurable.

No conviene imponer “una sola asistencia por día”, porque un miembro podría salir y regresar. La regla final dependerá de si más adelante se modelan entradas y salidas.

### Origen sugerido

```text
ADMIN
TRAINER
SYSTEM
```

Un origen como QR puede añadirse posteriormente.

## 12. Catálogo de ejercicios

### Fuente identificada

Repositorio:

[hasaneyldrm/exercises-dataset](https://github.com/hasaneyldrm/exercises-dataset)

El repositorio declara actualmente:

- 1.324 ejercicios.
- Nombre y categoría.
- Parte del cuerpo.
- Equipamiento.
- Músculo objetivo.
- Músculos secundarios.
- Instrucciones en diez idiomas, incluyendo español e inglés.
- JSON Schema para validar los registros.
- Miniaturas y GIFs de demostración.

### Evaluación

El dataset es una buena fuente inicial porque:

- Evita crear manualmente cientos de ejercicios.
- Incluye información suficiente para búsquedas y filtros.
- Incluye instrucciones en español.
- Proporciona un identificador externo.
- Tiene un schema formal.
- Permite demostrar un pipeline de importación validado.

No debe convertirse directamente en el modelo de dominio de GymFlow. El sistema debe importar y normalizar los campos que necesita.

### Licencia y restricción de medios

Según la documentación consultada:

- El código, la estructura del dataset y los textos de instrucciones se publican bajo licencia MIT.
- Las imágenes y GIFs pertenecen a Gym visual.
- El repositorio exige conservar la atribución de esos medios.
- También indica que se debe obtener una licencia propia antes de reutilizar las imágenes y GIFs.

Por este motivo, la decisión para el MVP es:

1. Se pueden evaluar e importar metadatos e instrucciones respetando la licencia MIT.
2. Se debe conservar la referencia a la fuente y su licencia.
3. No se copiarán ni publicarán imágenes o GIFs hasta confirmar un permiso o licencia compatible con GymFlow.
4. Durante el desarrollo se usarán placeholders visuales propios.
5. La licencia y el `NOTICE` se volverán a revisar antes de importar el dataset.

Fuentes:

- [README y condiciones de uso](https://github.com/hasaneyldrm/exercises-dataset#license--use)
- [LICENSE](https://github.com/hasaneyldrm/exercises-dataset/blob/main/LICENSE)
- [NOTICE](https://github.com/hasaneyldrm/exercises-dataset/blob/main/NOTICE.md)

### Campos externos relevantes

```text
id
name
category
body_part
equipment
instructions
instruction_steps
muscle_group
secondary_muscles
target
attribution
```

Los campos de media no se importarán inicialmente:

```text
media_id
image
gif_url
```

### Modelo interno sugerido

```text
Exercise
ExerciseTranslation
ExerciseSecondaryMuscle
```

#### Exercise

- Identificador interno.
- Identificador de la fuente.
- Nombre canónico.
- Parte del cuerpo.
- Músculo objetivo.
- Grupo muscular.
- Equipamiento.
- Estado activo/inactivo.
- Fuente.
- Fecha de importación.
- Versión o hash del registro importado.

#### ExerciseTranslation

- Ejercicio.
- Idioma.
- Nombre localizado, si está disponible.
- Instrucción completa.
- Pasos ordenados.

#### ExerciseSecondaryMuscle

- Ejercicio.
- Músculo secundario.

No es obligatorio crear tablas separadas para cada concepto en la primera migración. La decisión final dependerá del ORM y de las consultas previstas.

### Identidad interna y externa

GymFlow no debe utilizar el ID externo como primary key.

Se recomienda:

- Un ID interno controlado por GymFlow.
- `source = "hasaneyldrm/exercises-dataset"`.
- `externalId` para el identificador del dataset.
- Una restricción única compuesta por `source + externalId`.

Esto permite:

- Cambiar de fuente.
- Agregar ejercicios propios.
- Importar futuras versiones.
- Evitar colisiones.
- Mantener trazabilidad.

### Actualizaciones del dataset

La importación debe ser idempotente:

- Un registro nuevo se crea.
- Un registro existente se actualiza solamente si cambió.
- Un ejercicio que desaparece de la fuente no se elimina automáticamente.
- Los datos personalizados de GymFlow no se sobrescriben.
- El resultado de la importación debe informar creados, actualizados, omitidos y fallidos.

### Campos locales

GymFlow puede necesitar campos que no pertenecen al dataset:

- `isActive`.
- `isCustom`.
- `createdBy`.
- `updatedBy`.
- Notas internas.
- Nivel de dificultad, solo si se define con una fuente o criterio confiable.

No se debe inventar automáticamente dificultad, riesgo o recomendaciones médicas.

### Búsqueda y filtros

El MVP debe permitir:

- Búsqueda por nombre.
- Filtro por parte del cuerpo.
- Filtro por equipamiento.
- Filtro por músculo objetivo.
- Filtro por estado.

No se necesita un motor de búsqueda externo. PostgreSQL es suficiente para el volumen inicial.

### Idiomas

GymFlow puede comenzar con:

```text
es
en
```

Aunque la fuente tenga más idiomas, importar solamente español e inglés simplifica:

- La interfaz.
- Las pruebas.
- El almacenamiento.
- La revisión de calidad.

Los demás idiomas pueden añadirse sin cambiar el modelo si las traducciones se guardan por código de idioma.

## 13. Reglas de rutinas

### Entidades conceptuales

```text
Routine
RoutineExercise
RoutineAssignment
```

### Routine

- Nombre.
- Descripción.
- Objetivo general.
- Creador.
- Estado.
- Fecha de creación.

### RoutineExercise

Representa la inclusión de un ejercicio dentro de una rutina.

Debe permitir:

- Orden.
- Series.
- Repeticiones.
- Duración, cuando corresponda.
- Descanso.
- Notas del entrenador.
- Día o bloque de entrenamiento.

### RoutineAssignment

Representa la asignación de una rutina a un miembro.

Debe incluir:

- Miembro.
- Rutina.
- Entrenador o administrador que asigna.
- Fecha de inicio.
- Fecha de finalización opcional.
- Estado.

### Reglas

- Una rutina debe tener al menos un ejercicio antes de publicarse o asignarse.
- El orden de los ejercicios debe ser estable.
- Series y repeticiones deben ser valores válidos cuando se utilicen.
- Una rutina puede reutilizarse para varios miembros.
- Las personalizaciones por miembro no deben modificar silenciosamente la plantilla original.
- Modificar una rutina ya asignada requiere una decisión explícita sobre sus asignaciones.

### Estrategia recomendada para cambios

Para el MVP:

- Una rutina puede editarse mientras sea borrador.
- Al asignarla, se crea una versión o snapshot.
- Los cambios posteriores no alteran automáticamente la rutina que el miembro ya recibió.

Esto preserva el historial y evita que una edición cambie retroactivamente planes activos.

## 14. Progreso

El progreso no es obligatorio para el primer flujo, pero el modelo debe diferenciar:

- Progreso corporal.
- Rendimiento en ejercicios.
- Cumplimiento de rutinas.

Posibles datos futuros:

- Peso corporal.
- Medidas.
- Carga utilizada.
- Repeticiones completadas.
- Duración.
- Percepción de esfuerzo.
- Notas.

No se deben mostrar diagnósticos médicos ni recomendaciones clínicas.

## 15. Dashboard inicial

El dashboard administrativo del MVP puede mostrar:

- Total de miembros activos.
- Membresías activas.
- Membresías próximas a vencer.
- Asistencias del día.
- Miembros recientes.

No se necesitan gráficos complejos inicialmente. Los indicadores deben derivarse de datos reales del sistema y tener definiciones claras.

El portal del miembro puede mostrar:

- Estado de membresía.
- Fecha de expiración.
- Últimas asistencias.
- Rutina activa.

## 16. Paginación, búsqueda y filtros

Los listados administrativos deben ser paginados desde la API.

Reglas generales:

- Tamaño de página limitado.
- Ordenamiento explícito.
- Filtros validados.
- Búsquedas normalizadas.
- Respuestas con total de resultados.
- Parámetros desconocidos rechazados o ignorados de forma consistente.

No se deben cargar todos los miembros o todas las asistencias en el navegador.

Para 1.324 ejercicios, la paginación también es conveniente aunque el volumen sea moderado.

## 17. Auditoría

Las operaciones relevantes deberían registrar:

- Usuario que ejecutó la acción.
- Fecha.
- Tipo de acción.
- Recurso afectado.

Operaciones prioritarias:

- Creación o desactivación de usuarios.
- Asignación o cancelación de membresías.
- Registro o corrección de asistencias.
- Asignación de rutinas.
- Importación del catálogo de ejercicios.

No es necesario construir un sistema completo de event sourcing. Una auditoría simple y explícita es suficiente para el portafolio.

## 18. Eliminación de datos

Regla general:

- Los registros operativos importantes no se eliminan físicamente desde los flujos normales.
- Se usan estados, desactivación o soft delete cuando exista una razón clara.

No todas las tablas necesitan soft delete. Aplicarlo indiscriminadamente complica consultas y constraints.

Candidatos a desactivación:

- Usuarios.
- Miembros.
- Entrenadores.
- Planes.
- Ejercicios.
- Rutinas.

Registros históricos:

- Membresías.
- Asistencias.
- Asignaciones.
- Auditoría.

## 19. Datos de demostración

El repositorio público debe usar únicamente datos ficticios.

El seed debería crear:

- Un gimnasio de demostración.
- Un administrador.
- Un entrenador.
- Varios miembros ficticios.
- Planes.
- Membresías en distintos estados.
- Asistencias.
- Una selección del catálogo de ejercicios.
- Rutinas de demostración.

Nunca se deben incluir:

- Personas reales.
- Correos personales ajenos.
- Teléfonos reales.
- Contraseñas productivas.
- Tokens.
- Datos copiados de un gimnasio real.

Las credenciales demo deben estar claramente separadas de cualquier entorno real.

## 20. Criterios de aceptación del MVP

El MVP se considera demostrable cuando:

1. El monorepo se instala con un solo comando.
2. Los portales y la API pueden ejecutarse localmente.
3. PostgreSQL se levanta mediante Docker Compose.
4. Las migraciones se ejecutan de forma reproducible.
5. Existe un seed con datos ficticios.
6. Un administrador puede iniciar sesión.
7. Puede crear un miembro.
8. Puede asignar una membresía.
9. Puede registrar una asistencia.
10. El miembro puede iniciar sesión y consultar sus datos.
11. Un entrenador puede consultar ejercicios.
12. Puede crear y asignar una rutina.
13. El miembro puede consultar la rutina asignada.
14. Un miembro no puede acceder a acciones administrativas.
15. La API está documentada con OpenAPI.
16. Existen pruebas unitarias, integración y E2E para los flujos críticos.
17. GitHub Actions valida cada pull request.
18. El README explica arquitectura, ejecución y decisiones.

## 21. Roadmap funcional

### Entrega 1 — Fundamentos

- Workspace.
- Aplicaciones.
- API.
- PostgreSQL.
- Health checks.
- Calidad básica.

### Entrega 2 — Acceso

- Usuarios.
- Login.
- Sesiones.
- Roles.
- Permisos.
- Protección de rutas.

### Entrega 3 — Miembros y membresías

- Miembros.
- Planes.
- Membresías.
- Primer flujo E2E.

### Entrega 4 — Asistencias

- Registro.
- Historial.
- Reglas de membresía activa.
- Indicadores básicos.

### Entrega 5 — Ejercicios

- Revisión final de licencia.
- Importador.
- Validación del dataset.
- Catálogo.
- Búsqueda y filtros.
- Instrucciones en español e inglés.

### Entrega 6 — Rutinas

- Plantillas.
- Ejercicios ordenados.
- Asignaciones.
- Vista del miembro.
- Segundo flujo E2E.

### Entrega 7 — Portafolio y despliegue

- Storybook.
- CI completo.
- Docker.
- Documentación.
- Datos demo.
- Despliegue gratuito.

## 22. Decisiones pendientes para el siguiente documento

El próximo análisis debe cerrar:

1. Modelo single-tenant preparado para evolucionar o multi-tenant desde el inicio.
2. ORM: Prisma o Drizzle.
3. Estrategia exacta de autenticación.
4. Modelo de permisos.
5. Modelo relacional y diagrama de entidades.
6. Estrategia de versionado de rutinas.
7. Forma de importar y actualizar el dataset.
8. Política definitiva sobre imágenes y GIFs.

## 23. Decisiones tomadas hasta ahora

- pnpm como package manager.
- Nx como gestor del monorepo.
- Dos portales Next.js.
- API NestJS.
- PostgreSQL.
- Tres roles iniciales: `ADMIN`, `TRAINER` y `MEMBER`.
- Autorización validada en backend.
- El primer flujo se centra en miembros, membresías y asistencias.
- El segundo flujo incorpora ejercicios y rutinas.
- El dataset externo es una fuente de importación, no el modelo interno.
- Se consideran inicialmente español e inglés.
- No se reutilizarán imágenes o GIFs sin resolver primero su licencia.
- Solo se utilizarán datos ficticios en demos y seeds.

