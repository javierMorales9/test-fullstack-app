import { SessionRepository } from '../domain/SessionRepository';
import { Session } from '../domain/session';

export default class AllSessionsGetter {
  constructor(private sessionRepo: SessionRepository) {}

  public async getAll(): Promise<Session[]> {
    return await this.sessionRepo.getAll();
  }
}
