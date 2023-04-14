import { AudienceRequest } from '../domain/AudienceRequest';
import { Audience } from '../domain/Audience';
import { AudienceRepository } from '../domain/AudienceRepository';
import { Uuid } from '../../../Context/Shared/domain/value-object/Uuid';

export default class AudienceSaver {
  constructor(private audienceRepo: AudienceRepository) {}

  async execute(request: AudienceRequest, accountId: Uuid) {
    const audience = Audience.fromRequest(request, accountId);

    const savedAudience = await this.audienceRepo.save(audience);

    if (!savedAudience) throw new Error();

    return savedAudience;
  }
}
