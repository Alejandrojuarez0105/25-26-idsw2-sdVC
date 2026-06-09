import { IsIn, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ESTADOS_INCIDENCIA } from '../../profesor/incidencias.service';

export class AplicarSolucionDto {
  @IsString()
  @IsNotEmpty({ message: 'El mensaje de resolución es obligatorio' })
  @MinLength(5, { message: 'El mensaje debe tener al menos 5 caracteres' })
  @MaxLength(1000, { message: 'El mensaje no puede superar los 1000 caracteres' })
  mensaje: string;

  @IsOptional()
  @IsString()
  @IsIn(ESTADOS_INCIDENCIA as unknown as string[], {
    message: `Estado no válido. Valores permitidos: ${ESTADOS_INCIDENCIA.join(', ')}`,
  })
  estado?: string;
}
