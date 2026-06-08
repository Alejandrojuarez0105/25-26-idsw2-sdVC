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

  async findConflictos() {
    const examenes = await this.prisma.examen.findMany({
      orderBy: { fecha: 'asc' },
    });

    const formatFecha = (d: Date) => {
      const day = String(d.getUTCDate()).padStart(2, '0');
      const month = String(d.getUTCMonth() + 1).padStart(2, '0');
      const year = d.getUTCFullYear();
      return `${year}-${month}-${day}`;
    };

    const serializeExamen = (e: any) => ({
      id: e.id,
      codigo: e.codigo,
      asignatura: e.asignatura,
      fecha: formatFecha(new Date(e.fecha)),
      hora: e.hora,
      aula: e.aula,
      profesor: e.profesor,
    });

    const conflictos: any[] = [];
    let nextId = 1;

    // 1) Conflictos de PROFESOR — mismo profesor, misma fecha, misma hora
    const groupsProfesor = new Map<string, any[]>();
    for (const ex of examenes) {
      if (!ex.profesor || ex.profesor.trim() === '') continue;
      const key = `${ex.profesor.trim().toLowerCase()}|${formatFecha(new Date(ex.fecha))}|${ex.hora}`;
      if (!groupsProfesor.has(key)) groupsProfesor.set(key, []);
      groupsProfesor.get(key)!.push(ex);
    }
    for (const [, group] of groupsProfesor) {
      if (group.length >= 2) {
        const fecha = formatFecha(new Date(group[0].fecha));
        const profesor = group[0].profesor;
        conflictos.push({
          id: nextId++,
          tipo: 'Profesor',
          detalle: `${profesor} - ${group.length} exámenes a las ${group[0].hora}`,
          estado: 'Pendiente',
          examenes: group.map(serializeExamen),
          fecha,
          hora: group[0].hora,
          estudiantesAfectados: 0,
        });
      }
    }

    // 2) Conflictos de AULA — misma aula, misma fecha, misma hora
    const groupsAula = new Map<string, any[]>();
    for (const ex of examenes) {
      if (!ex.aula || ex.aula.trim() === '') continue;
      const key = `${ex.aula.trim().toLowerCase()}|${formatFecha(new Date(ex.fecha))}|${ex.hora}`;
      if (!groupsAula.has(key)) groupsAula.set(key, []);
      groupsAula.get(key)!.push(ex);
    }
    for (const [, group] of groupsAula) {
      if (group.length >= 2) {
        const fecha = formatFecha(new Date(group[0].fecha));
        conflictos.push({
          id: nextId++,
          tipo: 'Aula',
          detalle: `Aula ${group[0].aula} usada por ${group.length} exámenes`,
          estado: 'Pendiente',
          examenes: group.map(serializeExamen),
          fecha,
          hora: group[0].hora,
          estudiantesAfectados: 0,
        });
      }
    }

    // 3) Conflictos de ESTUDIANTE — alumnos matriculados en asignaturas con exámenes simultáneos
    const slotMap = new Map<string, any[]>();
    for (const ex of examenes) {
      const key = `${formatFecha(new Date(ex.fecha))}|${ex.hora}`;
      if (!slotMap.has(key)) slotMap.set(key, []);
      slotMap.get(key)!.push(ex);
    }

    const asignaturasCache = await this.prisma.asignatura.findMany({
      select: { id: true, nombre: true, codigo: true },
    });
    const resolveAsignaturaId = (nombreOcodigo: string) => {
      const target = (nombreOcodigo || '').trim().toLowerCase();
      const match = asignaturasCache.find(
        a => a.nombre.toLowerCase() === target || a.codigo.toLowerCase() === target
      );
      return match?.id || null;
    };

    for (const [, slotExamenes] of slotMap) {
      if (slotExamenes.length < 2) continue;

      const asignaturaIds = slotExamenes
        .map(e => resolveAsignaturaId(e.asignatura))
        .filter((x): x is string => !!x);
      if (asignaturaIds.length < 2) continue;

      const matriculas = await this.prisma.matricula.findMany({
        where: { asignaturaId: { in: asignaturaIds } },
        select: { alumnoId: true, asignaturaId: true },
      });

      const alumnoToAsigs = new Map<string, Set<string>>();
      for (const m of matriculas) {
        if (!alumnoToAsigs.has(m.alumnoId)) alumnoToAsigs.set(m.alumnoId, new Set());
        alumnoToAsigs.get(m.alumnoId)!.add(m.asignaturaId);
      }

      const afectados = Array.from(alumnoToAsigs.values()).filter(s => s.size >= 2).length;
      if (afectados >= 1) {
        conflictos.push({
          id: nextId++,
          tipo: 'Estudiante',
          detalle: `${afectados} estudiante(s) con ${slotExamenes.length} exámenes simultáneos`,
          estado: 'Pendiente',
          examenes: slotExamenes.map(serializeExamen),
          fecha: formatFecha(new Date(slotExamenes[0].fecha)),
          hora: slotExamenes[0].hora,
          estudiantesAfectados: afectados,
        });
      }
    }

    return conflictos;
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
