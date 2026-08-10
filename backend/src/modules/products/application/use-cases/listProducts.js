export class ListProductsUseCase {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async execute({ search, subCategory, isActive, page = 1, limit = 10 } = {}) {
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;

    const { items, total } = await this.productRepository.findAll({
      search,
      subCategory,
      isActive,
      page: pageNum,
      limit: limitNum,
    });

    return {
      items,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    };
  }
}
