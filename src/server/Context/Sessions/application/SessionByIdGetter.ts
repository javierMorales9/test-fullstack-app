import { SessionRepository } from '../domain/SessionRepository';
import { Session } from '../domain/session';
import SessionNotFoundError from '../domain/errors/SessionNotFoundError';

export default class SessionByIdGetter {
  public constructor(private sessionRepo: SessionRepository) {}

  public async getById(id: string): Promise<Session> {
    try {
      const session = await this.sessionRepo.getById(id);

      if (session) return session;

      throw new Error();
    } catch (err) {
      throw new SessionNotFoundError(id);
    }
  }
}
