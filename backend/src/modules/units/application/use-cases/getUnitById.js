import { UnitNotFoundError } from '../../domain/errors.js';

export class GetUnitByIdUseCase {
  constructor(unitRepository) {
    this.unitRepository = unitRepository;
  }

  async execute(id) {
    const unit = await this.unitRepository.findById(id);
    if (!unit) throw new UnitNotFoundError();
    return unit;
  }
}
