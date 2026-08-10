import { SubCategoryNotFoundError } from '../../domain/errors.js';

export class ActivateSubCategoryUseCase {
  constructor(subCategoryRepository) {
    this.subCategoryRepository = subCategoryRepository;
  }

  async execute(id) {
    const subCategory = await this.subCategoryRepository.findById(id);
    if (!subCategory) throw new SubCategoryNotFoundError();

    return this.subCategoryRepository.update(id, { isActive: true });
  }
}
