import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { GradosModule } from './modules/grados/grados.module';
import { AsignaturasModule } from './modules/asignaturas/asignaturas.module';
import { PrismaService } from './common/prisma.service';

@Module({
  imports: [AuthModule, GradosModule, AsignaturasModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
