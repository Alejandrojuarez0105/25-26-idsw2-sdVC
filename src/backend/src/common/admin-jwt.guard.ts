import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

/**
 * Guard de la API del Administrador.
 *
 * Verifica el JWT emitido por AuthService (payload { email, sub, rol }) con el
 * mismo secreto y exige `rol === 'Admin'`. Se instancia su propio JwtService (no
 * por inyección) para poder aplicarse con `@UseGuards(AdminJwtGuard)` en cualquier
 * controlador administrativo sin tener que registrar JwtModule en cada módulo.
 * Autorización basada únicamente en el rol del JWT (sin validaciones por email).
 */
@Injectable()
export class AdminJwtGuard implements CanActivate {
  private readonly jwt = new JwtService();
  private readonly secret = process.env.JWT_SECRET || 'secretKey';

  canActivate(context: ExecutionContext): boolean {
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

    if (payload.rol !== 'Admin') {
      throw new ForbiddenException('Acceso restringido al rol Administrador');
    }

    (request as any).user = payload;
    return true;
  }
}
