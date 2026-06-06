import { Controller, Get } from '@nestjs/common';
import { ExamenesService } from './examenes.service';

@Controller('examenes')
export class ExamenesController {
  constructor(private readonly examenesService: ExamenesService) {}

  @Get()
  async findAll() {
    return this.examenesService.findAll();
  }
}
