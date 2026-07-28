import { UserNotFoundError, ForbiddenUserDeletionError, CannotDeleteSelfError } from '../../domain/errors.js';

export class DeleteUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(id, { actingUserId, actingUserRole } = {}) {
    if (actingUserRole !== 'admin') throw new ForbiddenUserDeletionError();
    if (id === actingUserId) throw new CannotDeleteSelfError();

    const deleted = await this.userRepository.remove(id);
    if (!deleted) throw new UserNotFoundError();

    return deleted;
  }
}
