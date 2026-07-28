export class GetEntityHistoryUseCase {
  constructor(logRepository) {
    this.logRepository = logRepository;
  }

  async execute({ entityId, entityModel }) {
    return this.logRepository.findByEntity({ entityId, entityModel });
  }
}
