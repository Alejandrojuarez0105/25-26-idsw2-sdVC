import { SetMetadata } from '@nestjs/common';

/** Clave de metadatos donde se almacenan los roles permitidos de un endpoint. */
export const ROLES_KEY = 'roles';

/**
 * Decorador de autorización por rol.
 *
 * Declara, a nivel de controlador o de método, qué roles del JWT pueden acceder.
 * Lo consume JwtRolesGuard mediante Reflector. La autorización se basa
 * ÚNICAMENTE en el rol contenido en el JWT (sin validaciones por email).
 *
 * Ejemplos: `@Roles('Admin')` · `@Roles('Profesor')` · `@Roles('Alumno')`.
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
