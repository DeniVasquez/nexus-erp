import { CompanyNotFoundError, DuplicateTaxIdError } from '../../domain/errors.js';

export class UpdateCompanyUseCase {
  constructor(companyRepository) {
    this.companyRepository = companyRepository;
  }

  async execute(id, changes) {
    const company = await this.companyRepository.findById(id);
    if (!company) throw new CompanyNotFoundError();

    if (changes.taxId && changes.taxId.toUpperCase() !== company.taxId) {
      const taxIdTaken = await this.companyRepository.findByTaxId(changes.taxId);
      if (taxIdTaken) throw new DuplicateTaxIdError();
    }

    return this.companyRepository.update(id, changes);
  }
}
