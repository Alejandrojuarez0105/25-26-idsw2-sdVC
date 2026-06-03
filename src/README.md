# Davidario - Implementación

Este directorio contiene el código fuente del sistema de gestión de exámenes **Davidario**, organizado en una arquitectura desacoplada de Frontend y Backend.

## Stack Tecnológico
- **Frontend**: React + TypeScript + Vite
- **Backend**: NestJS + TypeScript + Prisma ORM
- **Base de Datos**: PostgreSQL 16

## Estructura del Proyecto
- `backend/`: API REST construida con NestJS.
- `frontend/`: Aplicación Single Page (SPA) construida con React.
- `database-setup.sql`: Scripts iniciales para PostgreSQL.

## Instrucciones de Ejecución Local

### 1. Base de Datos (PostgreSQL)
1. Abrir pgAdmin 4 o su cliente preferido.
2. Crear una base de datos llamada `davidario`.
3. Ejecutar el script `database-setup.sql` para crear la tabla de usuarios inicial.

### 2. Backend (NestJS)
1. Navegar a `src/backend`.
2. Instalar dependencias: `npm install`.
3. Configurar el archivo `.env` con las credenciales de su base de datos local.
4. Generar el cliente de Prisma: `npm run prisma:generate`.
5. Iniciar el servidor: `npm run start:dev`.

### 3. Frontend (React)
1. Navegar a `src/frontend`.
2. Instalar dependencias: `npm install`.
3. Iniciar la aplicación: `npm run dev`.
4. Acceder a `http://localhost:5173`.

## Casos de Uso Implementados
- **iniciarSesion()**: Flujo completo de autenticación con JWT y redirección por rol (Admin, Profesor, Alumno).
