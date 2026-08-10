import { UnitNotFoundError } from '../../domain/errors.js';

export class ActivateUnitUseCase {
  constructor(unitRepository) {
    this.unitRepository = unitRepository;
  }

  async execute(id) {
    const unit = await this.unitRepository.findById(id);
    if (!unit) throw new UnitNotFoundError();

    return this.unitRepository.update(id, { isActive: true });
  }
}
