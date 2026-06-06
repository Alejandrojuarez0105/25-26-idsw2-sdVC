import { Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param } from '@nestjs/common';
import { ExamenesService } from './examenes.service';

@Controller('examenes')
export class ExamenesController {
  constructor(private readonly examenesService: ExamenesService) {}

  @Get()
  async findAll() {
    return this.examenesService.findAll();
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
}
