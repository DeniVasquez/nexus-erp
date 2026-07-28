export class DomainError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class WarehouseNotFoundError extends DomainError {
  constructor() {
    super('Almacén no encontrado');
  }
}

export class InvalidWarehouseIdError extends DomainError {
  constructor() {
    super('Id no válido');
  }
}

export class BranchNotFoundForWarehouseError extends DomainError {
  constructor() {
    super('La sucursal indicada no existe');
  }
}

export class WarehouseCategoryNotFoundForWarehouseError extends DomainError {
  constructor() {
    super('La categoría de almacén indicada no existe');
  }
}

export class DuplicateWarehouseNameError extends DomainError {
  constructor() {
    super('Ya existe un almacén con ese nombre en esta sucursal');
  }
}
