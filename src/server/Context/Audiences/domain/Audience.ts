import { AudienceRequest } from './AudienceRequest';
import { createSegmentFromRequest, Segment } from './Segment';
import { Uuid } from '../../../Context/Shared/domain/value-object/Uuid';
import { UserData } from '../../../Context/Shared/domain/UserData';

export class Audience {
  constructor(
    public id: Uuid,
    public readonly name: string,
    public readonly segments: Segment[],
    public readonly account: Uuid,
  ) {}

  public static fromRequest(
    request: AudienceRequest,
    accountId: Uuid,
  ): Audience {
    const id = request.id ? new Uuid(request.id) : Uuid.random();

    return new Audience(
      id,
      request.name,
      request.segments.map((el) => createSegmentFromRequest(el)),
      accountId,
    );
  }

  public static fromPrimitives(data: {
    id: string;
    name: string;
    segments: Segment[];
    account: string;
  }) {
    return new Audience(
      new Uuid(data.id),
      data.name,
      data.segments,
      new Uuid(data.account),
    );
  }

  public checkUserData(userData: UserData) {
    for (const segment of this.segments)
      if (!segment.checkUserData(userData)) return false;

    return true;
  }
}
