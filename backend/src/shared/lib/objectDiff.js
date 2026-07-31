/**
 * Normaliza un valor de campo a un string comparable. Los refs a otras
 * entidades pueden llegar como ObjectId crudo (snapshot "antes", sin populate)
 * o como subdocumento poblado (respuesta "después", ej. warehouseCategory en
 * warehouses), así que ambos casos se resuelven al mismo id antes de comparar.
 */
const normalize = (value) => {
    if (value && typeof value === 'object') {
        if (typeof value.toHexString === 'function') return value.toHexString();
        if (value._id !== undefined) return String(value._id);
        if (value.id !== undefined) return String(value.id);
    }
    return String(value ?? '');
};

/**
 * Compara dos objetos planos sobre una lista de campos dada
 * y devuelve los nombres de los campos que cambiaron.
 */
export const diffFields = (before, after, fields) => {
    if (!before || !after) return [];

    return fields.filter((field) => normalize(before[field]) !== normalize(after[field]));
};
