import { Controller, Get, Post, Delete, Body, Param, HttpCode, HttpStatus, ConflictException } from '@nestjs/common';
import { AulasService } from './aulas.service';

@Controller('aulas')
export class AulasController {
  constructor(private readonly aulasService: AulasService) {}

  @Get()
  findAll() {
    return this.aulasService.findAll();
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

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.aulasService.remove(id);
  }
}
