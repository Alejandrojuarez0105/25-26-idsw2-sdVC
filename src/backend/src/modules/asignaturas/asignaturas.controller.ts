import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
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

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: any) {
    try {
      return await this.asignaturasService.create(data);
    } catch (err) {
      throw new ConflictException(err.message);
    }
  }

  @Post('import')
  @HttpCode(HttpStatus.OK)
  async import(@Body() data: any[]) {
    return this.asignaturasService.createMany(data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    try {
      return await this.asignaturasService.update(id, data);
    } catch (err) {
      if (err.message.includes('no encontrada')) {
        throw new NotFoundException(err.message);
      }
      throw new ConflictException(err.message);
    }
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
