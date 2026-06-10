import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AlumnoController } from './alumno.controller';
import { AlumnoCalendarioService } from './alumno-calendario.service';
import { AlumnoJwtGuard } from './alumno-jwt.guard';
import { PrismaService } from '../../common/prisma.service';
import { ExamenesModule } from '../examenes/examenes.module';

/**
 * Módulo de la rama Alumno (aditivo). Reutiliza ExamenesModule (que exporta
 * ExamenesService) para el calendario y registra JwtModule con el MISMO secreto
 * de autenticación para verificar el token ya emitido por AuthService.
 * No duplica lógica de calendario ni introduce entidades nuevas.
 */
@Module({
  imports: [
    ExamenesModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '8h' },
    }),
  ],
  controllers: [AlumnoController],
  providers: [AlumnoCalendarioService, AlumnoJwtGuard, PrismaService],
})
export class AlumnoModule {}
