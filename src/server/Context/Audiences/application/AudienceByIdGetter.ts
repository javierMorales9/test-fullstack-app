import { AudienceRepository } from '../domain/AudienceRepository';
import AudienceNotFoundError from '../domain/errors/AudienceNotFoundError';

export default class AudienceByIdGetter {
  constructor(private audienceRepo: AudienceRepository) {}

  async execute(audienceId: string) {
    const audience = await this.audienceRepo.getById(audienceId);

    if (!audience) throw new AudienceNotFoundError();

    return audience;
  }
}
