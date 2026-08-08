import { Unit } from '../../domain/Unit.js';
import { DuplicateUnitNameError } from '../../domain/errors.js';

export class CreateUnitUseCase {
  constructor(unitRepository) {
    this.unitRepository = unitRepository;
  }

  async execute({ name, type }) {
    const existing = await this.unitRepository.findByName(name);
    if (existing) throw new DuplicateUnitNameError();

    const unit = new Unit({ name, type });
    return this.unitRepository.create(unit);
  }
}
