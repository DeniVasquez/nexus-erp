export class DomainError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class InvalidCredentialsError extends DomainError {
  constructor() {
    super('credenciales invalidas');
  }
}

export class UserInactiveError extends DomainError {
  constructor() {
    super('Usuario desactivado. Contacta al administrador.');
  }
}
