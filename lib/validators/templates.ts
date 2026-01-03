import { z } from "zod";

export const createTemplateSchema = z
  .object({
    name: z.string().min(2),
    campaignType: z.string().optional(),
    htmlContent: z.string().min(1),
    subject: z.string().optional(),
    preview: z.string().optional(),
    tags: z.array(z.string()).optional(),
  })
  .strict();

export const createVersionSchema = z
  .object({
    templateId: z.string().min(1),
    htmlContent: z.string().min(1),
    versionNumber: z.string().optional(),
    changes: z
      .array(
        z.object({
          field: z.string(),
          oldValue: z.string().nullable(),
          newValue: z.string().nullable(),
        })
      )
      .optional(),
  })
  .strict();

