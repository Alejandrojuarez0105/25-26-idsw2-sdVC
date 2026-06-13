import { Module } from '@nestjs/common';
import { AlumnoController } from './alumno.controller';
import { AlumnoCalendarioService } from './alumno-calendario.service';
import { AlumnoResolverGuard } from './alumno-resolver.guard';
import { PrismaService } from '../../common/prisma.service';
import { ExamenesModule } from '../examenes/examenes.module';

/**
 * Módulo de la rama Alumno (aditivo). Reutiliza ExamenesModule (que exporta
 * ExamenesService) para el calendario. La autorización por rol la centraliza
 * JwtRolesGuard (común, autónomo: instancia su propio JwtService), por lo que
 * este módulo ya no necesita registrar JwtModule. No duplica lógica de
 * calendario ni introduce entidades nuevas.
 */
@Module({
  imports: [ExamenesModule],
  controllers: [AlumnoController],
  providers: [AlumnoCalendarioService, AlumnoResolverGuard, PrismaService],
})
export class AlumnoModule {}
