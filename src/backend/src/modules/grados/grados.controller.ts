import { UseGuards,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { JwtRolesGuard } from '../../common/jwt-roles.guard';
import { Roles } from '../../common/roles.decorator';
import { GradosService } from './grados.service';

@UseGuards(JwtRolesGuard)
@Roles('Admin')
@Controller('grados')
export class GradosController {
  constructor(private readonly gradosService: GradosService) {}

  @Get()
  findAll() {
    return this.gradosService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const grado = await this.gradosService.findOne(id);
    if (!grado) {
      throw new NotFoundException(`Grado con ID ${id} no encontrado`);
    }
    return grado;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: any) {
    try {
      return await this.gradosService.create(data);
    } catch (err) {
      throw new ConflictException(err.message);
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    try {
      const result = await this.gradosService.update(id, data);
      return result;
    } catch (err) {
      if (err.message.includes('no encontrado')) {
        throw new NotFoundException(err.message);
      }
      throw new ConflictException(err.message);
    }
  }

  @Post('import')
  @HttpCode(HttpStatus.OK)
  async import(@Body() data: any[]) {
    return this.gradosService.createMany(data);
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
