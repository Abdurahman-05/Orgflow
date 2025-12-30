import { Response, NextFunction } from "express";
import { AuthRequest } from "../auth/auth.middleware";
import {
  addComment,
  getTaskComments,
  updateComment,
  deleteComment
} from "./comment.service";
import {
  createCommentSchema,
  updateCommentSchema
} from "./comment.schema";
import { AppError } from "../../utils/AppError";

export async function addCommentHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { taskId } = req.params;
    const input = createCommentSchema.parse(req.body);
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError("Authentication required", 401);
    }

    const comment = await addComment(taskId, userId, input);
    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
}

export async function getTaskCommentsHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { taskId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError("Authentication required", 401);
    }

    const comments = await getTaskComments(taskId, userId);
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
}

export async function updateCommentHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { commentId } = req.params;
    const input = updateCommentSchema.parse(req.body);
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError("Authentication required", 401);
    }

    const comment = await updateComment(commentId, userId, input);
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
}

export async function deleteCommentHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { commentId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError("Authentication required", 401);
    }

    await deleteComment(commentId, userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
