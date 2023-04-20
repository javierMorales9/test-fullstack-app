import { getFieldsAPI } from "~/apis/fields";
import {
  numericValidatorOptions,
  booleanValidatorOptions,
  stringValidatorOptions,
  timeOperators,
  dateValidatorOptions,
} from "~/components/Automation/constants";
import { FieldType } from "../pages/manage/fields";

let instance;

class FieldStore {
  eventFields: Array<any>;
  userFields: Array<any>;

  constructor() {
    if (instance) {
      throw new Error("New instance can't be created");
    }
    this.eventFields = [];
    this.userFields = [];
    instance = this;
    getFieldsAPI().then((res) => {
      if (res.success()) {
        instance.setFields(res.success());
      }
    });
  }

  setFields(fields) {
    this.eventFields.push(...fields.filter((f) => f.entity === "event"));
    this.userFields.push(...fields.filter((f) => f.entity === "user"));
  }
}

let fieldHolder = Object.freeze(new FieldStore());

export function getFieldOptions(_fields) {
  return _fields.map((f) => ({
    label: f.name,
    id: f.name,
  }));
}

export function getFieldType(fields, fieldName) {
  const filtered = fields.filter((f) => f.name === fieldName);
  return filtered.length ? filtered[0].type : "";
}

export function getValidatorOptions(fieldType) {
  switch (fieldType) {
    case FieldType.String:
      return stringValidatorOptions;
    case FieldType.Boolean:
      return booleanValidatorOptions;
    case "time":
      return timeOperators;
    case FieldType.Number:
      return numericValidatorOptions;
    case FieldType.Date:
      return dateValidatorOptions;
    default:
      return [];
  }
}

export default fieldHolder;
