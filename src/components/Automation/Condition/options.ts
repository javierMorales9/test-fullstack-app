export enum ConditionInputType {
  USER_PROPERTY = "user-property-input",
  USER_EVENT_INPUT = "user-event-input",
  EVENT_PROPERTY = "event-property-input",
  SURVEY_INTERACTION = "survey-interaction-input",
  USER_RESPONSE = "user-response-input",
}

export enum EventConditionType {
  PERFORMED_EVENT = "performed-event-condition",
  AND_PERFORMED_EVENT = "and-event-condition",
  OR_PERFORMED_EVENT = "or-event-condition",
}

export enum UserConditionType {
  USER_PROPERTY = "user-property-condition",
  AND_USER_PROPERTY = "and-user-condition",
  OR_USER_PROPERTY = "or-user-condition",
}

export enum SurveyConditionType {
  SURVEY_INTERACTION = "survey-interaction-condition",
  AND_SURVEY_INTERACTION = "and-survey-interaction-condition",
  OR_SURVEY_INTERACTION = "or-survey-interaction-condition",
}

export enum UserResponseConditionType {
  USER_RESPONSE = "user-response-condition",
  AND_USER_RESPONSE = "and-user-response-condition",
  OR_USER_RESPONSE = "or-user-response-condition",
}
