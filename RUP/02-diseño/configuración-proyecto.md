# Davidario > Configuración y Scaffolding del Proyecto

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[🔍 Análisis](/RUP/01-analisis/README.md)|[📂 Diseño](/RUP/02-diseño/README.md)|**Configuración**|
> |-|-|-|-|-|

## información del artefacto
- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboration (Elaboración)
- **Disciplina**: Análisis y Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-02
- **Autor**: Gemini CLI

## Propósito
Este documento define la estructura de directorios, configuraciones iniciales y decisiones técnicas necesarias para materializar la arquitectura NestJS + React + PostgreSQL en código ejecutable. Sirve como el plano de ingeniería definitivo para iniciar la fase de Construcción.

## Filosofía de Organización
### Principios aplicados
1. **Modularidad NestJS**: Organización por módulos funcionales para encapsular responsabilidades en el backend.
2. **Componentización React**: Estructura basada en componentes y custom hooks para la reutilización de lógica en el frontend.
3. **Full-Stack TypeScript**: Compartición conceptual de tipos y interfaces entre frontend y backend para garantizar la consistencia.
4. **Persistencia Relacional**: Uso de Prisma o TypeORM para gestionar la integridad en PostgreSQL 16.
5. **Trazabilidad Absoluta**: Cada componente de código debe mapear a una clase o colaboración de diseño.

## Estructura del Proyecto (Scaffolding)

### Backend (NestJS)
```text
src/backend/
├── common/                 # Decoradores, filtros de excepción, guards e interceptores globales
├── config/                 # Configuración de variables de entorno (dotenv) y constantes
├── database/               # Esquemas (Prisma) o Migraciones (TypeORM)
├── entities/               # Modelos de dominio centralizado para el ORM
├── modules/
│   ├── auth/               # Autenticación, estrategia JWT y sesiones
│   ├── grados/             # Módulo de Grados Académicos
│   ├── asignaturas/        # Módulo de Asignaturas
│   ├── profesores/         # Gestión de Profesores y Preferencias
│   ├── aulas/              # Gestión de Espacios Físicos
│   ├── alumnos/            # Gestión de Estudiantes
│   ├── examenes/           # Gestión de Exámenes y Programación
│   ├── calendario/         # Motor de Generación y Consultas
│   └── incidencias/        # Reporte de Conflictos
├── main.ts                 # Punto de entrada de la aplicación
└── app.module.ts           # Módulo raíz que orquesta todas las dependencias
```

### Frontend (React + Vite)
```text
src/frontend/src/
├── assets/                 # Estilos globales, imágenes y recursos estáticos
├── components/             # Componentes de UI comunes y layouts compartidos
├── core/                   # Configuraciones globales, API Client e Interceptores
├── features/               # Módulos funcionales (vistas y lógica específica)
│   ├── admin/              # Vistas de gestión del Administrador
│   ├── profesor/           # Vistas de consulta e incidencias del Profesor
│   ├── alumno/             # Vistas de consulta del Alumno
│   └── auth/               # Pantallas de login y gestión de cuenta
├── hooks/                  # Custom hooks para lógica de negocio reutilizable
├── services/               # Servicios de comunicación con la API (Axios/Fetch)
├── store/                  # Gestión del estado global (Zustand/Redux/Context)
├── types/                  # Interfaces y tipos TypeScript (espejo del backend)
└── main.tsx                # Punto de entrada de React
```

## Configuraciones Técnicas Iniciales

### 1. Seguridad y Autenticación (NestJS + Passport)
- **Estrategia**: JWT (JSON Web Tokens) para sesiones stateless.
- **Hashing**: Argon2 o Bcrypt para el almacenamiento seguro de contraseñas.
- **Guards**: `@UseGuards(JwtAuthGuard, RolesGuard)` para proteger endpoints por rol.

### 2. Comunicación API (React + Axios)
- **Base URL**: Definida en archivos `.env` (VITE_API_URL).
- **Interceptores**:
    - `AuthInterceptor`: Inyecta el token Bearer en las cabeceras de cada petición.
    - `ResponseInterceptor`: Maneja centralizadamente errores 401 (logout) y notificaciones globales.

### 3. Persistencia (PostgreSQL 16)
- **ORM**: Prisma (recomendado por su tipado estático fuerte).
- **Naming Strategy**: snake_case para base de datos, camelCase para TypeScript.
- **Transacciones**: Gestionadas por el ORM para garantizar la integridad en la generación de calendarios.

