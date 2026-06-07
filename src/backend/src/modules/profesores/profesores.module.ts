import { Module } from '@nestjs/common';
import { ProfesoresService } from './profesores.service';
import { ProfesoresController } from './profesores.controller';
import { PrismaService } from '../../common/prisma.service';

@Module({
  providers: [ProfesoresService, PrismaService],
  controllers: [ProfesoresController],
})
export class ProfesoresModule {}
