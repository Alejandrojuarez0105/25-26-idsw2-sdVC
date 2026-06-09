import { Module } from '@nestjs/common';
import { IncidenciasController } from './incidencias.controller';
import { ProfesorModule } from '../profesor/profesor.module';

/**
 * Módulo de gestión de incidencias (Administrador). No duplica lógica:
 * importa ProfesorModule y reutiliza el IncidenciasService ya existente.
 */
@Module({
  imports: [ProfesorModule],
  controllers: [IncidenciasController],
})
export class IncidenciasModule {}
