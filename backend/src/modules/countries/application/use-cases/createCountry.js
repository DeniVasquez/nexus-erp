import { Country } from '../../domain/Country.js';
import { DuplicateCountryNameError } from '../../domain/errors.js';

export class CreateCountryUseCase {
  constructor(countryRepository) {
    this.countryRepository = countryRepository;
  }

  async execute({ name }) {
    const existing = await this.countryRepository.findByName(name);
    if (existing) throw new DuplicateCountryNameError();

    const country = new Country({ name });
    return this.countryRepository.create(country);
  }
}
