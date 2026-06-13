import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../../common/prisma.service';

/**
 * Resolutor de la entidad Alumno (enriquecimiento de la request).
 *
 * La autorización —verificación del JWT y comprobación del rol— la realiza
 * JwtRolesGuard, que se ejecuta ANTES y deja `request.user` con el payload del
 * token. Este guard NO contiene lógica de seguridad: se limita a resolver el
 * Alumno asociado al usuario autenticado (Usuario 1—1 Alumno) y a adjuntar
 * `request.alumno`, para que controladores y servicios filtren por el alumno
 * autenticado (sus asignaturas matriculadas). Debe usarse SIEMPRE después de
 * JwtRolesGuard: `@UseGuards(JwtRolesGuard, AlumnoResolverGuard) @Roles('Alumno')`.
 */
@Injectable()
export class AlumnoResolverGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = (request as any).user as { sub: string } | undefined;

    if (!user || !user.sub) {
      throw new UnauthorizedException('Sesión no autenticada');
    }

    const alumno = await this.prisma.alumno.findUnique({
      where: { usuarioId: user.sub },
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
