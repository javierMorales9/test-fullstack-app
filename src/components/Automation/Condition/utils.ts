import {
  ConditionInputType,
  EventConditionType,
  SurveyConditionType,
  UserConditionType,
  UserResponseConditionType,
} from "~/components/Automation/Condition/options";
import {
  BooleanValidator,
  EventPropertyType,
  InteractionType,
  NumericValidator,
  Occurrence,
  TimeFrameType,
  TriggerOption,
} from "~/components/Automation/constants";

export function deserializeUserConditionGroup(condition) {
  return {
    userPropertyConditionChaining:
      condition.type === UserConditionType.AND_USER_PROPERTY ? "all" : "any",
    isUserFilterGroup: true,
    userPropertyCondition: condition.children.map((c) =>
      deserializeUserCondition(c),
    ),
  };
}

function parseValue(val) {
  if (typeof val === "boolean") return val ? "true" : "false";
  if (typeof val === "number") return String(val);
  return val;
}

export function deserializeUserCondition(condition) {
  return {
    inputType: condition.input.type,
    propertyKey: condition.input.propertyKey,
    stringValidator: condition.validators[0].type,
    value: parseValue(condition.validators[0].value),
  };
}

export function deserializeUserConditionObject(condition) {
  if (condition.type === UserConditionType.USER_PROPERTY)
    return { userPropertyCondition: [deserializeUserCondition(condition)] };
  return deserializeUserConditionGroup(condition);
}

export function deserializerEventPropertyCondition(condition) {
  return {
    property: condition.input.propertyKey,
    operand: condition.validators[0].type,
    value: String(condition.validators[0].value || ""),
  };
}

export function deserializeEventPropertyConditionGroup(condition) {
  const type = condition.children[0].type;
  return {
    hasFilterGroup: true,
    childrenChaining:
      type === EventPropertyType.AND_EVENT_PROPERTY ? "all" : "any",
    children: condition.children[0].children.map((c) =>
      deserializerEventPropertyCondition(c),
    ),
  };
}

export function deserializeEventPropertyObject(condition) {
  const type = condition.children[0].type;
  if (type === EventPropertyType.EVENT_PROPERTY)
    return {
      children: [deserializerEventPropertyCondition(condition.children[0])],
    };
  else return deserializeEventPropertyConditionGroup(condition);
}

export function deserializeEventCondition(condition) {
  const eventObj = condition.children?.length
    ? deserializeEventPropertyObject(condition)
    : {};
  return {
    inputType: condition.input.type,
    event: condition.input.event,
    timesValidatorType: condition.validators[0].type,
    timesValidatorValue: condition.validators[0].times,
    occurrenceValidatorType: condition.validators[1].type,
    since:
      condition.validators[1].date &&
      new Date(condition.validators[1].date).toISOString().substring(0, 10),
    startDate:
      condition.validators[1].startDate &&
      new Date(condition.validators[1].startDate)
        .toISOString()
        .substring(0, 10),
    endDate:
      condition.validators[1].endDate &&
      new Date(condition.validators[1].endDate).toISOString().substring(0, 10),
    withinLastValue: condition.validators[1].amount,
    withinLastOperator: condition.validators[1].interval,
    ...eventObj,
  };
}

export function deserializeEventConditionGroup(condition) {
  return {
    eventPerformedConditionChaining:
      condition.type === EventConditionType.AND_PERFORMED_EVENT ? "all" : "any",
    eventPerformedCondition: condition.children.map((c) =>
      deserializeEventCondition(c),
    ),
    isEventFilterGroup: true,
  };
}

export function deserializeEventConditionObject(condition) {
  if (condition.type === EventConditionType.PERFORMED_EVENT)
    return { eventPerformedCondition: [deserializeEventCondition(condition)] };
  return deserializeEventConditionGroup(condition);
}

export function deserializeSurveyConditionGroup(condition) {
  return {
    surveyInteractionConditionChaining:
      condition.type === SurveyConditionType.AND_SURVEY_INTERACTION
        ? "all"
        : "any",
    isUserFilterGroup: true,
    surveyInteractionCondition: condition.children.map((c) =>
      deserializeSurveyCondition(c),
    ),
  };
}

export function deserializeSurveyCondition(condition) {
  return {
    inputType: condition.input.type,
    survey: condition.input.survey,
    interaction: condition.validators[0].interaction,
    timeframeValue: condition.validators[1].amount,
    timeFrameOperator: condition.validators[1].interval,
  };
}

export function deserializeSurveyConditionObject(condition) {
  if (condition.type === SurveyConditionType.SURVEY_INTERACTION)
    return {
      surveyInteractionCondition: [deserializeSurveyCondition(condition)],
    };
  return deserializeSurveyConditionGroup(condition);
}

export function deserializeUserResponseConditionGroup(condition) {
  return {
    userResponseConditionChaining:
      condition.type === UserResponseConditionType.AND_USER_RESPONSE
        ? "all"
        : "any",
    isUserFilterGroup: true,
    surveyInteractionCondition: condition.children.map((c) =>
      deserializeUserResponseCondition(c),
    ),
  };
}

export function deserializeUserResponseCondition(condition) {
  return {
    inputType: condition.input.type,
    slugName: condition.input.slugName,
    slugType: condition.input.slugType,
    stringValidator: condition.validators[0].type,
    value: parseValue(condition.validators[0].value),
  };
}

export function deserializeUserPropertyConditionObject(condition) {
  if (condition.type === UserResponseConditionType.USER_RESPONSE)
    return {
      userResponseCondition: [deserializeUserResponseCondition(condition)],
    };
  return deserializeUserResponseConditionGroup(condition);
}

