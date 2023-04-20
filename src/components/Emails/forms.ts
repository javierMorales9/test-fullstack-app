import { z } from "zod";

export const EmailSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  content: z.string(),
  design: z.string(),
});
