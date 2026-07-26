import { CompanyNotFoundError } from '../../domain/errors.js';

export class ToggleCompanyStatusUseCase {
  constructor(companyRepository) {
    this.companyRepository = companyRepository;
  }

  async execute(id) {
    const company = await this.companyRepository.findById(id);
    if (!company) throw new CompanyNotFoundError();

    company.toggleStatus();
    return this.companyRepository.update(id, { isActive: company.isActive });
  }
}
