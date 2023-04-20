// TODO: Remove unused options after API integration

export enum TriggerOption {
  USER_PERFORMS_AN_EVENT = "user-performs-an-event",
  USER_FIRST_SEEN = "user-first-seen",
  USER_MATCHES_ACONDITION = "user-matches-a-condition",
}

export enum EventPropertyType {
  EVENT_PROPERTY = "event-property-condition",
  AND_EVENT_PROPERTY = "and-event-condition",
  OR_EVENT_PROPERTY = "or-event-condition",
}

export enum CompoundConditionType {
  OR_USER_CONDITION = "or-user-condition",
  AND_USER_CONDITION = "and-user-condition",
}

export const triggerOptions = [
  {
    id: TriggerOption.USER_PERFORMS_AN_EVENT,
    label: "User performs an event",
  },
  {
    id: TriggerOption.USER_FIRST_SEEN,
    label: "User first seen",
  },
  {
    id: TriggerOption.USER_MATCHES_ACONDITION,
    label: "User matches a condition",
  },
];

export const eventProperties = [
  {
    id: "event-property-1",
    label: "Event Property 1",
  },
  {
    id: "event-property-2",
    label: "Event Property 2",
  },
  {
    id: "event-property-3",
    label: "Event Property 3",
  },
];

export enum UserProperty {
  NAME = "name",
  EMAIL = "email",
  BIO = "bio",
}

export const userProperties = [
  {
    id: UserProperty.NAME,
    label: "Name",
  },
  {
    id: UserProperty.EMAIL,
    label: "Email",
  },
  {
    id: UserProperty.BIO,
    label: "Bio",
  },
];

export enum EventOption {
  EVENT_1 = "event-1",
  EVENT_2 = "event-2",
  EVENT_3 = "event-3",
}

export const eventOptions = [
  { id: EventOption.EVENT_1, label: "Event 1" },
  { id: EventOption.EVENT_2, label: "Event 2" },
  { id: EventOption.EVENT_3, label: "Event 3" },
];

export enum NumericValidator {
  LESS_THAN = "less-than-number-validator",
  LESS_THAN_OR_EQUAL_TO = "less-than-or-equal-to-number-validator",
  GREATER_THAN = "greater-than-number-validator",
  GREATER_THAN_OR_EQUAL_TO = "greater-than-or-equal-to-number-validator",
  EQUAL_TO = "equal-to-number-validator",
  HAS_ANY_VALUE = "has-any-value-number-validator",
  HAS_NO_VALUE = "has-no-value-number-validator",
}

export const numericValidatorOptions = [
  {
    id: NumericValidator.LESS_THAN,
    label: "less than",
  },
  {
    id: NumericValidator.LESS_THAN_OR_EQUAL_TO,
    label: "less than or equal to",
  },
  {
    id: NumericValidator.GREATER_THAN,
    label: "greater than",
  },
  {
    id: NumericValidator.GREATER_THAN_OR_EQUAL_TO,
    label: "greater than or equal to",
  },
  {
    id: NumericValidator.EQUAL_TO,
    label: "equal to",
  },
  {
    id: NumericValidator.HAS_ANY_VALUE,
    label: "has any value",
    doNotRequireValue: true,
  },
  {
    id: NumericValidator.HAS_NO_VALUE,
    label: "has no value",
    doNotRequireValue: true,
  },
];

export enum BooleanValidator {
  IS = "is-boolean-validator",
  IS_NOT = "is-not-boolean-validator",
  HAS_ANY_VALUE = "has-any-value-boolean-validator",
  HAS_NO_VALUE = "has-no-value-boolean-validator",
}

export const booleanValidatorOptions = [
  {
    id: BooleanValidator.IS,
    label: "is",
    doNotRequireValue: true,
  },
  {
    id: BooleanValidator.IS_NOT,
    label: "is not",
    doNotRequireValue: true,
  },
  {
    id: BooleanValidator.HAS_ANY_VALUE,
    label: "has any value",
    doNotRequireValue: true,
  },
  {
    id: BooleanValidator.HAS_NO_VALUE,
    label: "has no value",
    doNotRequireValue: true,
  },
];

export enum DateValidators {
  LESS_THAN = "less-than-date-validator",
  GREATER_THAN = "greater-than-date-validator",
  EXACTLY = "exactly-date-validator",
  HAS_ANY_VALUE = "has-any-value-date-validator",
  HAS_NO_VALUE = "has-no-value-date-validator",
}

export const dateValidatorOptions = [
  {
    id: DateValidators.LESS_THAN,
    label: "less than",
  },
  {
    id: DateValidators.GREATER_THAN,
    label: "greater than",
  },
  {
    id: DateValidators.EXACTLY,
    label: "exactly",
  },
  {
    id: DateValidators.HAS_ANY_VALUE,
    label: "has any value",
    doNotRequireValue: true,
  },
  {
    id: DateValidators.HAS_NO_VALUE,
    label: "has no value",
    doNotRequireValue: true,
  },
];

