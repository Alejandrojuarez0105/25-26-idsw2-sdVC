import { Module } from '@nestjs/common';
import { ProfesorController } from './profesor.controller';
import { ProfesorCalendarioService } from './profesor-calendario.service';
import { IncidenciasService } from './incidencias.service';
import { ProfesorResolverGuard } from './profesor-resolver.guard';
import { PrismaService } from '../../common/prisma.service';
import { ExamenesModule } from '../examenes/examenes.module';

/**
 * Módulo de la rama Profesor (aditivo). Reutiliza ExamenesModule (que exporta
 * ExamenesService) para el calendario. La autorización por rol la centraliza
 * JwtRolesGuard (común, autónomo: instancia su propio JwtService), por lo que
 * este módulo ya no necesita registrar JwtModule.
 */
@Module({
  imports: [ExamenesModule],
  controllers: [ProfesorController],
  providers: [
    ProfesorCalendarioService,
    IncidenciasService,
    ProfesorResolverGuard,
    PrismaService,
  ],
  exports: [IncidenciasService],
})
export class ProfesorModule {}
