import { SupplierContactNotFoundError } from '../../domain/errors.js';

export class UpdateSupplierContactUseCase {
  constructor(supplierContactRepository) {
    this.supplierContactRepository = supplierContactRepository;
  }

  async execute(id, changes) {
    const supplierContact = await this.supplierContactRepository.findById(id);
    if (!supplierContact) throw new SupplierContactNotFoundError();

    return this.supplierContactRepository.update(id, changes);
  }
}
