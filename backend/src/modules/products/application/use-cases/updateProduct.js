import {
  ProductNotFoundError,
  SubCategoryNotFoundForProductError,
  UnitNotFoundForProductError,
  DuplicateProductCodeError,
} from '../../domain/errors.js';

export class UpdateProductUseCase {
  constructor(productRepository, subCategoryRepository, unitRepository) {
    this.productRepository = productRepository;
    this.subCategoryRepository = subCategoryRepository;
    this.unitRepository = unitRepository;
  }

  async execute(id, changes) {
    const product = await this.productRepository.findById(id);
    if (!product) throw new ProductNotFoundError();

    if (changes.code && changes.code !== product.code) {
      const codeTaken = await this.productRepository.findByCode(changes.code);
      if (codeTaken) throw new DuplicateProductCodeError();
    }

    if (changes.subCategory) {
      const subCategory = await this.subCategoryRepository.findById(changes.subCategory);
      if (!subCategory) throw new SubCategoryNotFoundForProductError();
    }

    const unitFields = ['unit', 'purchaseUnit', 'saleUnit'].filter((field) => changes[field]);
    if (unitFields.length > 0) {
      const foundUnits = await Promise.all(unitFields.map((field) => this.unitRepository.findById(changes[field])));
      if (foundUnits.some((found) => !found)) throw new UnitNotFoundForProductError();
    }

    return this.productRepository.update(id, changes);
  }
}
