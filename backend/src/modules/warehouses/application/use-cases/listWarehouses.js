export class ListWarehousesUseCase {
  constructor(warehouseRepository) {
    this.warehouseRepository = warehouseRepository;
  }

  async execute({ search, branch, warehouseCategory, isActive, page = 1, limit = 10 } = {}) {
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;

    const { items, total } = await this.warehouseRepository.findAll({
      search,
      branch,
      warehouseCategory,
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
