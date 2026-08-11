const MAX_ATTEMPTS = 10;
const BLOCK_DURATION_MS = 60 * 1000;

// Estado en memoria por proceso: alcanza para una sola instancia del
// servidor (sin Redis todavía). Se pierde al reiniciar, lo cual está bien
// para el alcance actual del proyecto.
const attemptsByIp = new Map();

/**
 * Limita los intentos de login por IP (no está en el ERS como RN-005, que
 * bloquea por usuario; esta es una variante pedida aparte: 10 intentos
 * fallidos desde la misma IP bloquean esa IP por 1 minuto).
 * Solo cuenta como intento fallido un 401 (credenciales inválidas) de
 * login.js — un 403 (usuario inactivo) o un 400 (body inválido) no suman.
 */
export const loginRateLimiter = (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();
    const entry = attemptsByIp.get(ip);

    if (entry?.blockedUntil) {
        if (entry.blockedUntil > now) {
            const retryAfterSeconds = Math.ceil((entry.blockedUntil - now) / 1000);
            res.set('Retry-After', String(retryAfterSeconds));
            return res.status(429).json({
                msj: `Demasiados intentos fallidos. Intenta de nuevo en ${retryAfterSeconds} segundos.`,
            });
        }
        attemptsByIp.delete(ip);
    }

    const originalJson = res.json.bind(res);
    res.json = (body) => {
        if (res.statusCode === 200) {
            attemptsByIp.delete(ip);
        } else if (res.statusCode === 401) {
            const current = attemptsByIp.get(ip) ?? { count: 0 };
            current.count += 1;

            if (current.count >= MAX_ATTEMPTS) {
                attemptsByIp.set(ip, { count: 0, blockedUntil: Date.now() + BLOCK_DURATION_MS });
            } else {
                attemptsByIp.set(ip, current);
            }
        }
        return originalJson(body);
    };

    next();
};
