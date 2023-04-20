import { SessionRepository } from "../domain/SessionRepository";

export default class PreviewSessionDestroyer {
  constructor(private sessionRepo: SessionRepository) {}

  public execute(token: string): Promise<void> {
    return this.sessionRepo.deleteByToken(token);
  }
}
