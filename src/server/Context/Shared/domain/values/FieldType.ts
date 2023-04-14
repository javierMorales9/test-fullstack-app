import { InvalidArgumentError } from '../value-object/InvalidArgumentError';

type FieldTypeValue = 'boolean' | 'string' | 'number' | 'Date';

export default class FieldType {
  constructor(private _value: FieldTypeValue) {
    this.ensureValueIsDefined(_value);
  }

  private ensureValueIsDefined(value: string): void {
    if (value === null || value === undefined) {
      throw new InvalidArgumentError('Value must be defined');
    }
  }

  checkValue(value: any) {
    switch (this.value) {
      case 'boolean':
        return typeof value === 'boolean';
      case 'string':
        return typeof value === 'string';
      case 'number':
        return typeof value === 'number';
      case 'Date':
        return value instanceof Date;
    }
    return false;
  }

  normalizeValue(newValue: any) {
    switch (this.value) {
      case 'boolean':
        return Boolean(newValue);
      case 'string':
        return String(newValue);
      case 'number':
        return Number(newValue);
      case 'Date':
        return new Date(newValue);
    }

    return null;
  }

  get value(): FieldTypeValue {
    return this._value;
  }

  toString(): string {
    return this.value.toString();
  }
}
