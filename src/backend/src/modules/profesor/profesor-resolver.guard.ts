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
 * Resolutor de la entidad Profesor (enriquecimiento de la request).
 *
 * La autorización —verificación del JWT y comprobación del rol— la realiza
 * JwtRolesGuard, que se ejecuta ANTES y deja `request.user` con el payload del
 * token. Este guard NO contiene lógica de seguridad: se limita a resolver el
 * Profesor asociado al usuario autenticado (Usuario 1—1 Profesor) y a adjuntar
 * `request.profesor`, para que controladores y servicios filtren por el profesor
 * autenticado. Debe usarse SIEMPRE después de JwtRolesGuard:
 * `@UseGuards(JwtRolesGuard, ProfesorResolverGuard) @Roles('Profesor')`.
 */
@Injectable()
export class ProfesorResolverGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = (request as any).user as { sub: string } | undefined;

    if (!user || !user.sub) {
      throw new UnauthorizedException('Sesión no autenticada');
    }

    const profesor = await this.prisma.profesor.findUnique({
      where: { usuarioId: user.sub },
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
