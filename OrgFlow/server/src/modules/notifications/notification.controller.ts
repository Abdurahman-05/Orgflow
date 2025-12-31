import { Response, NextFunction } from "express";
import { AuthRequest } from "../auth/auth.middleware";
import * as notificationService from "./notification.service";
import { getNotificationsSchema } from "./notification.schema";
import { addUserNotificationClient } from "../../utils/sse";
import { AppError } from "../../utils/AppError";

export async function getNotificationsHandler(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user?.userId;
    if (!userId) throw new AppError("Authentication required", 401);

    const { query } = getNotificationsSchema.parse({ query: req.query });
    const notifications = await notificationService.listNotifications(
      userId,
      query
    );
    res.status(200).json(notifications);
  } catch (error) {
    next(error);
  }
}

export async function markReadHandler(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    if (!userId) throw new AppError("Authentication required", 401);

    const notification = await notificationService.markAsRead(id, userId);
    res.status(200).json(notification);
  } catch (error) {
    next(error);
  }
}

export async function markAllReadHandler(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { organizationId } = req.body;
    const userId = req.user?.userId;
    if (!userId) throw new AppError("Authentication required", 401);

    if (!organizationId) {
      throw new AppError("organizationId is required", 400);
    }

    await notificationService.markAllAsRead(organizationId, userId);
    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    next(error);
  }
}

export async function streamNotificationsHandler(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user?.userId;
    if (!userId) throw new AppError("Authentication required", 401);

    addUserNotificationClient(userId, res);
  } catch (error) {
    next(error);
  }
}
