import { randomUUID } from 'node:crypto';
import { Product } from '../../domain/Product.js';
import {
  SubCategoryNotFoundForProductError,
  UnitNotFoundForProductError,
  DuplicateProductCodeError,
} from '../../domain/errors.js';

export class CreateProductUseCase {
  constructor(productRepository, subCategoryRepository, unitRepository) {
    this.productRepository = productRepository;
    this.subCategoryRepository = subCategoryRepository;
    this.unitRepository = unitRepository;
  }

  async execute(data) {
    const subCategory = await this.subCategoryRepository.findById(data.subCategory);
    if (!subCategory) throw new SubCategoryNotFoundForProductError();

    // RN: unidad base, de compra y de venta son FKs independientes (sin
    // factor de conversión por ahora, ver notas de la sesión de diseño).
    const [unit, purchaseUnit, saleUnit] = await Promise.all([
      this.unitRepository.findById(data.unit),
      this.unitRepository.findById(data.purchaseUnit),
      this.unitRepository.findById(data.saleUnit),
    ]);
    if (!unit || !purchaseUnit || !saleUnit) throw new UnitNotFoundForProductError();

    // RN-013: cada producto debe poseer un código único.
    const codeTaken = await this.productRepository.findByCode(data.code);
    if (codeTaken) throw new DuplicateProductCodeError();

    const product = new Product({ ...data, uuid: randomUUID() });
    return this.productRepository.create(product);
  }
}
