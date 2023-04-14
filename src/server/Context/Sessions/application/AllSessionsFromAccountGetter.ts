import { SessionRepository } from '../domain/SessionRepository';
import { Session } from '../domain/session';

export default class AllSessionsFromAccountGetter {
  constructor(private sessionRepo: SessionRepository) {}

  public async getAll(accountId: string): Promise<Session[]> {
    return await this.sessionRepo.getAllFromAccount(accountId);
  }
}
