import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import * as bcrypt from 'bcrypt';

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

  async findOne(id: string) {
    const alumno = await this.prisma.alumno.findUnique({
      where: { id },
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
        matriculas: {
          include: {
            asignatura: {
              select: {
                id: true,
                codigo: true,
                nombre: true,
              },
            },
          },
        },
      },
    });

    if (!alumno) {
      throw new NotFoundException(`Alumno con ID ${id} no encontrado`);
    }

    return alumno;
  }

  async create(data: any) {
    const existingMatricula = await this.prisma.alumno.findUnique({
      where: { matricula: data.matricula },
    });
    if (existingMatricula) {
      throw new Error(`La matrícula ${data.matricula} ya existe.`);
    }

    const existingEmail = await this.prisma.usuario.findUnique({
      where: { email: data.email },
    });
    if (existingEmail) {
      throw new Error(`El email ${data.email} ya está registrado.`);
    }

    const defaultPassword = await bcrypt.hash('alumno123', 10);
    const parts = data.nombre.trim().split(/\s+/);
    const nombre = parts[0] || 'Alumno';
    const apellido = parts.slice(1).join(' ') || 'Demo';

    return this.prisma.$transaction(async (tx) => {
      const usuario = await tx.usuario.create({
        data: {
          nombre,
          apellido,
          email: data.email,
          password: defaultPassword,
          rol: 'Alumno',
          activo: true,
        },
      });

      const alumno = await tx.alumno.create({
        data: {
          usuarioId: usuario.id,
          matricula: data.matricula,
          gradoId: data.gradoId,
          curso: data.curso || '1°',
        },
      });

      if (data.asignaturas && Array.isArray(data.asignaturas)) {
        for (const aid of data.asignaturas) {
          await tx.matricula.create({
            data: {
              alumnoId: alumno.id,
              asignaturaId: aid,
            },
          });
        }
      }

      return alumno;
    });
  }

  async update(id: string, data: any) {
    const alumno = await this.prisma.alumno.findUnique({
      where: { id },
      include: { usuario: true },
    });

    if (!alumno) {
      throw new NotFoundException(`Alumno con ID ${id} no encontrado`);
    }

    if (data.email && data.email !== alumno.usuario.email) {
      const existingEmail = await this.prisma.usuario.findUnique({
        where: { email: data.email },
      });
      if (existingEmail) {
        throw new Error(`El email ${data.email} ya está en uso por otro usuario.`);
      }
    }

    let nombre = alumno.usuario.nombre;
    let apellido = alumno.usuario.apellido;
    if (data.nombre) {
      const parts = data.nombre.trim().split(/\s+/);
      nombre = parts[0] || 'Alumno';
      apellido = parts.slice(1).join(' ') || 'Demo';
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.usuario.update({
        where: { id: alumno.usuarioId },
        data: {
          nombre,
          apellido,
          email: data.email,
        },
      });

      const updatedAlumno = await tx.alumno.update({
        where: { id },
        data: {
          gradoId: data.gradoId,
          curso: data.curso,
        },
      });

      if (data.asignaturas && Array.isArray(data.asignaturas)) {
        const newAsignaturaIds: string[] = data.asignaturas;

        const currentMatriculas = await tx.matricula.findMany({
          where: { alumnoId: id },
        });
        const currentAsignaturaIds = currentMatriculas.map(m => m.asignaturaId);

        const toDelete = currentMatriculas.filter(
          m => !newAsignaturaIds.includes(m.asignaturaId)
        );
        for (const m of toDelete) {
          await tx.matricula.delete({
            where: { id: m.id },
          });
        }

        const toAdd = newAsignaturaIds.filter(
          aid => !currentAsignaturaIds.includes(aid)
        );
        for (const aid of toAdd) {
          await tx.matricula.create({
            data: {
              alumnoId: id,
              asignaturaId: aid,
            },
          });
        }
      }

      return updatedAlumno;
    });
  }

  async remove(id: string): Promise<void> {
    const alumno = await this.prisma.alumno.findUnique({
      where: { id },
    });

    if (!alumno) {
      throw new NotFoundException(`Alumno con ID ${id} no encontrado`);
    }

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

        const existingAlumno = await this.prisma.alumno.findUnique({
          where: { matricula: item.matricula },
        });

        if (existingAlumno) {
          results.failed++;
          results.errors.push(`Error en ${item.matricula}: La matrícula ya existe.`);
          continue;
        }

        const existingUsuario = await this.prisma.usuario.findUnique({
          where: { email: item.email },
        });

        if (existingUsuario) {
          results.failed++;
          results.errors.push(`Error en ${item.matricula}: El correo ${item.email} ya está registrado.`);
          continue;
        }

        let grado = await this.prisma.grado.findFirst({
          where: {
            OR: [
              { codigo: { equals: item.grado, mode: 'insensitive' } },
              { nombre: { contains: item.grado, mode: 'insensitive' } }
            ]
          }
        });

        if (!grado) {
          grado = await this.prisma.grado.findFirst();
        }

        if (!grado) {
          results.failed++;
          results.errors.push(`Error en ${item.matricula}: No hay ningún grado registrado en el sistema.`);
          continue;
        }

        const nameParts = item.nombre.trim().split(/\s+/);
        const nombre = nameParts[0] || 'Alumno';
        const apellido = nameParts.slice(1).join(' ') || 'Demo';

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
              curso: item.curso || '1°',
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
