import { Category } from '../../domain/Category.js';
import { DuplicateCategoryNameError } from '../../domain/errors.js';

export class CreateCategoryUseCase {
  constructor(categoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  async execute({ name, description }) {
    const existing = await this.categoryRepository.findByName(name);
    if (existing) throw new DuplicateCategoryNameError();

    const category = new Category({ name, description });
    return this.categoryRepository.create(category);
  }
}
