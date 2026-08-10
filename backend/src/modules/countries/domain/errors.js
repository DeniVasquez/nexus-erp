export class DomainError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class CountryNotFoundError extends DomainError {
  constructor() {
    super('País no encontrado');
  }
}

export class InvalidCountryIdError extends DomainError {
  constructor() {
    super('Id no válido');
  }
}

export class DuplicateCountryNameError extends DomainError {
  constructor() {
    super('Ya existe un país con ese nombre');
  }
}
