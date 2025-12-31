import { Router } from "express";
import { authenticate } from "../auth/auth.middleware";
import {
  getNotificationsHandler,
  markReadHandler,
  markAllReadHandler,
  streamNotificationsHandler,
} from "./notification.controller";

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: List notifications for the current user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: organizationId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: unread
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/", getNotificationsHandler);

/**
 * @swagger
 * /api/notifications/stream:
 *   get:
 *     summary: Subscribe to real-time notification stream (SSE)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Event stream established
 */
router.get("/stream", streamNotificationsHandler);

/**
 * @swagger
 * /api/notifications/read-all:
 *   patch:
 *     summary: Mark all unread notifications as read for an organization
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [organizationId]
 *             properties:
 *               organizationId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.patch("/read-all", markAllReadHandler);

/**
 * @swagger
 * /api/notifications/{id}/read:
 *   patch:
 *     summary: Mark a single notification as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.patch("/:id/read", markReadHandler);

export default router;
