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

INSERT INTO "Asignatura" ("codigo", "nombre", "creditos", "gradoId")
SELECT 'IYA003', 'Programación I', 6, id FROM "Grado" WHERE codigo = 'INF' UNION ALL
SELECT 'IYA023', 'Bases de Datos I', 6, id FROM "Grado" WHERE codigo = 'INF' UNION ALL
SELECT 'IYA025', 'Estructuras de Datos I', 6, id FROM "Grado" WHERE codigo = 'INF' UNION ALL
SELECT 'IYA016', 'Expresión Gráfica', 6, id FROM "Grado" WHERE codigo = 'ADE';

-- 9. Tabla de Profesores
DROP TABLE IF EXISTS "ProfesorAsignatura" CASCADE;
DROP TABLE IF EXISTS "Profesor" CASCADE;

CREATE TABLE "Profesor" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "usuarioId" UUID UNIQUE NOT NULL REFERENCES "Usuario"("id") ON DELETE CASCADE,
    "codigo" VARCHAR(20) UNIQUE,
    "departamento" VARCHAR(100)
);

-- 9c. Tabla de ProfesorAsignatura (Relación N:M)
CREATE TABLE "ProfesorAsignatura" (
    "profesorId" UUID NOT NULL REFERENCES "Profesor"("id") ON DELETE CASCADE,
    "asignaturaId" UUID NOT NULL REFERENCES "Asignatura"("id") ON DELETE CASCADE,
    PRIMARY KEY ("profesorId", "asignaturaId")
);

INSERT INTO "Profesor" ("usuarioId", "codigo", "departamento")
SELECT id, 'PROF000', 'Informática' FROM "Usuario" WHERE email = 'profesor@davidario.edu' UNION ALL
SELECT id, 'PROF001', 'Informática' FROM "Usuario" WHERE email = 'manuel.masias@uneatlantico.es' UNION ALL
SELECT id, 'PROF002', 'Informática' FROM "Usuario" WHERE email = 'jorge.crespo@uneatlantico.es' UNION ALL
SELECT id, 'PROF003', 'Informática' FROM "Usuario" WHERE email = 'javier.bel@uneatlantico.es' UNION ALL
SELECT id, 'PROF004', 'Informática' FROM "Usuario" WHERE email = 'daniel.iglesias@uneatlantico.es';

INSERT INTO "Usuario" ("id", "nombre", "apellido", "email", "password", "rol")
VALUES 
(uuid_generate_v4(), 'Manuel', 'Masías', 'manuel.masias@uneatlantico.es', '$2b$10$S64kLshjsy/hR4L9CZ0yFeoxjbXdH.xiKUkHGxtQ.8fnsu3Q/l3y.', 'Profesor'),
(uuid_generate_v4(), 'Jorge', 'Crespo', 'jorge.crespo@uneatlantico.es', '$2b$10$S64kLshjsy/hR4L9CZ0yFeoxjbXdH.xiKUkHGxtQ.8fnsu3Q/l3y.', 'Profesor'),
(uuid_generate_v4(), 'Javier', 'Bel', 'javier.bel@uneatlantico.es', '$2b$10$S64kLshjsy/hR4L9CZ0yFeoxjbXdH.xiKUkHGxtQ.8fnsu3Q/l3y.', 'Profesor'),
(uuid_generate_v4(), 'Daniel', 'Iglesias', 'daniel.iglesias@uneatlantico.es', '$2b$10$S64kLshjsy/hR4L9CZ0yFeoxjbXdH.xiKUkHGxtQ.8fnsu3Q/l3y.', 'Profesor')
ON CONFLICT (email) DO NOTHING;

-- Nota: La tabla "Examen" se crea tras "Aula" (Sesión 70) para poder referenciar aulaId como FK.
-- Los usuarios y grados iniciales se usan para pruebas locales.
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

-- 13b. Tabla de Exámenes (refactor Sesión 70: usa profesorId/aulaId como FKs reales)
CREATE TABLE "Examen" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "codigo" VARCHAR(20) UNIQUE NOT NULL,
    "asignatura" VARCHAR(100) NOT NULL,
    "fecha" DATE NOT NULL,
    "hora" VARCHAR(5) NOT NULL,
    "profesorId" UUID REFERENCES "Profesor"("id") ON DELETE SET NULL,
    "aulaId" UUID REFERENCES "Aula"("id") ON DELETE SET NULL,
    "fechaCreacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "Examen_profesorId_idx" ON "Examen"("profesorId");
