import { Injectable } from '@nestjs/common';
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
}
