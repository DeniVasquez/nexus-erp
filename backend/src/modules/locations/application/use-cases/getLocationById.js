import { LocationNotFoundError } from '../../domain/errors.js';

export class GetLocationByIdUseCase {
  constructor(locationRepository) {
    this.locationRepository = locationRepository;
  }

  async execute(id) {
    const location = await this.locationRepository.findById(id);
    if (!location) throw new LocationNotFoundError();
    return location;
  }
}
