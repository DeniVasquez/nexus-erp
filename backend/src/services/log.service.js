import { Log } from '../models/logs.model.js';

/**
 * Punto único de escritura de logs. Todo el código que necesite
 * dejar una entrada en la bitácora (middleware o controllers) pasa por aquí.
 */
export const createLog = (logData) => Log.create(logData);
