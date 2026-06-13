import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtRolesGuard } from '../../common/jwt-roles.guard';
import { Roles } from '../../common/roles.decorator';
import { ProfesorResolverGuard } from './profesor-resolver.guard';
import { ProfesorCalendarioService } from './profesor-calendario.service';
import { IncidenciasService } from './incidencias.service';
import { CrearIncidenciaDto } from './dto/crear-incidencia.dto';

/**
 * Controlador de la rama Profesor. Todas las rutas exigen rol Profesor:
 * JwtRolesGuard verifica el JWT y el rol (vía @Roles) y ProfesorResolverGuard
 * adjunta el profesor autenticado en `request.profesor`. Funciona con cualquier
 * usuario cuyo rol sea Profesor (sin validaciones por email).
 */
@Controller('profesor')
@UseGuards(JwtRolesGuard, ProfesorResolverGuard)
@Roles('Profesor')
export class ProfesorController {
  constructor(
    private readonly calendarioService: ProfesorCalendarioService,
    private readonly incidenciasService: IncidenciasService,
  ) {}

  private profesorId(req: Request): string {
    return (req as any).profesor.id as string;
  }

  // --- consultarCalendario ---
  @Get('calendario')
  async consultarCalendario(@Req() req: Request) {
    try {
      return await this.calendarioService.consultarCalendario(this.profesorId(req));
    } catch (err: any) {
      throw new InternalServerErrorException(
        err?.message || 'Error al consultar el calendario del profesor',
      );
    }
  }

  // --- descargarCalendario ---
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
        await this.calendarioService.descargarCalendario(this.profesorId(req), opts);
      res.set({
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      });
      res.send(content);
    } catch (err: any) {
      throw new InternalServerErrorException(
        err?.message || 'Error al descargar el calendario del profesor',
      );
    }
  }

  // --- comunicarIncidenciaHorario (registro) ---
  @Post('incidencias')
  @HttpCode(HttpStatus.CREATED)
  async crearIncidencia(@Req() req: Request, @Body() dto: CrearIncidenciaDto) {
    return this.incidenciasService.crear(this.profesorId(req), dto);
  }

  // --- comunicarIncidenciaHorario (listado) ---
  @Get('incidencias')
  async listarIncidencias(@Req() req: Request) {
    try {
      return await this.incidenciasService.listar(this.profesorId(req));
    } catch (err: any) {
      throw new InternalServerErrorException(
        err?.message || 'Error al obtener las incidencias del profesor',
      );
    }
  }
}
