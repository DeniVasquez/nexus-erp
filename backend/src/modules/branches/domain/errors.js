export class DomainError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class BranchNotFoundError extends DomainError {
  constructor() {
    super('Sucursal no encontrada');
  }
}

export class InvalidBranchIdError extends DomainError {
  constructor() {
    super('Id no válido');
  }
}

export class CompanyNotFoundForBranchError extends DomainError {
  constructor() {
    super('La empresa indicada no existe');
  }
}

export class DuplicateBranchNameError extends DomainError {
  constructor() {
    super('Ya existe una sucursal con ese nombre en esta empresa');
  }
}

export class InvalidLocationError extends DomainError {
  constructor() {
    super('Departamento, municipio o distrito no válidos');
  }
}
