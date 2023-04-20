import { Pause } from "../Pause";

export class PauseResponse {
  public id?: string;
  public type: "pause";
  public title: string;
  public message: string;
  public maxPauseMonth: number;
  public accountId: string;

  constructor(pause: Pause) {
    this.id = pause.id.value;
    this.type = "pause";
    this.title = pause.title;
    this.message = pause.message;
    this.maxPauseMonth = pause.maxPauseMonth;
    this.accountId = pause.account.value;
  }
}
