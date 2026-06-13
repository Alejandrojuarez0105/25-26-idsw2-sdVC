import { UseGuards, Body, ConflictException, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { AdminJwtGuard } from '../../common/admin-jwt.guard';
import { ProfesoresService } from './profesores.service';

@UseGuards(AdminJwtGuard)
@Controller('profesores')
export class ProfesoresController {
  constructor(private readonly profesoresService: ProfesoresService) {}

  @Get()
  findAll() {
    return this.profesoresService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.profesoresService.findOne(id);
    } catch (err: any) {
      throw new NotFoundException(err.message);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: any) {
    try {
      return await this.profesoresService.create(data);
    } catch (err: any) {
      throw new ConflictException(err.message);
    }
  }

  @Post('import')
  @HttpCode(HttpStatus.OK)
  async import(@Body() data: any[]) {
    return this.profesoresService.importProfesores(data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    try {
      return await this.profesoresService.update(id, data);
    } catch (err: any) {
      if (err.message?.includes('no encontrado')) {
        throw new NotFoundException(err.message);
      }
      throw new ConflictException(err.message);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    try {
      await this.profesoresService.remove(id);
    } catch (err: any) {
      throw new NotFoundException(err.message);
    }
  }
}
