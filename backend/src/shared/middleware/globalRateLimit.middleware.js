import rateLimit from 'express-rate-limit';

/**
 * Rate limit global de la API: 100 requests / 15 min por IP, sin importar
 * el endpoint. Es un concepto distinto a loginRateLimiter (que solo cuenta
 * fallos de /login) — este corta abuso o loops accidentales del frontend
 * contra cualquier ruta.
 */
export const globalRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { msj: 'Demasiadas solicitudes. Intenta de nuevo más tarde.' },
});
