import logger from "../../../Context/Shared/infrastructure/logger/logger";
import { Uuid } from "../../../Context/Shared/domain/value-object/Uuid";
import { AudienceRepository } from "../domain/AudienceRepository";

export default class AllAudiencesGetter {
  constructor(private audienceRepo: AudienceRepository) {}

  public async execute(accountId: Uuid) {
    logger.debug("get all the audiences use case entered");
    return await this.audienceRepo.getAll(accountId.value);
  }
}
