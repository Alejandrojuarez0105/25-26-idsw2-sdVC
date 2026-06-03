import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class GradosService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.grado.findMany({
      orderBy: {
        nombre: 'asc',
      },
    });
  }

  async create(data: any) {
    const existing = await this.prisma.grado.findUnique({
      where: { codigo: data.codigo },
    });

    if (existing) {
      throw new Error(`El código ${data.codigo} ya existe.`);
    }

    return this.prisma.grado.create({
      data: {
        codigo: data.codigo,
        nombre: data.nombre,
        descripcion: data.descripcion,
      },
    });
  }

  async createMany(data: any[]) {
    const results = {
      success: 0,
      failed: 0,
      errors: [],
    };

    for (const item of data) {
      try {
        // Validate uniqueness of code
        const existing = await this.prisma.grado.findUnique({
          where: { codigo: item.codigo },
        });

        if (existing) {
          results.failed++;
          results.errors.push(`El código ${item.codigo} ya existe.`);
          continue;
        }

        await this.prisma.grado.create({
          data: {
            codigo: item.codigo,
            nombre: item.nombre,
            descripcion: item.descripcion,
          },
        });
        results.success++;
      } catch (err) {
        results.failed++;
        results.errors.push(`Error en ${item.codigo}: ${err.message}`);
      }
    }

    return results;
  }

  async remove(id: string) {
    // Check if degree exists
    const grado = await this.prisma.grado.findUnique({
      where: { id },
    });

    if (!grado) {
      return null;
    }

    // Delete the degree (cascade delete will handle associated items if configured in Prisma)
    return this.prisma.grado.delete({
      where: { id },
    });
  }
}
