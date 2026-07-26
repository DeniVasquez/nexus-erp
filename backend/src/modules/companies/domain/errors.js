export class DomainError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class CompanyNotFoundError extends DomainError {
  constructor() {
    super('Empresa no encontrada');
  }
}

export class DuplicateTaxIdError extends DomainError {
  constructor() {
    super('Ya existe una empresa con ese RFC/NIT');
  }
}

export class InvalidCompanyIdError extends DomainError {
  constructor() {
    super('Id no válido');
  }
}
