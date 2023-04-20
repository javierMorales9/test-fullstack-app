import { z } from "zod";

export const SegmentSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(5, "Name must be at least 5 characters"),
  percentageOfUsers: z.number().optional(),
  numberOfUsers: z.string().optional(),
});

export const UserSchema = z.object({
  id: z.string().optional(),
  email: z.string(),
  active: z.boolean(),
  properties: z.any(),
  date: z.date(),
});

export type Segment = z.infer<typeof SegmentSchema>;

export enum QuestionType {
  NPS = "nps",
  CTA = "cta",
  OpenText = "opentext",
  Select = "select",
}

enum CornerStyle {
  Rounded = "rounded",
  Straight = "straight",
}

export enum WidgetPosition {
  Top = "top",
  TopLeft = "top-left",
  TopMid = "top-mid",
  TopRight = "top-right",
  Mid = "mid",
  Bottom = "bottom",
  BottomMid = "bottom-mid",
  BottomLeft = "bottom-left",
  BottomRight = "bottom-right",
}

export type User = z.infer<typeof UserSchema>;

export const QuestionSchema = z.object({
  id: z.string().optional(),
  type: z.nativeEnum(QuestionType),
  question: z.string().optional(),
  explanation: z.string().optional(),
  headline: z.string().optional(),
  linkUrl: z.string().optional(),
  linkText: z.string().optional(),
  placeholder: z.string().optional(),
  slug: z.string(),
  options: z.array(z.string()).optional(),
});
export type Question = z.infer<typeof QuestionSchema>;
export const DesignSchema = z.object({
  colorTheme: z.array(z.string()),
  cornerStyle: z.nativeEnum(CornerStyle),
  widgetPosition: z.nativeEnum(WidgetPosition),
});

export const SurveySchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  account: z.string(),
  questions: z.array(QuestionSchema),
  design: DesignSchema,
});

export type Survey = z.infer<typeof SurveySchema>;
