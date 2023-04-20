export class AudienceRequest {
  public readonly name: string;
  public readonly segments: SegmentRequest[];
  public id?: string;

  constructor(data: any) {
    if (!data.name || !(typeof data.name === "string"))
      throw new Error("Incorrect Audience data");

    this.name = data.name;
    this.segments = data.segments;
    this.id = data.id;
  }
}

export class SegmentRequest {
  public field: string;
  public operator: string;
  public value: string | number | Date;

  constructor(data: any) {
    if (
      !data.field ||
      typeof data.field !== "string" ||
      !data.operator ||
      typeof data.operator !== "string" ||
      !data.value
    )
      throw new Error("Invalid audience segment data");

    this.field = data.field;
    this.operator = data.operator;
    this.value = data.value;
  }
}
