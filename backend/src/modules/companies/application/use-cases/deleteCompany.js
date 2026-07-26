import { CompanyNotFoundError } from '../../domain/errors.js';

export class DeleteCompanyUseCase {
  constructor(companyRepository) {
    this.companyRepository = companyRepository;
  }

  async execute(id) {
    const company = await this.companyRepository.remove(id);
    if (!company) throw new CompanyNotFoundError();
    return company;
  }
}