export function deserializeCondition(condition) {
  const initialValues =
    condition.dispatcher.type === TriggerOption.USER_MATCHES_ACONDITION
      ? deserializeUserConditionObject(condition.condition)
      : deserializeEventConditionObject(condition.condition);
  return {
    triggerType: condition.dispatcher.type,
    event: condition.dispatcher.event,
    ...initialValues,
  };
}

function serializeValue(type, val) {
  if (Object.values(NumericValidator).includes(type)) return Number(val);
  if (Object.values(BooleanValidator).includes(type)) return val === "true";
  return val;
}

export function serializeUserPropertyCondition(condition) {
  return {
    type: UserConditionType.USER_PROPERTY,
    input: {
      type: condition.inputType,
      propertyKey: condition.propertyKey,
    },
    validators: [
      {
        type: condition.stringValidator,
        value: serializeValue(condition.stringValidator, condition.value),
      },
    ],
  };
}

export function serializeEventPropertyCondition(condition) {
  return {
    type: EventPropertyType.EVENT_PROPERTY,
    input: {
      type: ConditionInputType.EVENT_PROPERTY,
      propertyKey: condition.property,
    },
    validators: [
      {
        type: condition.operand,
        value: condition.value,
      },
    ],
  };
}

export function serializeEventPropertyGroup(condition) {
  return [
    {
      type:
        condition.childrenChaining === "all"
          ? EventPropertyType.AND_EVENT_PROPERTY
          : EventPropertyType.OR_EVENT_PROPERTY,
      children: condition.children.map((c) =>
        serializeEventPropertyCondition(c),
      ),
    },
  ];
}

export function serializeEventPerformedCondition(condition) {
  // TODO: Remove this any
  const obj: any = {
    type: EventConditionType.PERFORMED_EVENT,
    input: {
      type: condition.inputType,
      event: condition.event,
    },
    validators: [
      {
        type: condition.timesValidatorType,
        times: condition.timesValidatorValue,
      },
    ],
  };

  switch (condition.occurrenceValidatorType) {
    case Occurrence.EVER:
      obj.validators.push({
        type: Occurrence.EVER,
      });
      break;
    case Occurrence.BETWEEN:
      obj.validators.push({
        type: Occurrence.BETWEEN,
        startDate: condition.startDate,
        endDate: condition.endDate,
      });
      break;
    case Occurrence.SINCE:
      obj.validators.push({
        type: Occurrence.SINCE,
        date: condition.since,
      });
      break;
    case Occurrence.WITHIN_LAST:
      obj.validators.push({
        type: Occurrence.WITHIN_LAST,
        amount: condition.withinLastValue,
        interval: condition.withinLastOperator,
      });
      break;
    default:
      break;
  }

  if (condition.hasFilterGroup) {
    obj.children = serializeEventPropertyGroup(condition);
  } else if (condition.children?.length) {
    obj.children = [serializeEventPropertyCondition(condition.children[0])];
  }

  return obj;
}

export function serializeSurveyInteractionCondition(condition) {
  return {
    type: SurveyConditionType.SURVEY_INTERACTION,
    input: {
      type: condition.inputType,
      survey: condition.survey,
    },
    validators: [
      {
        type: InteractionType,
        interaction: condition.interaction,
      },
      {
        type: TimeFrameType,
        amount: condition.timeframeValue,
        interval: condition.timeframeOperator,
      },
    ],
  };
}

export function serializeUserResponseCondition(condition) {
  return {
    type: UserResponseConditionType.USER_RESPONSE,
    input: {
      type: condition.inputType,
      slugName: condition.slugName,
      slugType: condition.slugType,
    },
    validators: [
      {
        type: condition.stringValidator,
        value: serializeValue(condition.stringValidator, condition.value),
      },
    ],
  };
}

export function serializeUserPropertyGroup(condition) {
  return {
    type:
      condition.userPropertyConditionChaining === "all"
        ? UserConditionType.AND_USER_PROPERTY
        : UserConditionType.OR_USER_PROPERTY,
    children: condition.userPropertyCondition.map((u) =>
      serializeUserPropertyCondition(u),
    ),
  };
}

export function serializeEventPerformedGroup(condition) {
  return {
    type:
      condition.eventPerformedConditionChaining === "all"
        ? EventConditionType.AND_PERFORMED_EVENT
        : EventConditionType.OR_PERFORMED_EVENT,
    children: condition.eventPerformedCondition.map((e) =>
      serializeEventPerformedCondition(e),
    ),
  };
}

export function serializeSurveyInteractionGroup(condition) {
  return {
    type:
      condition.surveyInteractionConditionChaining === "all"
        ? SurveyConditionType.AND_SURVEY_INTERACTION
        : SurveyConditionType.OR_SURVEY_INTERACTION,
    children: condition.surveyInteractionCondition.map((u) =>
      serializeSurveyInteractionCondition(u),
    ),
  };
}

export function serializeUserResponseGroup(condition) {
  return {
    type:
      condition.userResponseConditionChaining === "all"
        ? UserResponseConditionType.AND_USER_RESPONSE
        : UserResponseConditionType.OR_USER_RESPONSE,
    children: condition.userResponseCondition.map((u) =>
      serializeUserResponseCondition(u),
    ),
  };
}

export function parseCampaign(campaign) {
  return {
    ...campaign,
    id: campaign.id,
    name: campaign.name,
  };
}
