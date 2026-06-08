import { Body, ConflictException, Controller, Delete, Get, HttpCode, HttpStatus, InternalServerErrorException, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { ExamenesService } from './examenes.service';

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
