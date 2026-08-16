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

// RN-005: 5 intentos fallidos de autenticación bloquean la cuenta 5 minutos.
export class UserLockedError extends DomainError {
  constructor(retryAfterSeconds) {
    const minutes = Math.ceil(retryAfterSeconds / 60);
    super(`Cuenta bloqueada por múltiples intentos fallidos. Intenta de nuevo en ${minutes} minuto${minutes === 1 ? '' : 's'}.`);
    this.retryAfterSeconds = retryAfterSeconds;
  }
}
