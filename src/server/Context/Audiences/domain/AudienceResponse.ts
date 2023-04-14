import { Audience } from './Audience';
import { Segment } from './Segment';

export class AudienceResponse {
  public id: string;
  public readonly name: string;
  public readonly segments: Segment[];

  constructor(audience: Audience) {
    this.id = audience.id.value;
    this.name = audience.name;
    this.segments = audience.segments;
  }
}
