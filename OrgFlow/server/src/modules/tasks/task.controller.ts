import { Response, NextFunction } from "express";
import { AuthRequest } from "../auth/auth.middleware";
import {
  createTask,
  getOrgTasks,
  getTaskById,
  updateTask,
  deleteTask,
  assignUserToTask,
  listTaskAssignees,
  removeTaskAssignee
} from "./task.service";
import {
  createTaskSchema,
  updateTaskSchema,
  assignUserSchema
} from "./task.schema";
import { AppError } from "../../utils/AppError";

export async function createTaskHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { orgId } = req.params;
    const input = createTaskSchema.parse(req.body);
    const userId = req.user?.userId;

    if (!userId) throw new AppError("Authentication required", 401);

    const task = await createTask(orgId, userId, input);
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
}

export async function getOrgTasksHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { orgId } = req.params;
    const userId = req.user?.userId;

    if (!userId) throw new AppError("Authentication required", 401);

    const tasks = await getOrgTasks(orgId, userId);
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
}

export async function getTaskHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { taskId } = req.params;
    const userId = req.user?.userId;

    if (!userId) throw new AppError("Authentication required", 401);

    const task = await getTaskById(taskId, userId);
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
}

export async function updateTaskHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { taskId } = req.params;
    const input = updateTaskSchema.parse(req.body);
    const userId = req.user?.userId;

    if (!userId) throw new AppError("Authentication required", 401);

    const task = await updateTask(taskId, userId, input);
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
}

export async function deleteTaskHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { taskId } = req.params;
    const userId = req.user?.userId;

    if (!userId) throw new AppError("Authentication required", 401);

    await deleteTask(taskId, userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function assignTaskUserHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { taskId } = req.params;
    const { userId: targetUserId } = assignUserSchema.parse(req.body);
    const userId = req.user?.userId;

    if (!userId) throw new AppError("Authentication required", 401);

    const assignment = await assignUserToTask(taskId, userId, targetUserId);
    res.status(201).json(assignment);
  } catch (error) {
    next(error);
  }
}

export async function listTaskAssigneesHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { taskId } = req.params;
    const userId = req.user?.userId;

    if (!userId) throw new AppError("Authentication required", 401);

    const assignees = await listTaskAssignees(taskId, userId);
    res.status(200).json(assignees);
  } catch (error) {
    next(error);
  }
}

export async function removeTaskAssigneeHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { taskId, userId: targetUserId } = req.params;
    const userId = req.user?.userId;

    if (!userId) throw new AppError("Authentication required", 401);

    await removeTaskAssignee(taskId, userId, targetUserId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
