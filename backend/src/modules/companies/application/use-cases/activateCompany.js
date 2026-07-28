import { CompanyNotFoundError } from '../../domain/errors.js';

export class ActivateCompanyUseCase {
  constructor(companyRepository) {
    this.companyRepository = companyRepository;
  }

  async execute(id) {
    const company = await this.companyRepository.findById(id);
    if (!company) throw new CompanyNotFoundError();

    return this.companyRepository.update(id, { isActive: true });
  }
}
