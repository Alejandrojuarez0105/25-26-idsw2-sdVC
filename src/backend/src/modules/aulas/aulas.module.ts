import { Module } from '@nestjs/common';
import { AulasController } from './aulas.controller';
import { AulasService } from './aulas.service';
import { PrismaService } from '../../common/prisma.service';

@Module({
  controllers: [AulasController],
  providers: [AulasService, PrismaService],
  exports: [AulasService],
})
export class AulasModule {}
