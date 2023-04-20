import { TextArea } from "../TextArea";

export class TextAreaResponse {
  public id: string;
  public type: "textarea";
  public title: string;
  public description: string;
  public order: number;

  constructor(textArea: TextArea) {
    this.id = textArea.id;
    this.type = "textarea";
    this.title = textArea.title;
    this.description = textArea.description;
    this.order = textArea.order;
  }
}
