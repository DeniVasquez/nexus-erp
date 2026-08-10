import { SupplierContactNotFoundError } from '../../domain/errors.js';

export class ActivateSupplierContactUseCase {
  constructor(supplierContactRepository) {
    this.supplierContactRepository = supplierContactRepository;
  }

  async execute(id) {
    const supplierContact = await this.supplierContactRepository.findById(id);
    if (!supplierContact) throw new SupplierContactNotFoundError();

    return this.supplierContactRepository.update(id, { isActive: true });
  }
}