## Esquema de Base de Datos Inicial (PostgreSQL)
```sql
-- ==========================================
-- EXTENSIONES
-- ==========================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- TIPOS ENUM
-- ==========================================

CREATE TYPE rol_usuario AS ENUM (
    'Admin',
    'Profesor',
    'Alumno'
);

-- ==========================================
-- FUNCIONES Y TRIGGERS
-- ==========================================

CREATE OR REPLACE FUNCTION actualizar_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW."fechaActualizacion" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- USUARIOS
-- ==========================================

CREATE TABLE "Usuario" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    "nombre" VARCHAR(50) NOT NULL,
    "apellido" VARCHAR(50) NOT NULL,

    "email" VARCHAR(100) UNIQUE NOT NULL,
    "password" VARCHAR(255) NOT NULL,

    "rol" rol_usuario NOT NULL,

    "activo" BOOLEAN NOT NULL DEFAULT TRUE,

    "fechaCreacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CHECK (POSITION('@' IN "email") > 1)
);

-- ==========================================
-- CURSOS ACADÉMICOS
-- ==========================================

CREATE TABLE "CursoAcademico" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    "nombre" VARCHAR(20) UNIQUE NOT NULL,

    "activo" BOOLEAN NOT NULL DEFAULT FALSE
);

-- ==========================================
-- GRADOS
-- ==========================================

CREATE TABLE "Grado" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    "codigo" VARCHAR(20) UNIQUE NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,

    "descripcion" TEXT,

    "fechaActualizacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_grado_actualizacion
BEFORE UPDATE ON "Grado"
FOR EACH ROW
EXECUTE FUNCTION actualizar_timestamp();

-- ==========================================
-- ASIGNATURAS
-- ==========================================

CREATE TABLE "Asignatura" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    "codigo" VARCHAR(20) UNIQUE NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,

    "creditos" INT NOT NULL
        CHECK ("creditos" > 0),

    "gradoId" UUID NOT NULL
        REFERENCES "Grado"("id")
        ON DELETE CASCADE,

    "fechaCreacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- ALUMNOS
-- ==========================================

CREATE TABLE "Alumno" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    "usuarioId" UUID UNIQUE NOT NULL
        REFERENCES "Usuario"("id")
        ON DELETE CASCADE,

    "matricula" VARCHAR(20) UNIQUE NOT NULL,

    "gradoId" UUID NOT NULL
        REFERENCES "Grado"("id")
);

-- ==========================================
-- PROFESORES
-- ==========================================

CREATE TABLE "Profesor" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    "usuarioId" UUID UNIQUE NOT NULL
        REFERENCES "Usuario"("id")
        ON DELETE CASCADE,

    "departamento" VARCHAR(100)
);

-- ==========================================
-- PROFESOR-ASIGNATURA
-- ==========================================

CREATE TABLE "ProfesorAsignatura" (
    "profesorId" UUID NOT NULL
        REFERENCES "Profesor"("id")
        ON DELETE CASCADE,

    "asignaturaId" UUID NOT NULL
        REFERENCES "Asignatura"("id")
        ON DELETE CASCADE,

    PRIMARY KEY ("profesorId", "asignaturaId")
);

-- ==========================================
-- MATRÍCULAS
-- ==========================================

CREATE TABLE "Matricula" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    "alumnoId" UUID NOT NULL
        REFERENCES "Alumno"("id")
        ON DELETE CASCADE,

    "asignaturaId" UUID NOT NULL
        REFERENCES "Asignatura"("id")
        ON DELETE CASCADE,

    "fechaMatricula" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE ("alumnoId", "asignaturaId")
);

-- ==========================================
-- NOTAS
-- ==========================================

CREATE TABLE "Nota" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    "matriculaId" UUID NOT NULL
        REFERENCES "Matricula"("id")
        ON DELETE CASCADE,

    "nota" NUMERIC(4,2)
        CHECK ("nota" >= 0 AND "nota" <= 10),

    "convocatoria" VARCHAR(20),

    "fechaRegistro" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- ÍNDICES
-- ==========================================

CREATE INDEX idx_usuario_email
ON "Usuario"("email");

CREATE INDEX idx_asignatura_grado
ON "Asignatura"("gradoId");

CREATE INDEX idx_matricula_alumno
ON "Matricula"("alumnoId");

CREATE INDEX idx_nota_matricula
ON "Nota"("matriculaId");

-- ==========================================
-- DATOS INICIALES (SEED)
-- ==========================================

INSERT INTO "Usuario"
(
    "nombre",
    "apellido",
    "email",
    "password",
    "rol"
)
VALUES
(
    'Administrador',
    'Sistema',
    'admin@davidario.edu',
    '$2b$10$hash_ejemplo_bcrypt',
    'Admin'
);

INSERT INTO "CursoAcademico"
(
    "nombre",
    "activo"
)
VALUES
(
    '2025-2026',
    TRUE
);
```

## Comandos de Desarrollo

### Backend (NestJS)
```bash
cd src/backend
npm install
npm run start:dev     # Levantar en modo watch
npm run prisma:generate # Generar cliente de base de datos
```

### Frontend (React + Vite)
```bash
cd src/frontend
npm install
npm run dev           # Levantar servidor de desarrollo (Vite)
npm run build         # Generar build de producción
```

## Mapeo de Diseño a Código (Trazabilidad)
| Artefacto UML | Archivo de Código (Path Relativo) |
|---|---|
| `Usuario (Entity)` | `src/backend/entities/usuario.entity.ts` |
| `GradoController` | `src/backend/modules/grados/grados.controller.ts` |
| `AuthService` | `src/backend/modules/auth/auth.service.ts` |
| `LoginView` | `src/frontend/src/features/auth/login/LoginView.tsx` |
| `UseAuth (Hook)` | `src/frontend/src/hooks/useAuth.ts` |
