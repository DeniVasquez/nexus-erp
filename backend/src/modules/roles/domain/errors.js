export class DomainError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class RoleNotFoundError extends DomainError {
  constructor() {
    super('Rol no encontrado');
  }
}

export class DuplicateRoleNameError extends DomainError {
  constructor() {
    super('Ya existe un rol con ese nombre');
  }
}

export class InvalidRoleIdError extends DomainError {
  constructor() {
    super('Id no válido');
  }
}

export class SystemRoleNameImmutableError extends DomainError {
  constructor() {
    super('No se puede cambiar el nombre de roles del sistema');
  }
}

export class SystemRoleImmutableError extends DomainError {
  constructor() {
    super('No se pueden eliminar roles del sistema');
  }
}

export class RoleInUseError extends DomainError {
  constructor(count) {
    super(`No se puede eliminar. Hay ${count} usuario(s) con este rol`);
  }
}
