export class ListSupplierContactsUseCase {
  constructor(supplierContactRepository) {
    this.supplierContactRepository = supplierContactRepository;
  }

  async execute({ search, supplier, isActive, page = 1, limit = 10 } = {}) {
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;

    const { items, total } = await this.supplierContactRepository.findAll({
      search,
      supplier,
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
