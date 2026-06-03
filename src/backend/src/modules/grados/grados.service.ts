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
