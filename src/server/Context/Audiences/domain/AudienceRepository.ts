import { Audience } from './Audience';

export interface AudienceRepository {
  getAll(accountId: string): Promise<Audience[]>;
  getById(audienceId: string): Promise<Audience | null>;
  save(audience: Audience): Promise<Audience | null>;
  delete(audienceId: string, accountId: string): Promise<void>;
  deleteAll(accountId: string): Promise<void>;
}
