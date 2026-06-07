import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ProfesoresService {
  constructor(private prisma: PrismaService) {}

  async remove(id: string): Promise<void> {
    const profesor = await this.prisma.profesor.findUnique({
      where: { id },
    });

    if (!profesor) {
      throw new NotFoundException(`Profesor con ID ${id} no encontrado`);
    }

    await this.prisma.usuario.delete({
      where: { id: profesor.usuarioId },
    });
  }

  async create(data: any) {
    if (!data.nombre || !data.email) {
      throw new Error('Los campos nombre y email son obligatorios.');
    }

    const existingEmail = await this.prisma.usuario.findUnique({
      where: { email: data.email },
    });
    if (existingEmail) {
      throw new Error(`El email ${data.email} ya está registrado.`);
    }

    let codigo = (data.codigo || '').toString().trim().toUpperCase();
    if (codigo) {
      const existingCodigo = await this.prisma.profesor.findUnique({
        where: { codigo },
      });
      if (existingCodigo) {
        throw new Error(`El código ${codigo} ya existe.`);
      }
    } else {
      const next = await this.getNextCodigoSequence();
      codigo = `PROF${String(next).padStart(3, '0')}`;
    }

    const defaultPassword = await bcrypt.hash('profesor123', 10);

    let nombre = '';
    let apellido = '';
    if (data.apellido) {
      nombre = String(data.nombre).trim();
      apellido = String(data.apellido).trim();
    } else {
      const parts = String(data.nombre).trim().split(/\s+/);
      nombre = parts[0] || 'Profesor';
      apellido = parts.slice(1).join(' ') || 'Demo';
    }

    const departamento = data.departamento ? String(data.departamento).trim() : null;

    return this.prisma.$transaction(async (tx) => {
      const usuario = await tx.usuario.create({
        data: {
          nombre,
          apellido,
          email: data.email,
          password: defaultPassword,
          rol: 'Profesor',
          activo: true,
        },
      });

      const profesor = await tx.profesor.create({
        data: {
          usuarioId: usuario.id,
          codigo,
          departamento,
        },
      });

      return profesor;
    });
  }

  async findAll() {
    return this.prisma.profesor.findMany({
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
      },
    });
  }

  async importProfesores(data: any[]) {
    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };

    const defaultPassword = await bcrypt.hash('profesor123', 10);

    let nextSequence = await this.getNextCodigoSequence();

    for (const item of data) {
      try {
        if (!item.nombre || !item.email) {
          results.failed++;
          results.errors.push(`Error en registro incompleto: Faltan campos obligatorios (nombre/email).`);
          continue;
        }

        const existingUsuario = await this.prisma.usuario.findUnique({
          where: { email: item.email },
        });

        if (existingUsuario) {
          results.failed++;
          results.errors.push(`Error en ${item.email}: El correo ya está registrado.`);
          continue;
        }

        let codigo = (item.codigo || '').toString().trim().toUpperCase();
        if (codigo) {
          const existingCodigo = await this.prisma.profesor.findUnique({
            where: { codigo },
          });
          if (existingCodigo) {
            results.failed++;
            results.errors.push(`Error en ${item.email}: El código ${codigo} ya existe.`);
            continue;
          }
        } else {
          codigo = `PROF${String(nextSequence).padStart(3, '0')}`;
          nextSequence++;
        }

        let nombre = '';
        let apellido = '';
        if (item.apellido) {
          nombre = String(item.nombre).trim();
          apellido = String(item.apellido).trim();
        } else {
          const nameParts = String(item.nombre).trim().split(/\s+/);
          nombre = nameParts[0] || 'Profesor';
          apellido = nameParts.slice(1).join(' ') || 'Demo';
        }

        const departamento = item.departamento ? String(item.departamento).trim() : null;

        await this.prisma.$transaction(async (tx) => {
          const usuario = await tx.usuario.create({
            data: {
              nombre,
              apellido,
              email: item.email,
              password: defaultPassword,
              rol: 'Profesor',
              activo: true,
            },
          });

          await tx.profesor.create({
            data: {
              usuarioId: usuario.id,
              codigo,
              departamento,
            },
          });
        });

        results.success++;
      } catch (err: any) {
        results.failed++;
        results.errors.push(`Error en ${item.email || item.codigo || 'desconocido'}: ${err.message}`);
      }
    }

    return results;
  }

  private async getNextCodigoSequence(): Promise<number> {
    const profesores = await this.prisma.profesor.findMany({
      select: { codigo: true },
    });

    let max = -1;
    for (const p of profesores) {
      const match = /^PROF(\d+)$/i.exec(p.codigo || '');
      if (match) {
        const num = parseInt(match[1], 10);
        if (!isNaN(num) && num > max) {
          max = num;
        }
      }
    }

    return max + 1;
  }
}
