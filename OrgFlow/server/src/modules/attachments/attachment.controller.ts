import { Response, NextFunction } from "express";
import { AuthRequest } from "../auth/auth.middleware";
import {
  uploadAttachment,
  getTaskAttachments,
  deleteAttachment
} from "./attachment.service";
import { createAttachmentSchema } from "./attachment.schema";
import { AppError } from "../../utils/AppError";

export async function uploadAttachmentHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { taskId } = req.params;
    const input = createAttachmentSchema.parse(req.body);
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError("Authentication required", 401);
    }

    const attachment = await uploadAttachment(taskId, userId, input);
    res.status(201).json(attachment);
  } catch (error) {
    next(error);
  }
}

export async function getTaskAttachmentsHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { taskId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError("Authentication required", 401);
    }

    const attachments = await getTaskAttachments(taskId, userId);
    res.status(200).json(attachments);
  } catch (error) {
    next(error);
  }
}

export async function deleteAttachmentHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { attachmentId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError("Authentication required", 401);
    }

    await deleteAttachment(attachmentId, userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
