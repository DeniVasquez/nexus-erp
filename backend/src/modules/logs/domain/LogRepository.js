/**
 * Puerto que el dominio/aplicación usan para leer y escribir la bitácora. No
 * sabe nada de Mongo/Mongoose: cualquier adaptador de infraestructura que
 * implemente estos métodos sirve.
 */
export class LogRepository {
  async findAll(_criteria) {
    throw new Error('LogRepository.findAll no implementado');
  }

  async findByEntity(_criteria) {
    throw new Error('LogRepository.findByEntity no implementado');
  }

  async create(_logEntry) {
    throw new Error('LogRepository.create no implementado');
  }
}
