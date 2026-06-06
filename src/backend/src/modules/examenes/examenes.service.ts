import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class ExamenesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.examen.findMany({
      orderBy: {
        fecha: 'asc',
      },
    });
  }

  async remove(id: string) {
    const examen = await this.prisma.examen.findUnique({
      where: { id },
    });

    if (!examen) {
      return null;
    }

    return this.prisma.examen.delete({
      where: { id },
    });
  }
}
