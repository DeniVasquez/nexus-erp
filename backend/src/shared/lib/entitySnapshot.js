/**
 * Construye un snapshot plano de un documento, tomando solo los campos indicados.
 */
const buildSnapshot = (doc, fields) => {
    if (!doc) return null;

    return fields.reduce((snapshot, field) => {
        snapshot[field] = doc[field];
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
