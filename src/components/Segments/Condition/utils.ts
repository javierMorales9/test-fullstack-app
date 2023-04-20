import {
  EventConditionType,
  SurveyConditionType,
  UserConditionType,
  UserResponseConditionType,
} from "~/components/Automation/Condition/options";
import { CompoundConditionType } from "~/components/Automation/constants";
import {
  deserializeEventCondition,
  deserializeSurveyCondition,
  deserializeUserCondition,
  deserializeUserResponseCondition,
  serializeEventPerformedCondition,
  serializeSurveyInteractionCondition,
  serializeUserPropertyCondition,
  serializeUserResponseCondition,
} from "~/components/Automation/Condition/utils";

/*
 * Need to add composite condition serialization and deserialzation
 * */

export function serializeCondition(conditions, chaining) {
  let condition = {
    type:
      chaining === "all"
        ? CompoundConditionType.AND_USER_CONDITION
        : CompoundConditionType.OR_USER_CONDITION,
    children: [],
  };
  condition.children = conditions.map((c) => {
    switch (c.conditionType) {
      case UserConditionType.USER_PROPERTY:
        return serializeUserPropertyCondition(c);
      case EventConditionType.PERFORMED_EVENT:
        return serializeEventPerformedCondition(c);
      case SurveyConditionType.SURVEY_INTERACTION:
        return serializeSurveyInteractionCondition(c);
      case UserResponseConditionType.USER_RESPONSE:
        return serializeUserResponseCondition(c);
    }
  });

  return condition;
}

export function deserializeCondition(condition) {
  let conditions = [];
  let chaining =
    condition.type === CompoundConditionType.OR_USER_CONDITION ? "any" : "all";
  conditions = condition.children.map((c) => {
    switch (c.type) {
      case UserConditionType.USER_PROPERTY:
        return {
          ...deserializeUserCondition(c),
          conditionType: UserConditionType.USER_PROPERTY,
        };
      case EventConditionType.PERFORMED_EVENT:
        return {
          ...deserializeEventCondition(c),
          conditionType: EventConditionType.PERFORMED_EVENT,
        };
      case SurveyConditionType.SURVEY_INTERACTION:
        return {
          ...deserializeSurveyCondition(c),
          conditionType: SurveyConditionType.SURVEY_INTERACTION,
        };
      case UserResponseConditionType.USER_RESPONSE:
        return {
          ...deserializeUserResponseCondition(c),
          conditionType: UserResponseConditionType.USER_RESPONSE,
        };
    }
  });
  return { conditions, chaining };
}
