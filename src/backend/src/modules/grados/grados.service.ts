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
}
