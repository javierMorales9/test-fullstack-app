import { ValueObject } from "./ValueObject";

export default class Percentage extends ValueObject<number> {
  constructor(value: number) {
    if (value < 0 || value > 100) {
      throw new Error("Invalid percentage value");
    }
    super(value);
  }

  toPrimitives(): number {
    return this.value;
  }
}
