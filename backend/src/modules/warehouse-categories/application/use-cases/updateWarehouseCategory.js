import { WarehouseCategoryNotFoundError, DuplicateWarehouseCategoryNameError } from '../../domain/errors.js';

export class UpdateWarehouseCategoryUseCase {
  constructor(warehouseCategoryRepository) {
    this.warehouseCategoryRepository = warehouseCategoryRepository;
  }

  async execute(id, changes) {
    const category = await this.warehouseCategoryRepository.findById(id);
    if (!category) throw new WarehouseCategoryNotFoundError();

    if (changes.name && changes.name !== category.name) {
      const nameTaken = await this.warehouseCategoryRepository.findByName(changes.name);
      if (nameTaken) throw new DuplicateWarehouseCategoryNameError();
    }

    return this.warehouseCategoryRepository.update(id, changes);
  }
}
