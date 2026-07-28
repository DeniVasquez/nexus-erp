import { Warehouse } from '../../domain/Warehouse.js';
import {
  BranchNotFoundForWarehouseError,
  WarehouseCategoryNotFoundForWarehouseError,
  DuplicateWarehouseNameError,
} from '../../domain/errors.js';

export class CreateWarehouseUseCase {
  constructor(warehouseRepository, branchRepository, warehouseCategoryRepository) {
    this.warehouseRepository = warehouseRepository;
    this.branchRepository = branchRepository;
    this.warehouseCategoryRepository = warehouseCategoryRepository;
  }

  async execute(data) {
    // RN-WHS-001: todo almacén debe pertenecer a una sucursal.
    const branch = await this.branchRepository.findById(data.branch);
    if (!branch) throw new BranchNotFoundForWarehouseError();

    // RN-WHS-002: todo almacén debe tener una categoría asignada.
    const category = await this.warehouseCategoryRepository.findById(data.warehouseCategory);
    if (!category) throw new WarehouseCategoryNotFoundForWarehouseError();

    // Nombre único dentro de la misma sucursal (6.5.8).
    const nameTaken = await this.warehouseRepository.findByNameAndBranch(data.name, data.branch);
    if (nameTaken) throw new DuplicateWarehouseNameError();

    const warehouse = new Warehouse(data);
    return this.warehouseRepository.create(warehouse);
  }
}
