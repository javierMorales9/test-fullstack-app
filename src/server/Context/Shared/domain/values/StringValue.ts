import { InvalidArgumentError } from '../value-object/InvalidArgumentError';

export default class StringValue {
  readonly value: string;

  constructor(value: string) {
    this.value = value;
    this.ensureValueIsDefined(value);
  }

  private ensureValueIsDefined(value: any): void {
    if (value === null || value === undefined) {
      throw new InvalidArgumentError('Value must be defined');
    }
  }

  equals(other: StringValue): boolean {
    return (
      other.constructor.name === this.constructor.name &&
      other.value === this.value
    );
  }

  toString(): string {
    return this.value.toString();
  }
}
