import { WarehouseNotFoundError } from '../../domain/errors.js';

export class GetWarehouseByIdUseCase {
  constructor(warehouseRepository) {
    this.warehouseRepository = warehouseRepository;
  }

  async execute(id) {
    const warehouse = await this.warehouseRepository.findById(id);
    if (!warehouse) throw new WarehouseNotFoundError();
    return warehouse;
  }
}
