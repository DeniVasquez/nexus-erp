import { delete_endpoint_env } from '#shared/lib/env.js';

/**
 * Bloquea el acceso a rutas peligrosas/utilitarias que solo deben existir en
 * desarrollo (ej. limpiezas masivas). Si DELETE_ENDPOINT=production, corta la
 * petición antes de llegar al controller.
 */
export const devOnlyMiddleware = (req, res, next) => {
    if (delete_endpoint_env === 'production') {
        return res.status(403).json({
            msj: 'Endpoint disponible solo en entornos de desarrollo',
        });
    }

    next();
};
