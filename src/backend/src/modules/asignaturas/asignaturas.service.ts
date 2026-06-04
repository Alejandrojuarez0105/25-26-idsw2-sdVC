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
