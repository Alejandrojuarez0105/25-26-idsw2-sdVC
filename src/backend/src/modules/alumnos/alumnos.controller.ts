import { Controller, Get, Post, Delete, Body, Param, HttpCode, HttpStatus, NotFoundException } from '@nestjs/common';
import { AlumnosService } from './alumnos.service';

@Controller('alumnos')
export class AlumnosController {
  constructor(private readonly alumnosService: AlumnosService) {}

  @Get()
  findAll() {
    return this.alumnosService.findAll();
  }

  @Post('import')
  @HttpCode(HttpStatus.OK)
  async import(@Body() data: any[]) {
    return this.alumnosService.importAlumnos(data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    try {
      await this.alumnosService.remove(id);
    } catch (err: any) {
      throw new NotFoundException(err.message);
    }
  }
}
