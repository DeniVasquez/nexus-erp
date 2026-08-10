import { extractGeoId } from '#shared/lib/geoValidation.js';
import {
  SubCategoryNotFoundError,
  DuplicateSubCategoryNameError,
} from '../../domain/errors.js';

export class UpdateSubCategoryUseCase {
  constructor(subCategoryRepository) {
    this.subCategoryRepository = subCategoryRepository;
  }

  async execute(id, changes) {
    const subCategory = await this.subCategoryRepository.findById(id);
    if (!subCategory) throw new SubCategoryNotFoundError();

    if (changes.name && changes.name !== subCategory.name) {
      const nameTaken = await this.subCategoryRepository.findByNameAndCategory(changes.name, extractGeoId(subCategory.category));
      if (nameTaken) throw new DuplicateSubCategoryNameError();
    }

    return this.subCategoryRepository.update(id, changes);
  }
}
