export class DomainError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class SupplierContactNotFoundError extends DomainError {
  constructor() {
    super('Contacto de proveedor no encontrado');
  }
}

export class InvalidSupplierContactIdError extends DomainError {
  constructor() {
    super('Id no válido');
  }
}

export class SupplierNotFoundForSupplierContactError extends DomainError {
  constructor() {
    super('El proveedor indicado no existe');
  }
}
