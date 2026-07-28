import { LocationNotFoundError } from '../../domain/errors.js';

export class DeactivateLocationUseCase {
  constructor(locationRepository) {
    this.locationRepository = locationRepository;
  }

  async execute(id) {
    const location = await this.locationRepository.findById(id);
    if (!location) throw new LocationNotFoundError();

    // RN-WHS-007 (no desactivar ubicación con existencias) queda como TODO:
    // no hay módulo de inventario todavía para consultar stock. Flagueado,
    // igual que RN-BRA-004 en branches.
    return this.locationRepository.update(id, { isActive: false });
  }
}
