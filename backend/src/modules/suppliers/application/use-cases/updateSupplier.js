import { SupplierNotFoundError, CountryNotFoundForSupplierError } from '../../domain/errors.js';

export class UpdateSupplierUseCase {
  constructor(supplierRepository, countryRepository) {
    this.supplierRepository = supplierRepository;
    this.countryRepository = countryRepository;
  }

  async execute(id, changes) {
    const supplier = await this.supplierRepository.findById(id);
    if (!supplier) throw new SupplierNotFoundError();

    if (changes.country) {
      const country = await this.countryRepository.findById(changes.country);
      if (!country) throw new CountryNotFoundForSupplierError();
    }

    return this.supplierRepository.update(id, changes);
  }
}
