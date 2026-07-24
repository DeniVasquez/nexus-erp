import { fetchEntitySnapshot } from '../services/entitySnapshot.service.js';
import { createLog } from '../services/log.service.js';
import { diffFields } from '../utils/objectDiff.js';

/**
 * Middleware genérico de auditoría. No conoce el shape de ninguna entidad en
 * particular: recibe el modelo de mongoose y la configuración de snapshot/comparación
 * por parámetro, así puede reutilizarse para usuarios, productos, roles, etc.
 *
 * @param {Object} config
 * @param {'create'|'update'|'delete'|'read'} config.action
 * @param {string} config.resource - nombre del recurso para la bitácora (ej. 'users')
 * @param {import('mongoose').Model} config.entityModel - modelo mongoose de la entidad afectada
 * @param {Object} [config.snapshot] - { fields, populate, transform } usados para el "antes"
 * @param {string} [config.responseKey] - clave del body de respuesta donde viene la entidad (ej. 'newUser')
 * @param {string[]} [config.compareFields] - campos a comparar para calcular changedFields
 */
export const logAction = ({
    action,
    resource,
    entityModel,
    snapshot: { fields = [], populate = null, transform = null } = {},
    responseKey = null,
    compareFields = fields,
}) => {
    return async (req, res, next) => {
        let dataBefore = null;

        if (req.params.id && (action === 'update' || action === 'delete')) {
            dataBefore = await fetchEntitySnapshot(entityModel, req.params.id, { fields, populate, transform });
        }

        const originalJson = res.json;

        res.json = async function (data) {
            if (req.user) {
                const entity = responseKey ? data?.[responseKey] : null;

                const logData = {
                    user: req.user.id,
                    action,
                    resource,
                    details: `${req.method} ${req.originalUrl}`,
                    userAgent: req.get('user-agent'),
                    statusCode: res.statusCode,
                    dataBefore,
                };

                if (entity) {
                    logData.entityId = entity.id;
                    logData.entityModel = entityModel.modelName;
                    logData.entityName = entity.name;
                    logData.dataAfter = action === 'delete'
                        ? null
                        : fields.reduce((snapshot, field) => {
                            snapshot[field] = entity[field];
                            return snapshot;
                        }, {});

                    if (action === 'update') {
                        logData.changedFields = diffFields(dataBefore, logData.dataAfter, compareFields);
                    }
                } else if (dataBefore) {
                    // No vino entidad en la respuesta (ej. delete sin payload): usamos el snapshot previo
                    logData.entityId = req.params.id;
                    logData.entityModel = entityModel.modelName;
                }

                try {
                    await createLog(logData);
                } catch (error) {
                    console.error('Error creating log:', error);
                }
            }

            return originalJson.call(this, data);
        };

        next();
    };
};
