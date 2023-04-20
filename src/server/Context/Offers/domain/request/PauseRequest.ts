export class PauseRequest {
  public type: "pause";
  public title: string;
  public message: string;
  public maxPauseMonth: number;
  public id?: string;

  constructor(data: any) {
    if (
      !data.type ||
      data.type !== "pause" ||
      !data.title ||
      !data.message ||
      !data.maxPauseMonth
    )
      throw new Error("Bad Offer");

    this.type = data.type;
    this.title = data.title;
    this.message = data.message;
    this.maxPauseMonth = data.maxPauseMonth;
    this.id = data.id || undefined;
  }
}
