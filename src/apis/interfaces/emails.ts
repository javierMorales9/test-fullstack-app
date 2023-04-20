import { EmailSchema } from "~/components/Emails/forms";
import { z } from "zod";

export type EmailAttr = z.infer<typeof EmailSchema>;

const WithID = z.object({ id: z.string() });

const _EmailType = EmailSchema.merge(WithID);

export type EmailType = z.infer<typeof _EmailType>;
