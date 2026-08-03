# GymFlow — Estado y checklist antes de implementar

> Objetivo: determinar si existe suficiente definición para comenzar y qué decisiones deben cerrarse antes de desarrollar funcionalidades.

## 1. Respuesta corta

Sí existe suficiente información para:

- Inicializar el monorepo.
- Instalar los plugins principales de Nx.
- Crear las aplicaciones vacías.
- Configurar reglas básicas de calidad.
- Preparar la documentación del repositorio.

Todavía no existe suficiente definición para comenzar a implementar autenticación, membresías, asistencias y rutinas sin asumir decisiones importantes.

La preparación actual se puede resumir así:

| Área | Estado |
| --- | --- |
| Visión del producto | Definida |
| Stack principal | Definido |
| Arquitectura general | Definida |
| Roles principales | Definidos |
| Alcance general del MVP | Definido |
| Reglas de negocio iniciales | Definidas |
| Fuente del catálogo de ejercicios | Evaluada |
| Orden de entregas | Definido |
| Modelo relacional definitivo | Pendiente |
| ORM | Pendiente |
| Autenticación detallada | Pendiente |
| Permisos definitivos | Pendiente |
| Contratos de API | Pendiente |
| Flujos y pantallas | Pendiente |
| Estrategia exacta de pruebas | Parcial |
| Entornos y variables | Pendiente |
| Convenciones de desarrollo | Pendiente |

## 2. Lo que ya está decidido

### Producto

- GymFlow será una plataforma de gestión de gimnasios.
- Tendrá un portal administrativo.
- Tendrá un portal para miembros.
- Tendrá una API independiente.
- La primera versión será una demostración pública con datos ficticios.

### Stack

- pnpm.
- Nx.
- Next.js.
- React.
- TypeScript.
- NestJS.
- PostgreSQL.
- Storybook.
- Playwright.
- Jest y/o Vitest.
- Docker.
- GitHub Actions.
- Swagger/OpenAPI.

### Aplicaciones iniciales

```text
apps/member-portal
apps/admin-portal
apps/api
```

### Librerías iniciales

```text
packages/ui
packages/contracts
```

No es necesario crear todavía todas las librerías futuras.

### Roles

```text
ADMIN
TRAINER
MEMBER
```

### Primer flujo funcional

```text
Administrador inicia sesión
  ↓
Crea un miembro
  ↓
Asigna una membresía
  ↓
Registra una asistencia
  ↓
El miembro inicia sesión
  ↓
Consulta su membresía y asistencia
```

### Segundo flujo funcional

```text
Entrenador inicia sesión
  ↓
Consulta el catálogo de ejercicios
  ↓
Crea una rutina
  ↓
Asigna la rutina a un miembro
  ↓
El miembro consulta su rutina
```

### Dataset

- El dataset externo se tratará como una fuente de importación.
- No será el modelo interno de GymFlow.
- Se utilizarán inicialmente español e inglés.
- Se conservará la trazabilidad de la fuente.
- No se utilizarán imágenes o GIFs sin resolver primero sus condiciones de licencia.
- Durante el desarrollo pueden utilizarse placeholders propios.

## 3. Decisiones bloqueantes

Las siguientes decisiones deben resolverse antes de implementar el primer flujo vertical.

### 3.1. Estrategia de tenancy

Hay que elegir entre:

#### Opción A — Single-tenant estricto

El sistema representa un solo gimnasio y las tablas no contienen `gymId`.

Ventajas:

- Modelo más sencillo.
- Menos validaciones.
- Implementación inicial más rápida.

Desventajas:

- Convertirlo después en SaaS requeriría modificar gran parte del modelo.
- Demuestra menos aislamiento de datos.

#### Opción B — Multi-tenant completo

Cada petición y recurso se resuelve dentro de un gimnasio u organización.

Ventajas:

- Arquitectura SaaS real desde el inicio.
- Aislamiento explícito de datos.

Desventajas:

- Mayor complejidad de autenticación, autorización, constraints, consultas y pruebas.
- Aumenta considerablemente el alcance del MVP.

#### Opción recomendada — Single-tenant preparado

- La demo opera con un solo gimnasio.
- Existe una entidad `Gym`.
- Los recursos operativos principales incluyen `gymId`.
- No se construye todavía selección de organizaciones.
- No se implementa facturación SaaS.
- No se permite que un usuario cambie de gimnasio.

Esta alternativa permite demostrar un modelo preparado para crecer sin implementar toda la complejidad multi-tenant.

### 3.2. ORM

Opciones consideradas:

#### Prisma

Ventajas:

- Schema legible.
- Migraciones integradas.
- Cliente tipado.
- Buena experiencia con PostgreSQL.
- Prisma Studio ayuda a inspeccionar datos durante el desarrollo.
- Fácil de explicar en un proyecto de portafolio.

Consideraciones:

- Introduce su propia capa de abstracción.
- Algunas consultas avanzadas pueden requerir SQL.

#### Drizzle

Ventajas:

