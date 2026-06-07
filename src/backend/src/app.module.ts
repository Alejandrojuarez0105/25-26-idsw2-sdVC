import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { GradosModule } from './modules/grados/grados.module';
import { AsignaturasModule } from './modules/asignaturas/asignaturas.module';
import { ExamenesModule } from './modules/examenes/examenes.module';
import { AulasModule } from './modules/aulas/aulas.module';
import { AlumnosModule } from './modules/alumnos/alumnos.module';
import { PrismaService } from './common/prisma.service';

@Module({
  imports: [AuthModule, GradosModule, AsignaturasModule, ExamenesModule, AulasModule, AlumnosModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
