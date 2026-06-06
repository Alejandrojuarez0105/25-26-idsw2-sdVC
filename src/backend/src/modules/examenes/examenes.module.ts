import { Module } from '@nestjs/common';
import { ExamenesService } from './examenes.service';
import { ExamenesController } from './examenes.controller';
import { PrismaService } from '../../common/prisma.service';

@Module({
  controllers: [ExamenesController],
  providers: [ExamenesService, PrismaService],
  exports: [ExamenesService],
})
export class ExamenesModule {}
