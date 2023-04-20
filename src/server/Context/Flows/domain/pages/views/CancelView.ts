import { View } from "./View";
import { Cancel } from "../Cancel";

export class CancelView extends View {
  public title: string;
  public message: string;

  constructor(cancel: Cancel) {
    super(cancel.id, cancel.type);

    this.title = cancel.title;
    this.message = cancel.message;
  }
}
