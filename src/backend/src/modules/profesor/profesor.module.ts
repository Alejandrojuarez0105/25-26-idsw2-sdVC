import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ProfesorController } from './profesor.controller';
import { ProfesorCalendarioService } from './profesor-calendario.service';
import { IncidenciasService } from './incidencias.service';
import { ProfesorJwtGuard } from './profesor-jwt.guard';
import { PrismaService } from '../../common/prisma.service';
import { ExamenesModule } from '../examenes/examenes.module';

/**
 * Módulo de la rama Profesor (aditivo). Reutiliza ExamenesModule (que exporta
 * ExamenesService) para el calendario y registra JwtModule con el MISMO secreto
 * de autenticación para verificar el token ya emitido por AuthService.
 */
@Module({
  imports: [
    ExamenesModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '8h' },
    }),
  ],
  controllers: [ProfesorController],
  providers: [
    ProfesorCalendarioService,
    IncidenciasService,
    ProfesorJwtGuard,
    PrismaService,
  ],
})
export class ProfesorModule {}
