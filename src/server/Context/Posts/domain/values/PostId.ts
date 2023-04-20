import validate from "uuid-validate";
import { v4 as uuidv4 } from "uuid";

export class PostId {
  readonly value: string;

  constructor(value: any) {
    //check if the value is a string
    if (!validate(value)) throw new Error("Not valid PostId");

    this.value = value;
  }

  static random() {
    return new PostId(uuidv4());
  }
}
