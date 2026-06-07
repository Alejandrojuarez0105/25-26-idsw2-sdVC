import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class ProfesoresService {
  constructor(private prisma: PrismaService) {}

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
}
