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
 * Guard de la rama Alumno.
 *
 * Es ADITIVO: no modifica la autenticación ni el JWT existentes. Reutiliza el
 * mismo token emitido por AuthService (payload { email, sub, rol }), lo verifica
 * con el mismo secreto y autoriza EXCLUSIVAMENTE en función del rol contenido en
 * el JWT (rol === 'Alumno'). No hay validaciones por email: cualquier usuario
 * con rol Alumno es válido (soporte multiusuario por rol).
 *
 * Resuelve el Alumno asociado al usuario autenticado (Usuario 1—1 Alumno) y
 * adjunta `request.alumno` para que controladores y servicios filtren por el
 * alumno autenticado (sus asignaturas matriculadas).
 */
@Injectable()
export class AlumnoJwtGuard implements CanActivate {
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

    if (payload.rol !== 'Alumno') {
      throw new ForbiddenException('Acceso restringido al rol Alumno');
    }

    const alumno = await this.prisma.alumno.findUnique({
      where: { usuarioId: payload.sub },
      include: {
        usuario: { select: { id: true, nombre: true, apellido: true, email: true } },
      },
    });

    if (!alumno) {
      throw new ForbiddenException(
        'El usuario autenticado no tiene un perfil de alumno asociado',
      );
    }

    // Adjuntar el alumno autenticado a la request para uso del controlador.
    (request as any).alumno = alumno;
    return true;
  }
}
