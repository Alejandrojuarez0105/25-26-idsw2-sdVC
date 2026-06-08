import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

const examenInclude = {
  profesor: {
    include: {
      usuario: {
        select: { id: true, nombre: true, apellido: true, email: true },
      },
    },
  },
  aula: {
    select: { id: true, codigo: true, nombre: true, ubicacion: true, capacidad: true },
  },
} as const;

@Injectable()
export class ExamenesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.examen.findMany({
      orderBy: [{ fecha: 'asc' }, { hora: 'asc' }],
      include: examenInclude,
    });
  }

  async findOne(id: string) {
    return this.prisma.examen.findUnique({
      where: { id },
      include: examenInclude,
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
        profesorId: data.profesorId ?? null,
        aulaId: data.aulaId ?? null,
      },
      include: examenInclude,
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
        asignatura: data.asignatura ?? undefined,
        fecha: data.fecha ? new Date(data.fecha) : undefined,
        hora: data.hora ?? undefined,
        profesorId: data.profesorId === undefined ? undefined : data.profesorId,
        aulaId: data.aulaId === undefined ? undefined : data.aulaId,
      },
      include: examenInclude,
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

    if (profesorId) {
      const profesor = await this.prisma.profesor.findUnique({
        where: { id: profesorId },
      });
      if (!profesor) {
        throw new Error(`Profesor con ID ${profesorId} no encontrado`);
      }
    }

    return this.prisma.examen.update({
      where: { id: examenId },
      data: { profesorId: profesorId },
      include: examenInclude,
    });
  }

  async findConflictos() {
    const examenes = await this.prisma.examen.findMany({
      orderBy: [{ fecha: 'asc' }, { hora: 'asc' }],
      include: examenInclude,
    });

    const formatFecha = (d: Date) => {
      const day = String(d.getUTCDate()).padStart(2, '0');
      const month = String(d.getUTCMonth() + 1).padStart(2, '0');
      const year = d.getUTCFullYear();
      return `${year}-${month}-${day}`;
    };

    const nombreProfesor = (ex: any) =>
      ex.profesor?.usuario
        ? `${ex.profesor.usuario.nombre} ${ex.profesor.usuario.apellido}`.trim()
        : '';

    const codigoAula = (ex: any) => ex.aula?.codigo || '';

    const serializeExamen = (e: any) => ({
      id: e.id,
      codigo: e.codigo,
      asignatura: e.asignatura,
      fecha: formatFecha(new Date(e.fecha)),
      hora: e.hora,
      aula: codigoAula(e),
      aulaId: e.aulaId,
      profesor: nombreProfesor(e),
      profesorId: e.profesorId,
    });

    const conflictos: any[] = [];
    let nextId = 1;

    // 1) Conflicto de PROFESOR — mismo profesorId, misma fecha, misma hora
    const groupsProfesor = new Map<string, any[]>();
    for (const ex of examenes) {
      if (!ex.profesorId) continue;
      const key = `${ex.profesorId}|${formatFecha(new Date(ex.fecha))}|${ex.hora}`;
      if (!groupsProfesor.has(key)) groupsProfesor.set(key, []);
      groupsProfesor.get(key)!.push(ex);
    }
    for (const [, group] of groupsProfesor) {
      if (group.length >= 2) {
        const fecha = formatFecha(new Date(group[0].fecha));
        const profesor = nombreProfesor(group[0]);
        conflictos.push({
          id: nextId++,
          tipo: 'Profesor',
          detalle: `${profesor || 'Profesor'} - ${group.length} exámenes a las ${group[0].hora}`,
          estado: 'Pendiente',
          examenes: group.map(serializeExamen),
          fecha,
          hora: group[0].hora,
          estudiantesAfectados: 0,
        });
      }
    }

    // 2) Conflicto de AULA — misma aulaId, misma fecha, misma hora
    const groupsAula = new Map<string, any[]>();
    for (const ex of examenes) {
      if (!ex.aulaId) continue;
      const key = `${ex.aulaId}|${formatFecha(new Date(ex.fecha))}|${ex.hora}`;
      if (!groupsAula.has(key)) groupsAula.set(key, []);
      groupsAula.get(key)!.push(ex);
    }
    for (const [, group] of groupsAula) {
      if (group.length >= 2) {
        const fecha = formatFecha(new Date(group[0].fecha));
        conflictos.push({
          id: nextId++,
          tipo: 'Aula',
          detalle: `Aula ${codigoAula(group[0])} usada por ${group.length} exámenes`,
          estado: 'Pendiente',
          examenes: group.map(serializeExamen),
          fecha,
          hora: group[0].hora,
          estudiantesAfectados: 0,
        });
      }
    }

    // 3) Conflicto de ESTUDIANTE — alumnos matriculados en asignaturas con exámenes simultáneos
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

  async generarCalendario() {
    // 1) Obtener todos los exámenes registrados, ya ordenados cronológicamente,
    //    con sus relaciones reales (profesor + aula). Sin campos de texto quemados.
    const examenes = await this.prisma.examen.findMany({
      orderBy: [{ fecha: 'asc' }, { hora: 'asc' }],
      include: examenInclude,
    });

    // 2) Validar conflictos reutilizando la lógica ya existente.
    const conflictos = await this.findConflictos();

    const formatFecha = (d: Date) => {
      const day = String(d.getUTCDate()).padStart(2, '0');
      const month = String(d.getUTCMonth() + 1).padStart(2, '0');
      const year = d.getUTCFullYear();
      return `${year}-${month}-${day}`;
    };

    const nombreProfesor = (ex: any) =>
      ex.profesor?.usuario
        ? `${ex.profesor.usuario.nombre} ${ex.profesor.usuario.apellido}`.trim()
        : '';

    const codigoAula = (ex: any) => ex.aula?.codigo || '';

    // 3) Indexar qué exámenes están involucrados en algún conflicto y de qué tipo.
    const tiposPorExamen = new Map<string, Set<string>>();
    for (const c of conflictos) {
      for (const ex of c.examenes) {
        if (!tiposPorExamen.has(ex.id)) tiposPorExamen.set(ex.id, new Set());
        tiposPorExamen.get(ex.id)!.add(c.tipo);
      }
    }

    // 4) Consolidar la información lista para visualización (resolviendo profesor y aula reales).
    const examenesCalendario = examenes.map((e) => {
      const tipos = Array.from(tiposPorExamen.get(e.id) || []);
      return {
        id: e.id,
        codigo: e.codigo,
        asignatura: e.asignatura,
        fecha: formatFecha(new Date(e.fecha)),
        hora: e.hora,
        aula: codigoAula(e),
        aulaId: e.aulaId,
        profesor: nombreProfesor(e),
        profesorId: e.profesorId,
        tieneConflicto: tipos.length > 0,
        tiposConflicto: tipos,
      };
    });

    // 5) Métricas de datos procesados y resumen de la generación.
    const [grados, asignaturas, profesores, aulas, estudiantes] = await Promise.all([
      this.prisma.grado.count(),
      this.prisma.asignatura.count(),
      this.prisma.profesor.count(),
      this.prisma.aula.count(),
      this.prisma.alumno.count(),
    ]);

    const conProfesor = examenesCalendario.filter((e) => !!e.profesorId).length;
    const conAula = examenesCalendario.filter((e) => !!e.aulaId).length;
    const completos = examenesCalendario.filter((e) => !!e.profesorId && !!e.aulaId).length;

    // 6) Validar los requisitos mínimos reales para poder generar un calendario:
    //    debe existir al menos un examen, un aula y un profesor en el sistema.
    const requisitos = [
      { nombre: 'Exámenes', actual: examenesCalendario.length, minimo: 1, cumple: examenesCalendario.length >= 1 },
      { nombre: 'Aulas', actual: aulas, minimo: 1, cumple: aulas >= 1 },
      { nombre: 'Profesores', actual: profesores, minimo: 1, cumple: profesores >= 1 },
    ];
    const datosSuficientes = requisitos.every((r) => r.cumple);

    return {
      datosSuficientes,
      requisitos,
      generadoEn: new Date().toISOString(),
      datosProcesados: { grados, asignaturas, profesores, aulas, estudiantes },
      resumen: {
        totalExamenes: examenesCalendario.length,
        completos,
        conProfesor,
        conAula,
        sinProfesor: examenesCalendario.length - conProfesor,
        sinAula: examenesCalendario.length - conAula,
        totalConflictos: conflictos.length,
      },
      examenes: examenesCalendario,
      conflictos,
    };
  }
}
