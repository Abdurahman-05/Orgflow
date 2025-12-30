import { Router } from "express";
import {
  uploadAttachmentHandler,
  getTaskAttachmentsHandler,
  deleteAttachmentHandler
} from "./attachment.controller";
import { authenticate } from "../auth/auth.middleware";

const router = Router();

// Routes for attachments on a task
// Mounted at /api/tasks/:taskId/attachments in routes.ts
const taskAttachmentsRouter = Router({ mergeParams: true });
taskAttachmentsRouter.use(authenticate);

/**
 * @swagger
 * /api/tasks/{taskId}/attachments:
 *   post:
 *     summary: Upload an attachment to a task
 *     tags: [Attachments]
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
 *             required: [fileName, fileUrl, fileType]
 *             properties:
 *               fileName:
 *                 type: string
 *               fileUrl:
 *                 type: string
 *               fileType:
 *                 type: string
 *     responses:
 *       201:
 *         description: Attachment uploaded
 *       403:
 *         description: Not a member of the organization
 */
taskAttachmentsRouter.post("/", uploadAttachmentHandler);

/**
 * @swagger
 * /api/tasks/{taskId}/attachments:
 *   get:
 *     summary: Get all attachments for a task
 *     tags: [Attachments]
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
taskAttachmentsRouter.get("/", getTaskAttachmentsHandler);


// Routes for individual attachments
// Mounted at /api/attachments in routes.ts
const attachmentRouter = Router();
attachmentRouter.use(authenticate);

/**
 * @swagger
 * /api/attachments/{attachmentId}:
 *   delete:
 *     summary: Delete an attachment
 *     tags: [Attachments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: attachmentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Deleted
 *       403:
 *         description: Permission denied (not uploader and not admin)
 */
attachmentRouter.delete("/:attachmentId", deleteAttachmentHandler);

export { taskAttachmentsRouter, attachmentRouter };
