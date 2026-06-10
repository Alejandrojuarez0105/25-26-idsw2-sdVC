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
import { AlumnoJwtGuard } from './alumno-jwt.guard';
import { AlumnoCalendarioService } from './alumno-calendario.service';

/**
 * Controlador de la rama Alumno. Todas las rutas están protegidas por
 * AlumnoJwtGuard, que autoriza según el rol del JWT y adjunta el alumno
 * autenticado en `request.alumno`. Funciona con cualquier usuario cuyo rol
 * sea Alumno (sin validaciones por email).
 */
@Controller('alumno')
@UseGuards(AlumnoJwtGuard)
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
