import { Controller, Get, UseGuards } from '@nestjs/common';
import { GradosService } from './grados.service';

@Controller('grados')
export class GradosController {
  constructor(private readonly gradosService: GradosService) {}

  @Get()
  findAll() {
    return this.gradosService.findAll();
  }
}
