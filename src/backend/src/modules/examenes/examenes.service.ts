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

  // Consolida el calendario actual (exámenes ordenados cronológicamente con sus
  // relaciones reales de profesor/aula) y marca los implicados en conflictos.
  // Reutilizado por consultarCalendario() y descargarCalendario().
  private async buildCalendarioConsolidado() {
    const examenes = await this.prisma.examen.findMany({
      orderBy: [{ fecha: 'asc' }, { hora: 'asc' }],
      include: examenInclude,
    });
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

    const tiposPorExamen = new Map<string, Set<string>>();
    for (const c of conflictos) {
      for (const ex of c.examenes) {
        if (!tiposPorExamen.has(ex.id)) tiposPorExamen.set(ex.id, new Set());
        tiposPorExamen.get(ex.id)!.add(c.tipo);
      }
    }

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

    return { examenesCalendario, conflictos };
  }

  // Resuelve los nombres/códigos libres de asignatura contra el catálogo y
  // devuelve un Map asignaturaId -> número de alumnos matriculados.
  private async matriculasPorAsignatura(asignaturas: string[]) {
    const catalogo = await this.prisma.asignatura.findMany({
      select: { id: true, nombre: true, codigo: true },
    });
    const resolver = (valor: string) => {
      const target = (valor || '').trim().toLowerCase();
      const match = catalogo.find(
        (a) => a.nombre.toLowerCase() === target || a.codigo.toLowerCase() === target,
      );
      return match?.id || null;
    };

    const ids = Array.from(
      new Set(asignaturas.map(resolver).filter((x): x is string => !!x)),
    );

    const countById = new Map<string, number>();
    if (ids.length > 0) {
      const grouped = await this.prisma.matricula.groupBy({
        by: ['asignaturaId'],
        where: { asignaturaId: { in: ids } },
        _count: { _all: true },
      });
      for (const g of grouped) countById.set(g.asignaturaId, g._count._all);
    }

    return { resolver, countById };
  }

  async consultarCalendario() {
    const { examenesCalendario, conflictos } = await this.buildCalendarioConsolidado();

    const profesoresAsignados = new Set(
      examenesCalendario.filter((e) => e.profesorId).map((e) => e.profesorId),
    ).size;
    const aulasUtilizadas = new Set(
      examenesCalendario.filter((e) => e.aulaId).map((e) => e.aulaId),
    ).size;

    // Estudiantes afectados: alumnos distintos matriculados en alguna asignatura con examen.
    const { resolver, countById } = await this.matriculasPorAsignatura(
      examenesCalendario.map((e) => e.asignatura),
    );
    const idsConExamen = new Set(
      examenesCalendario.map((e) => resolver(e.asignatura)).filter((x): x is string => !!x),
    );
    let estudiantesAfectados = 0;
    for (const id of idsConExamen) estudiantesAfectados += countById.get(id) || 0;

    return {
      generadoEn: new Date().toISOString(),
      resumen: {
        totalExamenes: examenesCalendario.length,
        profesoresAsignados,
        aulasUtilizadas,
        estudiantesAfectados,
      },
      examenes: examenesCalendario,
      conflictos,
    };
  }

  async descargarCalendario(opts: {
    incluirAula?: boolean;
    incluirProfesor?: boolean;
    incluirEstudiantes?: boolean;
    fechaInicio?: string;
    fechaFin?: string;
  }) {
    const { examenesCalendario } = await this.buildCalendarioConsolidado();

    let filas = examenesCalendario;
    if (opts.fechaInicio) filas = filas.filter((e) => e.fecha >= opts.fechaInicio!);
    if (opts.fechaFin) filas = filas.filter((e) => e.fecha <= opts.fechaFin!);

    // Conteo de estudiantes por examen (solo si se solicita la columna).
    let estudiantesDe: (asignatura: string) => number = () => 0;
    if (opts.incluirEstudiantes) {
      const { resolver, countById } = await this.matriculasPorAsignatura(
        filas.map((e) => e.asignatura),
      );
      estudiantesDe = (asignatura: string) => {
        const id = resolver(asignatura);
        return id ? countById.get(id) || 0 : 0;
      };
    }

    const columnas = ['Fecha', 'Hora', 'Código', 'Asignatura'];
    if (opts.incluirAula) columnas.push('Aula');
    if (opts.incluirProfesor) columnas.push('Profesor');
    if (opts.incluirEstudiantes) columnas.push('Estudiantes');
    columnas.push('Estado');

    const esc = (valor: string) => `"${String(valor ?? '').replace(/"/g, '""')}"`;
    const lineas = [columnas.map(esc).join(',')];

    for (const e of filas) {
      const fila: string[] = [e.fecha, e.hora, e.codigo, e.asignatura];
      if (opts.incluirAula) fila.push(e.aula || '');
      if (opts.incluirProfesor) fila.push(e.profesor || '');
      if (opts.incluirEstudiantes) fila.push(String(estudiantesDe(e.asignatura)));
      fila.push(e.tieneConflicto ? `Conflicto: ${e.tiposConflicto.join('/')}` : 'OK');
      lineas.push(fila.map(esc).join(','));
    }

    // BOM inicial para que Excel respete los acentos al abrir el CSV.
    const content = '﻿' + lineas.join('\r\n');
    return {
      content,
      filename: 'calendario-examenes.csv',
      contentType: 'text/csv; charset=utf-8',
    };
  }

  // ===== Generación AUTOMÁTICA del calendario =====
  // Asigna fecha, hora, aula y profesor a cada examen respetando:
  //  - Separación: dos exámenes de la misma cohorte (grado + año) no pueden caer
  //    el mismo día ni en días consecutivos (>= 1 día libre entre ellos).
  //  - Aforo: el aula asignada tiene capacidad >= alumnos matriculados.
  //  - Sin doble reserva: una misma aula o un mismo profesor no se usan dos veces
  //    en el mismo (fecha, hora).
  //  - Profesor: tomado de ProfesorAsignatura (quien imparte esa asignatura).
  // Es un heurístico greedy (exámenes con más matriculados primero). Los exámenes
  // que no encajan se devuelven en `noAsignados` con su motivo; nunca se produce
  // un horario inválido. Persiste las asignaciones en BD.
  private formatFechaISO(d: Date): string {
    const day = String(d.getUTCDate()).padStart(2, '0');
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    return `${d.getUTCFullYear()}-${month}-${day}`;
  }

  private proximoDiaHabilUTC(): Date {
    const hoy = new Date();
    const d = new Date(Date.UTC(hoy.getUTCFullYear(), hoy.getUTCMonth(), hoy.getUTCDate()));
    // Avanzar hasta el próximo lunes (o quedarse si ya es día hábil futuro).
    while (d.getUTCDay() === 0 || d.getUTCDay() === 6) {
      d.setUTCDate(d.getUTCDate() + 1);
    }
    return d;
  }

  async generarCalendarioAutomatico(opts: {
    fechaInicio?: string;
    horizonteDias?: number;
    franjas?: string[];
    separacionDias?: number;
  } = {}) {
    const franjas = opts.franjas && opts.franjas.length
      ? opts.franjas
      : ['08:30', '11:30', '14:30', '17:30'];
    const separacionDias = opts.separacionDias ?? 1;
    const horizonteDias = opts.horizonteDias ?? 120;
    const baseInicio = opts.fechaInicio
      ? new Date(opts.fechaInicio + 'T00:00:00Z')
      : this.proximoDiaHabilUTC();

    // 1) Cargar datos
    const examenes = await this.prisma.examen.findMany({ include: examenInclude });
    const asignaturas = await this.prisma.asignatura.findMany({
      select: { id: true, nombre: true, codigo: true, gradoId: true, anio: true },
    });
    const aulas = await this.prisma.aula.findMany({ orderBy: { capacidad: 'asc' } });
    const profAsig = await this.prisma.profesorAsignatura.findMany({
      select: { profesorId: true, asignaturaId: true },
    });
    const todosProfesores = (
      await this.prisma.profesor.findMany({ select: { id: true } })
    ).map((x) => x.id);
    const matriculasGrouped = await this.prisma.matricula.groupBy({
      by: ['asignaturaId'],
      _count: { _all: true },
    });

    // 2) Índices auxiliares
    const norm = (s: string) => (s || '').trim().toLowerCase();
    const asigByKey = new Map<string, (typeof asignaturas)[number]>();
    for (const a of asignaturas) {
      asigByKey.set(norm(a.nombre), a);
      asigByKey.set(norm(a.codigo), a);
    }
    const matriCount = new Map<string, number>();
    for (const m of matriculasGrouped) matriCount.set(m.asignaturaId, m._count._all);
    const profesoresPorAsignatura = new Map<string, string[]>();
    for (const pa of profAsig) {
      if (!profesoresPorAsignatura.has(pa.asignaturaId)) {
        profesoresPorAsignatura.set(pa.asignaturaId, []);
      }
      profesoresPorAsignatura.get(pa.asignaturaId)!.push(pa.profesorId);
    }

    // 3) Construir slots (días hábiles L-V × franjas), en orden cronológico
    const slots: { fecha: string; hora: string; dayNum: number }[] = [];
    for (let i = 0; i < horizonteDias; i++) {
      const d = new Date(baseInicio);
      d.setUTCDate(d.getUTCDate() + i);
      const dow = d.getUTCDay();
      if (dow === 0 || dow === 6) continue; // saltar fines de semana
      const fecha = this.formatFechaISO(d);
      const dayNum = Math.floor(d.getTime() / 86400000); // índice absoluto de día
      for (const hora of franjas) slots.push({ fecha, hora, dayNum });
    }

    // 4) Preparar exámenes con metadatos (cohorte, aforo, profesores candidatos)
    const prep = examenes.map((e) => {
      const a = asigByKey.get(norm(e.asignatura));
      const enrolled = a ? matriCount.get(a.id) || 0 : 0;
      const cohorte = a ? `${a.gradoId}|${a.anio}` : `SIN|${e.id}`;
      const candidatos = a ? profesoresPorAsignatura.get(a.id) || [] : [];
      return { e, enrolled, cohorte, candidatos };
    });
    // Más matriculados primero (más difíciles de ubicar por aforo).
    prep.sort((x, y) => y.enrolled - x.enrolled);

    // 5) Estado de ocupación
    const aulaOcupada = new Set<string>(); // `${aulaId}|${fecha}|${hora}`
    const profOcupado = new Set<string>(); // `${profId}|${fecha}|${hora}`
    const cohorteDias = new Map<string, number[]>(); // cohorte -> días asignados

    const capacidadMaxima = aulas.length ? aulas[aulas.length - 1].capacidad : 0;
    const asignados: any[] = [];
    const noAsignados: { codigo: string; asignatura: string; motivo: string }[] = [];

    // 6) Asignación greedy
    for (const item of prep) {
      const { e, enrolled, cohorte, candidatos } = item;

      const aulasAptas = aulas.filter((au) => au.capacidad >= enrolled);
      if (enrolled > 0 && aulasAptas.length === 0) {
        noAsignados.push({
          codigo: e.codigo,
          asignatura: e.asignatura,
          motivo: `Aforo insuficiente: ${enrolled} matriculados superan la mayor aula (${capacidadMaxima}). El reparto multi-aula no está soportado.`,
        });
        continue;
      }
      const aulasCandidatas = aulasAptas.length ? aulasAptas : aulas;

      // Selección de profesor (opción c): prioriza el profesor asignado a mano
      // (si está libre), luego un docente de la asignatura, y como último recurso
      // cualquier profesor libre. Devuelve null solo si no hay ninguno libre.
      const elegirProfesor = (slot: { fecha: string; hora: string }): string | null => {
        const libre = (p: string) => !profOcupado.has(`${p}|${slot.fecha}|${slot.hora}`);
        if (e.profesorId && libre(e.profesorId)) return e.profesorId;
        const docente = candidatos.find((p) => libre(p));
        if (docente) return docente;
        const cualquiera = todosProfesores.find((p) => libre(p));
        return cualquiera || null;
      };

      type Slot = (typeof slots)[number];
      type Aula = (typeof aulas)[number];
      let elegido: { slot: Slot; aula: Aula; profId: string } | null = null;
      let fallback: { slot: Slot; aula: Aula } | null = null; // sin profesor libre

      for (const slot of slots) {
        // 6a) Separación de la cohorte (no mismo día ni consecutivos)
        const dias = cohorteDias.get(cohorte) || [];
        if (dias.some((dn) => Math.abs(dn - slot.dayNum) <= separacionDias)) continue;

        // 6b) Aula libre con aforo suficiente (best-fit: menor capacidad primero)
        const aula = aulasCandidatas.find(
          (au) => !aulaOcupada.has(`${au.id}|${slot.fecha}|${slot.hora}`),
        );
        if (!aula) continue;

        // 6c) Profesor por prioridad; preferimos un slot donde haya profesor.
        const profId = elegirProfesor(slot);
        if (profId) {
          elegido = { slot, aula, profId };
          break;
        }
        if (!fallback) fallback = { slot, aula };
      }

      // Si ningún slot permitió profesor, usamos el primer slot válido sin profesor.
      const destino = elegido
        ? elegido
        : fallback
          ? { ...fallback, profId: null as string | null }
          : null;

      if (!destino) {
        noAsignados.push({
          codigo: e.codigo,
          asignatura: e.asignatura,
          motivo:
            'No se encontró un hueco que cumpla la separación de días y la disponibilidad de aula dentro del horizonte.',
        });
        continue;
      }

      // 6d) Asignar y persistir
      await this.prisma.examen.update({
        where: { id: e.id },
        data: {
          fecha: new Date(destino.slot.fecha + 'T00:00:00Z'),
          hora: destino.slot.hora,
          aulaId: destino.aula.id,
          profesorId: destino.profId,
        },
      });
      aulaOcupada.add(`${destino.aula.id}|${destino.slot.fecha}|${destino.slot.hora}`);
      if (destino.profId) {
        profOcupado.add(`${destino.profId}|${destino.slot.fecha}|${destino.slot.hora}`);
      }
      if (!cohorteDias.has(cohorte)) cohorteDias.set(cohorte, []);
      cohorteDias.get(cohorte)!.push(destino.slot.dayNum);
      asignados.push({
        codigo: e.codigo,
        asignatura: e.asignatura,
        fecha: destino.slot.fecha,
        hora: destino.slot.hora,
        aula: destino.aula.codigo,
        sinProfesor: !destino.profId,
      });
    }

    // 7) Resultado consolidado (reutiliza la lógica existente sobre los datos ya persistidos)
    const consolidado = await this.generarCalendario();
    return {
      ...consolidado,
      generacion: {
        parametros: {
          fechaInicio: this.formatFechaISO(baseInicio),
          horizonteDias,
          franjas,
          separacionDias,
        },
        totalProcesados: prep.length,
        asignados: asignados.length,
        noAsignados,
        detalleAsignados: asignados,
      },
    };
  }
}
