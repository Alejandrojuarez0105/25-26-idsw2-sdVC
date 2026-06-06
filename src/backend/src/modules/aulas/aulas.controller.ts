import { Controller, Get } from '@nestjs/common';
import { AulasService } from './aulas.service';

@Controller('aulas')
export class AulasController {
  constructor(private readonly aulasService: AulasService) {}

  @Get()
  findAll() {
    return this.aulasService.findAll();
  }
}
