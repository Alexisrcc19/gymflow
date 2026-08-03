# GymFlow — Análisis y guía inicial

> Estado: documento de planificación. Todavía no se ha inicializado el monorepo ni generado código.

## 1. Recomendación principal

Para GymFlow utilizaría:

- pnpm como package manager.
- Nx como gestor del monorepo.
- Dos aplicaciones Next.js.
- Una API NestJS.
- PostgreSQL.
- Una librería UI con Storybook.
- Contratos y tipos compartidos.
- Playwright para pruebas E2E.
- Jest o Vitest para pruebas unitarias.
- Docker para el entorno local.
- GitHub Actions para CI/CD.
- Swagger/OpenAPI para documentar la API.

Aunque Turborepo es excelente y más sencillo, no es claramente mejor para este proyecto. Nx ofrece más valor porque tendremos varias aplicaciones, librerías compartidas, pruebas E2E, dependencias entre proyectos y una API NestJS.

Nx proporciona integración con Next.js y NestJS, generación de proyectos, caché, ejecución de proyectos afectados y visualización del grafo de dependencias. Además, se integra directamente con pnpm workspaces.

Referencia: [Nx con NestJS](https://nx.dev/docs/technologies/node/nest/introduction)

## 2. Nx frente a Turborepo

| Criterio | Nx | Turborepo |
| --- | --- | --- |
| Configuración inicial | Más guiada | Más manual |
| Next.js | Excelente | Excelente |
| NestJS | Plugin y generadores oficiales | Configuración manual |
| Generación de aplicaciones y librerías | Muy completa | No es su enfoque |
| Grafo de dependencias | Visual y explícito | Más básico |
| Comandos para proyectos afectados | Integrados | Requiere otra estrategia |
| Caché local | Sí | Sí |
| CI para monorepos | Muy completo | Muy bueno |
| Curva de aprendizaje | Media | Baja |
| Valor para GymFlow | Muy alto | Alto |

### Decisión recomendada

Usar Nx. Ya existe experiencia previa con esta herramienta y GymFlow tiene suficiente complejidad para aprovecharla. Cambiar a Turborepo solamente por cambiar de herramienta no aportaría una ventaja técnica clara.

## 3. Arquitectura propuesta

```text
gymflow/
├── apps/
│   ├── member-portal/       # Next.js
│   ├── admin-portal/        # Next.js
│   ├── api/                 # NestJS
│   └── e2e/                 # Playwright
│
├── packages/
│   ├── ui/                  # Componentes + Storybook
│   ├── contracts/           # DTOs y contratos compartidos
│   ├── validation/          # Schemas de validación
│   ├── auth/                # Tipos, permisos y helpers de RBAC
│   └── config/              # Configuración compartida
│
├── docs/
│   ├── architecture/
│   └── decisions/
│
├── nx.json
├── pnpm-workspace.yaml
└── package.json
```

No se deben crear todos los paquetes desde el primer día. La estructura anterior representa el destino. Para comenzar serían suficientes:

```text
apps/member-portal
apps/admin-portal
apps/api
packages/ui
packages/contracts
```

### Separación de responsabilidades

```text
Member Portal ─┐
               ├── HTTP API ── NestJS ── PostgreSQL
Admin Portal ──┘                    │
                              Auth + RBAC
```

- Next.js presenta la interfaz y consume la API.
- NestJS concentra las reglas de negocio.
- PostgreSQL almacena los datos.
- `packages/contracts` comparte contratos, pero no lógica de base de datos.
- `packages/ui` contiene componentes visuales reutilizables.
- Ninguna aplicación frontend se conecta directamente a PostgreSQL.
- El backend verifica permisos aunque la interfaz oculte las acciones no autorizadas.

## 4. Alcance funcional recomendado

La idea completa es buena, pero no conviene desarrollar todos los módulos al mismo tiempo.

### MVP 1 — Base demostrable

El primer flujo público debería cubrir:

1. Login.
2. RBAC.
3. Administración de miembros.
4. Planes de membresía.
5. Asignación de una membresía.
6. Registro de asistencia.
7. Portal del miembro para consultar su membresía y asistencias.

Este alcance permite demostrar:

- Autenticación.
- Autorización.
- Modelado relacional.
- CRUD.
- Formularios y validación.
- API documentada.
- Componentes reutilizables.
- Pruebas unitarias y E2E.
- CI.

### MVP 2 — Operación del gimnasio

- Entrenadores.
- Rutinas.
- Ejercicios.
- Asignación de rutinas.
- Clases.
- Cupos y reservas.
- Cancelación de reservas.

### MVP 3 — Analítica

- Miembros activos e inactivos.
- Asistencias por periodo.
- Ocupación de clases.
- Membresías próximas a vencer.
- Evolución del progreso del miembro.

### Funcionalidad que se pospone

No se recomienda integrar pagos reales en la primera versión. Los pagos introducen webhooks, estados transaccionales, conciliación y requisitos adicionales de seguridad.

Inicialmente se pueden modelar pagos manuales y dejar la integración con un proveedor externo para una fase posterior.

## 5. Modelo de dominio inicial

### Seguridad

```text
User
Role
Permission
RefreshSession
```

Roles iniciales:

```text
ADMIN
TRAINER
MEMBER
```

Ejemplo preliminar de permisos:

| Acción | Admin | Trainer | Member |
| --- | ---: | ---: | ---: |
| Gestionar miembros | Sí | Lectura limitada | No |
| Gestionar entrenadores | Sí | No | No |
| Crear rutinas | Sí | Sí | No |
| Consultar rutina propia | Sí | Sí | Sí |
| Registrar asistencia | Sí | Sí | No |
| Consultar asistencia propia | Sí | Sí | Sí |
| Gestionar clases | Sí | Sí | No |
| Reservar una clase | Sí | Sí | Sí |

No conviene implementar la autorización mediante verificaciones dispersas como `role === "ADMIN"`. Es preferible que los roles agrupen permisos y que NestJS aplique esos permisos mediante guards.

### Gimnasio y usuarios

```text
Gym
User
MemberProfile
TrainerProfile
```

Aunque inicialmente exista un solo gimnasio, incluir la entidad `Gym` facilita una posible evolución multi-tenant. Esto no implica implementar todavía facturación SaaS ni administración de múltiples organizaciones.

### Membresías

```text
MembershipPlan
Membership
Payment
```

Consideraciones:

- Un plan define duración y precio.
- Una membresía representa la contratación concreta.
- El precio contratado debe conservarse aunque después cambie el precio del plan.
- La membresía necesita fechas de inicio y expiración.
- Sus estados podrían ser `PENDING`, `ACTIVE`, `EXPIRED` y `CANCELLED`.

### Asistencia

```text
Attendance
```

Debe registrar al menos:

- Miembro.
- Fecha y hora de entrada.
- Método de registro.
- Usuario que registró la asistencia, cuando corresponda.

### Rutinas

```text
Exercise
Routine
RoutineExercise
RoutineAssignment
ProgressEntry
```

`RoutineExercise` es necesario porque la relación contiene información propia:

- Series.
- Repeticiones.
- Descanso.
- Orden.
- Notas.

### Clases

```text
ClassTemplate
ClassSession
ClassBooking
```

Separar la definición de una clase de cada sesión permite representar una clase recurrente y sus sesiones en fechas concretas.

## 6. Autenticación y RBAC

Para demostrar un backend completo, NestJS debería controlar la autenticación y autorización.

```text
Login
  ↓
NestJS valida credenciales
  ↓
Access token corto + refresh session
  ↓
Cookie segura
  ↓
Guard de autenticación
  ↓
Guard de permisos
  ↓
Caso de uso autorizado
```

Decisiones recomendadas:

- Contraseñas almacenadas únicamente como hashes.
- Access tokens de corta duración.
- Refresh tokens rotables.
- Cookies `HttpOnly`, `Secure` en producción y con política `SameSite`.
- Sesiones revocables.
- Rate limiting en endpoints de autenticación.
- Validación de variables de entorno.
- Swagger desactivable o protegido en producción.
- CORS restringido a los frontends autorizados.

Para el portafolio, RBAC será más demostrable si existen pruebas que confirmen que un usuario `MEMBER` no puede ejecutar acciones de `ADMIN`.

## 7. Estrategia de testing

### Pruebas unitarias

Backend:

- Casos de uso.
- Reglas de membresía.
- Cálculo de expiración.
- Cupos de clases.
- Permisos.
- Transiciones de estado.

Frontend:

- Componentes con comportamiento.
- Formularios.
- Estados vacíos y de error.
- Hooks relevantes.

### Pruebas de integración

- Repositorios con PostgreSQL.
- Endpoints NestJS.
- Autenticación.
- Guards.
- Constraints de base de datos.

### Pruebas E2E con Playwright

Recorridos iniciales:

1. Un administrador inicia sesión y registra un miembro.
2. El administrador asigna una membresía.
3. El miembro inicia sesión y consulta su membresía.

Recorridos posteriores:

4. Un entrenador asigna una rutina.
5. Un miembro reserva una clase.
6. Un miembro no puede acceder a rutas administrativas.

Las pruebas E2E deben proteger los recorridos críticos. Las reglas detalladas se comprueban mejor mediante pruebas unitarias y de integración.

## 8. CI/CD propuesto

### Pipeline inicial

```text
Pull Request
    │
    ├── Install with frozen lockfile
    ├── Lint
    ├── Typecheck
    ├── Unit tests
    ├── Integration tests
    ├── Build affected projects
    └── E2E smoke tests
```

Con Nx se pueden ejecutar solamente los proyectos afectados:

```bash
pnpm nx affected -t lint typecheck test build
```

GitHub indica que los runners estándar de GitHub Actions son gratuitos para repositorios públicos.

Referencia: [Facturación y uso de GitHub Actions](https://docs.github.com/en/actions/concepts/billing-and-usage)

No es necesario conectar Nx Cloud al inicio. La caché local de Nx es suficiente para comenzar.

## 9. Guía de inicialización

> Los siguientes comandos son una guía para ejecutar posteriormente. Todavía no han sido ejecutados.

### 9.1. Comprobar herramientas

```bash
node --version
corepack --version
git --version
docker --version
docker compose version
```

Se recomienda utilizar una versión LTS vigente de Node.js y fijarla posteriormente en el repositorio.

### 9.2. Activar pnpm mediante Corepack

```bash
corepack enable
corepack prepare pnpm@latest --activate
pnpm --version
```

Si `corepack` no está disponible:

```bash
npm install --global corepack
corepack enable
```

### 9.3. Crear el workspace Nx

La forma oficial con pnpm es:

```bash
cd /home/alexis/DEV/PERSONAL
pnpm dlx create-nx-workspace@latest GymFlow
```

Referencia: [Creación de un workspace Nx](https://nx.dev/docs/getting-started/tutorials/crafting-your-workspace)

En el asistente se recomienda seleccionar:

```text
Package manager: pnpm
Workspace type: Integrated monorepo
Starter: Empty / Apps
CI provider: Skip for now
Nx Cloud: Skip for now
Git: Yes
```

Como la carpeta `GymFlow` ya existe y contiene este documento, antes de ejecutar el generador será necesario decidir entre:

1. Inicializar Nx dentro de la carpeta existente.
2. Mover temporalmente la documentación, generar el workspace y devolverla.
3. Crear el workspace manualmente con pnpm y añadir Nx mediante `nx init`.

La alternativa más segura se definirá antes de ejecutar comandos para no sobrescribir este documento.

### 9.4. Instalar plugins oficiales

Una vez inicializado el workspace:

```bash
pnpm nx add @nx/next
pnpm nx add @nx/nest
pnpm nx add @nx/js
pnpm nx add @nx/playwright
pnpm nx add @nx/storybook
```

Las versiones de todos los plugins `@nx/*` deben mantenerse sincronizadas con la versión de `nx`.

### 9.5. Crear el portal de miembros

```bash
pnpm nx generate @nx/next:application
```

Respuestas recomendadas:

```text
Name: member-portal
Directory: apps/member-portal
App Router: Yes
Styling: Tailwind CSS
Unit test runner: Vitest
E2E test runner: None
```

### 9.6. Crear el portal administrativo

```bash
pnpm nx generate @nx/next:application
```

Respuestas recomendadas:

```text
Name: admin-portal
Directory: apps/admin-portal
App Router: Yes
Styling: Tailwind CSS
Unit test runner: Vitest
E2E test runner: None
```

### 9.7. Crear la API

```bash
pnpm nx generate @nx/nest:application
```

Respuestas recomendadas:

```text
Name: api
Directory: apps/api
Unit test runner: Jest
E2E test runner: None
```

NestJS utiliza Jest de forma natural, mientras que Vitest puede utilizarse en las aplicaciones frontend.

### 9.8. Crear las primeras librerías

```bash
pnpm nx generate @nx/js:library
```

Primera librería:

```text
Name: contracts
Directory: packages/contracts
Bundler: None
Unit test runner: Vitest
```

Segunda librería:

```bash
pnpm nx generate @nx/js:library
```

```text
Name: auth
Directory: packages/auth
Bundler: None
Unit test runner: Vitest
```

Para la UI se debe utilizar un generador compatible con React/Next y después configurar Storybook. Inicialmente bastan componentes fundamentales como botones, inputs, campos de formulario, diálogos y tablas.

### 9.9. Consultar el monorepo

```bash
pnpm nx show projects
pnpm nx graph
```

### 9.10. Ejecutar las aplicaciones

En terminales separadas:

```bash
pnpm nx dev member-portal
```

```bash
pnpm nx dev admin-portal
```

```bash
pnpm nx serve api
```

Los nombres finales de los targets se deben confirmar mediante:

```bash
pnpm nx show project member-portal
pnpm nx show project admin-portal
pnpm nx show project api
```

### 9.11. Comprobar el workspace

```bash
pnpm nx run-many -t lint test build
```

## 10. Orden recomendado de desarrollo

No se recomienda configurar Storybook, Docker, Swagger, CI, autenticación y despliegue el mismo día.

### Fase 0 — Definición

- Confirmar el alcance del MVP.
- Definir roles y permisos.
- Crear el diagrama de entidades.
- Documentar decisiones arquitectónicas iniciales.

### Fase 1 — Workspace

- Crear Nx.
- Crear los dos frontends.
- Crear la API.
- Crear contratos compartidos.
- Verificar lint, test y build.

### Fase 2 — Base de datos

- Elegir ORM.
- Crear PostgreSQL local con Docker Compose.
- Diseñar la migración inicial.
- Agregar datos ficticios de desarrollo.

### Fase 3 — Primer vertical slice

```text
Login de administrador
→ Crear miembro
→ Guardar en PostgreSQL
→ Consultar miembro
→ Mostrarlo en admin portal
→ Prueba E2E
```

### Fase 4 — Calidad

- Swagger/OpenAPI.
- Pruebas de integración.
- Playwright.
- Storybook.
- GitHub Actions.

### Fase 5 — Despliegue

- Base de datos gratuita.
- API gratuita.
- Frontends gratuitos.
- Variables de entorno.
- CORS.
- Seed de demostración.
- Cuenta demo con permisos limitados.

## 11. Alternativas para mantener el proyecto gratis

> Información revisada en julio de 2026. Los planes pueden cambiar y deben verificarse nuevamente antes del despliegue.

Combinación recomendada:

```text
GitHub                 Repositorio + Actions
Vercel Hobby           Frontends Next.js
Render Free            API NestJS
Neon Free              PostgreSQL
```

### PostgreSQL — Neon Free

Es la opción preferida para la base de datos porque:

- Es PostgreSQL real.
- No tiene límite temporal declarado en el plan gratuito.
- Escala a cero cuando está inactiva.
- Incluye actualmente 0.5 GB por proyecto.
- Incluye actualmente 100 CU-hours mensuales por proyecto.
- No requiere tarjeta para el plan gratuito según su documentación.

Referencia: [Neon Free](https://neon.com/pricing)

Para una demo con pocos usuarios, 0.5 GB es suficiente si no se almacenan imágenes o archivos binarios en la base.

### Alternativa — Supabase Free

Actualmente ofrece:

- PostgreSQL.
- 500 MB por proyecto.
- Dos proyectos activos.
- Autenticación y almacenamiento opcionales.
- Pausa después de una semana de inactividad.

Referencia: [Supabase pricing](https://supabase.com/pricing)

Supabase es conveniente para Auth y Storage administrados. Sin embargo, para demostrar NestJS y RBAC propios, se recomienda Neon como base de datos y autenticación controlada por la API.

### API — Render Free

Render permite desplegar servicios Node gratuitamente, pero:

- El servicio duerme después de 15 minutos sin tráfico.
- El arranque puede tardar aproximadamente un minuto.
- El filesystem es efímero.
- Incluye 750 horas gratuitas mensuales por workspace.
- No es adecuado para producción real.

Referencia: [Render Free](https://render.com/docs/free)

Para una demo de portafolio es aceptable. La interfaz puede advertir que la API podría tardar aproximadamente un minuto en despertar.

No se recomienda el PostgreSQL gratuito de Render porque actualmente caduca después de 30 días. Neon o Supabase son opciones más apropiadas para conservar la demo.

### Frontend — Vercel Hobby

Puede ser adecuado para los dos frontends personales:

- Un proyecto para `member-portal`.
- Otro proyecto para `admin-portal`.
- Builds filtrados al directorio correspondiente.
- Variables públicas separadas de secretos.
- Ninguna lógica sensible en el frontend.

Sus límites y condiciones deben revisarse justo antes del despliegue.

### CI — GitHub Actions

Para un repositorio público, GitHub permite utilizar runners estándar sin consumir una cuota facturable de minutos, sujeto a sus políticas y límites.

Para optimizar CI:

- Ejecutar CI solamente en pull requests y `main`.
- Usar `pnpm install --frozen-lockfile`.
- Utilizar `nx affected`.
- Cachear el store de pnpm.
- No desplegar desde cada job.
- Ejecutar la suite E2E completa solamente cuando cambien aplicaciones críticas.

### Dominio

No es necesario comprar un dominio al inicio. Los subdominios gratuitos de cada proveedor son suficientes para el portafolio.

## 12. Riesgos del enfoque gratuito

“Gratis” no significa que no existan restricciones:

- La API puede dormirse.
- La base puede pausar o escalar a cero.
- Los primeros requests pueden ser lentos.
- Los planes pueden cambiar.
- Los servicios pueden suspenderse al alcanzar límites.
- Los datos gratuitos pueden no tener backups adecuados.
- No se debe utilizar información real de personas.

Se deben usar datos ficticios, un seed reproducible y una cuenta demo con permisos limitados.

## 13. Decisiones pendientes

Antes de inicializar el proyecto hay que resolver:

1. ¿Un solo gimnasio o arquitectura multi-tenant desde el modelo?
2. ¿Autenticación propia en NestJS o proveedor administrado?
3. ¿Prisma, Drizzle u otro ORM?
4. ¿Un solo proyecto E2E o uno por portal?
5. ¿Jest en todo el monorepo o Vitest en frontend y Jest en backend?
6. ¿Dos portales independientes o un solo Next.js con áreas por rol?

Recomendaciones iniciales:

- Preparar el modelo para incluir `Gym`, pero lanzar un solo gimnasio.
- Autenticación propia en NestJS.
- Evaluar Prisma primero por claridad para un portafolio.
- Un proyecto Playwright central al inicio.
- Vitest en frontend y Jest en NestJS.
- Dos portales separados para mostrar mejor la arquitectura del monorepo.

## 14. Próximo paso

La siguiente sesión debería continuar con diseño:

1. Definir el MVP definitivo.
2. Diseñar entidades y relaciones.
3. Crear la matriz completa de permisos.
4. Elegir ORM.
5. Definir la estrategia de autenticación.
6. Solo después, inicializar el workspace Nx.

