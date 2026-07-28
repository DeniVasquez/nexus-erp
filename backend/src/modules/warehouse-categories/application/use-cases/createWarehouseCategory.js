import { WarehouseCategory } from '../../domain/WarehouseCategory.js';
import { DuplicateWarehouseCategoryNameError } from '../../domain/errors.js';

export class CreateWarehouseCategoryUseCase {
  constructor(warehouseCategoryRepository) {
    this.warehouseCategoryRepository = warehouseCategoryRepository;
  }

  async execute({ name, description }) {
    const existing = await this.warehouseCategoryRepository.findByName(name);
    if (existing) throw new DuplicateWarehouseCategoryNameError();

    const category = new WarehouseCategory({ name, description });
    return this.warehouseCategoryRepository.create(category);
  }
}
