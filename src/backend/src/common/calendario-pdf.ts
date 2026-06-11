import PDFDocument = require('pdfkit');

export interface PdfCalendarioInput {
  titulo: string;
  columnas: string[];
  filas: string[][];
  subtitulo?: string;
}

/**
 * Genera un PDF tabular (A4 apaisado) del calendario de exámenes y lo devuelve
 * como Buffer. Compartido por las descargas de Administrador, Profesor y Alumno
 * para mantener un formato consistente. Reimprime la cabecera al saltar de página.
 */
export function construirPdfCalendario(input: PdfCalendarioInput): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 36 });
    const chunks: Buffer[] = [];
    doc.on('data', (c: Buffer) => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const startX = doc.page.margins.left;
    const usableW = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const colW = usableW / input.columnas.length;
    const rowH = 20;

    // Encabezado del documento
    doc.fontSize(16).font('Helvetica-Bold').fillColor('#000').text(input.titulo, { align: 'center' });
    if (input.subtitulo) {
      doc.moveDown(0.2).fontSize(9).font('Helvetica').fillColor('#555').text(input.subtitulo, { align: 'center' });
    }
    doc.moveDown(0.6).fillColor('#000');
    let y = doc.y;

    const dibujarFila = (celdas: string[], header = false) => {
      if (y + rowH > doc.page.height - doc.page.margins.bottom - 24) {
        doc.addPage();
        y = doc.page.margins.top;
        dibujarFila(input.columnas, true); // reimprimir cabecera
      }
      if (header) {
        doc.rect(startX, y, usableW, rowH).fill('#dfe7ef');
        doc.fillColor('#000');
      }
      doc.font(header ? 'Helvetica-Bold' : 'Helvetica').fontSize(9).fillColor('#000');
      celdas.forEach((celda, i) => {
        doc.text(String(celda ?? ''), startX + i * colW + 4, y + 6, {
          width: colW - 8,
          ellipsis: true,
          lineBreak: false,
        });
      });
      doc.moveTo(startX, y + rowH).lineTo(startX + usableW, y + rowH).strokeColor('#cccccc').stroke();
      y += rowH;
    };

    dibujarFila(input.columnas, true);
    if (input.filas.length === 0) {
      doc.font('Helvetica-Oblique').fontSize(10).fillColor('#666')
        .text('Sin exámenes para los criterios seleccionados.', startX, y + 8);
    } else {
      for (const fila of input.filas) dibujarFila(fila);
    }

    // Pie
    doc.font('Helvetica').fontSize(8).fillColor('#666').text(
      'Davidario · Sistema de Gestión de Exámenes',
      startX,
      doc.page.height - doc.page.margins.bottom - 12,
      { width: usableW, align: 'left' },
    );

    doc.end();
  });
}
