import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PrismaService } from '../../common/prisma.service';

/**
 * Guard de la rama Profesor.
 *
 * Es ADITIVO: no modifica la autenticación ni el JWT existentes. Reutiliza el
 * mismo token emitido por AuthService (payload { email, sub, rol }), lo verifica
 * con el mismo secreto y autoriza EXCLUSIVAMENTE en función del rol contenido en
 * el JWT (rol === 'Profesor'). No hay validaciones por email: cualquier usuario
 * con rol Profesor es válido.
 *
 * Resuelve el Profesor asociado al usuario autenticado (Usuario 1—1 Profesor) y
 * adjunta `request.profesor` para que controladores y servicios filtren por el
 * profesor autenticado.
 */
@Injectable()
export class ProfesorJwtGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token de autenticación no proporcionado');
    }

    const token = authHeader.substring('Bearer '.length).trim();

    let payload: { sub: string; email: string; rol: string };
    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET || 'secretKey',
      });
    } catch {
      throw new UnauthorizedException('Token inválido o expirado');
    }

    if (payload.rol !== 'Profesor') {
      throw new ForbiddenException(
        'Acceso restringido al rol Profesor',
      );
    }

    const profesor = await this.prisma.profesor.findUnique({
      where: { usuarioId: payload.sub },
      include: {
        usuario: { select: { id: true, nombre: true, apellido: true, email: true } },
      },
    });

    if (!profesor) {
      throw new ForbiddenException(
        'El usuario autenticado no tiene un perfil de profesor asociado',
      );
    }

    // Adjuntar el profesor autenticado a la request para uso del controlador.
    (request as any).profesor = profesor;
    return true;
  }
}
