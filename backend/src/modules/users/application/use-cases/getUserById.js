import { UserNotFoundError } from '../../domain/errors.js';

export class GetUserByIdUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(id) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new UserNotFoundError();
    return user;
  }
}
