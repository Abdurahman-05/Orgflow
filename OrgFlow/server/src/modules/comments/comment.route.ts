import { Router } from "express";
import {
  addCommentHandler,
  getTaskCommentsHandler,
  updateCommentHandler,
  deleteCommentHandler
} from "./comment.controller";
import { authenticate } from "../auth/auth.middleware";

const router = Router();

// Routes for comments on a task
// Mounted at /api/tasks/:taskId/comments in routes.ts
const taskCommentsRouter = Router({ mergeParams: true });
taskCommentsRouter.use(authenticate);

/**
 * @swagger
 * /api/tasks/{taskId}/comments:
 *   post:
 *     summary: Add a comment to a task
 *     tags: [Comments]
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
 *             required: [content]
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment added
 *       403:
 *         description: Not a member of the organization
 */
taskCommentsRouter.post("/", addCommentHandler);

/**
 * @swagger
 * /api/tasks/{taskId}/comments:
 *   get:
 *     summary: Get all comments for a task
 *     tags: [Comments]
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
taskCommentsRouter.get("/", getTaskCommentsHandler);


// Routes for individual comments
// Mounted at /api/comments in routes.ts
const commentRouter = Router();
commentRouter.use(authenticate);

/**
 * @swagger
 * /api/comments/{commentId}:
 *   patch:
 *     summary: Update a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content]
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comment updated
 *       403:
 *         description: Not the author
 */
commentRouter.patch("/:commentId", updateCommentHandler);

/**
 * @swagger
 * /api/comments/{commentId}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Deleted
 *       403:
 *         description: Permission denied (not author and not admin)
 */
commentRouter.delete("/:commentId", deleteCommentHandler);

export { taskCommentsRouter, commentRouter };
