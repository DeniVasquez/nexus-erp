/**
 * Puerto que el dominio/aplicación usan para persistir Permission. No sabe
 * nada de Mongo/Mongoose: cualquier adaptador de infraestructura que
 * implemente estos métodos sirve.
 */
export class PermissionRepository {
  async findAllActive() {
    throw new Error('PermissionRepository.findAllActive no implementado');
  }

  async upsertByCode(_permission) {
    throw new Error('PermissionRepository.upsertByCode no implementado');
  }
}
