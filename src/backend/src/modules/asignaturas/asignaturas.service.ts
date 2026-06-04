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
}
