import { Router } from "express";
import {
  createTaskHandler,
  getOrgTasksHandler,
  getTaskHandler,
  updateTaskHandler,
  deleteTaskHandler,
  assignTaskUserHandler,
  listTaskAssigneesHandler,
  removeTaskAssigneeHandler
} from "./task.controller";
import { authenticate } from "../auth/auth.middleware";

const router = Router();

// Routes for tasks in an organization
// Mounted at /api/organizations/:orgId/tasks in routes.ts
const orgTasksRouter = Router({ mergeParams: true });
orgTasksRouter.use(authenticate);

/**
 * @swagger
 * /api/organizations/{orgId}/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orgId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [TODO, IN_PROGRESS, DONE]
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH]
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               teamId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Task created
 */
orgTasksRouter.post("/", createTaskHandler);

/**
 * @swagger
 * /api/organizations/{orgId}/tasks:
 *   get:
 *     summary: Get all tasks in an organization
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orgId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
orgTasksRouter.get("/", getOrgTasksHandler);


// Routes for individual tasks
// Mounted at /api/tasks in routes.ts
const taskRouter = Router();
taskRouter.use(authenticate);

/**
 * @swagger
 * /api/tasks/{taskId}:
 *   get:
 *     summary: Get single task details
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
taskRouter.get("/:taskId", getTaskHandler);

/**
 * @swagger
 * /api/tasks/{taskId}:
 *   patch:
 *     summary: Update a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [TODO, IN_PROGRESS, DONE]
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH]
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               teamId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 */
taskRouter.patch("/:taskId", updateTaskHandler);

/**
 * @swagger
 * /api/tasks/{taskId}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Deleted
 */
taskRouter.delete("/:taskId", deleteTaskHandler);

/**
 * @swagger
 * /api/tasks/{taskId}/assignees:
 *   post:
 *     summary: Assign a user to a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId]
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       201:
 *         description: User assigned
 */
taskRouter.post("/:taskId/assignees", assignTaskUserHandler);

/**
 * @swagger
 * /api/tasks/{taskId}/assignees:
 *   get:
 *     summary: List all assignees for a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
taskRouter.get("/:taskId/assignees", listTaskAssigneesHandler);

/**
 * @swagger
 * /api/tasks/{taskId}/assignees/{userId}:
 *   delete:
 *     summary: Remove an assignee from a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Assignee removed
 */
taskRouter.delete("/:taskId/assignees/:userId", removeTaskAssigneeHandler);

export { orgTasksRouter, taskRouter };
