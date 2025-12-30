import { Router } from "express";
import {
  createTeamHandler,
  getTeamsInOrganizationHandler,
  getTeamHandler,
  updateTeamHandler,
  deleteTeamHandler,
  addTeamMemberHandler,
  listTeamMembersHandler,
  removeTeamMemberHandler
} from "./team.controller";
import { authenticate } from "../auth/auth.middleware";

const router = Router();

// Routes nested under /api/organizations/:orgId/teams
// This router will be mounted at /api/organizations/:orgId/teams (for create/list)
// and at /api (for others) OR we can use separate routers.
// The request asks for specific paths.

const orgTeamsRouter = Router({ mergeParams: true });
orgTeamsRouter.use(authenticate);

/**
 * @swagger
 * /api/organizations/{orgId}/teams:
 *   post:
 *     summary: Create a new team
 *     tags: [Teams]
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
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Team created
 */
orgTeamsRouter.post("/", createTeamHandler);

/**
 * @swagger
 * /api/organizations/{orgId}/teams:
 *   get:
 *     summary: Get all teams in an organization
 *     tags: [Teams]
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
orgTeamsRouter.get("/", getTeamsInOrganizationHandler);


const teamRouter = Router();
teamRouter.use(authenticate);

/**
 * @swagger
 * /api/teams/{teamId}:
 *   get:
 *     summary: Get single team
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
teamRouter.get("/:teamId", getTeamHandler);

/**
 * @swagger
 * /api/teams/{teamId}:
 *   patch:
 *     summary: Update team
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
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
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 */
teamRouter.patch("/:teamId", updateTeamHandler);

/**
 * @swagger
 * /api/teams/{teamId}:
 *   delete:
 *     summary: Delete team
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Deleted
 */
teamRouter.delete("/:teamId", deleteTeamHandler);

/**
 * @swagger
 * /api/teams/{teamId}/members:
 *   post:
 *     summary: Add member to team
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
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
 *         description: Member added
 */
teamRouter.post("/:teamId/members", addTeamMemberHandler);

/**
 * @swagger
 * /api/teams/{teamId}/members:
 *   get:
 *     summary: List team members
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
teamRouter.get("/:teamId/members", listTeamMembersHandler);

/**
 * @swagger
 * /api/teams/{teamId}/members/{userId}:
 *   delete:
 *     summary: Remove member from team
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
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
 *         description: Member removed
 */
teamRouter.delete("/:teamId/members/:userId", removeTeamMemberHandler);

export { orgTeamsRouter, teamRouter };
