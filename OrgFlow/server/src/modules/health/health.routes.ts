import { Router } from "express";
import { healthCheck } from "./health.controller";

const router = Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Check system health
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: System is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 */
router.get("/", healthCheck);

export default router;
