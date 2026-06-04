import { Controller, Get } from '@nestjs/common';
import { AsignaturasService } from './asignaturas.service';

@Controller('asignaturas')
export class AsignaturasController {
  constructor(private readonly asignaturasService: AsignaturasService) {}

  @Get()
  findAll() {
    return this.asignaturasService.findAll();
  }
}
