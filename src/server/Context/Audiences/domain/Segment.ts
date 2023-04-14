import { SegmentRequest } from "./AudienceRequest";
import { UserData } from "../../../Context/Shared/domain/UserData";

type Field = keyof UserData;
type SimpleValueType = string | number | Date;
type ArrayValueType = [number, number] | [Date, Date];
type ValueType = SimpleValueType | ArrayValueType;

type OperatorGroup = {
  operators: string[];
  parseRequestFunction: (value: any) => any;
  checkDataFunctions: ((
    valueToCheck: SimpleValueType,
    segmentValue: any
  ) => boolean)[];
};

const equalOperators = ["is", "is not"];
const sizeOperators = ["less than or equal to", "greater than or equal to"];
const betweenOperators = ["between", "not between"];

const parseValueString = (value: any) => {
  if (typeof value === "string") return value;
  throw new Error();
};
const parseValueNumber = (value: any) => {
  if (typeof value === "number") return value;

  const parsed = parseFloat(value);

  if (parsed) return parsed;

  throw new Error();
};
const parseValueDate = (value: any) => {
  if (value instanceof Date) return value;

  const date = new Date(value);

  if (date) return date;

  throw new Error();
};
const parseNumberValueBetween = (value: any): number[] => {
  if (!Array.isArray(value) || value.length !== 2) throw new Error();

  return value.map((el) => parseFloat(el));
};

const parseDateValueBetween = (value: any): Date[] => {
  if (!Array.isArray(value) || value.length !== 2) throw new Error();

  return value.map((el) => new Date(el));
};

const equal = (valueToCheck: SimpleValueType, segmentValue: SimpleValueType) =>
  valueToCheck === segmentValue;
const notEqual = (
  valueToCheck: SimpleValueType,
  segmentValue: SimpleValueType
) => valueToCheck !== segmentValue;
const smaller = (
  valueToCheck: SimpleValueType,
  segmentValue: SimpleValueType
) => valueToCheck <= segmentValue;
const greater = (
  valueToCheck: SimpleValueType,
  segmentValue: SimpleValueType
) => valueToCheck >= segmentValue;
const between = (valueToCheck: SimpleValueType, segmentValue: ArrayValueType) =>
  valueToCheck >= segmentValue[0] && valueToCheck <= segmentValue[1];
const notBetween = (
  valueToCheck: SimpleValueType,
  segmentValue: ArrayValueType
) => valueToCheck < segmentValue[0] || valueToCheck > segmentValue[1];

const equalCheckDataFunctions = [equal, notEqual];
const sizeCheckDataFunctions = [smaller, greater];
const betweenCheckDataFunctions = [between, notBetween];

const valueValidators = new Map<Field, OperatorGroup[]>([
  [
    "plan",
    [
      {
        operators: equalOperators,
        parseRequestFunction: parseValueString,
        checkDataFunctions: equalCheckDataFunctions
      }
    ]
  ],
  [
    "subscriptionPrice",
    [
      {
        operators: sizeOperators,
        parseRequestFunction: parseValueNumber,
        checkDataFunctions: sizeCheckDataFunctions
      },
      {
        operators: betweenOperators,
        parseRequestFunction: parseNumberValueBetween,
        checkDataFunctions: betweenCheckDataFunctions
      }
    ]
  ],
  [
    "billingInterval",
    [
      {
        operators: equalOperators,
        parseRequestFunction: parseValueString,
        checkDataFunctions: equalCheckDataFunctions
      }
    ]
  ],
  [
    "subscriptionAge",
    [
      {
        operators: sizeOperators,
        parseRequestFunction: parseValueNumber,
        checkDataFunctions: sizeCheckDataFunctions
      },
      {
        operators: betweenOperators,
        parseRequestFunction: parseNumberValueBetween,
        checkDataFunctions: betweenCheckDataFunctions
      }
    ]
  ],
  [
    "subscriptionStartDate",
    [
      {
        operators: sizeOperators,
        parseRequestFunction: parseValueDate,
        checkDataFunctions: sizeCheckDataFunctions
      },
      {
        operators: betweenOperators,
        parseRequestFunction: parseDateValueBetween,
        checkDataFunctions: betweenCheckDataFunctions
      }
    ]
  ],
  [
    "subscriptionStatus",
    [
      {
        operators: equalOperators,
        parseRequestFunction: parseValueString,
        checkDataFunctions: equalCheckDataFunctions
      }
    ]
  ]
]);

export class Segment {
  constructor(
    public field: Field,
    public operator: string,
    public value: ValueType
  ) {
  }

  public checkUserData(userData: UserData) {
    const userValue = userData[this.field];
    const operatorGroups = valueValidators.get(this.field)!;

    for (let i = 0; i < operatorGroups.length; i++) {
      const operatorGroup = operatorGroups[i];
      if (!operatorGroup) continue;

      if (operatorGroup.operators.includes(this.operator)) {
        const operatorIndex = operatorGroup.operators.indexOf(this.operator);
        return operatorGroup.checkDataFunctions[operatorIndex]!(
          userValue,
          this.value
        );
      }
    }

    return false;
  }
}

export const createSegmentFromRequest = (request: SegmentRequest) => {
  const field = getValidatedField(request.field);
  const operator = getValidatedOperator(field, request.operator);
  const value = getValidatedValue(field, operator, request.value);

  return new Segment(field, operator, value);
};

const getValidatedField = (requestField: any): Field => {
  if (!requestField || !valueValidators.has(requestField))
    throw new Error("Invalid segment field " + requestField || "");

  return requestField as Field;
};

const getValidatedOperator = (field: Field, requestOperator: any) => {
  const operatorGroups = valueValidators.get(field)!;
  const allOperators = operatorGroups.reduce(
    (previousValue: string[], currentValue) => {
      return previousValue.concat(currentValue.operators);
    },
    []
  );

  if (!requestOperator || !allOperators.includes(requestOperator))
    throw new Error("Invalid segment operator " + requestOperator || "");

  return requestOperator as string;
};

const getValidatedValue = (field: Field, operator: string, value: any) => {
  if (!value) throw new Error("Value is undefined");

  try {
    const operatorGroup = getOperatorGroup(field, operator);
    return operatorGroup.parseRequestFunction(value) as ValueType;
  } catch (err) {
    throw new Error(
      "Invalid value " +
      value +
      " for field " +
      field +
      " and operator " +
      operator
    );
  }
};

function getOperatorGroup(field: Field, operator: string) {
  const operatorGroups = valueValidators.get(field)!;
  let operatorGroup: OperatorGroup | null = null;
  for (const og of operatorGroups) {
    if (og.operators.includes(operator)) operatorGroup = og;
  }

  if (!operatorGroup)
    throw new Error("Invalid operator operator for field " + field);

  return operatorGroup;
}
