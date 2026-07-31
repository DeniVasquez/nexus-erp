/**
 * Convierte un valor de campo poblado (subdocumento Mongoose) a un objeto
 * plano. Necesario porque un documento Mongoose asignado dentro de un campo
 * Mixed (como Log.dataBefore/dataAfter) se "aplana" a su solo ObjectId al
 * guardarse — un objeto plano en cambio sí conserva sus datos (ej. `name`).
 */
export const toPlainValue = (value) => {
    if (value && typeof value === 'object' && typeof value.toObject === 'function') {
        return value.toObject();
    }
    return value;
};

/**
 * Construye un snapshot plano de un documento, tomando solo los campos indicados.
 */
const buildSnapshot = (doc, fields) => {
    if (!doc) return null;

    return fields.reduce((snapshot, field) => {
        snapshot[field] = toPlainValue(doc[field]);
        return snapshot;
    }, {});
};

/**
 * Obtiene el snapshot "antes" de una entidad para cualquier modelo de mongoose.
 * `transform` permite ajustar el snapshot con datos derivados (ej. resolver un populate).
 */
export const fetchEntitySnapshot = async (model, id, { fields = [], populate = null, transform = null } = {}) => {
    if (!id) return null;

    let query = model.findById(id);
    if (populate) query = query.populate(populate);

    const doc = await query;
    if (!doc) return null;

    const snapshot = buildSnapshot(doc, fields);
    return transform ? transform(snapshot, doc) : snapshot;
};
