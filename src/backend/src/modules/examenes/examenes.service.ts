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
}
