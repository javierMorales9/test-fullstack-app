import { Audience } from "../domain/Audience";
import { Segment } from "../domain/Segment";

export function transformToArrayOfAudiencesFromRepo(
  audiencesReceived: any[],
): Audience[] {
  const audiences: Audience[] = [];

  for (const audienceReceived of audiencesReceived) {
    const audience = transformToAudienceFromRepo(audienceReceived);

    if (audience != null) audiences.push(audience);
  }

  return audiences;
}

export function transformToAudienceFromRepo(
  entryAudience: any,
): Audience | null {
  if (!entryAudience) return null;

  const audience = entryAudience._doc ? entryAudience._doc : entryAudience;

  return Audience.fromPrimitives({
    id: audience._id.toString(),
    name: audience.name,
    segments: audience.segments.map((el: any) => transformSegment(el)),
    account: audience.account,
  });
}

export function transformSegment(el: any) {
  el = el._doc ? el._doc : el;
  return new Segment(el.field, el.operator, el.value);
}
