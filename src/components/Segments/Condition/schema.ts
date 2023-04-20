import {
  PerformedEventFormSchema,
  SurveyInteractionFormSchema,
  UserPropertyFormSchema,
  UserResponseFormSchema,
} from "~/components/Automation/Condition/schemas";
import z from "zod";
import {
  EventConditionType,
  SurveyConditionType,
  UserConditionType,
  UserResponseConditionType,
} from "~/components/Automation/Condition/options";

export const conditionTypeOptions = [
  {
    id: UserConditionType.USER_PROPERTY,
    label: "User Property",
  },
  {
    id: EventConditionType.PERFORMED_EVENT,
    label: "Performed Event",
  },
  {
    id: SurveyConditionType.SURVEY_INTERACTION,
    label: "Survey Interaction",
  },
  {
    id: UserResponseConditionType.USER_RESPONSE,
    label: "User Response",
  },
];

export const FilterSchema = z.object({
  condition: z.array(
    z.union([
      UserPropertyFormSchema.extend({
        conditionType: z.string().default(UserConditionType.USER_PROPERTY),
      }),
      PerformedEventFormSchema.extend({
        conditionType: z.string().default(EventConditionType.PERFORMED_EVENT),
      }),
      SurveyInteractionFormSchema.extend({
        conditionType: z
          .string()
          .default(SurveyConditionType.SURVEY_INTERACTION),
      }),
      UserResponseFormSchema.extend({
        conditionType: z
          .string()
          .default(UserResponseConditionType.USER_RESPONSE),
      }),
    ]),
  ),
  conditionChaining: z.enum(["any", "all"]).default("any"),
  type: z.string(),
});

export function defaultCondition() {
  return {
    conditionType: UserConditionType.USER_PROPERTY,
  };
}
