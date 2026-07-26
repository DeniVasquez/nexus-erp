/**
 * Puerto que el dominio/aplicación usan para persistir Company. No sabe nada de
 * Mongo/Mongoose: cualquier adaptador de infraestructura que implemente estos
 * métodos sirve (Mongo hoy, Postgres mañana, un fake en memoria en tests).
 */
export class CompanyRepository {
  async findAll(_criteria) {
    throw new Error('CompanyRepository.findAll no implementado');
  }

  async findById(_id) {
    throw new Error('CompanyRepository.findById no implementado');
  }

  async findByTaxId(_taxId) {
    throw new Error('CompanyRepository.findByTaxId no implementado');
  }

  async create(_company) {
    throw new Error('CompanyRepository.create no implementado');
  }

  async update(_id, _company) {
    throw new Error('CompanyRepository.update no implementado');
  }

  async remove(_id) {
    throw new Error('CompanyRepository.remove no implementado');
  }
}