- Modelo cercano a SQL.
- Tipado sólido.
- Menor nivel de abstracción.
- Buen control sobre queries y schema.

Consideraciones:

- Requiere más decisiones manuales.
- Puede demandar más trabajo inicial para un proyecto cuyo objetivo principal no es comparar ORMs.

#### Recomendación

Usar Prisma para el MVP.

La razón no es que sea universalmente mejor, sino que reduce decisiones de infraestructura, facilita migraciones y permite concentrarse en arquitectura, reglas de negocio y testing.

### 3.3. Autenticación

Opciones consideradas:

- Autenticación propia en NestJS.
- Proveedor externo.
- Autenticación administrada por la plataforma de base de datos.

#### Recomendación

Implementar autenticación en NestJS:

- Email y contraseña.
- Password hashing.
- Access token de corta duración.
- Refresh session revocable.
- Cookies seguras.
- Endpoint para usuario actual.
- Logout.
- Rate limiting.

Esto permite demostrar backend, seguridad, guards, sesiones y RBAC.

No se recomienda añadir OAuth en el MVP.

### 3.4. Modelo de autorización

No basta con comprobar roles directamente en cada endpoint.

Se recomienda:

```text
Role
  ↓
Permissions
  ↓
Guard
  ↓
Resource scope
```

Ejemplo:

```text
MEMBER_READ
MEMBER_CREATE
MEMBER_UPDATE
MEMBERSHIP_ASSIGN
ATTENDANCE_CREATE
ROUTINE_CREATE
ROUTINE_ASSIGN
```

Además del permiso, algunas acciones requieren alcance:

- Un miembro consulta únicamente su perfil.
- Un entrenador consulta miembros asignados.
- Un administrador consulta todos los miembros de su gimnasio.

La decisión pendiente no es si habrá RBAC, porque eso ya está decidido. Lo pendiente es definir el catálogo exacto de permisos y sus alcances.

### 3.5. Versionado de rutinas

Problema:

Si un entrenador modifica una rutina después de asignarla, hay que decidir si el miembro ve el cambio inmediatamente o conserva la versión recibida.

#### Recomendación

- Una rutina comienza como borrador.
- Al publicarla se crea una versión.
- Una asignación referencia una versión concreta.
- Editar una rutina publicada genera una nueva versión.
- Las asignaciones existentes no cambian automáticamente.

Esta decisión conserva historial y hace las pruebas más deterministas.

### 3.6. Importación del dataset

#### Recomendación

- Importación controlada desde un comando interno.
- Validación previa contra JSON Schema.
- Normalización de campos.
- Identificador interno propio.
- Conservación de `source` y `externalId`.
- Importación idempotente.
- Informe de registros creados, actualizados, omitidos y fallidos.
- Sin descarga dinámica durante requests de usuarios.
- Sin dependencia en tiempo de ejecución del repositorio externo.

El dataset debe importarse a PostgreSQL. La aplicación no debería leer el JSON remoto cada vez que un usuario consulta ejercicios.

## 4. Decisiones importantes, pero no bloqueantes para crear el workspace

### Convenciones de nombres

Propuesta:

- Carpetas y proyectos: `kebab-case`.
- Variables y funciones: `camelCase`.
- Tipos, clases y componentes: `PascalCase`.
- Constantes: `UPPER_SNAKE_CASE` cuando sean constantes globales.
- Tablas y columnas: decidir según la convención del ORM.
- Commits: Conventional Commits.

### Ramas

Para un proyecto personal no es necesario un flujo complejo.

Propuesta:

```text
main
feature/*
fix/*
docs/*
chore/*
```

Cada cambio importante puede entrar mediante pull request para que GitHub Actions sea visible.

### Versiones de Node y pnpm

Antes del primer commit funcional:

- Fijar una versión LTS de Node.js.
- Fijar la versión de pnpm.
- Registrar ambas en el repositorio.

Esto evita diferencias entre desarrollo local y CI.

### Formato y lint

Hay que definir:

- Prettier.
- ESLint.
- Orden de imports.
- Reglas TypeScript.
- Verificación de tipos.

Estas reglas deben ejecutarse desde Nx y en CI.

### Variables de entorno

Se debe documentar:

- Nombre.
- Aplicación que la utiliza.
- Si es pública o secreta.
- Si es obligatoria.
- Ejemplo seguro.

Nunca se deben incluir valores reales en el repositorio.

## 5. Documentos que todavía faltan

### Documento 04 — Modelo de datos y relaciones

Debe contener:

- Entidades definitivas.
- Relaciones.
- Cardinalidades.
- Constraints.
- Índices.
- Campos de auditoría.
- Estrategia de IDs.
- Estados.
- Diagrama entidad-relación.

Este es el documento más importante antes de crear migraciones.

### Documento 05 — Autenticación, permisos y seguridad

Debe contener:

- Flujo de login.
- Access token.
- Refresh sessions.
- Cookies.
- Logout.
- Recuperación de contraseña, aunque pueda quedar fuera del MVP.
- Catálogo de permisos.
- Alcance por rol.
- Casos de autorización.
- Riesgos y controles.

