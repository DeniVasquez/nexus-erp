import { SupplierNotFoundError } from '../../domain/errors.js';

export class ActivateSupplierUseCase {
  constructor(supplierRepository) {
    this.supplierRepository = supplierRepository;
  }

  async execute(id) {
    const supplier = await this.supplierRepository.findById(id);
    if (!supplier) throw new SupplierNotFoundError();

    return this.supplierRepository.update(id, { isActive: true });
  }
}
