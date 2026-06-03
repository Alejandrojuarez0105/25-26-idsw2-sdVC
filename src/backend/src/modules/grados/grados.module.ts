import { Module } from '@nestjs/common';
import { GradosService } from './grados.service';
import { GradosController } from './grados.controller';
import { PrismaService } from '../../common/prisma.service';

@Module({
  providers: [GradosService, PrismaService],
  controllers: [GradosController],
})
export class GradosModule {}
