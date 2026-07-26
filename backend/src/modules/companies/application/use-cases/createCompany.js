import { Company } from '../../domain/Company.js';
import { DuplicateTaxIdError } from '../../domain/errors.js';

export class CreateCompanyUseCase {
  constructor(companyRepository) {
    this.companyRepository = companyRepository;
  }

  async execute(data) {
    const existing = await this.companyRepository.findByTaxId(data.taxId);
    if (existing) throw new DuplicateTaxIdError();

    const company = new Company(data);
    return this.companyRepository.create(company);
  }
}
