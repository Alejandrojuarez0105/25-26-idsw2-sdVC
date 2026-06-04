import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class AsignaturasService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.asignatura.findMany({
      include: {
        grado: {
          select: {
            codigo: true,
            nombre: true,
          },
        },
      },
      orderBy: {
        codigo: 'asc',
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.asignatura.findUnique({
      where: { id },
      include: {
        grado: {
          select: {
            codigo: true,
            nombre: true,
          },
        },
      },
    });
  }

  async create(data: any) {
    // Validate uniqueness of code
    const existing = await this.prisma.asignatura.findUnique({
      where: { codigo: data.codigo },
    });

    if (existing) {
      throw new Error(`El código ${data.codigo} ya existe.`);
    }

    // Validate degree existence
    const grado = await this.prisma.grado.findUnique({
      where: { id: data.gradoId },
    });

    if (!grado) {
      throw new Error(`El grado seleccionado no existe.`);
    }

    return this.prisma.asignatura.create({
      data: {
        codigo: data.codigo,
        nombre: data.nombre,
        creditos: data.creditos,
        gradoId: data.gradoId,
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
        // Validate degree existence if gradoCodigo is provided
        let gradoId = item.gradoId;
        if (item.gradoCodigo) {
          const grado = await this.prisma.grado.findUnique({
            where: { codigo: item.gradoCodigo },
          });
          if (!grado) {
            results.failed++;
            results.errors.push(`Error en ${item.codigo}: El grado ${item.gradoCodigo} no existe.`);
            continue;
          }
          gradoId = grado.id;
        }

        if (!gradoId) {
          results.failed++;
          results.errors.push(`Error en ${item.codigo}: Se requiere gradoId o gradoCodigo.`);
          continue;
        }

        // Validate uniqueness of code
        const existing = await this.prisma.asignatura.findUnique({
          where: { codigo: item.codigo },
        });

        if (existing) {
          results.failed++;
          results.errors.push(`Error en ${item.codigo}: El código ya existe.`);
          continue;
        }

        await this.prisma.asignatura.create({
          data: {
            codigo: item.codigo,
            nombre: item.nombre,
            creditos: item.creditos || 6,
            gradoId: gradoId,
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

  async update(id: string, data: any) {
    const existing = await this.prisma.asignatura.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new Error(`Asignatura con ID ${id} no encontrada`);
    }

    // Validate degree existence if gradoId is provided
    if (data.gradoId) {
      const grado = await this.prisma.grado.findUnique({
        where: { id: data.gradoId },
      });
      if (!grado) {
        throw new Error(`El grado seleccionado no existe.`);
      }
    }

    return this.prisma.asignatura.update({
      where: { id },
      data: {
        nombre: data.nombre,
        creditos: data.creditos,
        gradoId: data.gradoId,
      },
    });
  }

  async remove(id: string) {
    const existing = await this.prisma.asignatura.findUnique({
      where: { id },
    });

    if (!existing) {
      return null;
    }

    return this.prisma.asignatura.delete({
      where: { id },
    });
  }
}
