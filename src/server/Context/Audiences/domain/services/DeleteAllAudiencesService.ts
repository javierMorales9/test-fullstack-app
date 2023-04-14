import { AudienceRepository } from '../AudienceRepository';
import { Uuid } from '../../../../Context/Shared/domain/value-object/Uuid';

export default class DeleteAllAudiencesService {
  constructor(private audienceRepo: AudienceRepository) {}

  async execute(accountId: Uuid) {
    await this.audienceRepo.deleteAll(accountId.value);
  }
}
