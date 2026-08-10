import { SupplierContactNotFoundError } from '../../domain/errors.js';

export class GetSupplierContactByIdUseCase {
  constructor(supplierContactRepository) {
    this.supplierContactRepository = supplierContactRepository;
  }

  async execute(id) {
    const supplierContact = await this.supplierContactRepository.findById(id);
    if (!supplierContact) throw new SupplierContactNotFoundError();
    return supplierContact;
  }
}
