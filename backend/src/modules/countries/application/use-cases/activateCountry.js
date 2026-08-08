import { CountryNotFoundError } from '../../domain/errors.js';

export class ActivateCountryUseCase {
  constructor(countryRepository) {
    this.countryRepository = countryRepository;
  }

  async execute(id) {
    const country = await this.countryRepository.findById(id);
    if (!country) throw new CountryNotFoundError();

    return this.countryRepository.update(id, { isActive: true });
  }
}
