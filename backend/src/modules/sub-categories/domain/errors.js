export class DomainError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class SubCategoryNotFoundError extends DomainError {
  constructor() {
    super('Sub-categoría no encontrada');
  }
}

export class InvalidSubCategoryIdError extends DomainError {
  constructor() {
    super('Id no válido');
  }
}

export class CategoryNotFoundForSubCategoryError extends DomainError {
  constructor() {
    super('La categoría indicada no existe');
  }
}

export class DuplicateSubCategoryNameError extends DomainError {
  constructor() {
    super('Ya existe una sub-categoría con ese nombre en esta categoría');
  }
}
