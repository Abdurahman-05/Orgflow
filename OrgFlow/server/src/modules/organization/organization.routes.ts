import { Router } from "express";
import {
  createOrganizationHandler,
  getMyOrganizationsHandler,
  getOrganizationHandler,
  updateOrganizationHandler,
  deleteOrganizationHandler
} from "./organization.controller";
import { authenticate } from "../auth/auth.middleware";

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /api/organizations:
 *   post:
 *     summary: Create a new organization
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, slug]
 *             properties:
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *     responses:
 *       201:
 *         description: Organization created
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post("/", createOrganizationHandler);

/**
 * @swagger
 * /api/organizations:
 *   get:
 *     summary: Get all organizations where user is a member
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 */
router.get("/", getMyOrganizationsHandler);

/**
 * @swagger
 * /api/organizations/{organizationId}:
 *   get:
 *     summary: Get organization details
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: organizationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *       403:
 *         description: Access denied
 *       404:
 *         description: Not found
 */
router.get("/:organizationId", getOrganizationHandler);

/**
 * @swagger
 * /api/organizations/{organizationId}:
 *   patch:
 *     summary: Update organization name
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: organizationId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 *       403:
 *         description: Permission denied
 */
router.patch("/:organizationId", updateOrganizationHandler);

/**
 * @swagger
 * /api/organizations/{organizationId}:
 *   delete:
 *     summary: Delete organization
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: organizationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Deleted
 *       403:
 *         description: Only owner can delete
 */
router.delete("/:organizationId", deleteOrganizationHandler);


export default router;
