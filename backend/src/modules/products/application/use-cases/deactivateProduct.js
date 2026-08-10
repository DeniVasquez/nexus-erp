import { ProductNotFoundError } from '../../domain/errors.js';

export class DeactivateProductUseCase {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async execute(id) {
    const product = await this.productRepository.findById(id);
    if (!product) throw new ProductNotFoundError();

    return this.productRepository.update(id, { isActive: false });
  }
}
