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

  async findOne(id: string) {
    return this.prisma.examen.findUnique({
      where: { id },
    });
  }

  async create(data: any) {
    const existing = await this.prisma.examen.findUnique({
      where: { codigo: data.codigo },
    });

    if (existing) {
      throw new Error(`El código ${data.codigo} ya existe.`);
    }

    return this.prisma.examen.create({
      data: {
        codigo: data.codigo,
        asignatura: data.asignatura,
        fecha: new Date(data.fecha),
        hora: data.hora,
        aula: data.aula,
        profesor: data.profesor,
      },
    });
  }

  async update(id: string, data: any) {
    const existing = await this.prisma.examen.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new Error(`Examen con ID ${id} no encontrado`);
    }

    return this.prisma.examen.update({
      where: { id },
      data: {
        asignatura: data.asignatura,
        fecha: data.fecha ? new Date(data.fecha) : undefined,
        hora: data.hora,
        aula: data.aula,
        profesor: data.profesor,
      },
    });
  }

  async remove(id: string) {
    const existing = await this.prisma.examen.findUnique({
      where: { id },
    });

    if (!existing) {
      return null;
    }

    return this.prisma.examen.delete({
      where: { id },
    });
  }

  async asignarProfesor(examenId: string, profesorId: string | null) {
    const examen = await this.prisma.examen.findUnique({
      where: { id: examenId },
    });

    if (!examen) {
      throw new Error(`Examen con ID ${examenId} no encontrado`);
    }

    if (!profesorId) {
      return this.prisma.examen.update({
        where: { id: examenId },
        data: { profesor: '' },
      });
    }

    const profesor = await this.prisma.profesor.findUnique({
      where: { id: profesorId },
      include: {
        usuario: {
          select: { nombre: true, apellido: true },
        },
      },
    });

    if (!profesor) {
      throw new Error(`Profesor con ID ${profesorId} no encontrado`);
    }

    const nombreCompleto = `${profesor.usuario.nombre} ${profesor.usuario.apellido}`.trim();

    return this.prisma.examen.update({
      where: { id: examenId },
      data: { profesor: nombreCompleto },
    });
  }
}
