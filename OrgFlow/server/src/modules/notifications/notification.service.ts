import prisma from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { broadcastNotification } from "../../utils/sse";
import {
  GetNotificationsQuery,
} from "./notification.schema";
import { NotificationType } from "../../generated/prisma/enums";

async function checkIsOrgMember(organizationId: string, userId: string) {
  const member = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId,
      },
    },
  });

  if (!member) {
    throw new AppError("User is not a member of this organization", 403);
  }
  return member;
}

export async function createNotification(data: {
  userId: string;
  organizationId: string;
  type: NotificationType;
  entityId?: string;
  message: string;
}) {
  const notification = await prisma.notification.create({
    data: {
      userId: data.userId,
      organizationId: data.organizationId,
      type: data.type,
      entityId: data.entityId,
      message: data.message,
    },
  });

  // Broadcast via SSE
  broadcastNotification(notification);

  return notification;
}

export async function listNotifications(
  userId: string,
  query: GetNotificationsQuery
) {
  await checkIsOrgMember(query.organizationId, userId);

  return prisma.notification.findMany({
    where: {
      userId,
      organizationId: query.organizationId,
      readAt: query.unread ? null : undefined,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function markAsRead(notificationId: string, userId: string) {
  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
  });

  if (!notification) {
    throw new AppError("Notification not found", 404);
  }

  if (notification.userId !== userId) {
    throw new AppError("Unauthorized", 403);
  }

  return prisma.notification.update({
    where: { id: notificationId },
    data: { readAt: new Date() },
  });
}

export async function markAllAsRead(organizationId: string, userId: string) {
  await checkIsOrgMember(organizationId, userId);

  return prisma.notification.updateMany({
    where: {
      userId,
      organizationId,
      readAt: null,
    },
    data: {
      readAt: new Date(),
    },
  });
}
