import { CompanyNotFoundError } from '../../domain/errors.js';

export class GetCompanyByIdUseCase {
  constructor(companyRepository) {
    this.companyRepository = companyRepository;
  }

  async execute(id) {
    const company = await this.companyRepository.findById(id);
    if (!company) throw new CompanyNotFoundError();
    return company;
  }
}
