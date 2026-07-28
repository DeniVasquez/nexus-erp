export class DomainError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class WarehouseCategoryNotFoundError extends DomainError {
  constructor() {
    super('Categoría de almacén no encontrada');
  }
}

export class InvalidWarehouseCategoryIdError extends DomainError {
  constructor() {
    super('Id no válido');
  }
}

export class DuplicateWarehouseCategoryNameError extends DomainError {
  constructor() {
    super('Ya existe una categoría de almacén con ese nombre');
  }
}