export enum StringOperand {
  HAS_ANY_VALUE = "has-any-value-string-validator",
  HAS_NO_VALUE = "has-no-value-string-validator",
  EQUALS = "equals-string-validator",
  DOES_NOT_EQUAL = "does-not-equal-string-validator",
  STARTS_WITH = "starts-with-string-validator",
  DOES_NOT_START_WITH = "does-not-start-with-string-validator",
  ENDS_WITH = "ends-with-string-validator",
  DOES_NOT_END_WITH = "does-not-end-with-string-validator",
  CONTAINS = "contains-string-validator",
  DOES_NOT_CONTAIN = "does-not-contains-string-validator",
}

export const stringValidatorOptions = [
  {
    id: StringOperand.HAS_ANY_VALUE,
    //id: 'has-any-value-string-validator',
    label: "has any value",
    doNotRequireValue: true,
  },
  {
    id: StringOperand.HAS_NO_VALUE,
    label: "has no value",
    doNotRequireValue: true,
  },
  {
    id: StringOperand.EQUALS,
    label: "equals",
  },
  {
    id: StringOperand.DOES_NOT_EQUAL,
    label: "does not equal",
  },
  {
    id: StringOperand.STARTS_WITH,
    label: "starts with",
  },
  {
    id: StringOperand.DOES_NOT_START_WITH,
    label: "does not start with",
  },
  {
    id: StringOperand.ENDS_WITH,
    label: "ends with",
  },
  {
    id: StringOperand.DOES_NOT_END_WITH,
    label: "does not end with",
  },
  {
    id: StringOperand.CONTAINS,
    label: "contains",
  },
  {
    id: StringOperand.DOES_NOT_CONTAIN,
    label: "does not contain",
  },
];

export enum QuantityOption {
  EXACTLY_VALIDATOR = "exactly-validator",
  ATLEAST_VALIDATOR = "at-least-validator",
  ATMOST_VALIDATOR = "at-most-validator",
}

export const quantityOptions = [
  {
    id: QuantityOption.EXACTLY_VALIDATOR,
    label: "exactly",
  },
  {
    id: QuantityOption.ATLEAST_VALIDATOR,
    label: "at least",
  },
  {
    id: QuantityOption.ATMOST_VALIDATOR,
    label: "at most",
  },
];

export enum Occurrence {
  EVER = "ever-validator",
  WITHIN_LAST = "with-in-the-last-validator",
  SINCE = "since-validator",
  BETWEEN = "between-validator",
}

export const occurrenceOperators = [
  {
    id: Occurrence.EVER,
    label: "ever",
    doNotRequireValue: true,
  },
  {
    id: Occurrence.WITHIN_LAST,
    label: "with in the last",
  },
  {
    id: Occurrence.SINCE,
    label: "since",
  },
  {
    id: Occurrence.BETWEEN,
    label: "between",
  },
];

export enum Time {
  DAYS = "days",
  WEEKS = "weeks",
  MONTHS = "months",
  YEARS = "years",
}

export const timeOperators = [
  {
    id: Time.DAYS,
    label: "days",
  },
  {
    id: Time.WEEKS,
    label: "weeks",
  },
  {
    id: Time.MONTHS,
    label: "months",
  },
  {
    id: Time.YEARS,
    label: "years",
  },
];

export const InteractionType = "interaction-validator";
export enum InteractionTypes {
  COMPLETED_SURVEY = "completed-survey",
  DID_NOT_COMPLETE_SURVEY = "did-not-complete-survey",
  STARTED_SURVEY = "started-survey",
  DID_NOT_STARTED_SURVEY = "did-not-started-survey",
  DISMISSED_SURVEY = "dismissed-survey",
  DID_NOT_DISMISS_SURVEY = "did-not-dismiss-survey",
  SAW_SURVEY = "saw-survey",
  DID_NOT_SAW_SURVEY = "did-not-saw-survey",
}

export const interactionTypes = [
  {
    id: InteractionTypes.COMPLETED_SURVEY,
    label: "completed survey",
  },
  {
    id: InteractionTypes.DID_NOT_COMPLETE_SURVEY,
    label: "did not complete survey",
  },
  {
    id: InteractionTypes.STARTED_SURVEY,
    label: "started survey",
  },
  {
    id: InteractionTypes.DID_NOT_STARTED_SURVEY,
    label: "did not start survey",
  },
  {
    id: InteractionTypes.DISMISSED_SURVEY,
    label: "dismissed survey",
  },
  {
    id: InteractionTypes.DID_NOT_DISMISS_SURVEY,
    label: "did not dismiss survey",
  },
  {
    id: InteractionTypes.SAW_SURVEY,
    label: "saw survey",
  },
  {
    id: InteractionTypes.DID_NOT_SAW_SURVEY,
    label: "did not saw survey",
  },
];

export const TimeFrameType = "timeframe-validator";
