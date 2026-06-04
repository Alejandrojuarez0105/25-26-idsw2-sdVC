import { Module } from '@nestjs/common';
import { AsignaturasService } from './asignaturas.service';
import { AsignaturasController } from './asignaturas.controller';
import { PrismaService } from '../../common/prisma.service';

@Module({
  providers: [AsignaturasService, PrismaService],
  controllers: [AsignaturasController],
})
export class AsignaturasModule {}
