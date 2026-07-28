import { comparePassword } from '#shared/lib/password.js';
import { generateToken } from '#shared/lib/jwt.js';
import { InvalidCredentialsError, UserInactiveError } from '../../domain/errors.js';

export class LoginUseCase {
  constructor(userRepository, writeLogEntryUseCase) {
    this.userRepository = userRepository;
    this.writeLogEntryUseCase = writeLogEntryUseCase;
  }

  async execute({ email, password }, { ipAddress, userAgent } = {}) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new InvalidCredentialsError();

    if (!user.isActive) throw new UserInactiveError();

    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) throw new InvalidCredentialsError();

    const updated = await this.userRepository.update(user.id, { lastLogin: new Date() });

    const token = generateToken({
      id: updated.id,
      email: updated.email,
      roleId: updated.role?._id || updated.role,
    });

    // El log de login no debe tumbar el login si falla; solo se reporta.
    try {
      await this.writeLogEntryUseCase.execute({
        user: updated.id,
        action: 'login',
        resource: 'auth',
        entityId: updated.id,
        entityModel: 'userModel',
        entityName: updated.name,
        details: 'Login exitoso',
        ipAddress,
        userAgent,
        statusCode: 200,
      });
    } catch (error) {
      console.error('Error creating login log:', error);
    }

    return { token, user: updated };
  }
}
