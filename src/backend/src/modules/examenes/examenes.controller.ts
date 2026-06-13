import { UseGuards, Body, ConflictException, Controller, Delete, Get, HttpCode, HttpStatus, InternalServerErrorException, NotFoundException, Param, Post, Put, Query, Res } from '@nestjs/common';
import { JwtRolesGuard } from '../../common/jwt-roles.guard';
import { Roles } from '../../common/roles.decorator';
import { Response } from 'express';
import { ExamenesService } from './examenes.service';

@UseGuards(JwtRolesGuard)
@Roles('Admin')
@Controller('examenes')
export class ExamenesController {
  constructor(private readonly examenesService: ExamenesService) {}

  @Get()
  async findAll() {
    return this.examenesService.findAll();
  }

  @Get('conflictos')
  async findConflictos() {
    return this.examenesService.findConflictos();
  }

  @Get('calendario/generar')
  async generarCalendario() {
    try {
      return await this.examenesService.generarCalendario();
    } catch (err: any) {
      throw new InternalServerErrorException(
        err?.message || 'Error al generar el calendario de exámenes',
      );
    }
  }

  @Get('calendario/descargar')
  async descargarCalendario(@Query() query: any, @Res() res: Response) {
    try {
      const opts = {
        incluirAula: query.incluirAula !== 'false',
        incluirProfesor: query.incluirProfesor !== 'false',
        incluirEstudiantes: query.incluirEstudiantes !== 'false',
        fechaInicio: query.fechaInicio || undefined,
        fechaFin: query.fechaFin || undefined,
        formato: query.formato === 'pdf' ? ('pdf' as const) : ('csv' as const),
      };
      const { content, filename, contentType } =
        await this.examenesService.descargarCalendario(opts);
      res.set({
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      });
      res.send(content);
    } catch (err: any) {
      throw new InternalServerErrorException(
        err?.message || 'Error al descargar el calendario de exámenes',
      );
    }
  }

  @Get('calendario')
  async consultarCalendario() {
    try {
      return await this.examenesService.consultarCalendario();
    } catch (err: any) {
      throw new InternalServerErrorException(
        err?.message || 'Error al consultar el calendario de exámenes',
      );
    }
  }

  @Post('calendario/generar-automatico')
  @HttpCode(HttpStatus.OK)
  async generarCalendarioAutomatico(@Body() body: any) {
    try {
      return await this.examenesService.generarCalendarioAutomatico(body || {});
    } catch (err: any) {
      throw new InternalServerErrorException(
        err?.message || 'Error al generar automáticamente el calendario',
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const examen = await this.examenesService.findOne(id);
    if (!examen) {
      throw new NotFoundException(`Examen con ID ${id} no encontrado`);
    }
    return examen;
  }

  @Post()
  async create(@Body() data: any) {
    try {
      return await this.examenesService.create(data);
    } catch (err) {
      if (err.message.includes('ya existe')) {
        throw new ConflictException(err.message);
      }
      throw err;
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    try {
      const result = await this.examenesService.update(id, data);
      if (!result) {
        throw new NotFoundException(`Examen con ID ${id} no encontrado`);
      }
      return result;
    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      throw new ConflictException(err.message);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    const result = await this.examenesService.remove(id);
    if (!result) {
      throw new NotFoundException(`Examen con ID ${id} no encontrado`);
    }
    return result;
  }

  @Post(':id/asignar-profesor')
  @HttpCode(HttpStatus.OK)
  async asignarProfesor(@Param('id') id: string, @Body() data: { profesorId: string | null }) {
    try {
      return await this.examenesService.asignarProfesor(id, data?.profesorId ?? null);
    } catch (err: any) {
      throw new NotFoundException(err.message);
    }
  }
}
