import { AudienceRepository } from '../AudienceRepository';
import { UserData } from '../../../../Context/Shared/domain/UserData';

export default class CheckAudienceMatchesAUserService {
  constructor(private audienceRepo: AudienceRepository) {}

  async execute(id: string, userData: UserData) {
    const audience = await this.audienceRepo.getById(id);

    if (!audience) throw new Error('Audience not found: ' + id);

    return audience.checkUserData(userData);
  }
}
