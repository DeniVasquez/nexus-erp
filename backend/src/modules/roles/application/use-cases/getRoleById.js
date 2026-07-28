import { RoleNotFoundError } from '../../domain/errors.js';

export class GetRoleByIdUseCase {
  constructor(roleRepository) {
    this.roleRepository = roleRepository;
  }

  async execute(id) {
    const role = await this.roleRepository.findById(id);
    if (!role) throw new RoleNotFoundError();
    return role;
  }
}
