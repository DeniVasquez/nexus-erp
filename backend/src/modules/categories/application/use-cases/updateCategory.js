import { CategoryNotFoundError, DuplicateCategoryNameError } from '../../domain/errors.js';

export class UpdateCategoryUseCase {
  constructor(categoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  async execute(id, changes) {
    const category = await this.categoryRepository.findById(id);
    if (!category) throw new CategoryNotFoundError();

    if (changes.name && changes.name !== category.name) {
      const nameTaken = await this.categoryRepository.findByName(changes.name);
      if (nameTaken) throw new DuplicateCategoryNameError();
    }

    return this.categoryRepository.update(id, changes);
  }
}
