export class ListSubCategoriesUseCase {
  constructor(subCategoryRepository) {
    this.subCategoryRepository = subCategoryRepository;
  }

  async execute({ search, category, isActive, page = 1, limit = 10 } = {}) {
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;

    const { items, total } = await this.subCategoryRepository.findAll({
      search,
      category,
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
