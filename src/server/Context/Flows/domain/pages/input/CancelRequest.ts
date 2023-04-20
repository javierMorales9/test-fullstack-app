export class CancelRequest {
  public type: "cancel";
  public title: string;
  public message: string;
  public order: number;
  public id?: string;

  constructor(data: any) {
    if (
      !data.type ||
      data.type !== "cancel" ||
      !data.title ||
      !data.message ||
      !data.order
    )
      throw new Error("Incorrect Cancel page data");

    this.type = data.type;
    this.title = data.title;
    this.message = data.message;
    this.order = data.order;
    this.id = data.id || undefined;
  }
}
