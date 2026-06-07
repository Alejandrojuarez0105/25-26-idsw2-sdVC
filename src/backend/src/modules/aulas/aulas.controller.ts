import { Controller, Get, Post, Delete, Body, Param, HttpCode, HttpStatus, ConflictException, NotFoundException, Put } from '@nestjs/common';
import { AulasService } from './aulas.service';

@Controller('aulas')
export class AulasController {
  constructor(private readonly aulasService: AulasService) {}

  @Get()
  findAll() {
    return this.aulasService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const aula = await this.aulasService.findOne(id);
    if (!aula) {
      throw new NotFoundException(`Aula con ID ${id} no encontrada`);
    }
    return aula;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: any) {
    try {
      return await this.aulasService.create(data);
    } catch (err: any) {
      throw new ConflictException(err.message);
    }
  }

  @Post('import')
  @HttpCode(HttpStatus.OK)
  async import(@Body() data: any[]) {
    return this.aulasService.createMany(data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    try {
      return await this.aulasService.update(id, data);
    } catch (err: any) {
      if (err.message.includes('no encontrada')) {
        throw new NotFoundException(err.message);
      }
      throw new ConflictException(err.message);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.aulasService.remove(id);
  }
}