### Documento 06 — Contratos de API

Debe definir:

- Recursos.
- Endpoints.
- Request DTOs.
- Response DTOs.
- Paginación.
- Filtros.
- Formato de errores.
- Códigos HTTP.
- Versionado.

No necesita contener código.

### Documento 07 — Flujos y pantallas

Debe incluir:

- Sitemap de cada portal.
- Pantallas.
- Estados vacíos.
- Estados de carga.
- Errores.
- Acciones visibles por rol.
- Primeros wireframes de baja fidelidad.

### Documento 08 — Estrategia de testing

Debe cerrar:

- Qué se prueba de forma unitaria.
- Qué se prueba con PostgreSQL.
- Qué se prueba con Playwright.
- Datos de prueba.
- Aislamiento.
- Cobertura mínima razonable.
- Pipeline de pull requests.

### Documento 09 — Entornos y despliegue

Debe definir:

- Local.
- CI.
- Preview o staging.
- Demo pública.
- Servicios gratuitos.
- Variables.
- Migraciones.
- Seeds.
- Backups.
- Límites conocidos.

No es necesario escribirlo antes del primer componente, pero sí antes del primer despliegue.

## 6. Qué puede hacerse ahora sin riesgo

Mientras se completa la documentación, se puede:

- Finalizar la instalación base de Nx.
- Recuperar los documentos dentro del workspace.
- Crear un `docs/` para alojarlos.
- Agregar los plugins oficiales de Next.js y NestJS.
- Crear aplicaciones vacías.
- Verificar que el workspace ejecuta lint, typecheck y build.
- Configurar versiones de Node y pnpm.
- Crear el repositorio Git.

Todavía no conviene:

- Crear el schema de base de datos.
- Generar migraciones.
- Implementar JWT.
- Crear guards.
- Importar el dataset.
- Implementar endpoints.
- Crear formularios de negocio.

Estas acciones dependen de decisiones que deben documentarse primero.

## 7. Definition of Ready para comenzar implementación

El proyecto estará listo para implementar el primer flujo cuando:

- [x] La visión esté definida.
- [x] El stack esté definido.
- [x] El MVP esté delimitado.
- [x] Los roles estén identificados.
- [x] Los dos primeros flujos verticales estén definidos.
- [x] La fuente de ejercicios esté evaluada.
- [ ] La estrategia de tenancy esté aprobada.
- [ ] El ORM esté aprobado.
- [ ] El modelo relacional esté aprobado.
- [ ] La estrategia de autenticación esté aprobada.
- [ ] La matriz definitiva de permisos esté aprobada.
- [ ] Los contratos del primer flujo estén definidos.
- [ ] Las pantallas del primer flujo estén enumeradas.
- [ ] Los criterios E2E del primer flujo estén aprobados.

## 8. Nivel actual de preparación

Estimación cualitativa:

```text
Producto y alcance       █████████░  90%
Arquitectura general     ████████░░  80%
Reglas de negocio        ███████░░░  70%
Modelo de datos          ███░░░░░░░  30%
Seguridad y permisos     ████░░░░░░  40%
Contratos de API         ██░░░░░░░░  20%
UX y pantallas           ██░░░░░░░░  20%
Testing detallado        ████░░░░░░  40%
Despliegue               ███░░░░░░░  30%
```

Estos porcentajes son únicamente una herramienta de planificación. No representan progreso de implementación.

## 9. Recomendación de secuencia

El orden recomendado desde este punto es:

1. Aprobar las decisiones técnicas propuestas en este documento.
2. Crear `04-modelo-de-datos-y-relaciones.md`.
3. Crear `05-autenticacion-permisos-y-seguridad.md`.
4. Crear `06-contratos-api-primer-flujo.md`.
5. Crear `07-flujos-y-pantallas.md`.
6. Inicializar solamente la base técnica.
7. Implementar el primer flujo vertical.
8. Crear el detalle de testing antes de completar el flujo.
9. Configurar CI.
10. Continuar con ejercicios y rutinas.

## 10. Recomendaciones propuestas para aprobación

Para avanzar sin ampliar innecesariamente el alcance:

| Decisión | Propuesta |
| --- | --- |
| Tenancy | Single-tenant preparado mediante entidad `Gym` y `gymId` |
| ORM | Prisma |
| Autenticación | Propia en NestJS |
| Sesión | Access token corto + refresh session revocable |
| Autorización | Roles que agrupan permisos + validación de alcance |
| Rutinas | Versionadas; asignaciones apuntan a una versión |
| Dataset | Importación idempotente a PostgreSQL |
| Idiomas iniciales | Español e inglés |
| Medios del dataset | No usarlos hasta resolver licencia |
| Unit testing frontend | Vitest |
| Unit testing backend | Jest |
| E2E | Un proyecto Playwright central al inicio |

Si se aprueban estas propuestas, el siguiente documento puede diseñar el modelo relacional sin decisiones críticas abiertas.

