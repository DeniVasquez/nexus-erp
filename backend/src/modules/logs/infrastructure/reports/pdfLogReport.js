import PDFDocument from 'pdfkit';

const buildFilterSummary = ({ action, resource, startDate, endDate, exportAll, page }) => {
    const filterTexts = [];
    if (action) filterTexts.push(`Acción: ${action}`);
    if (resource) filterTexts.push(`Recurso: ${resource}`);
    if (startDate && endDate) {
        filterTexts.push(
            `Fechas: ${new Date(startDate).toLocaleDateString('es-ES')} - ${new Date(endDate).toLocaleDateString('es-ES')}`,
        );
    }
    if (exportAll === 'false') filterTexts.push(`Página: ${page}`);

    return filterTexts;
};

/**
 * Escribe el PDF de logs ya filtrados (DTOs planos) directamente al stream de
 * respuesta. Los headers HTTP los define el controller antes de llamar aquí.
 */
export const streamPdfReport = (logs, filters, res) => {
    const { exportAll = 'true', page = 1 } = filters;
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    doc.pipe(res);

    doc.fontSize(20).text('Reporte de Bitácoras', { align: 'center' });
    doc.moveDown();

    doc.fontSize(10);
    const filterTexts = buildFilterSummary(filters);
    if (filterTexts.length > 0) {
        doc.text(`Filtros aplicados: ${filterTexts.join(' | ')}`, { align: 'center' });
    } else {
        doc.text('Sin filtros aplicados - Mostrando todos los logs', { align: 'center' });
    }

    doc.moveDown();
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();

    const tableTop = doc.y;
    const rowHeight = 25;

    doc.fontSize(9).font('Helvetica-Bold');
    doc.text('Fecha', 50, tableTop, { width: 80 });
    doc.text('Usuario', 130, tableTop, { width: 90 });
    doc.text('Acción', 220, tableTop, { width: 60 });
    doc.text('Recurso', 280, tableTop, { width: 70 });
    doc.text('Afectado', 350, tableTop, { width: 100 });
    doc.text('Status', 450, tableTop, { width: 50 });

    doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

    doc.font('Helvetica').fontSize(8);
    let y = tableTop + 20;

    logs.forEach((log) => {
        if (y > 720) {
            doc.addPage();
            y = 50;
        }

        doc.text(new Date(log.createdAt).toLocaleDateString('es-ES'), 50, y, { width: 80 });
        doc.text(log.user?.name || 'Desconocido', 130, y, { width: 90 });
        doc.text(log.action, 220, y, { width: 60 });
        doc.text(log.resource, 280, y, { width: 70 });
        doc.text(log.entityId?.name || log.entityName || '-', 350, y, { width: 100 });
        doc.text(log.statusCode?.toString() || '-', 450, y, { width: 50 });

        y += rowHeight;
    });

    doc.moveDown();
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.fontSize(10);
    doc.text(`Total de registros: ${logs.length}${exportAll === 'false' ? ` (Página ${page})` : ''}`, 50, doc.y + 10);
    doc.text(`Generado: ${new Date().toLocaleString('es-ES')}`, 350, doc.y);

    doc.end();
};
