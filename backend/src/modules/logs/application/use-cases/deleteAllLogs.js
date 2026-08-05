export class DeleteAllLogsUseCase {
  constructor(logRepository) {
    this.logRepository = logRepository;
  }

  async execute() {
    const deletedCount = await this.logRepository.deleteAll();
    return { deletedCount };
  }
}
