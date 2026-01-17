# Medical Biochemistry Lab Management System

Sistema de gestión para laboratorios de análisis clínicos que permite administrar pacientes, órdenes médicas, autorizaciones, derivaciones a laboratorios externos, ingreso y validación de resultados, y entrega de informes.

## 🎯 Características Principales

- **Gestión de Pacientes**: Registro y administración de pacientes con separación entre paciente real y titular administrativo
- **Órdenes Médicas**: Gestión de órdenes médicas con múltiples prácticas bioquímicas
- **Autorizaciones**: Control de autorizaciones de obras sociales con soporte para autorizaciones parciales
- **Derivaciones**: Trazabilidad completa de muestras derivadas a laboratorios externos
- **Resultados**: Ingreso y validación de resultados con trazabilidad de quién ingresó y quién validó
- **Entrega de Resultados**: Gestión de entregas físicas y digitales de informes

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 16 con App Router
- **Runtime**: React 19, TypeScript
- **Base de Datos**: PostgreSQL (Neon) con Drizzle ORM
- **Autenticación**: Better Auth
- **Validación**: Zod, next-safe-action
- **UI**: shadcn/ui, Tailwind CSS, React Hook Form
- **Monitoreo**: Sentry para error tracking

## 📋 Requisitos Previos

- Node.js 18+
- pnpm
- PostgreSQL
- Variables de entorno configuradas (ver `.env.example`)

## 🚀 Instalación

1. Clonar el repositorio:

```bash
git clone <repository-url>
cd lab
```

2. Instalar dependencias:

```bash
pnpm install
```

3. Configurar variables de entorno:

```bash
cp .env.example .env
# Editar .env con tus valores
```

4. Configurar la base de datos:

```bash
pnpm db:push
```

5. Iniciar el servidor de desarrollo:

```bash
pnpm dev
```

La aplicación estará disponible en `http://localhost:3000`.

## 📁 Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js
│   ├── auth/              # Rutas de autenticación
│   ├── patients/          # Gestión de pacientes
│   ├── practices/         # Catálogo de prácticas
│   └── results/           # Gestión de resultados
├── actions/                # Server actions (next-safe-action)
├── components/             # Componentes React reutilizables
│   ├── Form/              # Componentes de formulario
│   └── ui/                 # Componentes UI (shadcn/ui)
├── lib/
│   ├── auth/              # Configuración de Better Auth
│   ├── db/                 # Configuración de Drizzle ORM
│   │   └── schema.ts       # Esquema de base de datos
│   ├── validation/         # Schemas de validación Zod
│   └── safe-action.ts      # Configuración de next-safe-action
└── config/                 # Configuraciones (Drizzle, env, etc.)
```

## 🗄️ Modelo de Datos

El sistema modela los siguientes conceptos principales del dominio:

### Entidades Principales

- **Paciente**: Persona real a la que pertenecen las muestras y resultados
- **Titular Administrativo**: Persona cuyas credenciales se usan para autorizar (puede diferir del paciente)
- **Orden Médica**: Documento con prácticas solicitadas
- **Autorización**: Comprobante que habilita el cobro de prácticas
- **Práctica**: Práctica bioquímica del catálogo
- **Muestra**: Muestra biológica con trazabilidad completa
- **Resultado**: Valores obtenidos del procesamiento
- **Validación**: Validación explícita por bioquímica
- **Entrega**: Entrega de resultados al paciente

### Invariantes del Dominio

1. **Ninguna práctica es facturable sin autorización válida**
2. **Toda práctica derivada debe existir administrativamente a nombre del titular**
3. **Los resultados siempre están a nombre del paciente real, no del titular administrativo**
4. **Toda muestra debe ser trazable (dónde se procesó, identificador externo)**
5. **Un informe solo se entrega si todas las prácticas tienen resultados validados**

## 🔐 Autenticación

El sistema utiliza Better Auth para la autenticación. Actualmente soporta:

- Autenticación por email y contraseña
- Sesiones seguras con cookies HTTP-only

## 📝 Scripts Disponibles

- `pnpm dev`: Inicia el servidor de desarrollo
- `pnpm build`: Construye la aplicación para producción
- `pnpm start`: Inicia el servidor de producción
- `pnpm lint`: Ejecuta el linter
- `pnpm db:push`: Sincroniza el esquema con la base de datos
- `pnpm db:studio`: Abre Drizzle Studio para explorar la base de datos

## 🧪 Desarrollo

### Convenciones de Código

- **Server Actions**: Usar `next-safe-action` con validación Zod
- **Queries**: Preferir la API relacional de Drizzle (`db.query.*.findMany()`)
- **Formularios**: React Hook Form con validación Zod
- **Manejo de Errores**: Logging a Sentry, mensajes amigables al usuario

### Mejores Prácticas

- Priorizar componentes Server cuando no se necesita interactividad
- Validación tanto en cliente (UX) como en servidor (seguridad)
- Nunca fallar silenciosamente - siempre mostrar feedback al usuario
- Mantener trazabilidad completa de todas las operaciones críticas

## 📚 Documentación Adicional

- [Requisitos del Dominio](.cursor/rules/domain-requirements.mdc): Documentación detallada de la lógica de negocio
- [Instrucciones de Desarrollo](.cursor/rules/instructions.mdc): Guías de desarrollo y patrones
- [Mejores Prácticas Next.js](.cursor/rules/rules.mdc): Patrones y anti-patrones de Next.js

## 🚧 Estado del Proyecto

El sistema está en desarrollo activo. Funcionalidades planificadas:

- [ ] Control de acceso basado en roles (RBAC)
- [ ] GUI para gestión del catálogo de prácticas
- [ ] Automatización de autorizaciones con plataformas externas
- [ ] Integración con sistemas de laboratorios externos
- [ ] Reportes financieros y analíticos
- [ ] Notificaciones automáticas a pacientes
