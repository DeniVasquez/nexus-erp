import { extractGeoId } from '#shared/lib/geoValidation.js';
import {
  WarehouseNotFoundError,
  WarehouseCategoryNotFoundForWarehouseError,
  DuplicateWarehouseNameError,
} from '../../domain/errors.js';

export class UpdateWarehouseUseCase {
  constructor(warehouseRepository, warehouseCategoryRepository) {
    this.warehouseRepository = warehouseRepository;
    this.warehouseCategoryRepository = warehouseCategoryRepository;
  }

  async execute(id, changes) {
    const warehouse = await this.warehouseRepository.findById(id);
    if (!warehouse) throw new WarehouseNotFoundError();

    if (changes.name && changes.name !== warehouse.name) {
      const nameTaken = await this.warehouseRepository.findByNameAndBranch(changes.name, extractGeoId(warehouse.branch));
      if (nameTaken) throw new DuplicateWarehouseNameError();
    }

    if (changes.warehouseCategory) {
      const category = await this.warehouseCategoryRepository.findById(changes.warehouseCategory);
      if (!category) throw new WarehouseCategoryNotFoundForWarehouseError();
    }

    return this.warehouseRepository.update(id, changes);
  }
}
