import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class AulasService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.aula.findMany({
      orderBy: {
        codigo: 'asc',
      },
    });
  }

  async create(data: any) {
    const existing = await this.prisma.aula.findUnique({
      where: { codigo: data.codigo },
    });

    if (existing) {
      throw new Error(`El código ${data.codigo} ya existe.`);
    }

    return this.prisma.aula.create({
      data: {
        codigo: data.codigo,
        nombre: data.nombre,
        capacidad: parseInt(data.capacidad) || 0,
        ubicacion: data.ubicacion || '',
      },
    });
  }

  async createMany(data: any[]) {
    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (const item of data) {
      try {
        const existing = await this.prisma.aula.findUnique({
          where: { codigo: item.codigo },
        });

        if (existing) {
          results.failed++;
          results.errors.push(`El código ${item.codigo} ya existe.`);
          continue;
        }

        await this.prisma.aula.create({
          data: {
            codigo: item.codigo,
            nombre: item.nombre,
            capacidad: parseInt(item.capacidad) || 0,
            ubicacion: item.ubicacion || '',
          },
        });
        results.success++;
      } catch (err: any) {
        results.failed++;
        results.errors.push(`Error en ${item.codigo}: ${err.message}`);
      }
    }

    return results;
  }

  async remove(id: string): Promise<void> {
    const aula = await this.prisma.aula.findUnique({ where: { id } });
    if (!aula) {
      throw new NotFoundException(`Aula con ID ${id} no encontrada.`);
    }

    await this.prisma.aula.delete({ where: { id } });
  }
}
