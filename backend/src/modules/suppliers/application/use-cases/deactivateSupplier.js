import { SupplierNotFoundError } from '../../domain/errors.js';

export class DeactivateSupplierUseCase {
  constructor(supplierRepository) {
    this.supplierRepository = supplierRepository;
  }

  async execute(id) {
    const supplier = await this.supplierRepository.findById(id);
    if (!supplier) throw new SupplierNotFoundError();

    return this.supplierRepository.update(id, { isActive: false });
  }
}
