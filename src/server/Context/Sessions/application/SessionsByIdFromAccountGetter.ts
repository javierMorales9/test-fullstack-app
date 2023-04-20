import { SessionRepository } from "../domain/SessionRepository";
import { Session } from "../domain/session";
import { Uuid } from "../../../Context/Shared/domain/value-object/Uuid";
import SessionNotFoundError from "../domain/errors/SessionNotFoundError";

export default class SessionsByIdFromAccountGetter {
  public constructor(private sessionRepo: SessionRepository) {}

  public async getById(id: string, account: Uuid): Promise<Session> {
    const session = await this.sessionRepo.getById(id);

    if (!session || session.flow.account.id.value !== account.value)
      throw new SessionNotFoundError(id);

    return session;
  }
}
