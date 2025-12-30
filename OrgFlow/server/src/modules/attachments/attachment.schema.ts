import { z } from "zod";

export const createAttachmentSchema = z.object({
  fileName: z.string().min(1).max(255),
  fileUrl: z.string().url(),
  fileType: z.string().min(1).max(50),
});

export type CreateAttachmentInput = z.infer<typeof createAttachmentSchema>;
