import { NotificationType } from "../../generated/prisma/enums";

export interface NotificationUpdate {
  id: string;
  userId: string;
  organizationId: string;
  type: NotificationType;
  entityId?: string | null;
  message: string;
  readAt: Date | null;
  createdAt: Date;
}

import { z } from "zod";

export const getNotificationsSchema = z.object({
  query: z.object({
    organizationId: z.string().cuid(),
    unread: z
      .string()
      .optional()
      .transform((val) => val === "true"),
  }),
});

export type GetNotificationsQuery = z.infer<
  typeof getNotificationsSchema
>["query"];
