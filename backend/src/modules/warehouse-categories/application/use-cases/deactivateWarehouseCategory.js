import { WarehouseCategoryNotFoundError } from '../../domain/errors.js';

export class DeactivateWarehouseCategoryUseCase {
  constructor(warehouseCategoryRepository) {
    this.warehouseCategoryRepository = warehouseCategoryRepository;
  }

  async execute(id) {
    const category = await this.warehouseCategoryRepository.findById(id);
    if (!category) throw new WarehouseCategoryNotFoundError();

    return this.warehouseCategoryRepository.update(id, { isActive: false });
  }
}
