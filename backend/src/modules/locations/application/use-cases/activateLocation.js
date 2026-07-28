import { LocationNotFoundError } from '../../domain/errors.js';

export class ActivateLocationUseCase {
  constructor(locationRepository) {
    this.locationRepository = locationRepository;
  }

  async execute(id) {
    const location = await this.locationRepository.findById(id);
    if (!location) throw new LocationNotFoundError();

    return this.locationRepository.update(id, { isActive: true });
  }
}
