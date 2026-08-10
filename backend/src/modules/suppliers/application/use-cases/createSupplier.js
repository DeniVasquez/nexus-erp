import { Supplier } from '../../domain/Supplier.js';
import { CountryNotFoundForSupplierError } from '../../domain/errors.js';

export class CreateSupplierUseCase {
  constructor(supplierRepository, countryRepository) {
    this.supplierRepository = supplierRepository;
    this.countryRepository = countryRepository;
  }

  async execute(data) {
    const country = await this.countryRepository.findById(data.country);
    if (!country) throw new CountryNotFoundForSupplierError();

    const supplier = new Supplier(data);
    return this.supplierRepository.create(supplier);
  }
}