CREATE INDEX IF NOT EXISTS "Examen_aulaId_idx" ON "Examen"("aulaId");
CREATE INDEX IF NOT EXISTS "Examen_fecha_hora_idx" ON "Examen"("fecha","hora");

-- 13c. Datos Iniciales de Exámenes (FKs resueltos por subconsultas)
INSERT INTO "Examen"("codigo","asignatura","fecha","hora","profesorId","aulaId")
SELECT 'EX001','Programación I',DATE '2026-01-15','08:30',
       (SELECT p.id FROM "Profesor" p JOIN "Usuario" u ON u.id = p."usuarioId" WHERE u.email = 'manuel.masias@uneatlantico.es'),
       (SELECT id FROM "Aula" WHERE codigo = '-2.6')
UNION ALL
SELECT 'EX002','Bases de Datos I',DATE '2026-01-16','11:30',
       NULL,
       (SELECT id FROM "Aula" WHERE codigo = '-2.2')
UNION ALL
SELECT 'EX003','Estructuras de Datos I',DATE '2026-01-19','14:30',
       (SELECT p.id FROM "Profesor" p JOIN "Usuario" u ON u.id = p."usuarioId" WHERE u.email = 'manuel.masias@uneatlantico.es'),
       (SELECT id FROM "Aula" WHERE codigo = '-2.4')
UNION ALL
SELECT 'EX004','Expresión Gráfica',DATE '2026-01-20','17:30',
       NULL,
       (SELECT id FROM "Aula" WHERE codigo = '1.2');

-- 14. Tabla de Alumnos
CREATE TABLE IF NOT EXISTS "Alumno" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "usuarioId" UUID NOT NULL UNIQUE REFERENCES "Usuario"("id") ON DELETE CASCADE,
    "matricula" VARCHAR(20) UNIQUE NOT NULL,
    "gradoId" UUID NOT NULL REFERENCES "Grado"("id"),
    "curso" VARCHAR(10) NOT NULL DEFAULT '1°'
);

-- 14b. Tabla de Matrículas
CREATE TABLE IF NOT EXISTS "Matricula" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "alumnoId" UUID NOT NULL REFERENCES "Alumno"("id") ON DELETE CASCADE,
    "asignaturaId" UUID NOT NULL REFERENCES "Asignatura"("id") ON DELETE CASCADE,
    "fechaMatricula" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE ("alumnoId", "asignaturaId")
);

-- 14c. Tabla de Notas
CREATE TABLE IF NOT EXISTS "Nota" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "matriculaId" UUID NOT NULL REFERENCES "Matricula"("id") ON DELETE CASCADE,
    "nota" DECIMAL(4, 2) NOT NULL,
    "convocatoria" VARCHAR(20),
    "fechaRegistro" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
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

INSERT INTO "Alumno" ("usuarioId", "matricula", "gradoId", "curso")
SELECT u.id, 'AL001234', g.id, '1°'
FROM "Usuario" u, "Grado" g
WHERE u.email = 'ana.garcia@alumnos.uneatlantico.es' AND g.codigo = 'INF';

INSERT INTO "Alumno" ("usuarioId", "matricula", "gradoId", "curso")
SELECT u.id, 'AL002345', g.id, '2°'
FROM "Usuario" u, "Grado" g
WHERE u.email = 'carlos.martin@alumnos.uneatlantico.es' AND g.codigo = 'ADE';

INSERT INTO "Alumno" ("usuarioId", "matricula", "gradoId", "curso")
SELECT u.id, 'AL003456', g.id, '3°'
FROM "Usuario" u, "Grado" g
WHERE u.email = 'laura.sanchez@alumnos.uneatlantico.es' AND g.codigo = 'INF';

INSERT INTO "Alumno" ("usuarioId", "matricula", "gradoId", "curso")
SELECT u.id, 'AL000001', g.id, '4°'
FROM "Usuario" u, "Grado" g
WHERE u.email = 'alumno@davidario.edu' AND g.codigo = 'INF';