import { LogEntry } from '../../domain/LogEntry.js';

export class WriteLogEntryUseCase {
  constructor(logRepository) {
    this.logRepository = logRepository;
  }

  async execute(data) {
    const entry = new LogEntry(data);
    return this.logRepository.create(entry);
  }
}
