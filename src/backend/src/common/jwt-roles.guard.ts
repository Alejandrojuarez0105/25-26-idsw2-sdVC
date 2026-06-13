import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ROLES_KEY } from './roles.decorator';

/**
 * Guard de autorización UNIFICADO para toda la API.
 *
 * Centraliza en un único punto la lógica que antes estaba triplicada en los
 * guards de Administrador, Profesor y Alumno: extraer el Bearer token, verificar
 * el JWT con el mismo secreto que emite AuthService (payload { email, sub, rol })
 * y autorizar EXCLUSIVAMENTE en función del rol del JWT. Los roles permitidos se
 * declaran por controlador/handler con `@Roles(...)` y se leen vía Reflector.
 *
 * Instancia su propio JwtService (no por inyección) para poder aplicarse con
 * `@UseGuards(JwtRolesGuard)` en cualquier módulo sin tener que registrar
 * JwtModule. Adjunta `request.user = payload` para uso posterior (p. ej. la
 * resolución de la entidad de dominio en las ramas Profesor/Alumno).
 */
@Injectable()
export class JwtRolesGuard implements CanActivate {
  private readonly jwt = new JwtService();
  private readonly secret = process.env.JWT_SECRET || 'secretKey';

  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const rolesPermitidos = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token de autenticación no proporcionado');
    }

    const token = authHeader.substring('Bearer '.length).trim();

    let payload: { sub: string; email: string; rol: string };
    try {
      payload = this.jwt.verify(token, { secret: this.secret });
    } catch {
      throw new UnauthorizedException('Token inválido o expirado');
    }

    if (
      rolesPermitidos &&
      rolesPermitidos.length > 0 &&
      !rolesPermitidos.includes(payload.rol)
    ) {
      throw new ForbiddenException(
        `Acceso restringido a: ${rolesPermitidos.join(', ')}`,
      );
    }

    (request as any).user = payload;
    return true;
  }
}
