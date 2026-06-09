import { IsNotEmpty, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

/**
 * Datos de entrada para comunicar una incidencia de horario.
 * El profesorId NO se recibe del cliente: se deriva del JWT en el guard,
 * garantizando que la incidencia se asocia siempre al profesor autenticado.
 */
export class CrearIncidenciaDto {
  @IsUUID(undefined, { message: 'El examen seleccionado no es válido' })
  @IsNotEmpty({ message: 'Debe seleccionar el examen afectado' })
  examenId: string;

  @IsString()
  @IsNotEmpty({ message: 'La descripción de la incidencia es obligatoria' })
  @MinLength(10, { message: 'La descripción debe tener al menos 10 caracteres' })
  @MaxLength(500, { message: 'La descripción no puede superar los 500 caracteres' })
  descripcion: string;
}
