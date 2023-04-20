export class TextAreaRequest {
  public type: "textarea";
  public title: string;
  public description: string;
  public order: number;
  public id?: string;

  constructor(data: any) {
    if (
      !data.type ||
      data.type !== "textarea" ||
      !data.title ||
      !data.description ||
      !data.order
    )
      throw new Error("Bad Text Area Page");

    this.type = data.type;
    this.title = data.title;
    this.description = data.description;
    this.order = data.order;
    this.id = data.id || undefined;
  }
}
