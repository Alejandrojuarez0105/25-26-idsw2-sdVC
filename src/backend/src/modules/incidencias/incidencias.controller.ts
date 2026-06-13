import { UseGuards,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { AdminJwtGuard } from '../../common/admin-jwt.guard';
import { Response } from 'express';
import { IncidenciasService } from '../profesor/incidencias.service';
import { CambiarEstadoDto } from './dto/cambiar-estado.dto';
import { AplicarSolucionDto } from './dto/aplicar-solucion.dto';

/**
 * Controlador de gestión de incidencias (Administrador). Reutiliza el
 * IncidenciasService existente (sin duplicar lógica) para listar todas las
 * incidencias, cambiar su estado, aplicar soluciones y exportarlas.
 * Coherente con el resto de endpoints administrativos del sistema.
 */
@UseGuards(AdminJwtGuard)
@Controller('incidencias')
export class IncidenciasController {
  constructor(private readonly incidenciasService: IncidenciasService) {}

  // Listado completo de incidencias del sistema.
  @Get()
  async listarTodas() {
    try {
      return await this.incidenciasService.listarTodas();
    } catch (err: any) {
      throw new InternalServerErrorException(
        err?.message || 'Error al listar las incidencias',
      );
    }
  }

  // Exportación de incidencias en CSV (declarado antes de cualquier ':id').
  @Get('export')
  async exportar(@Res() res: Response) {
    try {
      const { content, filename, contentType } =
        await this.incidenciasService.exportarCSV();
      res.set({
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      });
      res.send(content);
    } catch (err: any) {
      throw new InternalServerErrorException(
        err?.message || 'Error al exportar las incidencias',
      );
    }
  }

  // Cambio de estado (PENDIENTE | REVISADA | RESUELTA | OMITIDA).
  @Put(':id/estado')
  @HttpCode(HttpStatus.OK)
  async cambiarEstado(@Param('id') id: string, @Body() dto: CambiarEstadoDto) {
    return this.incidenciasService.cambiarEstado(id, dto.estado);
  }

  // Aplicar solución con mensaje del administrador (deja la incidencia RESUELTA por defecto).
  @Post(':id/solucion')
  @HttpCode(HttpStatus.OK)
  async aplicarSolucion(@Param('id') id: string, @Body() dto: AplicarSolucionDto) {
    return this.incidenciasService.aplicarSolucion(id, dto.mensaje, dto.estado);
  }
}
