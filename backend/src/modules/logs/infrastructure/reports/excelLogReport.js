import ExcelJS from 'exceljs';

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

    return filterTexts.length > 0
        ? `Filtros aplicados: ${filterTexts.join(' | ')}`
        : 'Sin filtros aplicados - Mostrando todos los logs';
};

/**
 * Construye el buffer .xlsx a partir de logs ya filtrados (DTOs planos).
 * No sabe nada de Express ni de Mongo: solo arma el workbook.
 */
export const buildExcelWorkbook = async (logs, filters) => {
    const { exportAll = 'true', page = 1 } = filters;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Logs');

    workbook.creator = 'Sistema de Bitácoras';
    workbook.created = new Date();

    worksheet.mergeCells('A1:F1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'Reporte de Bitácoras';
    titleCell.font = { size: 16, bold: true };
    titleCell.alignment = { horizontal: 'center' };

    worksheet.mergeCells('A2:F2');
    const filterCell = worksheet.getCell('A2');
    filterCell.value = buildFilterSummary(filters);
    filterCell.font = { size: 10, italic: true };
    filterCell.alignment = { horizontal: 'center' };

    worksheet.addRow([]);

    const headerRow = worksheet.addRow(['Fecha', 'Usuario', 'Acción', 'Recurso', 'Usuario Afectado', 'Status']);
    headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } };
    headerRow.font = { color: { argb: 'FFFFFFFF' }, bold: true };
    headerRow.alignment = { horizontal: 'center' };

    logs.forEach((log) => {
        worksheet.addRow([
            new Date(log.createdAt).toLocaleString('es-ES'),
            log.user?.name || 'Desconocido',
            log.action,
            log.resource,
            log.entityId?.name || log.entityName || '-',
            log.statusCode,
        ]);
    });

    worksheet.columns = [
        { width: 20 },
        { width: 25 },
        { width: 12 },
        { width: 15 },
        { width: 25 },
        { width: 10 },
    ];

    const dataStartRow = 4;
    const dataEndRow = worksheet.rowCount;
    for (let i = dataStartRow; i <= dataEndRow; i++) {
        for (let j = 1; j <= 6; j++) {
            worksheet.getCell(i, j).border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
            };
        }
    }

    worksheet.addRow([]);
    const footerRow = worksheet.addRow([
        `Total de registros: ${logs.length}${exportAll === 'false' ? ` (Página ${page})` : ''}`,
        '',
        '',
        '',
        '',
        `Generado: ${new Date().toLocaleString('es-ES')}`,
    ]);
    footerRow.font = { italic: true, size: 9 };

    return workbook.xlsx.writeBuffer();
};
