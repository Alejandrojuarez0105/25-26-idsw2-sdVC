-- Davidario - Configuración Inicial de Base de Datos
-- PostgreSQL 16

-- 1. Crear base de datos
-- CREATE DATABASE davidario;

-- 2. Extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 3. Tipos ENUM
DROP TYPE IF EXISTS "RolUsuario" CASCADE;
DROP TYPE IF EXISTS rol_usuario CASCADE;
CREATE TYPE "RolUsuario" AS ENUM ('Admin', 'Profesor', 'Alumno');

-- Limpieza (Opcional, para ejecución limpia)
DROP TABLE IF EXISTS "Nota" CASCADE;
DROP TABLE IF EXISTS "Matricula" CASCADE;
DROP TABLE IF EXISTS "ProfesorAsignatura" CASCADE;
DROP TABLE IF EXISTS "Alumno" CASCADE;
DROP TABLE IF EXISTS "Profesor" CASCADE;
DROP TABLE IF EXISTS "Asignatura" CASCADE;
DROP TABLE IF EXISTS "Examen" CASCADE;
DROP TABLE IF EXISTS "Aula" CASCADE;
DROP TABLE IF EXISTS "CursoAcademico" CASCADE;
DROP TABLE IF EXISTS "Usuario" CASCADE;
DROP TABLE IF EXISTS "Grado" CASCADE;

-- 4. Tabla de Usuarios (Mínima para iniciar sesión)
CREATE TABLE "Usuario" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "nombre" VARCHAR(50) NOT NULL,
    "apellido" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) UNIQUE NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "rol" "RolUsuario" NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT TRUE,
    "fechaCreacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. Datos Iniciales de Usuarios (Passwords hasheados con Bcrypt - 'admin123')
INSERT INTO "Usuario" ("nombre", "apellido", "email", "password", "rol")
VALUES 
('Administrador', 'Sistema', 'admin@davidario.edu', '$2b$10$KIXQ1Q9l9y0z2z8b7h6Y7e9pQG9v1Q8kG0mZxQJQZ8q8q8q8q8q8q', 'Admin'),
('Profesor', 'Demo', 'profesor@davidario.edu', '$2b$10$Zx8mQ9pL2k8v7n6b5c4d3e2r1t0y9u8i7o6p5a4s3d2f1g0h9j8k7', 'Profesor'),
('Alumno', 'Demo', 'alumno@davidario.edu', '$2b$10$A1b2C3d4E5f6G7h8I9j0K1l2M3n4O5p6Q7r8S9t0U1v2W3x4Y5z6', 'Alumno');

UPDATE "Usuario"
SET "password" = '$2b$10$e.3wJxLWkl99ENbCV7/QK.ZN5A9EN4hMnhrcctM.mPF5GFEKM8aMy'
WHERE "email" = 'admin@davidario.edu';

UPDATE "Usuario"
SET "password" = '$2b$10$S64kLshjsy/hR4L9CZ0yFeoxjbXdH.xiKUkHGxtQ.8fnsu3Q/l3y.'
WHERE "email" = 'profesor@davidario.edu';

UPDATE "Usuario"
SET "password" = '$2b$10$PmyAFmUANTVN6COebCjheeFe/DzV7tuk1aM8.YA85HE925Q2dPtqq'
WHERE "email" = 'alumno@davidario.edu';

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

-- 10. Tabla de Exámenes
CREATE TABLE "Examen" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "codigo" VARCHAR(20) UNIQUE NOT NULL,
    "asignatura" VARCHAR(100) NOT NULL,
    "fecha" DATE NOT NULL,
    "hora" VARCHAR(5) NOT NULL,
    "aula" VARCHAR(50) NOT NULL,
    "profesor" VARCHAR(100) NOT NULL,
    "fechaCreacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 11. Datos Iniciales de Exámenes
INSERT INTO "Examen"("codigo","asignatura","fecha","hora","aula","profesor")
VALUES('EX001','Programación I','2026-01-15','08:30','-2.6','Manuel Masías'),
('EX002','Bases de Datos I','2026-01-16','11:30','-2.2','Lázaro Hernández'),
('EX003','Estructuras de Datos I','2026-01-19','14:30','-2.4','Manuel Masías'),
('EX004','Expresión Gráfica','2026-01-20','17:30','1.2','Carlos Galiano');

-- Nota: Los usuarios y grados iniciales se usan para pruebas locales.
-- Los passwords deben mantenerse sincronizados con el script de seed de backend.

-- 12. Tabla de Aulas
CREATE TABLE "Aula" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "codigo" VARCHAR(20) UNIQUE NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "capacidad" INT NOT NULL CHECK ("capacidad" > 0),
    "ubicacion" VARCHAR(100) NOT NULL,
    "fechaCreacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 13. Datos Iniciales de Aulas
