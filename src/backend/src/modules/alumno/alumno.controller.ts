import {
  Controller,
  Get,
  InternalServerErrorException,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtRolesGuard } from '../../common/jwt-roles.guard';
import { Roles } from '../../common/roles.decorator';
import { AlumnoResolverGuard } from './alumno-resolver.guard';
import { AlumnoCalendarioService } from './alumno-calendario.service';

/**
 * Controlador de la rama Alumno. Todas las rutas exigen rol Alumno:
 * JwtRolesGuard verifica el JWT y el rol (vía @Roles) y AlumnoResolverGuard
 * adjunta el alumno autenticado en `request.alumno`. Funciona con cualquier
 * usuario cuyo rol sea Alumno (sin validaciones por email).
 */
@Controller('alumno')
@UseGuards(JwtRolesGuard, AlumnoResolverGuard)
@Roles('Alumno')
export class AlumnoController {
  constructor(private readonly calendarioService: AlumnoCalendarioService) {}

  private alumnoId(req: Request): string {
    return (req as any).alumno.id as string;
  }

  // --- consultarCalendario ---
  @Get('calendario')
  async consultarCalendario(@Req() req: Request) {
    try {
      return await this.calendarioService.consultarCalendario(this.alumnoId(req));
    } catch (err: any) {
      throw new InternalServerErrorException(
        err?.message || 'Error al consultar el calendario del alumno',
      );
    }
  }

  // --- descargarCalendarioExamenes ---
  @Get('calendario/descargar')
  async descargarCalendario(
    @Req() req: Request,
    @Query() query: any,
    @Res() res: Response,
  ) {
    try {
      const opts = {
        incluirAula: query.incluirAula !== 'false',
        incluirAsignatura: query.incluirAsignatura !== 'false',
        fechaInicio: query.fechaInicio || undefined,
        fechaFin: query.fechaFin || undefined,
        formato: query.formato === 'pdf' ? ('pdf' as const) : ('csv' as const),
      };
      const { content, filename, contentType } =
        await this.calendarioService.descargarCalendario(this.alumnoId(req), opts);
      res.set({
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      });
      res.send(content);
    } catch (err: any) {
      throw new InternalServerErrorException(
        err?.message || 'Error al descargar el calendario del alumno',
      );
    }
  }
}
