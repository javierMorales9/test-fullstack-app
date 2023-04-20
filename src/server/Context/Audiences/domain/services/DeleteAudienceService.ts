import { AudienceRepository } from "../AudienceRepository";
import { Uuid } from "../../../../Context/Shared/domain/value-object/Uuid";

export default class DeleteAudienceService {
  constructor(private audienceRepo: AudienceRepository) {}

  async execute(audienceId: string, accountId: Uuid) {
    await this.audienceRepo.delete(audienceId, accountId.value);
  }
}