INSERT INTO "Aula"("codigo","nombre","capacidad","ubicacion")
VALUES('-2.6','Laboratorio -2.6',30,'Planta -2'),
('-2.2','Aula Magna',150,'Planta -2'),
('-2.4','Aula Informática -2.4',40,'Planta -2'),
('1.2','Aula 1.2',60,'Planta 1');

-- 14. Tabla de Alumnos
CREATE TABLE IF NOT EXISTS "Alumno" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "usuarioId" UUID NOT NULL UNIQUE REFERENCES "Usuario"("id") ON DELETE CASCADE,
    "matricula" VARCHAR(20) UNIQUE NOT NULL,
    "gradoId" UUID NOT NULL REFERENCES "Grado"("id")
);

-- 15. Datos Iniciales de Alumnos
INSERT INTO "Usuario"
("nombre", "apellido", "email", "password", "rol")
VALUES
(
  'Ana',
  'García López',
  'ana.garcia@alumnos.uneatlantico.es',
  '$2b$10$z0h.Nl4czmUaQRxlFaCReeNUbXNJ2Iq7rXRmg4.VU8jhD50jsKfFC',
  'Alumno'
)
ON CONFLICT (email) DO NOTHING;

INSERT INTO "Usuario"
("nombre", "apellido", "email", "password", "rol")
VALUES
(
  'Carlos',
  'Martín Ruiz',
  'carlos.martin@alumnos.uneatlantico.es',
  '$2b$10$zkmRwRMCbv8VSNWUm0tQGeDJJkfk5JD.Dh5EuyyW0.oNDeM2z8gP6',
  'Alumno'
)
ON CONFLICT (email) DO NOTHING;

INSERT INTO "Usuario"
("nombre", "apellido", "email", "password", "rol")
VALUES
(
  'Laura',
  'Sánchez Pérez',
  'laura.sanchez@alumnos.uneatlantico.es',
  '$2b$10$rzONB9TpBYIiDkmDuPmbsO7.3iGFwc6qyB64ZFvj5okow/J6fjGA.',
  'Alumno'
)
ON CONFLICT (email) DO NOTHING;

INSERT INTO "Usuario"
("nombre", "apellido", "email", "password", "rol")
VALUES
(
  'Alumno',
  'Demo',
  'alumno@davidario.edu',
  '$2b$10$YSacLgcTppKBzdh.6nhnc.qIF96l9TiGJM.uO.l5mZR45wVmMZvzC',
  'Alumno'
)
ON CONFLICT (email) DO NOTHING;

UPDATE "Usuario"
SET "password" = '$2b$10$engewKhyK1uBwfDigkNir.GgJDKIjmZtKllXEhN7RU8EwhfzrEJcK'
WHERE "email" = 'ana.garcia@alumnos.uneatlantico.es';

UPDATE "Usuario"
SET "password" = '$2b$10$1IE3ZPGxH5NEkL1/xEpYkudIr0n0O8BXmbT97yKAdzIVKVF7/M0mO'
WHERE "email" = 'carlos.martin@alumnos.uneatlantico.es';

UPDATE "Usuario"
SET "password" = '$2b$10$17T8rvklhmb3drktB/VL0ex0SS5rOe6CWxiyUTppBCpWSp/y8gP/G'
WHERE "email" = 'laura.sanchez@alumnos.uneatlantico.es';

UPDATE "Usuario"
SET "password" = '$2b$10$3/HJWpVXUCv13nUcFBq6Deo7p7Y6ULjtjpHVS8zj5dIyfidK7xDmy'
WHERE "email" = 'alumno@davidario.edu';

-- 16. Insertar alumnos

INSERT INTO "Alumno" ("usuarioId", "matricula", "gradoId")
SELECT u.id, 'AL001234', g.id
FROM "Usuario" u, "Grado" g
WHERE u.email = 'ana.garcia@alumnos.uneatlantico.es' AND g.codigo = 'INF';

INSERT INTO "Alumno" ("usuarioId", "matricula", "gradoId")
SELECT u.id, 'AL002345', g.id
FROM "Usuario" u, "Grado" g
WHERE u.email = 'carlos.martin@alumnos.uneatlantico.es' AND g.codigo = 'ADE';

INSERT INTO "Alumno" ("usuarioId", "matricula", "gradoId")
SELECT u.id, 'AL003456', g.id
FROM "Usuario" u, "Grado" g
WHERE u.email = 'laura.sanchez@alumnos.uneatlantico.es' AND g.codigo = 'INF';

INSERT INTO "Alumno" ("usuarioId", "matricula", "gradoId")
SELECT u.id, 'AL000001', g.id
FROM "Usuario" u, "Grado" g
WHERE u.email = 'alumno@davidario.edu' AND g.codigo = 'INF';