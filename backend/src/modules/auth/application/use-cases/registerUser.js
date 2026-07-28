import { generateToken } from '#shared/lib/jwt.js';

/**
 * Registro público. Reutiliza el mismo CreateUserUseCase del módulo users
 * (ambos flujos son, en el fondo, "crear una cuenta con un rol válido") y
 * además emite el token de sesión, que es responsabilidad de auth.
 */
export class RegisterUserUseCase {
  constructor(createUserUseCase) {
    this.createUserUseCase = createUserUseCase;
  }

  async execute({ name, email, password, role }) {
    const { user, role: roleDoc } = await this.createUserUseCase.execute({ name, email, password, role });
    const token = generateToken({ id: user.id, email: user.email, roleId: roleDoc.id });

    return { token, user, role: roleDoc };
  }
}
