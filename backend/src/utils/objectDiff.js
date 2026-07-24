/**
 * Compara dos objetos planos sobre una lista de campos dada
 * y devuelve los nombres de los campos que cambiaron.
 */
export const diffFields = (before, after, fields) => {
    if (!before || !after) return [];

    return fields.filter((field) => {
        const beforeValue = String(before[field] || '');
        const afterValue = String(after[field] || '');
        return beforeValue !== afterValue;
    });
};
