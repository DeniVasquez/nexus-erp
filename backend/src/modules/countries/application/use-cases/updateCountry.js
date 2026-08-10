import { CountryNotFoundError, DuplicateCountryNameError } from '../../domain/errors.js';

export class UpdateCountryUseCase {
  constructor(countryRepository) {
    this.countryRepository = countryRepository;
  }

  async execute(id, changes) {
    const country = await this.countryRepository.findById(id);
    if (!country) throw new CountryNotFoundError();

    if (changes.name && changes.name !== country.name) {
      const nameTaken = await this.countryRepository.findByName(changes.name);
      if (nameTaken) throw new DuplicateCountryNameError();
    }

    return this.countryRepository.update(id, changes);
  }
}
