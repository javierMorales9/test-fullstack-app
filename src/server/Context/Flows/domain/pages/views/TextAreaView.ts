import { View } from "./View";
import { TextArea } from "../TextArea";

export class TextAreaView extends View {
  public title: string;
  public description: string;

  constructor(textArea: TextArea) {
    super(textArea.id, textArea.type);

    this.title = textArea.title;
    this.description = textArea.description;
  }
}
