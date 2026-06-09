import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { ESTADOS_INCIDENCIA } from '../../profesor/incidencias.service';

export class CambiarEstadoDto {
  @IsString()
  @IsNotEmpty({ message: 'El estado es obligatorio' })
  @IsIn(ESTADOS_INCIDENCIA as unknown as string[], {
    message: `Estado no válido. Valores permitidos: ${ESTADOS_INCIDENCIA.join(', ')}`,
  })
  estado: string;
}
