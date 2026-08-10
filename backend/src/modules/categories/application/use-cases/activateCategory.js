import { CategoryNotFoundError } from '../../domain/errors.js';

export class ActivateCategoryUseCase {
  constructor(categoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  async execute(id) {
    const category = await this.categoryRepository.findById(id);
    if (!category) throw new CategoryNotFoundError();

    return this.categoryRepository.update(id, { isActive: true });
  }
}
