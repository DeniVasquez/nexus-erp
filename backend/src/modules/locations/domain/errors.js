export class DomainError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class LocationNotFoundError extends DomainError {
  constructor() {
    super('Ubicación no encontrada');
  }
}

export class InvalidLocationIdError extends DomainError {
  constructor() {
    super('Id no válido');
  }
}

export class WarehouseNotFoundForLocationError extends DomainError {
  constructor() {
    super('El almacén indicado no existe');
  }
}

export class DuplicateLocationCodeError extends DomainError {
  constructor() {
    super('Ya existe una ubicación con ese código en este almacén');
  }
}

export class InvalidCapacityError extends DomainError {
  constructor() {
    super('La capacidad debe ser mayor que cero');
  }
}

export class DuplicateLocationCoordinatesError extends DomainError {
  constructor() {
    super('Ya existe una ubicación con esa combinación de pasillo, estante, nivel y posición en este almacén');
  }
}
