import z from "zod";
import {
  BooleanValidator,
  EventOption,
  NumericValidator,
  Occurrence,
  QuantityOption,
  StringOperand,
  Time,
  TriggerOption,
} from "../constants";
import { ConditionInputType } from "./options";
import fieldHolder, { getFieldOptions } from "~/utils/fields";

const ValidatorSchema = z.union([
  z.nativeEnum(StringOperand),
  z.nativeEnum(BooleanValidator),
  z.nativeEnum(NumericValidator),
]);

export const EventPropertyFormSchema = z.object({
  property: z.string(),
  operand: ValidatorSchema,
  value: z.string(),
});

export const PerformedEventFormSchema = z.object({
  inputType: z.string().default(ConditionInputType.USER_EVENT_INPUT),
  event: z.string(),
  timesValidatorType: z.nativeEnum(QuantityOption),
  timesValidatorValue: z.number(),
  occurrenceValidatorType: z.nativeEnum(Occurrence).optional(),
  withinLastValue: z.number().optional(),
  withinLastOperator: z.nativeEnum(Time).optional(),
  since: z.date().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  hasFilterGroup: z.boolean().default(false),
  children: z.array(EventPropertyFormSchema).optional(),
});

export const UserPropertyFormSchema = z.object({
  inputType: z.string().default(ConditionInputType.USER_PROPERTY),
  propertyKey: z.string(),
  stringValidator: ValidatorSchema,
  value: z.string(),
});

export const SurveyInteractionFormSchema = z.object({
  inputType: z.string().default(ConditionInputType.SURVEY_INTERACTION),
  survey: z.string().uuid(),
  interaction: z.string(),
  timeframeValue: z.number().optional(),
  timeframeOperator: z.nativeEnum(Time).optional(),
});

export const UserResponseFormSchema = z.object({
  inputType: z.string().default(ConditionInputType.USER_RESPONSE),
  slugName: z.string(),
  slugType: z.string(),
  stringValidator: ValidatorSchema,
  value: z.string(),
});

export function defaultUserPropertyObject(): UserPropertyFormData {
  return {
    inputType: ConditionInputType.USER_PROPERTY,
    propertyKey: fieldHolder.userFields.length
      ? getFieldOptions(fieldHolder.userFields)[0].id
      : "",
    value: "",
  };
}

export function defaultPerformedEventCondition(): PerformedEventFormData {
  return {
    inputType: ConditionInputType.USER_EVENT_INPUT,
    event: EventOption.EVENT_1,
    timesValidatorType: QuantityOption.EXACTLY_VALIDATOR,
    occurrenceValidatorType: Occurrence.EVER,
  };
}

export function defaultEventPropertyObject(): EventPropertyFormData {
  return {
    property: fieldHolder.eventFields.length
      ? getFieldOptions(fieldHolder.eventFields)[0].id
      : "",
    value: "",
  };
}

export function defaultSurveyInteractionObject(): SurveyInteractionFormData {
  return {
    inputType: ConditionInputType.SURVEY_INTERACTION,
    survey: "",
    interaction: "",
    timeframeValue: 0,
    timeframeOperator: Time.DAYS,
  };
}

export function defaultUserResponseObject(): UserResponseFormData {
  return {
    inputType: ConditionInputType.USER_RESPONSE,
    value: "",
  };
}

export const TriggerSchema = z
  .object({
    triggerType: z
      .nativeEnum(TriggerOption)
      .default(TriggerOption.USER_PERFORMS_AN_EVENT),
    triggerEvent: z.nativeEnum(EventOption).optional(),
    userPropertyCondition: z.array(UserPropertyFormSchema),
    userPropertyConditionChaining: z.enum(["any", "all"]).default("any"),
    eventPerformedCondition: z.array(PerformedEventFormSchema),
    eventPerformedConditionChaining: z.enum(["any", "all"]).default("any"),
  })
  .refine(
    (trigger) => {
      if (trigger.triggerType === TriggerOption.USER_MATCHES_ACONDITION)
        return !!trigger.userPropertyCondition?.length;
      else if (trigger.triggerType === TriggerOption.USER_PERFORMS_AN_EVENT)
        return !!trigger.eventPerformedCondition?.length;
      return false; // Right not we don't support TriggerOption.USER_FIRST_SEEN
    },
    {
      message: "Please add a condition or condition group",
      path: ["condition"],
    },
  );

export type EventPropertyFormData = z.infer<typeof EventPropertyFormSchema>;
export type PerformedEventFormData = z.infer<typeof PerformedEventFormSchema>;
export type UserPropertyFormData = z.infer<typeof UserPropertyFormSchema>;
export type SurveyInteractionFormData = z.infer<
  typeof SurveyInteractionFormSchema
>;
export type UserResponseFormData = z.infer<typeof UserResponseFormSchema>;
export type TriggerFormDate = z.infer<typeof TriggerSchema>;
