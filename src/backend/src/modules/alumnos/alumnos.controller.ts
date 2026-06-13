import { UseGuards, Controller, Get, Post, Delete, Put, Body, Param, HttpCode, HttpStatus, NotFoundException, ConflictException } from '@nestjs/common';
import { AdminJwtGuard } from '../../common/admin-jwt.guard';
import { AlumnosService } from './alumnos.service';

@UseGuards(AdminJwtGuard)
@Controller('alumnos')
export class AlumnosController {
  constructor(private readonly alumnosService: AlumnosService) {}

  @Get()
  findAll() {
    return this.alumnosService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.alumnosService.findOne(id);
    } catch (err: any) {
      throw new NotFoundException(err.message);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: any) {
    try {
      return await this.alumnosService.create(data);
    } catch (err: any) {
      throw new ConflictException(err.message);
    }
  }

  @Post('import')
  @HttpCode(HttpStatus.OK)
  async import(@Body() data: any[]) {
    return this.alumnosService.importAlumnos(data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    try {
      return await this.alumnosService.update(id, data);
    } catch (err: any) {
      if (err.message.includes('no encontrado')) {
        throw new NotFoundException(err.message);
      }
      throw new ConflictException(err.message);
    }
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
