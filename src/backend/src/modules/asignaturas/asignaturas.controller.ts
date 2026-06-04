import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post
} from '@nestjs/common';
import { AsignaturasService } from './asignaturas.service';

@Controller('asignaturas')
export class AsignaturasController {
  constructor(private readonly asignaturasService: AsignaturasService) {}

  @Get()
  findAll() {
    return this.asignaturasService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const asignatura = await this.asignaturasService.findOne(id);
    if (!asignatura) {
      throw new NotFoundException(`Asignatura con ID ${id} no encontrada`);
    }
    return asignatura;
  }

  @Post('import')
  @HttpCode(HttpStatus.OK)
  async import(@Body() data: any[]) {
    return this.asignaturasService.createMany(data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    const result = await this.asignaturasService.remove(id);
    if (!result) {
      throw new NotFoundException(`Asignatura con ID ${id} no encontrada`);
    }
    return result;
  }
}
