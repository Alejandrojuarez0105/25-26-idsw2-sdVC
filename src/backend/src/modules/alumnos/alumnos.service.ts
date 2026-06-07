import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class AlumnosService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.alumno.findMany({
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
            activo: true,
          },
        },
        grado: {
          select: {
            id: true,
            codigo: true,
            nombre: true,
          },
        },
      },
      orderBy: {
        matricula: 'asc',
      },
    });
  }

  async remove(id: string): Promise<void> {
    const alumno = await this.prisma.alumno.findUnique({
      where: { id },
    });

    if (!alumno) {
      throw new NotFoundException(`Alumno con ID ${id} no encontrado`);
    }

    // Delete the Usuario, which will cascade delete the Alumno automatically
    await this.prisma.usuario.delete({
      where: { id: alumno.usuarioId },
    });
  }

  async importAlumnos(data: any[]) {
    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };

    const defaultPassword = await bcrypt.hash('alumno123', 10);

    for (const item of data) {
      try {
        if (!item.matricula || !item.nombre || !item.email) {
          results.failed++;
          results.errors.push(`Error en registro incompleto: Faltan campos obligatorios.`);
          continue;
        }

        // 1. Check if student already exists by matricula
        const existingAlumno = await this.prisma.alumno.findUnique({
          where: { matricula: item.matricula },
        });

        if (existingAlumno) {
          results.failed++;
          results.errors.push(`Error en ${item.matricula}: La matrícula ya existe.`);
          continue;
        }

        // 2. Check if user already exists by email
        const existingUsuario = await this.prisma.usuario.findUnique({
          where: { email: item.email },
        });

        if (existingUsuario) {
          results.failed++;
          results.errors.push(`Error en ${item.matricula}: El correo ${item.email} ya está registrado.`);
          continue;
        }

        // 3. Find grade by code
        let grado = await this.prisma.grado.findFirst({
          where: {
            OR: [
              { codigo: { equals: item.gradoCodigo, mode: 'insensitive' } },
              { nombre: { contains: item.gradoCodigo, mode: 'insensitive' } }
            ]
          }
        });

        if (!grado) {
          // Fallback to first grade
          grado = await this.prisma.grado.findFirst();
        }

        if (!grado) {
          results.failed++;
          results.errors.push(`Error en ${item.matricula}: No hay ningún grado registrado en el sistema.`);
          continue;
        }

        // 4. Split full name
        const nameParts = item.nombre.trim().split(/\s+/);
        const nombre = nameParts[0] || 'Alumno';
        const apellido = nameParts.slice(1).join(' ') || 'Demo';

        // 5. Create user and student in a Prisma transaction
        await this.prisma.$transaction(async (tx) => {
          const usuario = await tx.usuario.create({
            data: {
              nombre,
              apellido,
              email: item.email,
              password: defaultPassword,
              rol: 'Alumno',
              activo: true,
            },
          });

          await tx.alumno.create({
            data: {
              usuarioId: usuario.id,
              matricula: item.matricula,
              gradoId: grado.id,
            },
          });
        });

        results.success++;
      } catch (err: any) {
        results.failed++;
        results.errors.push(`Error en ${item.matricula || 'desconocido'}: ${err.message}`);
      }
    }

    return results;
  }
}
