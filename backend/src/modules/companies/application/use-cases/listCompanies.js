export class ListCompaniesUseCase {
  constructor(companyRepository) {
    this.companyRepository = companyRepository;
  }

  async execute({ search, isActive, plan, page = 1, limit = 10 } = {}) {
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;

    const { items, total } = await this.companyRepository.findAll({
      search,
      isActive,
      plan,
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
