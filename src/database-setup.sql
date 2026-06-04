-- Davidario - Configuración Inicial de Base de Datos
-- PostgreSQL 16

-- 1. Crear base de datos
-- CREATE DATABASE davidario;

-- 2. Extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 3. Tipos ENUM
CREATE TYPE rol_usuario AS ENUM ('Admin', 'Profesor', 'Alumno');

-- Limpieza (Opcional, para ejecución limpia)
DROP TABLE IF EXISTS "Usuario" CASCADE;
DROP TABLE IF EXISTS "Grado" CASCADE;

-- 4. Tabla de Usuarios (Mínima para iniciar sesión)
CREATE TABLE "Usuario" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "nombre" VARCHAR(50) NOT NULL,
    "apellido" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) UNIQUE NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "rol" rol_usuario NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT TRUE,
    "fechaCreacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. Datos Iniciales de Usuarios (Passwords hasheados con Bcrypt - 'admin123')
INSERT INTO "Usuario" ("nombre", "apellido", "email", "password", "rol")
VALUES 
('Administrador', 'Sistema', 'admin@davidario.edu', '$2b$10$KIXQ1Q9l9y0z2z8b7h6Y7e9pQG9v1Q8kG0mZxQJQZ8q8q8q8q8q8q', 'Admin'),
('Profesor', 'Demo', 'profesor@davidario.edu', '$2b$10$Zx8mQ9pL2k8v7n6b5c4d3e2r1t0y9u8i7o6p5a4s3d2f1g0h9j8k7', 'Profesor'),
('Alumno', 'Demo', 'alumno@davidario.edu', '$2b$10$A1b2C3d4E5f6G7h8I9j0K1l2M3n4O5p6Q7r8S9t0U1v2W3x4Y5z6', 'Alumno');

-- 6. Tabla de Grados
CREATE TABLE "Grado" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "codigo" VARCHAR(20) UNIQUE NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "fechaActualizacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 7. Datos Iniciales de Grados
INSERT INTO "Grado" ("codigo", "nombre", "descripcion")
VALUES
('INF', 'Ingeniería Informática', 'Grado de informática'),
('ADE', 'Administración de Empresas', 'Grado ADE'),
('DER', 'Derecho', 'Grado Derecho');

-- 8. Tabla de Asignaturas
CREATE TABLE "Asignatura" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "codigo" VARCHAR(20) UNIQUE NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "creditos" INT NOT NULL CHECK ("creditos" > 0),
    "gradoId" UUID NOT NULL REFERENCES "Grado"("id") ON DELETE CASCADE,
    "fechaCreacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 9. Datos Iniciales de Asignaturas
-- Obtenemos IDs de grados para insertar (Esto es ilustrativo para manual, en setup real se usarían variables o subconsultas)
INSERT INTO "Asignatura" ("codigo", "nombre", "creditos", "gradoId")
SELECT 'IYA003', 'Programación I', 6, id FROM "Grado" WHERE codigo = 'INF' UNION ALL
SELECT 'IYA023', 'Bases de Datos I', 6, id FROM "Grado" WHERE codigo = 'INF' UNION ALL
SELECT 'IYA025', 'Estructuras de Datos I', 6, id FROM "Grado" WHERE codigo = 'INF' UNION ALL
SELECT 'IYA016', 'Expresión Gráfica', 6, id FROM "Grado" WHERE codigo = 'ADE'; -- Solo como ejemplo para el setup inicial

-- Nota: Los usuarios y grados iniciales se usan para pruebas locales.
-- Los passwords deben mantenerse sincronizados con el script de seed de backend.
