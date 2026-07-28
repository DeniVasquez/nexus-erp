import { BranchNotFoundError } from '../../domain/errors.js';

export class GetBranchByIdUseCase {
  constructor(branchRepository) {
    this.branchRepository = branchRepository;
  }

  async execute(id) {
    const branch = await this.branchRepository.findById(id);
    if (!branch) throw new BranchNotFoundError();
    return branch;
  }
}
