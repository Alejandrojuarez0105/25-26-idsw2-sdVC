import { Controller, Get, Delete, Param, HttpCode, HttpStatus, NotFoundException } from '@nestjs/common';
import { GradosService } from './grados.service';

@Controller('grados')
export class GradosController {
  constructor(private readonly gradosService: GradosService) {}

  @Get()
  findAll() {
    return this.gradosService.findAll();
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    const result = await this.gradosService.remove(id);
    if (!result) {
      throw new NotFoundException(`Grado con ID ${id} no encontrado`);
    }
    return result;
  }
}
