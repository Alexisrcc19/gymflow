# GymFlow — Estructura interna del monorepo

> Estado: convención arquitectónica propuesta para aplicaciones y librerías. No implica que todas las carpetas deban crearse desde el primer día.

## 1. Referencias utilizadas

La estructura toma como guía:

- Nx recomienda aplicaciones delgadas, código reutilizable en librerías y agrupación por dominio.
- NestJS recomienda feature modules que encapsulen controllers, providers y dependencias.
- Next.js permite route groups para organizar rutas sin modificar la URL y private folders para separar detalles internos.

Referencias:

- [Nx: estructura de monorepos](https://nx.dev/docs/kb/folder-structure)
- [NestJS: módulos](https://docs.nestjs.com/modules)
- [NestJS: controllers](https://docs.nestjs.com/controllers)
- [NestJS: providers](https://docs.nestjs.com/providers)
- [Next.js: estructura de proyecto](https://nextjs.org/docs/app/getting-started/project-structure)

## 2. Principios

### Aplicaciones delgadas

Las carpetas dentro de `apps/` contienen:

- Entry points.
- Configuración del runtime.
- Composición de módulos o features.
- Routing.
- Assets específicos.

No deben convertirse en depósitos de toda la lógica compartida.

### Agrupación por dominio

El código se organiza primero por dominio:

```text
members
memberships
attendance
exercises
routines
```

Después se separa por responsabilidad dentro del dominio.

Se evita una estructura global como:

```text
controllers/
services/
repositories/
dto/
```

porque con el tiempo mezcla todos los dominios.

### Compartir de forma deliberada

Un archivo no entra en `shared` solamente porque podría reutilizarse algún día.

Se promueve a compartido cuando:

- Tiene al menos dos consumidores reales.
- No contiene reglas específicas de una feature.
- Tiene una API pública estable.

### Dependencias en una dirección

```text
presentation
    ↓
application
    ↓
domain
    ↑
infrastructure implements ports
```

El dominio no depende de NestJS, Prisma, HTTP ni React.

## 3. Estructura raíz

```text
GymFlow/
├── apps/
│   ├── api/
│   ├── admin-portal/
│   ├── member-portal/
│   └── e2e/
│
├── packages/
│   ├── ui/
│   ├── contracts/
│   ├── api-client/
│   ├── config/
│   └── testing/
│
├── docs/
│   ├── architecture/
│   ├── decisions/
│   └── product/
│
├── tools/
│   ├── data-import/
│   └── scripts/
│
├── .github/
│   └── workflows/
│
├── nx.json
├── pnpm-workspace.yaml
├── package.json
└── README.md
```

### Creación progresiva

Primera etapa:

```text
apps/api
apps/admin-portal
apps/member-portal
packages/ui
packages/contracts
docs
```

Se agregan `api-client`, `testing`, `tools` y `e2e` cuando aparezca su primer uso real.

## 4. Aplicación API

### Estructura general

```text
apps/api/
├── src/
│   ├── app/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── members/
│   │   │   ├── trainers/
│   │   │   ├── membership-plans/
│   │   │   ├── memberships/
│   │   │   ├── attendance/
│   │   │   ├── exercises/
│   │   │   ├── routines/
│   │   │   └── audit/
│   │   │
│   │   ├── common/
│   │   ├── config/
│   │   ├── database/
│   │   ├── health/
│   │   └── app.module.ts
│   │
│   └── main.ts
│
├── test/
└── project.json
```

### `modules`

Contiene módulos de negocio.

Cada módulo expone solamente los providers que otros módulos realmente necesitan.

### `common`

Solo contiene elementos transversales:

- Decorators.
- Guards genéricos.
- Exception filters.
- Interceptors.
- Pipes.
- Errores HTTP compartidos.

No contiene lógica de miembros, membresías o rutinas.

### `config`

- Validación de variables.
- Configuración tipada.
- Configuración por entorno.

No contiene secretos con valores reales.

### `database`

- Prisma module.
- Prisma service.
- Helpers transaccionales.
- Adaptadores compartidos estrictamente necesarios.

No contiene todos los repositories del sistema. Cada repository pertenece a su dominio.

### `health`

- Estado de API.
- Estado de base de datos.
- Información pública mínima.

## 5. Estructura interna de un módulo NestJS

Ejemplo para miembros:

```text
members/
├── application/
│   ├── commands/
│   │   ├── create-member/
│   │   ├── update-member/
│   │   └── deactivate-member/
│   │
│   ├── queries/
│   │   ├── get-member/
│   │   └── list-members/
│   │
│   └── ports/
│       └── member-repository.port.ts
│
├── domain/
│   ├── entities/
│   ├── errors/
│   ├── policies/
│   └── value-objects/
│
├── infrastructure/
│   └── persistence/
│       ├── prisma-member.repository.ts
│       └── member.mapper.ts
│
├── presentation/
│   ├── controllers/
│   ├── dto/
│   └── presenters/
│
└── members.module.ts
```

### `application`

Orquesta casos de uso.

Responsabilidades:

- Recibir input ya validado.
- Consultar ports.
- Aplicar reglas.
- Coordinar transacciones.
- Devolver resultados de aplicación.

No conoce HTTP.

### `domain`

Contiene reglas puras.

Responsabilidades:

- Entidades.
- Políticas.
- Estados.
- Errores del dominio.
- Value objects cuando aporten claridad.

No importa NestJS ni Prisma.

### `infrastructure`

Implementa detalles técnicos:

- Repositories Prisma.
- Mappers.
- Integraciones externas.
- Persistencia.

### `presentation`

Adapta HTTP a la aplicación:

- Controllers.
- DTOs.
- Serialización.
- Códigos HTTP.
- Swagger decorators.

### Regla pragmática

No es obligatorio crear carpetas vacías.

Un módulo comienza con la estructura mínima que necesita y se divide cuando aparecen responsabilidades reales.

## 6. Módulo de autenticación

```text
auth/
├── application/
│   ├── login/
│   ├── refresh-session/
│   ├── logout/
│   └── get-current-user/
│
├── domain/
│   ├── session/
│   └── errors/
│
├── infrastructure/
│   ├── hashing/
│   ├── tokens/
│   └── persistence/
│
├── presentation/
│   ├── controllers/
│   ├── dto/
│   ├── guards/
│   └── decorators/
│
└── auth.module.ts
```

Las implementaciones de hashing y tokens quedan detrás de interfaces o providers.

## 7. Módulo de ejercicios

```text
exercises/
├── application/
│   ├── list-exercises/
│   ├── get-exercise/
│   ├── import-exercises/
│   └── ports/
│
├── domain/
│   ├── entities/
│   ├── import-policy/
│   └── errors/
│
├── infrastructure/
│   ├── persistence/
│   └── dataset/
│       ├── parser/
│       ├── validator/
│       └── mapper/
│
├── presentation/
│   ├── controllers/
│   └── dto/
│
└── exercises.module.ts
```

El dataset externo se adapta dentro de `infrastructure/dataset`. Su formato no se propaga al dominio.

## 8. Portal administrativo

### Estructura

```text
apps/admin-portal/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/
│   │   │
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/
│   │   │   ├── members/
│   │   │   ├── trainers/
│   │   │   ├── plans/
│   │   │   ├── memberships/
│   │   │   ├── attendance/
│   │   │   ├── exercises/
│   │   │   └── routines/
│   │   │
│   │   ├── layout.tsx
│   │   ├── error.tsx
│   │   ├── loading.tsx
│   │   └── not-found.tsx
│   │
│   ├── features/
│   │   ├── auth/
│   │   ├── members/
│   │   ├── trainers/
│   │   ├── plans/
│   │   ├── memberships/
│   │   ├── attendance/
│   │   ├── exercises/
│   │   └── routines/
│   │
│   ├── components/
│   ├── lib/
│   ├── providers/
│   ├── config/
│   └── styles/
│
├── public/
└── project.json
```

### Route groups

`(auth)` y `(dashboard)` organizan layouts sin formar parte de la URL.

Esto sigue las convenciones oficiales de Next.js.

### `app`

Debe contener principalmente:

- Routing.
- Layouts.
- Pages.
- Loading states.
- Error boundaries.
- Composición de features.

Las páginas no contienen clientes HTTP ni reglas complejas.

### `features`

Cada feature agrupa:

```text
members/
├── api/
├── components/
├── hooks/
├── schemas/
├── types/
└── utils/
```

Solo se crean carpetas utilizadas.

### `components`

Contiene componentes compartidos dentro de ese portal:

- Navigation.
- Page header.
- Permission gate.
- Empty state.

Los componentes que usan ambos portales se promueven a `packages/ui`.

### `lib`

- Cliente base de API.
- Manejo de errores.
- Sesión.
- Utilidades de runtime.

No debe convertirse en una carpeta genérica sin límites.

## 9. Portal del miembro

```text
apps/member-portal/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/
│   │   │
│   │   ├── (portal)/
│   │   │   ├── home/
│   │   │   ├── profile/
│   │   │   ├── membership/
│   │   │   ├── attendance/
│   │   │   └── routines/
│   │   │
│   │   ├── layout.tsx
│   │   ├── error.tsx
│   │   └── not-found.tsx
│   │
│   ├── features/
│   │   ├── auth/
│   │   ├── profile/
│   │   ├── membership/
│   │   ├── attendance/
│   │   └── routines/
│   │
│   ├── components/
│   ├── lib/
│   ├── providers/
│   ├── config/
│   └── styles/
│
├── public/
└── project.json
```

La estructura es similar al portal administrativo, pero no se fuerza a compartir features completas entre aplicaciones.

Se comparte UI, contratos y cliente de API. La composición de pantallas permanece en cada portal.

## 10. Librería UI

```text
packages/ui/
├── src/
│   ├── components/
│   │   ├── button/
│   │   ├── input/
│   │   ├── select/
│   │   ├── dialog/
│   │   ├── table/
│   │   └── form-field/
│   │
│   ├── foundations/
│   ├── hooks/
│   ├── styles/
│   └── index.ts
│
├── .storybook/
└── project.json
```

### Puede contener

- Componentes presentacionales.
- Tokens visuales.
- Accesibilidad.
- Stories.
- Tests de interacción.

### No puede contener

- Clientes HTTP.
- Autenticación.
- Reglas de miembros.
- Estado global de una aplicación.
- Navegación específica de un portal.

## 11. Contratos

```text
packages/contracts/
├── src/
│   ├── auth/
│   ├── members/
│   ├── memberships/
│   ├── attendance/
│   ├── exercises/
│   ├── routines/
│   ├── pagination/
│   ├── errors/
│   └── index.ts
│
└── project.json
```

### Regla

Los contratos representan datos que cruzan el límite HTTP.

No deben exportar:

- Entidades de dominio.
- Modelos Prisma.
- Repositories.
- Clases internas de NestJS.

La API OpenAPI será la fuente pública verificable. Más adelante se decidirá si `api-client` se genera desde OpenAPI.

## 12. Cliente de API

Se crea cuando los primeros endpoints estén definidos.

```text
packages/api-client/
├── src/
│   ├── generated/
│   ├── client/
│   ├── errors/
│   └── index.ts
│
└── project.json
```

No debe editarse manualmente el contenido generado.

Los wrappers manuales viven fuera de `generated`.

## 13. Configuración compartida

```text
packages/config/
├── eslint/
├── typescript/
├── testing/
└── index.ts
```

Solo se crea si aparece configuración repetida que Nx no resuelve directamente.

## 14. Testing compartido

```text
packages/testing/
├── src/
│   ├── factories/
│   ├── fixtures/
│   ├── builders/
│   └── mocks/
│
└── project.json
```

Reglas:

- Solo datos ficticios.
- Factories deterministas.
- Sin credenciales reales.
- Sin depender de orden global entre pruebas.

## 15. Proyecto E2E

```text
apps/e2e/
├── src/
│   ├── admin/
│   ├── member/
│   ├── fixtures/
│   └── support/
│
├── playwright.config.ts
└── project.json
```

Se organiza por recorrido y portal, no por cada componente visual.

## 16. Herramientas e importadores

```text
tools/
├── data-import/
│   └── exercises/
│       ├── source/
│       ├── validation/
│       └── reports/
│
└── scripts/
```

El importador puede terminar como target de Nx o comando interno de la API.

Los datos descargados del dataset no deben agregarse al repositorio hasta revisar:

- Tamaño.
- Licencia.
- Necesidad real.
- Estrategia de actualización.

## 17. Documentación

```text
docs/
├── architecture/
│   ├── system-overview.md
│   ├── data-model.md
│   └── security.md
│
├── decisions/
│   ├── 0001-use-nx.md
│   ├── 0002-use-prisma.md
│   └── 0003-single-tenant-prepared.md
│
└── product/
    ├── mvp.md
    ├── permissions.md
    └── user-flows.md
```

Los documentos actuales pueden moverse a `docs/product` o `docs/architecture` una vez que el workspace esté estable.

## 18. APIs públicas de cada librería

Cada librería expone su API mediante un único punto público:

```text
src/index.ts
```

No se deben importar archivos internos con rutas profundas desde otras librerías.

Esto permite:

- Cambiar estructura interna.
- Controlar dependencias.
- Detectar acoplamiento.
- Facilitar refactors.

## 19. Tags y límites Nx

Propuesta de scopes:

```text
scope:admin
scope:member
scope:api
scope:shared
```

Propuesta de tipos:

```text
type:app
type:feature
type:ui
type:data-access
type:util
type:contracts
```

Reglas iniciales:

- `type:ui` depende solo de `type:ui` y `type:util`.
- `type:contracts` no depende de aplicaciones.
- `scope:admin` no depende de `scope:member`.
- `scope:member` no depende de `scope:admin`.
- Ambos pueden depender de `scope:shared`.
- Ningún frontend importa infraestructura de `scope:api`.

No es necesario configurar todas las reglas el primer día, pero los tags deben acompañar la creación de proyectos.

## 20. Imports

Se deben utilizar aliases del workspace para librerías:

```text
@gymflow/ui
@gymflow/contracts
@gymflow/api-client
```

Dentro de una feature se permiten imports relativos locales.

Se evitan rutas que atraviesen muchas carpetas:

```text
../../../../shared/...
```

## 21. Nombres de archivos

### React

Propuesta:

```text
member-form.tsx
member-list.tsx
use-members.ts
member.schema.ts
member.types.ts
```

### NestJS

Propuesta:

```text
members.module.ts
members.controller.ts
create-member.dto.ts
create-member.use-case.ts
member-repository.port.ts
prisma-member.repository.ts
```

### Tests

```text
member-form.test.tsx
create-member.use-case.spec.ts
members.e2e-spec.ts
```

Se utiliza una convención consistente por stack, aunque Jest y Vitest usen nombres habituales diferentes.

## 22. Qué no hacer

- Crear una librería por cada archivo.
- Crear carpetas vacías para aparentar arquitectura.
- Colocar toda la aplicación en `shared`.
- Compartir páginas completas entre portales.
- Importar Prisma desde controllers.
- Importar modelos Prisma en frontend.
- Ejecutar reglas de autorización solamente en UI.
- Crear un `utils` global sin dueño.
- Colocar reglas de negocio dentro de componentes React.
- Colocar queries SQL o Prisma dentro de casos de uso.
- Hacer globales todos los módulos NestJS.
- Añadir CQRS, eventos o microservicios antes de necesitarlos.

## 23. Estructura inicial real

Aunque el diseño final sea amplio, al comenzar solo se necesita:

```text
apps/
├── api/
├── admin-portal/
└── member-portal/

packages/
├── contracts/
└── ui/

docs/
```

Dentro de la API se crean inicialmente:

```text
auth
users
members
membership-plans
memberships
attendance
```

Ejercicios y rutinas se agregan en el segundo flujo.

## 24. Decisión final

GymFlow utilizará:

- Monorepo agrupado en `apps` y `packages`.
- Aplicaciones delgadas.
- Módulos backend por dominio.
- Capas internas pragmáticas en módulos complejos.
- Frontends organizados por rutas y features.
- UI compartida sin reglas de negocio.
- Contratos independientes de Prisma.
- Límites de dependencia controlados por Nx.
- Creación progresiva de proyectos y carpetas.

La estructura debe servir al código existente. No se crearán todas las carpetas antes de implementar su primera responsabilidad.

